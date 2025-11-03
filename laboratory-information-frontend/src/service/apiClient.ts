import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Token refresh state management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      // Update token in request config and retry
      if (token && prom.config.headers) {
        prom.config.headers.Authorization = `Bearer ${token}`;
      }
      prom.resolve();
    }
  });
  
  failedQueue = [];
};

// Default axios instance configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    withCredentials: true, // Enable cookies for JWT authentication
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token if available
  client.interceptors.request.use(
    (config) => {
      // Get token from localStorage or cookies if needed
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle common errors and token refresh
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 Unauthorized - Try to refresh token
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        const requestUrl = originalRequest.url || '';
        const fullUrl = originalRequest.baseURL 
          ? `${originalRequest.baseURL}${requestUrl}` 
          : requestUrl;
        
        // Skip refresh for auth endpoints to avoid infinite loop
        if (
          fullUrl.includes('/login') ||
          fullUrl.includes('/refresh-token') ||
          fullUrl.includes('/logout') ||
          fullUrl.includes('/register') ||
          requestUrl.includes('/login') ||
          requestUrl.includes('/refresh-token') ||
          requestUrl.includes('/logout') ||
          requestUrl.includes('/register')
        ) {
          // If auth endpoint failed, redirect to login
          localStorage.removeItem('authToken');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest });
          })
            .then(() => {
              // Retry the original request after token refresh
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Try to refresh the token
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/refresh-token`,
            {},
            {
              withCredentials: true, // Important: send cookies (refreshToken)
            }
          );

          if (refreshResponse.status === 200) {
            // Token refreshed successfully
            // New access token is set in cookies by backend, no need to update localStorage
            // But if you have a token in localStorage, you might want to update it
            // However, since backend uses httpOnly cookies, we might not need localStorage token
            
            // Process queued requests
            processQueue(null, null);
            isRefreshing = false;

            // Retry the original request (new token will be in cookies)
            return client(originalRequest);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          // Refresh failed - clear auth and redirect to login
          processQueue(refreshError as AxiosError, null);
          isRefreshing = false;
          
          localStorage.removeItem('authToken');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }

      // Handle other HTTP errors
      if (error.response?.status === 403) {
        // Forbidden - show access denied message
        console.error('Access denied:', error.response?.data);
      } else if (error.response?.status && error.response.status >= 500) {
        // Server errors
        console.error('Server error:', error.response?.data);
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

// Create the main API client instance
export const apiClient = createApiClient();

// Generic API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Generic API methods
export class ApiService {
  private client: AxiosInstance;

  constructor(client: AxiosInstance = apiClient) {
    this.client = client;
  }

  // GET request
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // POST request
  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // PUT request
  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // PATCH request
  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // DELETE request
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Handle errors consistently
  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('API Error:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
      });
    } else if (error instanceof Error) {
      console.error('API Error:', error.message);
    } else {
      console.error('Unknown API Error:', error);
    }
  }
}

// Create a default API service instance
export const apiService = new ApiService();

// Utility functions for common operations
export const apiUtils = {
  // Check if response is successful
  isSuccessResponse: (response: AxiosResponse | undefined): boolean => {
  return !!response && (response.status === 200 || response.status === 201);
},

  // Extract error message from axios error
  getErrorMessage: (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      // Prefer explicit message from backend; fall back to any 'error' field or axios message
      return (
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Có lỗi xảy ra'
      );
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'Có lỗi xảy ra';
  },

  // Create standardized API response
  createResponse: <T>(success: boolean, message: string, data?: T): ApiResponse<T> => ({
    success,
    message,
    data,
  }),
};

// Export the axios instance for direct use if needed
export default apiClient;


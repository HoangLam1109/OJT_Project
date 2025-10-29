import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  // Response interceptor - Handle common errors
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle common HTTP errors
      if (error.response?.status === 401) {
        // Unauthorized - redirect to login or clear auth
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
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

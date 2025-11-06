import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { apiUtils } from './apiClient';
import type { Reagent } from '../pages/LabUser/data/mockReagentsData';

// Create a dedicated axios instance for Warehouse service
const WAREHOUSE_SERVICE_URL = import.meta.env.VITE_WAREHOUSE_SERVICE_URL || 'http://localhost:5003';
const reagentApiClient: AxiosInstance = axios.create({
  baseURL: WAREHOUSE_SERVICE_URL,
  timeout: 10000,
  withCredentials: true, // Enable cookies for JWT authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header
reagentApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      config.headers = config.headers || {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const REAGENT_API_BASE_URL = '/api/warehouse/reagents';

// Backend API response type (matching IReagent from backend)
interface BackendReagent {
  _id: string;
  reagent_code: string;
  reagent_name: string;
  reagent_type: string;
  quantity_received: number;
  quantity_current: number;
  unit_of_measure: string;
  usage_per_run: number;
  expiration_date: string | Date;
  received_date: string | Date;
  status: 'Available' | 'InUse' | 'LowStock' | 'Expired' | 'Depleted';
  low_stock_threshold?: number;
  storage_location?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by?: string;
  updated_by?: string;
  is_deleted?: boolean;
}

// Backend API response wrapper
interface BackendReagentResponse {
  success: boolean;
  data: BackendReagent | BackendReagent[];
  message?: string;
}

// Transform backend response to frontend format
const transformBackendReagent = (backendReagent: BackendReagent): Reagent => {
  // Map status from backend to frontend
  const mapStatus = (status: BackendReagent['status']): Reagent['status'] => {
    switch (status) {
      case 'Available':
        return 'Available';
      case 'InUse':
        return 'In Use';
      case 'LowStock':
        return 'Low Stock';
      case 'Expired':
        return 'Expired';
      case 'Depleted':
        return 'Expired'; // Map Depleted to Expired for frontend
      default:
        return 'Available';
    }
  };

  // Format date to string (YYYY-MM-DD)
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return new Date().toISOString().split('T')[0];
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  return {
    id: backendReagent._id,
    name: backendReagent.reagent_name,
    lotNumber: backendReagent.reagent_code,
    manufacturer: backendReagent.reagent_type, // Using reagent_type as manufacturer placeholder
    receivedDate: formatDate(backendReagent.received_date),
    expiryDate: formatDate(backendReagent.expiration_date),
    quantity: backendReagent.quantity_current,
    status: mapStatus(backendReagent.status),
    storageLocation: backendReagent.storage_location || '',
    usedInTests: [], // Backend doesn't provide this, leaving empty
    notes: `Unit: ${backendReagent.unit_of_measure}, Usage per run: ${backendReagent.usage_per_run}`,
    createdBy: backendReagent.created_by || 'system',
    createdAt: formatDate(backendReagent.created_at) + 'T00:00:00Z',
    updatedAt: formatDate(backendReagent.updated_at) + 'T00:00:00Z',
  };
};

// Reagent Service API
export const reagentService = {
  // Get all reagents
  async getAllReagents(): Promise<Reagent[]> {
    try {
      const response = await reagentApiClient.get<BackendReagentResponse>(
        `${REAGENT_API_BASE_URL}/`
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch reagents');
      }

      const reagents = Array.isArray(response.data.data) 
        ? response.data.data 
        : [response.data.data];
      
      // Filter out deleted reagents
      const activeReagents = reagents.filter(
        (r: BackendReagent) => !r.is_deleted
      );
      
      return activeReagents.map(transformBackendReagent);
    } catch (error: any) {
      console.error('Error fetching reagents:', error);
      
      // Provide more specific error messages
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
        throw new Error('Không thể kết nối đến Warehouse Service (port 5003). Vui lòng kiểm tra backend service đã chạy chưa.');
      }
      
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },

  // Get reagent by ID
  async getReagentById(id: string): Promise<Reagent | null> {
    try {
      const response = await reagentApiClient.get<BackendReagentResponse>(
        `${REAGENT_API_BASE_URL}/${id}`
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch reagent');
      }

      const reagent = Array.isArray(response.data.data)
        ? response.data.data[0]
        : response.data.data;

      if (!reagent || reagent.is_deleted) {
        return null;
      }

      return transformBackendReagent(reagent);
    } catch (error: any) {
      console.error('Error fetching reagent:', error);
      
      // Provide more specific error messages
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
        throw new Error('Không thể kết nối đến Warehouse Service (port 5003). Vui lòng kiểm tra backend service đã chạy chưa.');
      }
      
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },

  // Transform frontend format to backend format
  transformToBackendFormat(reagent: Partial<Reagent>, userId?: string): Partial<BackendReagent> {
    // Map status from frontend to backend
    const mapStatusToBackend = (status?: Reagent['status']): BackendReagent['status'] => {
      switch (status) {
        case 'Available':
          return 'Available';
        case 'In Use':
          return 'InUse';
        case 'Low Stock':
          return 'LowStock';
        case 'Expired':
          return 'Expired';
        default:
          return 'Available';
      }
    };

    // Parse date string to Date
    const parseDate = (dateStr?: string): Date | undefined => {
      if (!dateStr) return undefined;
      try {
        // Handle both YYYY-MM-DD and ISO format
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? undefined : date;
      } catch {
        return undefined;
      }
    };

    // Ensure quantity_received and quantity_current have values
    const quantity = reagent.quantity || 0;

    const backendData: Partial<BackendReagent> = {
      reagent_code: reagent.lotNumber || '',
      reagent_name: reagent.name || '',
      reagent_type: reagent.manufacturer || 'Unknown',
      quantity_received: quantity,
      quantity_current: quantity,
      unit_of_measure: 'unit', // Default, can be updated if frontend provides
      usage_per_run: 1, // Default, can be updated if frontend provides
      expiration_date: parseDate(reagent.expiryDate) || new Date(),
      received_date: parseDate(reagent.receivedDate) || new Date(),
      status: mapStatusToBackend(reagent.status),
      storage_location: reagent.storageLocation || '',
    };

    if (reagent.id) {
      backendData.updated_by = userId;
    } else {
      backendData.created_by = userId;
    }

    return backendData;
  },

  // Create new reagent
  async createReagent(reagentData: Partial<Reagent>, userId?: string): Promise<Reagent> {
    try {
      const backendData = this.transformToBackendFormat(reagentData, userId);
      
      const response = await reagentApiClient.post<BackendReagentResponse>(
        `${REAGENT_API_BASE_URL}/`,
        backendData
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create reagent');
      }

      const reagent = Array.isArray(response.data.data)
        ? response.data.data[0]
        : response.data.data;

      return transformBackendReagent(reagent);
    } catch (error: any) {
      console.error('Error creating reagent:', error);
      
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
        throw new Error('Không thể kết nối đến Warehouse Service (port 5003). Vui lòng kiểm tra backend service đã chạy chưa.');
      }
      
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },

  // Delete reagent (soft delete)
  async deleteReagent(id: string, userId?: string): Promise<void> {
    try {
      const response = await reagentApiClient.delete<{ message?: string; order?: any }>(
        `${REAGENT_API_BASE_URL}/${id}`,
        {
          data: { deleted_by: userId }
        }
      );
      
      // Backend returns { message, order } format on success (200)
      // Or { message } on error (404, 500)
      if (response.status === 200) {
        // Success - check if message contains success indicator
        if (response.data.message && !response.data.message.includes('thành công') && !response.data.message.includes('success')) {
          // If message exists but doesn't indicate success, might be an error
          console.warn('Delete response:', response.data);
        }
        // If status is 200, consider it successful
        return;
      } else {
        throw new Error(response.data.message || 'Failed to delete reagent');
      }
    } catch (error: any) {
      console.error('Error deleting reagent:', error);
      
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
        throw new Error('Không thể kết nối đến Warehouse Service (port 5003). Vui lòng kiểm tra backend service đã chạy chưa.');
      }
      
      // Handle HTTP error responses
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || `Failed to delete reagent (${status})`;
        throw new Error(message);
      }
      
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },
};


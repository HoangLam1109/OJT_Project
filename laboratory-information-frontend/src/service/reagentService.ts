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
};


import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { apiUtils } from './apiClient';
import type { TestOrder } from '../pages/LabUser/types/TestOrderTypes';

// Create a dedicated axios instance for TestOrder service (port 5002)
const TEST_ORDER_SERVICE_URL = import.meta.env.VITE_TEST_ORDER_SERVICE_URL || 'http://localhost:5002';
const testOrderApiClient: AxiosInstance = axios.create({
  baseURL: TEST_ORDER_SERVICE_URL,
  timeout: 10000,
  withCredentials: true, // Enable cookies for JWT authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// testOrderService.ts
const VALID_STATUSES = ['Pending', 'Processing', 'Completed'] as const;

const isValidStatus = (status: string): status is typeof VALID_STATUSES[number] => {
  return typeof status === 'string' && VALID_STATUSES.includes(status as typeof VALID_STATUSES[number]);
};

// Attach Authorization header like the global apiClient
testOrderApiClient.interceptors.request.use(
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

const TEST_ORDER_API_BASE_URL = '/api/testOrder';

// Backend API response type
interface BackendTestOrder {
  _id: string;
  patient_id: string;
  barcode: string;
  status: string;
  testType: string
  created_at: string;
  created_by: string;
  due_date?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  deleted_by?: string;
  processing?: number;
  notes?: string;
  user?: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    age?: number;
  };
}

// Transform backend response to frontend format
const transformBackendOrder = (backendOrder: BackendTestOrder): TestOrder => {
  const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  const mapStatus = (status?: string): TestOrder['status'] => {
    if (!status) return 'Pending';

    const lower = status.toLowerCase();
    switch (lower) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      default:
        return 'Pending';
    }
  };

  return {
    id: backendOrder._id,
    barcode: backendOrder.barcode,
    patient_name: backendOrder.user?.fullName || 'N/A',
    patient_id: backendOrder.patient_id,
    testType: backendOrder.testType,
    created_at: formatDate(backendOrder.created_at),
    created_by: backendOrder.created_by,
    status: mapStatus(backendOrder.status),
    due_date: formatDate(backendOrder.due_date),
    is_deleted: backendOrder.is_deleted || undefined,
    deleted_at: backendOrder.deleted_at,
    deleted_by: backendOrder.deleted_by,
    progress: backendOrder.processing,
    notes: backendOrder.notes,
  };
};

// TestOrder Service API
export const testOrderService = {
  // Get all test orders
  async getAllTestOrders(): Promise<TestOrder[]> {
    try {
      const response = await testOrderApiClient.get<BackendTestOrder[]>(`${TEST_ORDER_API_BASE_URL}/all`);
      console.log("response", response.data)
      return response.data.map(transformBackendOrder);
    } catch (error) {
      console.error('Error fetching test orders:', error);
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },

  // Get all test orders via Swagger path (/testOrder/all)
  async getAllTestOrdersDirect(): Promise<TestOrder[]> {
    try {
      const response = await testOrderApiClient.get<BackendTestOrder[]>(`${TEST_ORDER_API_BASE_URL}/all`);
      return response.data.map(transformBackendOrder);
    } catch (error) {
      console.error('Error fetching test orders (direct):', error);
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },

  // Get test order by ID
  async getTestOrderById(id: string): Promise<TestOrder | null> {
    try {
      const response = await testOrderApiClient.get<BackendTestOrder>(`${TEST_ORDER_API_BASE_URL}/${id}`);
      console.log("response", response.data)
      return transformBackendOrder(response.data);
    } catch (error) {
      console.error('Error fetching test order:', error);
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },

  // Create new test order
  // testOrderService.ts
  async createTestOrder(orderData: Partial<TestOrder>): Promise<TestOrder> {
    try {

      const backendData = {
        ...orderData,  //  từ submitData ở trang TestOrderForm

        status: (orderData.status && isValidStatus(orderData.status))
          ? orderData.status
          : 'Pending',
      };
      console.log('Sending to backend:', backendData); // DEBUG
 
      const response = await testOrderApiClient.post<BackendTestOrder>(
        `${TEST_ORDER_API_BASE_URL}/create`,
        backendData
      );

      return transformBackendOrder(response.data);
    } catch (error) {
      console.error('Error creating test order:', error);
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },

  // Update test order
  async updateTestOrder(id: string, orderData: Partial<TestOrder>): Promise<TestOrder> {
    try {
      // Transform frontend data to backend format
      const backendData: Partial<BackendTestOrder> = {
        ...orderData
      };

      if (orderData.status) {
        backendData.status = orderData.status.toLowerCase();
      }
      //by Add other fields as needed

      const response = await testOrderApiClient.put<BackendTestOrder>(
        `${TEST_ORDER_API_BASE_URL}/update/${id}`,
        backendData
      );
      return transformBackendOrder(response.data);
    } catch (error) {
      console.error('Error updating test order:', error);
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },


  async deleteTestOrder(id: string, deletedBy: string): Promise<void> {
    try {
      await testOrderApiClient.delete(
        `${TEST_ORDER_API_BASE_URL}/delete/${id}`,
        {
          data: { deleted_by: deletedBy },
        }
      );
    } catch (error) {
      console.error('Error deleting test order:', error);
      throw new Error('Lỗi server khi xóa test order');
    }
  },

  async changeStatus(
    id: string,
    status: 'Pending' | 'Processing' | 'Completed',
    updated_by: string
  ) {
    const response = await testOrderApiClient.patch(`api/testOrder/${id}/status`, {
      status,
      updated_by,
    });
    return response.data.data;
  }

};

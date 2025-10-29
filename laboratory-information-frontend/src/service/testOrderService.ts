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

const TEST_ORDER_API_BASE_URL = '/api/testOrder';

// Backend API response type
interface BackendTestOrder {
  _id: string;
  patient_id: string;
  barcode: string;
  status: string;
  created_at: string;
  created_by: string;
  run_by?: string;
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

  const mapStatus = (status: string): TestOrder['status'] => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('pending') || statusLower === 'pending') return 'Pending';
    if (statusLower.includes('processing') || statusLower.includes('in_progress')) return 'Processing';
    if (statusLower.includes('completed') || statusLower === 'completed') return 'Completed';
    if (statusLower.includes('cancelled') || statusLower === 'cancelled') return 'Cancelled';
    if (statusLower.includes('failed') || statusLower === 'failed') return 'failed';
    return 'Pending';
  };

  return {
    id: backendOrder.barcode || backendOrder._id,
    barcode: backendOrder.barcode,
    patientName: backendOrder.user?.fullName || 'N/A',
    patientId: backendOrder.patient_id,
    testType: 'Chưa xác định', // Backend doesn't have this field yet
    testName: 'Xét nghiệm', // Backend doesn't have this field yet
    createdAt: formatDate(backendOrder.created_at),
    status: mapStatus(backendOrder.status),
    priority: 'Normal', // Backend doesn't have this field yet
    assignedTo: backendOrder.run_by || undefined,
    assignedInstrument: undefined, // Will be set when processing
    progress: undefined, // Will be set when processing
    startTime: undefined, // Will be set when processing
    estimatedCompletion: undefined, // Will be set when processing
    notes: undefined, // Backend doesn't have this field yet
    createdBy: backendOrder.created_by,
    collectionDate: formatDate(backendOrder.created_at),
    sampleType: 'Chưa xác định', // Backend doesn't have this field yet
    samples: undefined, // Backend doesn't have this field yet
  };
};

// TestOrder Service API
export const testOrderService = {
  // Get all test orders
  async getAllTestOrders(): Promise<TestOrder[]> {
    try {
      const response = await testOrderApiClient.get<BackendTestOrder[]>(`${TEST_ORDER_API_BASE_URL}/all`);
      return response.data.map(transformBackendOrder);
    } catch (error) {
      console.error('Error fetching test orders:', error);
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },

  // Get test order by ID
  async getTestOrderById(id: string): Promise<TestOrder | null> {
    try {
      const response = await testOrderApiClient.get<BackendTestOrder>(`${TEST_ORDER_API_BASE_URL}/${id}`);
      return transformBackendOrder(response.data);
    } catch (error) {
      console.error('Error fetching test order:', error);
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },

  // Create new test order
  async createTestOrder(orderData: Partial<TestOrder>): Promise<TestOrder> {
    try {
      // Transform frontend data to backend format
      const backendData = {
        patient_id: orderData.patientId,
        barcode: orderData.barcode || orderData.id,
        status: orderData.status?.toLowerCase() || 'pending',
        created_by: orderData.createdBy,
        // Add other fields as needed
      };

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
      const backendData: Partial<BackendTestOrder> = {};
      
      if (orderData.status) {
        backendData.status = orderData.status.toLowerCase();
      }
      if (orderData.assignedTo) {
        backendData.run_by = orderData.assignedTo;
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

  // Delete test order
  async deleteTestOrder(id: string): Promise<void> {
    try {
      await testOrderApiClient.delete(`${TEST_ORDER_API_BASE_URL}/delete/${id}`);
    } catch (error) {
      console.error('Error deleting test order:', error);
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },
};

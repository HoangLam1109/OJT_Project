import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { apiUtils } from './apiClient';
import { apiService } from './apiClient';

// Create a dedicated axios instance for Patient service
// Patient service runs on port 5001 independently
const PATIENT_SERVICE_URL = import.meta.env.VITE_PATIENT_SERVICE_URL || 'http://localhost:5001';
const patientApiClient: AxiosInstance = axios.create({
  baseURL: PATIENT_SERVICE_URL,
  timeout: 10000,
  withCredentials: true, // Enable cookies for JWT authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header like the global apiClient
patientApiClient.interceptors.request.use(
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

const PATIENT_API_BASE_URL = '/api/patients';

// Backend API response types
interface BackendPatient {
  _id: string;
  patient_code?: string;
  user_id: string;
  is_active: boolean;
  is_deleted: boolean;
  last_test_type?: string;
  user?: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
  } | null;
}

interface GetAllPatientsResponse {
  patients: BackendPatient[];
  total: number;
  page: number;
  totalPages: number;
}

// Frontend Patient interface for dropdown
export interface PatientOption {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  patientCode?: string;
}

// Transform backend response to frontend format
const transformBackendPatient = (backendPatient: BackendPatient): PatientOption => {
  return {
    id: backendPatient._id,
    fullName: backendPatient.user?.fullName || 'N/A',
    email: backendPatient.user?.email,
    phoneNumber: backendPatient.user?.phoneNumber,
    patientCode: backendPatient.patient_code,
  };
};

// Patient Service API
export const patientService = {
  // Get all patients with pagination and filters
  async getAllPatients(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    populateUser?: boolean;
  }): Promise<PatientOption[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      if (params?.populateUser !== undefined) queryParams.append('populateUser', params.populateUser.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `${PATIENT_API_BASE_URL}/getAll/?${queryString}`
        : `${PATIENT_API_BASE_URL}/getAll/`;

      // Try using patientApiClient first, fallback to apiService if needed
      let responseData: GetAllPatientsResponse;
      try {
        const response = await patientApiClient.get<GetAllPatientsResponse>(endpoint);
        responseData = response.data;
      } catch (error) {
        // If dedicated service fails, try using main API client
        console.warn('Patient service dedicated client failed, trying main API client');
        responseData = await apiService.get<GetAllPatientsResponse>(endpoint);
      }

      // Filter out deleted patients and return active ones with user info
      return responseData.patients
        .filter((p: BackendPatient) => !p.is_deleted && p.is_active && p.user) // Only active patients with user info
        .map(transformBackendPatient);
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },

  // Get all patients without pagination (for dropdowns)
  async getAllPatientsForDropdown(): Promise<PatientOption[]> {
    try {
      // Fetch with a large limit to get all active patients
      return await this.getAllPatients({
        page: 1,
        limit: 1000, // Large limit to get all patients
        isActive: true,
        populateUser: true,
      });
    } catch (error) {
      console.error('Error fetching patients for dropdown:', error);
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },

  // Get patient by ID
  async getPatientById(id: string): Promise<PatientOption | null> {
    try {
      const endpoint = `${PATIENT_API_BASE_URL}/viewDetail/${id}?populateUser=true`;
      
      let responseData: BackendPatient;
      try {
        const response = await patientApiClient.get<BackendPatient>(endpoint);
        responseData = response.data;
      } catch (error) {
        console.warn('Patient service dedicated client failed, trying main API client');
        responseData = await apiService.get<BackendPatient>(endpoint);
      }

      if (!responseData || responseData.is_deleted) {
        return null;
      }

      return transformBackendPatient(responseData);
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },
};


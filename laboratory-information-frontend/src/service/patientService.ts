import axios from 'axios';

// Patient API client for backend patient service
// Note: backend exposes endpoints under /api, so include it in the base URL
const PATIENT_API_BASE = 'http://localhost:5001/api';

export interface PatientDetailResponse {
  id: string;
  patient_code: string;
  user?: {
    id?: string;
    fullName?: string;
    email?: string;
    identityNumber?: string;
    phoneNumber?: string;
    gender?: string;
    age?: number;
    dateOfBirth?: string;
    address?: string;
  };
  emergency_contact?: {
    name?: string;
    phone?: string;
  };
  is_active?: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BackendPatient {
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  identifyNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  age?: number;
  address?: string;
  emergencyContact?: Record<string, unknown>;
  medicalHistory?: string[] | string;
  allergies?: string[];
  bloodType?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  lastVisit?: string;
}

export interface PatientsResponse {
  patients: BackendPatient[];
  total?: number;
  page?: number;
  totalPages?: number;
}

export async function fetchPatients(page = 1, limit = 10): Promise<PatientsResponse> {
  try {
    const url = `${PATIENT_API_BASE}/patients/getAll?page=${page}&limit=${limit}`;
    const res = await axios.get(url, { timeout: 5000 });
    // Expect backend to return { patients: [...], total, page, totalPages }
    const body = res.data ?? {};
    // normalize possible shapes
    if (Array.isArray(body)) {
      return { patients: body };
    }
    if (Array.isArray(body.patients)) {
      return {
        patients: body.patients as BackendPatient[],
        total: body.total ?? body.totalCount,
        page: body.page ?? page,
        totalPages: body.totalPages ?? body.total_pages ?? undefined,
      };
    }
    // Try other common shapes
    const data = body.data ?? body.patients ?? [];
    return {
      patients: Array.isArray(data) ? (data as BackendPatient[]) : [],
      total: body.total ?? undefined,
      page: body.page ?? undefined,
      totalPages: body.totalPages ?? undefined,
    };
  } catch (error) {
    // Provide more actionable logging for common failures
    // axios error typing is broad; attempt to extract response/status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = error;
    if (e?.response) {
      console.error(`PatientService.fetchPatients error: HTTP ${e.response.status} - ${e.response.statusText}`, e.response.data ?? e.message);
      if (e.response.status === 404) {
        console.error(`Requested URL ${PATIENT_API_BASE}/patients/getAll returned 404. Verify the patient service is running and that the endpoint path is correct (should be ${PATIENT_API_BASE}/patients/getAll).`);
      }
    } else {
      console.error('PatientService.fetchPatients error:', e?.message ?? e);
    }
    return { patients: [] };
  }
}

export async function viewPatientDetail(id: string): Promise<PatientDetailResponse | null> {
  try {
    const url = `${PATIENT_API_BASE}/patients/viewDetail/${id}`;
    const res = await axios.get(url, { timeout: 5000 });
    // Normalize possible shapes: { data: {...} } or { patient: {...} } or direct object
    const raw = res.data;
    let candidate = raw?.data ?? raw?.patient ?? raw?.result ?? raw;

    // If candidate is an object with nested `data` (some APIs wrap twice)
    if (candidate && (candidate.data || candidate.patient)) {
      candidate = candidate.data ?? candidate.patient ?? candidate;
    }

    // If still nullish, log and return null
    if (!candidate) {
      console.warn('viewPatientDetail: empty response for id', id, 'full response:', raw);
      return null;
    }

    return candidate as PatientDetailResponse;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = error;
    if (e?.response) {
      console.error(`PatientService.viewPatientDetail error: HTTP ${e.response.status} - ${e.response.statusText}`, e.response.data ?? e.message);
    } else {
      console.error('PatientService.viewPatientDetail error:', e?.message ?? e);
    }
    return null;
  }
}

export async function deletePatient(id: string): Promise<boolean> {
  try {
    // Backend delete endpoint (per spec): /patients/delete/{id}
    const url = `${PATIENT_API_BASE}/patients/delete/${id}`;
    // Use apiClient so cookies/auth are correctly attached
    const res = await apiClient.delete(url, { timeout: 5000 });
    // consider success if 2xx
    return res.status >= 200 && res.status < 300;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = error;
    if (e?.response) {
      console.error(`PatientService.deletePatient error: HTTP ${e.response.status} - ${e.response.statusText}`, e.response.data ?? e.message);
    } else {
      console.error('PatientService.deletePatient error:', e?.message ?? e);
    }
    return false;
  }
}

export interface UpdatePatientPayload {
  id: string;
  emergency_contact: {
    name: string;
    phone: string;
  };
  last_test_type?: string;
  is_active?: boolean;
}

import { apiClient } from './apiClient';

export async function updatePatient(id: string, payload: Partial<UpdatePatientPayload>): Promise<PatientDetailResponse | null> {
  try {
    const url = `${PATIENT_API_BASE}/patients/update/${id}`;
    
    // Ensure id is included in payload as required by API
    const fullPayload: UpdatePatientPayload = {
      id,
      emergency_contact: {
        name: payload.emergency_contact?.name || '',
        phone: payload.emergency_contact?.phone || ''
      },
      is_active: true
    };

    console.log('Sending update request:', { url, payload: fullPayload });
    
    // Use apiClient which already handles auth headers
    const res = await apiClient.put(url, fullPayload);

    // normalize response
    const body = res.data ?? res;
    console.log('Update response:', body);
    
    const candidate = body?.data ?? body?.patient ?? body;
    if (!candidate) {
      console.warn('Update response missing data:', body);
    }
    return candidate ?? null;
  } catch (error) {
    console.error('PatientService.updatePatient error:', error);
    // Re-throw to let component handle the error
    throw error;
  }
}

export default { fetchPatients, viewPatientDetail, deletePatient, updatePatient };

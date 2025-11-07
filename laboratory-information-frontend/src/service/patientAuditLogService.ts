import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { apiUtils, apiService } from './apiClient';

// Dedicated axios instance for Patient service (same as patientService pattern)
const PATIENT_SERVICE_URL = import.meta.env.VITE_PATIENT_SERVICE_URL || 'http://localhost:5001';
const auditApiClient: AxiosInstance = axios.create({
  baseURL: PATIENT_SERVICE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

auditApiClient.interceptors.request.use(
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

export interface SnapshotUser {
  id?: string;
  email?: string;
  fullName?: string;
  identityNumber?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  age?: number;
}

export interface SnapshotNewValues {
  user_id?: string;
  emergency_contact?: { name?: string; phone?: string };
  is_active?: boolean;
  created_by?: string;
  is_deleted?: boolean;
  _id?: string;
  created_at?: string;
  updated_at?: string;
  patient_code?: string;
  __v?: number;
  snapshot?: { user?: SnapshotUser };
}

export interface PatientAuditLog {
  _id: string;
  patient_id?: string;
  action: string;
  event_message?: string;
  old_values?: unknown;
  new_values?: SnapshotNewValues | unknown;
  performed_by?: string;
  performed_by_id?: string;
  performed_at: string; // ISO string
  ip_address?: string;
  user_agent?: string;
}

export interface PatientAuditLogsResponse {
  logs: PatientAuditLog[];
  total?: number;
  page?: number;
  totalPages?: number;
}

export interface PatientAuditLogDetailResponse {
  log: PatientAuditLog;
}

// Some backends mount routes under /api, others at root. Try both.
const AUDIT_ENDPOINTS = [
  '/api/patient-audit-logs',
  '/patient-audit-logs',
];

async function tryGet<T>(pathWithQuery: string): Promise<T> {
  // First try dedicated client
  try {
    const res = await auditApiClient.get<T>(pathWithQuery);
    return res.data as T;
  } catch {
    // Fallback to shared apiService
    return await apiService.get<T>(pathWithQuery);
  }
}

function isLogsResponse(candidate: unknown): candidate is PatientAuditLogsResponse {
  if (!candidate || typeof candidate !== 'object') return false;
  const c = candidate as Record<string, unknown>;
  return Array.isArray(c.logs);
}

type AltLogsResponse = {
  data?: PatientAuditLog[];
  total?: number;
  totalCount?: number;
  page?: number;
  totalPages?: number;
  total_pages?: number;
};

function isAltLogsResponse(candidate: unknown): candidate is AltLogsResponse {
  if (!candidate || typeof candidate !== 'object') return false;
  const c = candidate as Record<string, unknown>;
  return Array.isArray(c.data as unknown[]);
}

function pickNumber(...vals: Array<unknown>): number | undefined {
  for (const v of vals) {
    if (typeof v === 'number') return v;
  }
  return undefined;
}

export const patientAuditLogService = {
  async getAuditLogs(params?: { page?: number; limit?: number }): Promise<PatientAuditLogsResponse> {
    try {
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 10;
      const query = `?page=${page}&limit=${limit}`;

      // Try multiple mount points
      for (const base of AUDIT_ENDPOINTS) {
        try {
          const data = await tryGet<unknown>(`${base}${query}`);
          if (isLogsResponse(data)) {
            return {
              logs: data.logs,
              total: pickNumber(data.total),
              page: data.page ?? page,
              totalPages: pickNumber(data.totalPages),
            };
          }
          if (isAltLogsResponse(data)) {
            return {
              logs: data.data ?? [],
              total: pickNumber(data.total, data.totalCount),
              page: data.page ?? page,
              totalPages: pickNumber(data.totalPages, data.total_pages),
            };
          }
        } catch {
          // try next base
          continue;
        }
      }
      // If all attempts failed
      return { logs: [], total: 0, page, totalPages: 0 };
    } catch (error) {
      console.error('Error fetching patient audit logs:', error);
      throw new Error(apiUtils.getErrorMessage(error));
    }
  },

  async deleteAuditLog(id: string): Promise<boolean> {
    // Best-guess delete endpoints
    const candidates = [
      `/api/patient-audit-logs/delete/${id}`,
      `/patient-audit-logs/delete/${id}`,
      `/api/patient-audit-logs/${id}`,
      `/patient-audit-logs/${id}`,
    ];
    for (const path of candidates) {
      try {
        const res = await auditApiClient.delete(path);
        if (res.status >= 200 && res.status < 300) return true;
      } catch {
        try {
          await apiService.delete(path);
          return true;
        } catch {
          // try next
        }
      }
    }
    return false;
  },

  async getAuditLogById(id: string): Promise<PatientAuditLog | null> {
    const candidates = [
      `/api/patient-audit-logs/${id}`,
      `/patient-audit-logs/${id}`,
    ];
    for (const path of candidates) {
      try {
        const detail = await tryGet<unknown>(path);
        // normalize shapes: { log: {...} } or direct object
        const asObj = (detail && typeof detail === 'object') ? (detail as Record<string, unknown>) : undefined;
        const candidate = (asObj?.log && typeof asObj.log === 'object') ? (asObj.log as Partial<PatientAuditLog>) : (detail as Partial<PatientAuditLog> | null);
        if (candidate && typeof candidate === 'object' && typeof candidate._id === 'string') return candidate as PatientAuditLog;
      } catch {
        // try next
      }
    }
    return null;
  },
};

export default patientAuditLogService;



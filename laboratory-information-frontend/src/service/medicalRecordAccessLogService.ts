import axios from 'axios';
import type { AxiosInstance } from 'axios';

const PATIENT_SERVICE_URL = import.meta.env.VITE_PATIENT_SERVICE_URL || 'http://localhost:5001';

const accessLogApiClient: AxiosInstance = axios.create({
  baseURL: PATIENT_SERVICE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

accessLogApiClient.interceptors.request.use((config) => {
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
});

export interface MedicalRecordAccessLog {
  _id: string;
  medical_record_id?: string;
  patient_id?: string;
  accessed_by?: string;
  accessed_by_email?: string;
  accessed_by_name?: string | null;
  accessed_at: string; // ISO
  access_type?: string; // e.g., VIEW/UPDATE
  old_values?: unknown;
  new_values?: unknown;
  patient_snapshot?: unknown;
}

export interface MedicalRecordAccessLogsResponse {
  logs: MedicalRecordAccessLog[];
  total?: number;
  page?: number;
  totalPages?: number;
}

const ENDPOINTS = [
  '/medical-record-access-logs',
  '/api/medical-record-access-logs',
];

async function tryGet<T>(path: string): Promise<T> {
  const res = await accessLogApiClient.get<T>(path);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (res as any).data as T;
}

export const medicalRecordAccessLogService = {
  async getAll(params?: { page?: number; limit?: number }): Promise<MedicalRecordAccessLogsResponse> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const query = `?page=${page}&limit=${limit}`;
    for (const base of ENDPOINTS) {
      try {
        const data = await tryGet<unknown>(`${base}${query}`);
        if (data && typeof data === 'object') {
          const obj = data as Record<string, unknown>;
          const logs = (obj.logs as MedicalRecordAccessLog[]) || (obj.data as MedicalRecordAccessLog[]) || [];
          const total = (obj.total as number) ?? (obj.totalCount as number) ?? undefined;
          const totalPages = (obj.totalPages as number) ?? (obj.total_pages as number) ?? undefined;
          return { logs, total, page, totalPages };
        }
      } catch {
        // try next base
      }
    }
    return { logs: [], total: 0, page, totalPages: 0 };
  },

  async getById(id: string): Promise<MedicalRecordAccessLog | null> {
    const candidates = [
      `/medical-record-access-logs/${id}`,
      `/api/medical-record-access-logs/${id}`,
    ];
    for (const path of candidates) {
      try {
        const data = await tryGet<unknown>(path);
        if (data && typeof data === 'object') {
          const obj = data as Record<string, unknown>;
          const candidate = (obj.log && typeof obj.log === 'object')
            ? (obj.log as MedicalRecordAccessLog)
            : (obj.data && typeof obj.data === 'object')
              ? (obj.data as MedicalRecordAccessLog)
              : (data as MedicalRecordAccessLog);
          if (candidate && typeof candidate._id === 'string') return candidate;
        }
      } catch {
        // try next
      }
    }
    return null;
  },

  async delete(id: string): Promise<boolean> {
    const candidates = [
      `/medical-record-access-logs/${id}`,
      `/api/medical-record-access-logs/${id}`,
    ];
    for (const path of candidates) {
      try {
        const res = await accessLogApiClient.delete(path);
        if (res.status >= 200 && res.status < 300) return true;
      } catch {
        // try next
      }
    }
    return false;
  },
};

export default medicalRecordAccessLogService;



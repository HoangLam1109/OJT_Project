import axios from "axios";
import type { AxiosInstance } from 'axios';
import { apiUtils } from './apiClient'
import type { Instrument } from '../pages/service/types/Instrument';

const INSTRUMENTS_SERVICE_URL = import.meta.env.VITE_WAREHOUSE_SERVICE_URL || 'http://localhost:5003';
const INSTRUMENTS_API_BASE_URL = '/api/warehouse/instruments';

const instrumentsApiClient: AxiosInstance = axios.create({
    baseURL: INSTRUMENTS_SERVICE_URL,
    timeout: 10000,
    withCredentials: true, // Enable cookies for JWT authentication
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Attach Authorization header similar to other services
instrumentsApiClient.interceptors.request.use(
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

interface BackendInstrument {
    _id: string;
    instrument_code: string;
    instrument_name: string;
    instrument_type: string;
    manufacturer?: string;
    status: string;
    is_active: boolean;
    location?: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
    deleted_at?: string;
    deleted_by?: string;
    created_by?: string;
    updated_by?: string;
}

const transformBackendInstrument = (backendInstrument: BackendInstrument): Instrument => {
    const toDate = (dateStr?: string): Date => {
      const d = dateStr ? new Date(dateStr) : new Date();
      return isNaN(d.getTime()) ? new Date() : d;
    };

    

    return {
        _id: backendInstrument._id,
        instrument_code: backendInstrument.instrument_code,
        instrument_name: backendInstrument.instrument_name,
        instrument_type: backendInstrument.instrument_type,
        manufacturer: backendInstrument.manufacturer,
        status: backendInstrument.status as "Ready" | "Processing" | "Maintenance" | "Error" | "Inactive",
        is_active: backendInstrument.is_active,
        location: backendInstrument.location,
        created_at: toDate(backendInstrument.created_at),
        updated_at: toDate(backendInstrument.updated_at),
        is_deleted: backendInstrument.is_deleted,
        deleted_at: backendInstrument.deleted_at ? toDate(backendInstrument.deleted_at) : undefined,
        deleted_by: backendInstrument.deleted_by,
        created_by: backendInstrument.created_by,
        updated_by: backendInstrument.updated_by,
    };
};

const isRecord = (val: unknown): val is Record<string, unknown> => {
  return typeof val === 'object' && val !== null;
};

const extractDataArray = (payload: unknown): BackendInstrument[] => {
  if (Array.isArray(payload)) {
    return payload as BackendInstrument[];
  }
  if (isRecord(payload)) {
    const data = payload["data"];
    if (Array.isArray(data)) {
      return data as BackendInstrument[];
    }
  }
  return [];
};

const extractDataItem = (payload: unknown): BackendInstrument => {
  if (isRecord(payload) && "data" in payload) {
    const data = (payload as Record<string, unknown>)["data"] as BackendInstrument;
    return data;
  }
  return payload as BackendInstrument;
};

export const instrumentsService = {
    async getAllInstruments(): Promise<Instrument[]> {
        try {
            const response = await instrumentsApiClient.get(`${INSTRUMENTS_API_BASE_URL}/`);
            const payload = response.data as unknown;
            const list = extractDataArray(payload);
            return list.map(transformBackendInstrument);    
        } catch (error) {
            console.error('Error fetching instruments:', error);
            throw new Error(apiUtils.getErrorMessage(error));
        }
    },

    async getInstrumentById(_id: string): Promise<Instrument> {
        try {
            const response = await instrumentsApiClient.get(`${INSTRUMENTS_API_BASE_URL}/${_id}`);
            const payload = response.data as unknown;
            const item = extractDataItem(payload);
            return transformBackendInstrument(item);
        } catch (error) {
            console.error('Error fetching instrument:', error);
            throw new Error(apiUtils.getErrorMessage(error));
        }
    },
    async createInstrument(instrument: Partial<Instrument>): Promise<Instrument> {
        try {
            // Transform to backend format - only send the fields that backend expects
            const Payload: {
                instrument_name: string;
                instrument_type: string;
                manufacturer?: string;
                location?: string;
            } = {
                instrument_name: instrument.instrument_name || '',
                instrument_type: instrument.instrument_type || '',
            };

            if (instrument.manufacturer) {
                Payload.manufacturer = instrument.manufacturer;
            }

            if (instrument.location) {
                Payload.location = instrument.location;
            }

            const response = await instrumentsApiClient.post(`${INSTRUMENTS_API_BASE_URL}/`, Payload);
            const payload = response.data as unknown;
            const item = extractDataItem(payload);
            return transformBackendInstrument(item);
        } catch (error) {
            console.error('Error creating instrument:', error);
            throw new Error(apiUtils.getErrorMessage(error));
        }
    },

  async updateInstrument(_id: string, instrument: Partial<Instrument>): Promise<Instrument> {
    try {
        // Transform to backend format - only send the fields that backend expects
        const backendPayload: {
            instrument_name?: string;
            instrument_type?: string;
            manufacturer?: string;
            location?: string;
            status?: "Ready" | "Processing" | "Maintenance" | "Error" | "Inactive";
            is_active?: boolean;
        } = {};

        if (instrument.instrument_name !== undefined) {
            backendPayload.instrument_name = instrument.instrument_name.trim();
        }

        if (instrument.instrument_type !== undefined) {
            backendPayload.instrument_type = instrument.instrument_type.trim();
        }

        if (instrument.manufacturer !== undefined) {
            backendPayload.manufacturer = instrument.manufacturer.trim() || undefined;
        }

        if (instrument.location !== undefined) {
            backendPayload.location = instrument.location.trim() || undefined;
        }

        if (instrument.status !== undefined) {
            backendPayload.status = instrument.status;
        }

        if (instrument.is_active !== undefined) {
            backendPayload.is_active = instrument.is_active;
        }

        const response = await instrumentsApiClient.put(`${INSTRUMENTS_API_BASE_URL}/${_id}`, backendPayload);
        const payload = response.data as unknown;
        const item = extractDataItem(payload);
        return transformBackendInstrument(item);
    } catch (error) {
        console.error('Error updating instrument:', error);
        throw new Error(apiUtils.getErrorMessage(error));
    }
},

async deleteInstrument(_id: string): Promise<Instrument> {
    try {
        const response = await instrumentsApiClient.delete(`${INSTRUMENTS_API_BASE_URL}/${_id}`);
        const payload = response.data as unknown;
        const item = extractDataItem(payload);
        return transformBackendInstrument(item);
    } catch (error) {
        console.error('Error deleting instrument:', error);
        throw new Error(apiUtils.getErrorMessage(error));
    }
}
};
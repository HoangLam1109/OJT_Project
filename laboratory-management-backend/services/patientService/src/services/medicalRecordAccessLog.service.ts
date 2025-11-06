import type { FilterQuery } from "mongoose";
import MedicalRecordAccessLog, {
  type IMedicalRecordAccessLog,
  type MedicalRecordAccessType,
} from "../db/models/MedicalRecordAccessLog.model.js";

export interface MedicalRecordAccessFilters {
  medical_record_id?: string;
  patient_id?: string;
  accessed_by?: string;
  access_type?: MedicalRecordAccessType;
}

export interface PaginatedAccessLogs {
  logs: IMedicalRecordAccessLog[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateAccessLogPayload {
  medical_record_id: string;
  patient_id: string;
  accessed_by: string;
  accessed_by_email?: string | null;
  accessed_by_name?: string | null;
  access_type: MedicalRecordAccessType;
  accessed_at?: Date;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
}

class MedicalRecordAccessLogService {
  async createAccessLog(payload: CreateAccessLogPayload): Promise<IMedicalRecordAccessLog> {
    return await MedicalRecordAccessLog.create({
      ...payload,
      accessed_at: payload.accessed_at ?? new Date(),
    });
  }

  async getAccessLogs(
    filters: MedicalRecordAccessFilters = {},
    page = 1,
    limit = 10
  ): Promise<PaginatedAccessLogs> {
    const query: FilterQuery<IMedicalRecordAccessLog> = {};

    if (filters.medical_record_id) {
      query.medical_record_id = filters.medical_record_id;
    }

    if (filters.patient_id) {
      query.patient_id = filters.patient_id;
    }

    if (filters.accessed_by) {
      query.accessed_by = filters.accessed_by;
    }

    if (filters.access_type) {
      query.access_type = filters.access_type;
    }

    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
    const skip = (safePage - 1) * safeLimit;

    const [logs, total] = await Promise.all([
      MedicalRecordAccessLog.find(query)
        .sort({ accessed_at: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean<IMedicalRecordAccessLog[]>(),
      MedicalRecordAccessLog.countDocuments(query),
    ]);

    return {
      logs,
      total,
      page: safePage,
      totalPages: Math.max(Math.ceil(total / safeLimit), 1),
    };
  }

  async getAccessLogById(id: string): Promise<IMedicalRecordAccessLog | null> {
    return await MedicalRecordAccessLog.findById(id).lean<IMedicalRecordAccessLog | null>();
  }

  async deleteAccessLog(id: string): Promise<boolean> {
    const result = await MedicalRecordAccessLog.deleteOne({ _id: id });
    return Boolean(result.deletedCount && result.deletedCount > 0);
  }
}

const medicalRecordAccessLogService = new MedicalRecordAccessLogService();
export default medicalRecordAccessLogService;

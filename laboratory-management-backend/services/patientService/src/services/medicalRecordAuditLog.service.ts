import type { FilterQuery } from "mongoose";
import MedicalRecordAuditLog, {
  type IMedicalRecordAuditLog,
  type MedicalRecordAuditAction,
} from "../db/models/MedicalRecordAuditLog.model.js";

export interface MedicalRecordAuditFilters {
  medical_record_id?: string;
  patient_id?: string;
  performed_by?: string;
  performed_by_email?: string;
  action?: MedicalRecordAuditAction;
}

export interface PaginatedMedicalRecordAuditLogs {
  logs: IMedicalRecordAuditLog[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateMedicalRecordAuditLogPayload {
  medical_record_id: string;
  patient_id: string;
  action: MedicalRecordAuditAction;
  event_message: string;
  performed_by: string;
  performed_by_email?: string | null;
  performed_by_name?: string | null;
  performed_at?: Date;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
}

class MedicalRecordAuditLogService {
  async createAuditLog(
    payload: CreateMedicalRecordAuditLogPayload
  ): Promise<IMedicalRecordAuditLog> {
    return await MedicalRecordAuditLog.create({
      ...payload,
      performed_at: payload.performed_at ?? new Date(),
    });
  }

  async getAuditLogs(
    filters: MedicalRecordAuditFilters = {},
    page = 1,
    limit = 10
  ): Promise<PaginatedMedicalRecordAuditLogs> {
    const query: FilterQuery<IMedicalRecordAuditLog> = {};

    if (filters.medical_record_id) {
      query.medical_record_id = filters.medical_record_id;
    }

    if (filters.patient_id) {
      query.patient_id = filters.patient_id;
    }

    if (filters.performed_by) {
      query.performed_by = filters.performed_by;
    }

    if (filters.performed_by_email) {
      query.performed_by_email = filters.performed_by_email;
    }

    if (filters.action) {
      query.action = filters.action;
    }

    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
    const skip = (safePage - 1) * safeLimit;

    const [logs, total] = await Promise.all([
      MedicalRecordAuditLog.find(query)
        .sort({ performed_at: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean<IMedicalRecordAuditLog[]>(),
      MedicalRecordAuditLog.countDocuments(query),
    ]);

    return {
      logs,
      total,
      page: safePage,
      totalPages: Math.max(Math.ceil(total / safeLimit), 1),
    };
  }

  async getAuditLogById(id: string): Promise<IMedicalRecordAuditLog | null> {
    return await MedicalRecordAuditLog.findById(id).lean<IMedicalRecordAuditLog | null>();
  }

  async deleteAuditLog(id: string): Promise<boolean> {
    const result = await MedicalRecordAuditLog.deleteOne({ _id: id });
    return Boolean(result.deletedCount && result.deletedCount > 0);
  }
}

const medicalRecordAuditLogService = new MedicalRecordAuditLogService();
export default medicalRecordAuditLogService;
export { MedicalRecordAuditLogService };
export type { IMedicalRecordAuditLog };

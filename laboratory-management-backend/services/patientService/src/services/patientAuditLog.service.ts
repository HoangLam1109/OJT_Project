import type { FilterQuery } from "mongoose";
import PatientAuditLog, { type IPatientAuditLog } from "../db/models/PatientAuditLog.model.js";

export interface AuditLogFilters {
  patient_id?: string;
  performed_by?: string;
  action?: "CREATE" | "UPDATE" | "DELETE";
}

export interface PaginatedAuditLogs {
  logs: IPatientAuditLog[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateAuditLogPayload {
  patient_id: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  event_message: string;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
  performed_by: string;
  ip_address?: string;
  user_agent?: string;
  performed_at?: Date;
}

export class PatientAuditLogService {
  async createAuditLog(payload: CreateAuditLogPayload): Promise<IPatientAuditLog> {
    return await PatientAuditLog.create({
      ...payload,
      performed_at: payload.performed_at ?? new Date(),
    });
  }

  async getAuditLogs(
    filters: AuditLogFilters = {},
    page = 1,
    limit = 10
  ): Promise<PaginatedAuditLogs> {
    const query: FilterQuery<IPatientAuditLog> = {};

    if (filters.patient_id) {
      query.patient_id = filters.patient_id;
    }

    if (filters.performed_by) {
      query.performed_by = filters.performed_by;
    }

    if (filters.action) {
      query.action = filters.action;
    }

    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
    const skip = (safePage - 1) * safeLimit;

    const [logs, total] = await Promise.all([
      PatientAuditLog.find(query)
        .sort({ performed_at: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean<IPatientAuditLog[]>(),
      PatientAuditLog.countDocuments(query),
    ]);

    return {
      logs,
      total,
      page: safePage,
      totalPages: Math.max(Math.ceil(total / safeLimit), 1),
    };
  }

  async getAuditLogById(id: string): Promise<IPatientAuditLog | null> {
    return await PatientAuditLog.findById(id).lean<IPatientAuditLog | null>();
  }

  async deleteAuditLog(id: string): Promise<boolean> {
    const result = await PatientAuditLog.deleteOne({ _id: id });
    return Boolean(result.deletedCount && result.deletedCount > 0);
  }
}

const patientAuditLogService = new PatientAuditLogService();
export default patientAuditLogService;

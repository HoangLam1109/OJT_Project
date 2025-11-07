import { auditLogRepository } from "../repositories/index.js";
import {
  PaginationResponse,
  PaginationOptions,
} from "../types/pagination.type.js";
import { PaginationUtils } from "../utils/pagination.util.js";
import { IAuditLog } from "../db/models/AuditLog.model.js";

export class LogService {
  async getLog(eventId: string): Promise<IAuditLog | null> {
      return await auditLogRepository.findById(
        eventId,
        "_id action eventMessage performedAt serviceName"
      );
    }

  async deleteLog(
    eventId: string,
    performedBy?: string
  ): Promise<IAuditLog | null> {
    const deletedUser = await auditLogRepository.deleteById(eventId);
    await this._logEvent(
      "E_00003",
      "DELETE",
      "Log deleted successfully!",
      performedBy || "Unknown"
    );
    return deletedUser;
  }

  async getLogsWithPagination(
    options: PaginationOptions
  ): Promise<PaginationResponse<IAuditLog>> {
    const result = await auditLogRepository.findWithPagination(options);
    return PaginationUtils.formatResponse(
      result.data,
      result.hasNextPage,
      options,
      result.totalCount
    );
  }

  private async _logEvent(
    eventCode: string,
    action: string,
    eventMessage: string,
    perfomedBy: string
  ): Promise<void> {
    await auditLogRepository.create({
      eventCode,
      action,
      eventMessage,
      userId: perfomedBy,
      performedAt: new Date(),
      serviceName: "Log Service",
    });
  }
}

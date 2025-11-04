import type { Request, Response } from "express";
import patientAuditLogService from "../services/patientAuditLog.service.js";
import { errorHandler } from "../utils/error.util.js";
import iamServiceClient from "../services/iamService.client.js";

type AuditLogRecord = Record<string, unknown> & { performed_by: string; performed_by_id?: string };

const resolveEmailForActor = async (actorId: string): Promise<string | null> => {
  if (!actorId || actorId.includes("@") || actorId === "system") {
    return null;
  }
  try {
    const user = await iamServiceClient.getUserById(actorId);
    if (user?.email) {
      return user.email;
    }
  } catch (error) {
    console.warn(`[PatientAuditLogController] Unable to resolve actor ${actorId}`, error);
  }
  return null;
};

const sanitizeAuditLog = (log: Record<string, unknown>): AuditLogRecord => {
  const cloned = { ...log };
  delete (cloned as Record<string, unknown>)["changed_fields"];
  return cloned as AuditLogRecord;
};

const enrichAuditLogsWithEmail = async (logs: AuditLogRecord[]): Promise<AuditLogRecord[]> => {
  if (logs.length === 0) {
    return [];
  }

  const actorsNeedingLookup = new Set<string>();
  for (const log of logs) {
    const performer = log.performed_by;
    if (performer && !performer.includes("@")) {
      actorsNeedingLookup.add(performer);
    }
  }

  const emailMap = new Map<string, string>();
  await Promise.all(
    Array.from(actorsNeedingLookup).map(async (actorId) => {
      const email = await resolveEmailForActor(actorId);
      if (email) {
        emailMap.set(actorId, email);
      }
    })
  );

  return logs.map((log) => {
    const performer = log.performed_by;
    const resolvedEmail = performer.includes("@") ? performer : emailMap.get(performer) ?? performer;
    return sanitizeAuditLog({
      ...log,
      performed_by: resolvedEmail,
      performed_by_id: performer,
    });
  });
};

const getAllAuditLogs = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['PatientAuditLogs']
    #swagger.description = 'Danh sách log (phân trang, filter)'
    #swagger.parameters['page'] = { in: 'query', type: 'integer', default: 1 }
    #swagger.parameters['limit'] = { in: 'query', type: 'integer', default: 10 }
    #swagger.parameters['patientId'] = { in: 'query', type: 'string' }
    #swagger.parameters['performedBy'] = { in: 'query', type: 'string' }
    #swagger.parameters['action'] = { in: 'query', type: 'string', enum: ['CREATE','UPDATE','DELETE'] }
  */
  try {
    const { page = "1", limit = "10", patientId, performedBy, action } = req.query;

    const filters = {
      ...(typeof patientId === "string" ? { patient_id: patientId } : {}),
      ...(typeof performedBy === "string" ? { performed_by: performedBy } : {}),
      ...(typeof action === "string" ? { action: action as "CREATE" | "UPDATE" | "DELETE" } : {}),
    };

    const result = await patientAuditLogService.getAuditLogs(
      filters,
      Number(page),
      Number(limit)
    );

    const logsForResponse = result.logs.map((log) =>
      sanitizeAuditLog(log as unknown as Record<string, unknown>)
    );
    const enrichedLogs = await enrichAuditLogsWithEmail(logsForResponse);

    res.status(200).json({
      ...result,
      logs: enrichedLogs,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAuditLogDetail = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['PatientAuditLogs']
    #swagger.description = 'Chi tiết một audit log'
    #swagger.parameters['id'] = { in: 'path', type: 'string', required: true }
  */
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Audit log ID is required" });
      return;
    }

    const log = await patientAuditLogService.getAuditLogById(id);
    if (!log) {
      res.status(404).json({ message: "Audit log not found" });
      return;
    }

    const [resolvedLog] = await enrichAuditLogsWithEmail([
      sanitizeAuditLog(log as unknown as Record<string, unknown>),
    ]);

    res.status(200).json({ log: resolvedLog });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAuditLog = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['PatientAuditLogs']
    #swagger.description = 'Xóa audit log (chỉ admin nội bộ)'
    #swagger.parameters['id'] = { in: 'path', type: 'string', required: true }
  */
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Audit log ID is required" });
      return;
    }

    const deleted = await patientAuditLogService.deleteAuditLog(id);
    if (!deleted) {
      res.status(404).json({ message: "Audit log not found" });
      return;
    }

    res.status(200).json({ message: "Audit log deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

export { getAllAuditLogs, getAuditLogDetail, deleteAuditLog };

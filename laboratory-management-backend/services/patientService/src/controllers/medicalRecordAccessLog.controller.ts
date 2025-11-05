import type { Request, Response } from "express";
import medicalRecordAccessLogService from "../services/medicalRecordAccessLog.service.js";
import { errorHandler } from "../utils/error.util.js";
import iamServiceClient from "../services/iamService.client.js";
import type { MedicalRecordAccessType } from "../db/models/MedicalRecordAccessLog.model.js";

interface AccessLogRecord extends Record<string, unknown> {
  accessed_by: string;
  accessed_by_email?: string | null;
  accessed_by_name?: string | null;
}

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
    console.warn(`[MedicalRecordAccessLogController] Unable to resolve actor ${actorId}`, error);
  }
  return null;
};

const enrichLogsWithEmail = async (logs: AccessLogRecord[]): Promise<AccessLogRecord[]> => {
  if (logs.length === 0) {
    return [];
  }

  const actorIds = new Set<string>();
  for (const log of logs) {
    const actor = log.accessed_by;
    if (actor && !actor.includes("@")) {
      if (!log.accessed_by_email) {
        actorIds.add(actor);
      }
    }
  }

  const emailMap = new Map<string, string>();
  await Promise.all(
    Array.from(actorIds).map(async (actorId) => {
      const email = await resolveEmailForActor(actorId);
      if (email) {
        emailMap.set(actorId, email);
      }
    })
  );

  return logs.map((log) => {
    const actor = log.accessed_by;
    const existingEmail = typeof log.accessed_by_email === "string" ? log.accessed_by_email : null;
    const resolvedEmail = existingEmail ?? (actor.includes("@") ? actor : emailMap.get(actor) ?? null);
    return {
      ...log,
      accessed_by_email: resolvedEmail,
    };
  });
};

const ACCESS_TYPES: readonly MedicalRecordAccessType[] = [
  "VIEW",
  "UPDATE",
  "DELETE",
  "EXPORT",
  "CREATE",
] as const;

const getAllAccessLogs = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['MedicalRecordAccessLogs']
    #swagger.description = 'Danh sách log truy cập hồ sơ y tế'
    #swagger.parameters['page'] = { in: 'query', type: 'integer', default: 1 }
    #swagger.parameters['limit'] = { in: 'query', type: 'integer', default: 10 }
    #swagger.parameters['medicalRecordId'] = { in: 'query', type: 'string' }
    #swagger.parameters['patientId'] = { in: 'query', type: 'string' }
    #swagger.parameters['accessedBy'] = { in: 'query', type: 'string' }
  #swagger.parameters['accessType'] = { in: 'query', type: 'string', enum: ['VIEW','UPDATE','DELETE','EXPORT','CREATE'] }
  */
  try {
    const { page = "1", limit = "10", medicalRecordId, patientId, accessedBy, accessType } = req.query;

    const filters = {
      ...(typeof medicalRecordId === "string" ? { medical_record_id: medicalRecordId } : {}),
      ...(typeof patientId === "string" ? { patient_id: patientId } : {}),
      ...(typeof accessedBy === "string" ? { accessed_by: accessedBy } : {}),
      ...((typeof accessType === "string" && ACCESS_TYPES.includes(accessType as MedicalRecordAccessType))
        ? { access_type: accessType as MedicalRecordAccessType }
        : {}),
    };

    const result = await medicalRecordAccessLogService.getAccessLogs(
      filters,
      Number(page),
      Number(limit)
    );

    const logsForResponse = result.logs.map((log) => ({ ...log })) as AccessLogRecord[];
    const enrichedLogs = await enrichLogsWithEmail(logsForResponse);

    res.status(200).json({
      ...result,
      logs: enrichedLogs,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAccessLogDetail = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['MedicalRecordAccessLogs']
    #swagger.description = 'Chi tiết log truy cập hồ sơ y tế'
    #swagger.parameters['id'] = { in: 'path', type: 'string', required: true }
  */
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Access log ID is required" });
      return;
    }

    const log = await medicalRecordAccessLogService.getAccessLogById(id);
    if (!log) {
      res.status(404).json({ message: "Access log not found" });
      return;
    }

    const [enrichedLog] = await enrichLogsWithEmail([{ ...log } as AccessLogRecord]);

    res.status(200).json({ log: enrichedLog });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAccessLog = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['MedicalRecordAccessLogs']
    #swagger.description = 'Xóa log truy cập (nội bộ)'
    #swagger.parameters['id'] = { in: 'path', type: 'string', required: true }
  */
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Access log ID is required" });
      return;
    }

    const deleted = await medicalRecordAccessLogService.deleteAccessLog(id);
    if (!deleted) {
      res.status(404).json({ message: "Access log not found" });
      return;
    }

    res.status(200).json({ message: "Access log deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

export { getAllAccessLogs, getAccessLogDetail, deleteAccessLog };

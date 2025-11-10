import type { Request, Response } from "express";
import patientAuditLogService from "../services/patientAuditLog.service.js";
import { errorHandler } from "../utils/error.util.js";
import iamServiceClient, { type IamUser } from "../services/iamService.client.js";
import { PatientService } from "../services/patient.service.js";

const patientService = new PatientService();

const buildUserSnapshot = (user: IamUser | null | undefined): Record<string, unknown> | null => {
  if (!user) {
    return null;
  }
  return {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    identityNumber: user.identityNumber,
    phoneNumber: user.phoneNumber ?? null,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
    address: user.address ?? null,
    age: user.age,
    role: user.role,
    isActive: user.isActive,
  };
};

const buildPatientSnapshot = (
  user: IamUser | null | undefined
): Record<string, unknown> | null => {
  const userData = buildUserSnapshot(user);
  if (!userData) {
    return null;
  }
  return {
    user: userData,
  };
};

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

    const log = await patientAuditLogService.getAuditLogById(id);
    if (!log) {
      res.status(404).json({ message: "Audit log not found" });
      return;
    }

    // Tái sử dụng snapshot từ log hiện tại nếu có
    const logRecord = log as unknown as Record<string, unknown>;
    let patientSnapshot: Record<string, unknown> | null = null;

    // Kiểm tra snapshot trong old_values hoặc new_values
    const oldValues = logRecord.old_values as Record<string, unknown> | null | undefined;
    const newValues = logRecord.new_values as Record<string, unknown> | null | undefined;
    
    if (oldValues && typeof oldValues === "object" && oldValues.snapshot) {
      patientSnapshot = oldValues.snapshot as Record<string, unknown>;
      console.log("   ♻️  Reusing snapshot from old_values");
    } else if (newValues && typeof newValues === "object" && newValues.snapshot) {
      patientSnapshot = newValues.snapshot as Record<string, unknown>;
      console.log("   ♻️  Reusing snapshot from new_values");
    } else {
      // Nếu không có snapshot, tạo mới từ patient hiện tại
      const patient = await patientService.getPatientById(log.patient_id);
      if (patient && patient.user_id) {
        const iamUser = await iamServiceClient.getUserById(patient.user_id);
        patientSnapshot = buildPatientSnapshot(iamUser);
        console.log("   🆕 Created new snapshot from current patient");
      }
    }

    // Lấy thông tin actor
    const actorId = (req as any).userId || "system";
    const actorEmail = (req as any).email || null;

    const deleted = await patientAuditLogService.deleteAuditLog(id);
    if (!deleted) {
      res.status(404).json({ message: "Audit log not found" });
      return;
    }

    // Ghi log audit cho việc xóa audit log
    const deleteOldValues: Record<string, unknown> = { ...logRecord };
    if (patientSnapshot) {
      deleteOldValues.snapshot = patientSnapshot;
    }

    await patientAuditLogService.createAuditLog({
      patient_id: log.patient_id,
      performed_by: actorEmail || actorId,
      action: "DELETE",
      event_message: "Audit log deleted",
      old_values: deleteOldValues,
      new_values: null,
    });

    res.status(200).json({ message: "Audit log deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

export { getAllAuditLogs, getAuditLogDetail, deleteAuditLog };

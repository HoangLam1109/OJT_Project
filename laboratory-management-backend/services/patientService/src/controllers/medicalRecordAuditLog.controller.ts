import type { Request, Response } from "express";
import medicalRecordAuditLogService from "../services/medicalRecordAuditLog.service.js";
import { errorHandler } from "../utils/error.util.js";
import iamServiceClient from "../services/iamService.client.js";
import { PatientMedicalRecordService } from "../services/patientMedicalRecord.service.js";

const patientMedicalRecordService = new PatientMedicalRecordService();

const resolveActorEmail = async (actorId: string): Promise<string | null> => {
  if (!actorId || actorId === "system" || actorId.includes("@")) {
    return actorId && actorId.includes("@") ? actorId : null;
  }

  try {
    const user = await iamServiceClient.getUserById(actorId);
    if (user?.email) {
      return user.email;
    }
  } catch (error) {
    console.warn(`[MedicalRecordAuditLogController] Unable to resolve email for ${actorId}`, error);
  }
  return null;
};

const resolveActorName = async (actorId: string): Promise<string | null> => {
  if (!actorId || actorId === "system") {
    return null;
  }

  if (actorId.includes("@")) {
    return actorId;
  }

  try {
    const user = await iamServiceClient.getUserById(actorId);
    if (user?.fullName && user.fullName.trim().length > 0) {
      return user.fullName.trim();
    }
    if (user?.email && user.email.trim().length > 0) {
      return user.email.trim();
    }
  } catch (error) {
    console.warn(`[MedicalRecordAuditLogController] Unable to resolve name for ${actorId}`, error);
  }
  return null;
};

const resolveRequestActor = async (
  req: Request
): Promise<{ actorId: string; actorEmail: string | null; actorName: string | null }> => {
  const headerNameRaw =
    req.headers["x-user-name"] ??
    req.headers["x-operator-name"] ??
    req.headers["x-actor-name"];
  const headerName = Array.isArray(headerNameRaw) ? headerNameRaw[0] : headerNameRaw;

  const headerEmailRaw = req.headers["x-user-email"];
  const headerEmail = Array.isArray(headerEmailRaw) ? headerEmailRaw[0] : headerEmailRaw;
  if (typeof headerEmail === "string" && headerEmail.length > 0) {
    const normalizedEmail = headerEmail.trim();
    const normalizedName =
      typeof headerName === "string" && headerName.trim().length > 0
        ? headerName.trim()
        : normalizedEmail;
    return {
      actorId: normalizedEmail,
      actorEmail: normalizedEmail,
      actorName: normalizedName,
    };
  }

  const headerUserIdRaw = req.headers["x-user-id"] ?? req.headers["x-actor-id"];
  const headerUserId = Array.isArray(headerUserIdRaw) ? headerUserIdRaw[0] : headerUserIdRaw;
  const requestUserId = (req as any).userId;
  const resolvedUserId =
    typeof requestUserId === "string" && requestUserId.trim().length > 0
      ? requestUserId.trim()
      : typeof headerUserId === "string" && headerUserId.trim().length > 0
      ? headerUserId.trim()
      : null;

  if (resolvedUserId) {
    const email = await resolveActorEmail(resolvedUserId);
    const nameCandidate =
      typeof headerName === "string" && headerName.trim().length > 0
        ? headerName.trim()
        : await resolveActorName(resolvedUserId);
    return {
      actorId: resolvedUserId,
      actorEmail: email,
      actorName: nameCandidate ?? email ?? resolvedUserId,
    };
  }

  const fallbackName =
    typeof headerName === "string" && headerName.trim().length > 0 ? headerName.trim() : null;

  return {
    actorId: "system",
    actorEmail: null,
    actorName: fallbackName,
  };
};

const sanitizeAuditLog = (log: Record<string, unknown>): Record<string, unknown> => {
  const cloned = { ...log };
  delete cloned.__v;
  return cloned;
};

const enrichActorDisplay = async (
  logs: Record<string, unknown>[]
): Promise<Record<string, unknown>[]> => {
  return await Promise.all(
    logs.map(async (log) => {
      const performedBy = log.performed_by as string | undefined;
      const performedByEmail = log.performed_by_email as string | null | undefined;
      const resolvedEmail = performedByEmail ?? (performedBy ? await resolveActorEmail(performedBy) : null);
      const resolvedName =
        (log.performed_by_name as string | null | undefined) ??
        (performedBy ? await resolveActorName(performedBy) : null);

      return {
        ...log,
        performed_by: resolvedEmail ?? performedBy ?? "system",
        performed_by_id: performedBy ?? null,
        performed_by_email: resolvedEmail ?? performedByEmail ?? null,
        performed_by_name: resolvedName ?? resolvedEmail ?? performedBy ?? null,
      };
    })
  );
};

const getAllMedicalRecordAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "10", medicalRecordId, patientId, performedBy, action } = req.query;

    const filters = {
      ...(typeof medicalRecordId === "string" ? { medical_record_id: medicalRecordId } : {}),
      ...(typeof patientId === "string" ? { patient_id: patientId } : {}),
      ...(typeof performedBy === "string" ? { performed_by: performedBy } : {}),
      ...(typeof action === "string" ? { action: action as any } : {}),
    };

    const result = await medicalRecordAuditLogService.getAuditLogs(
      filters,
      Number(page),
      Number(limit)
    );

    const sanitizedLogs = result.logs.map((log) => sanitizeAuditLog(log as unknown as Record<string, unknown>));
    const enrichedLogs = await enrichActorDisplay(sanitizedLogs);

    res.status(200).json({
      ...result,
      logs: enrichedLogs,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getMedicalRecordAuditLogDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Audit log ID is required" });
      return;
    }

    const log = await medicalRecordAuditLogService.getAuditLogById(id);
    if (!log) {
      res.status(404).json({ message: "Audit log not found" });
      return;
    }

    const [enriched] = await enrichActorDisplay([
      sanitizeAuditLog(log as unknown as Record<string, unknown>),
    ]);

    res.status(200).json({ log: enriched });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteMedicalRecordAuditLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Audit log ID is required" });
      return;
    }

    const log = await medicalRecordAuditLogService.getAuditLogById(id);
    if (!log) {
      res.status(404).json({ message: "Audit log not found" });
      return;
    }

    const actorContext = await resolveRequestActor(req);

    const deleted = await medicalRecordAuditLogService.deleteAuditLog(id);
    if (!deleted) {
      res.status(404).json({ message: "Audit log not found" });
      return;
    }

    const logRecord = log as unknown as Record<string, unknown>;
    const oldValues = logRecord.old_values as Record<string, unknown> | null | undefined;
    const newValues = logRecord.new_values as Record<string, unknown> | null | undefined;
    let snapshot =
      (oldValues && typeof oldValues === "object" && (oldValues as any).snapshot
        ? ((oldValues as any).snapshot as Record<string, unknown>)
        : null) ??
      (newValues && typeof newValues === "object" && (newValues as any).snapshot
        ? ((newValues as any).snapshot as Record<string, unknown>)
        : null);

    if (!snapshot) {
      try {
        const recordIdValue = log.medical_record_id;
        const record = await patientMedicalRecordService.getPatientRecordDetail(
          recordIdValue,
          true
        );
        if (record) {
          snapshot = {
            medical_record: { ...record, patient: undefined },
          };
        }
      } catch (snapshotError) {
        console.warn("[MedicalRecordAuditLogController] Unable to build snapshot", snapshotError);
      }
    }

    const deleteOldValues: Record<string, unknown> = { ...logRecord };
    if (snapshot) {
      deleteOldValues.snapshot = snapshot;
    }

    try {
      await medicalRecordAuditLogService.createAuditLog({
        medical_record_id: log.medical_record_id,
        patient_id: log.patient_id,
        action: "DELETE",
        event_message: "Audit log deleted",
        performed_by: actorContext.actorId,
        performed_by_email: actorContext.actorEmail,
        performed_by_name: actorContext.actorName,
        old_values: deleteOldValues,
        new_values: null,
      });
    } catch (auditError) {
      console.warn(
        "[MedicalRecordAuditLogController] Failed to record deletion audit log",
        auditError
      );
    }

    res.status(200).json({ message: "Audit log deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

export {
  getAllMedicalRecordAuditLogs,
  getMedicalRecordAuditLogDetail,
  deleteMedicalRecordAuditLog,
};

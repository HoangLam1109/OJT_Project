import type { Request, Response } from "express";
import medicalRecordAccessLogService from "../services/medicalRecordAccessLog.service.js";
import { errorHandler } from "../utils/error.util.js";
import iamServiceClient, { type IamUser } from "../services/iamService.client.js";
import type { MedicalRecordAccessType } from "../db/models/MedicalRecordAccessLog.model.js";
import Patient, { type IPatient } from "../db/models/Patient.model.js";

interface AccessLogRecord extends Record<string, unknown> {
  accessed_by: string;
  accessed_by_email?: string | null;
  accessed_by_name?: string | null;
  medical_record_id: string;
  patient_id: string;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
  patient_snapshot?: Record<string, unknown> | null;
}

const extractSnapshot = (payload: unknown): Record<string, unknown> | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const snapshot = (payload as Record<string, unknown>).snapshot;
  if (!snapshot || typeof snapshot !== "object") {
    return null;
  }
  return { ...(snapshot as Record<string, unknown>) };
};

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

const buildPatientSnapshotFromContext = (user: IamUser | null): Record<string, unknown> | null => {
  const userData = buildUserSnapshot(user);
  if (!userData) {
    return null;
  }
  return { user: userData };
};

const fetchPatientSnapshots = async (
  patientIds: string[]
): Promise<Map<string, Record<string, unknown>>> => {
  const snapshotMap = new Map<string, Record<string, unknown>>();
  const uniqueIds = [...new Set(patientIds.filter((id) => typeof id === "string" && id.length > 0))] as string[];
  if (uniqueIds.length === 0) {
    return snapshotMap;
  }

  try {
    const patients = await Patient.find({ _id: { $in: uniqueIds } }).lean<IPatient[]>();
    if (patients.length === 0) {
      return snapshotMap;
    }

    const userIds = new Set<string>();
    for (const patient of patients) {
      const userId = typeof patient.user_id === "string" ? patient.user_id : undefined;
      if (userId) {
        userIds.add(userId);
      }
    }

    const userMap = new Map<string, IamUser>();
    await Promise.all(
      Array.from(userIds).map(async (userId) => {
        try {
          const user = await iamServiceClient.getUserById(userId);
          if (user) {
            userMap.set(userId, user);
          }
        } catch (error) {
          console.warn(`[MedicalRecordAccessLogController] Unable to resolve IAM user ${userId}`, error);
        }
      })
    );

    for (const patient of patients) {
      const key = String(patient._id);
      const user = typeof patient.user_id === "string" ? userMap.get(patient.user_id) ?? null : null;
      const snapshot = buildPatientSnapshotFromContext(user ?? null);
      if (snapshot) {
        snapshotMap.set(key, snapshot);
      }
    }
  } catch (error) {
    console.warn("[MedicalRecordAccessLogController] Unable to hydrate patient snapshots", error);
  }

  return snapshotMap;
};

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
  const cachedSnapshots: Array<Record<string, unknown> | null> = new Array(logs.length).fill(null);
  const missingPatientIds = new Set<string>();
  for (const log of logs) {
    const actor = log.accessed_by;
    if (actor && !actor.includes("@")) {
      if (!log.accessed_by_email) {
        actorIds.add(actor);
      }
    }
  }

  logs.forEach((log, index) => {
    const existingSnapshot = extractSnapshot(log.new_values ?? null) ?? extractSnapshot(log.old_values ?? null);
    cachedSnapshots[index] = existingSnapshot;
    if (!existingSnapshot) {
      const patientId = typeof log.patient_id === "string" ? log.patient_id : undefined;
      if (patientId && patientId.length > 0) {
        missingPatientIds.add(patientId);
      }
    }
  });

  const emailMap = new Map<string, string>();
  await Promise.all(
    Array.from(actorIds).map(async (actorId) => {
      const email = await resolveEmailForActor(actorId);
      if (email) {
        emailMap.set(actorId, email);
      }
    })
  );

  const fallbackSnapshots = await fetchPatientSnapshots(Array.from(missingPatientIds));

  return logs.map((log, index) => {
    const actor = log.accessed_by;
    const existingEmail = typeof log.accessed_by_email === "string" ? log.accessed_by_email : null;
    const resolvedEmail = existingEmail ?? (actor.includes("@") ? actor : emailMap.get(actor) ?? null);
  const inlineSnapshot = cachedSnapshots[index];
  const patientKey = typeof log.patient_id === "string" ? log.patient_id : undefined;
  const fallbackSnapshot = inlineSnapshot ?? (patientKey ? fallbackSnapshots.get(patientKey) ?? null : null);
    return {
      ...log,
      accessed_by_email: resolvedEmail,
      patient_snapshot: fallbackSnapshot,
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

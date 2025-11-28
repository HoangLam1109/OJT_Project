import monitoringServiceClient, { type MonitoringEventLogPayload } from "./monitoringService.client.js";
import {
  MonitoringEventCodes,
  MonitoringEventActions,
  MonitoringServiceName,
} from "../constants/monitoring.constant.js";
import Patient, { type IPatient } from "../db/models/Patient.model.js";
import iamServiceClient, { type IamUser } from "./iamService.client.js";

interface MedicalRecordMonitoringPayload {
  medicalRecordId: string;
  patientId: string;
  eventMessage: string;
  operatorId?: string | null;
  operatorEmail?: string | null;
  operatorName?: string | null;
  operatorRole?: string | null;
  operatorAvatar?: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
}

class MedicalRecordMonitoringService {
  private normalize(value: string | null | undefined): string | undefined {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
    return undefined;
  }

  private isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private stripSnapshot(data: any): any {
    if (!this.isPlainObject(data)) {
      return data;
    }
    const { snapshot, ...rest } = data;
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rest)) {
      sanitized[key] = this.stripSnapshot(value);
    }
    return sanitized;
  }

  private extractSnapshot(data: any): Record<string, unknown> | null {
    if (this.isPlainObject(data) && this.isPlainObject((data as any).snapshot)) {
      return (data as any).snapshot as Record<string, unknown>;
    }
    return null;
  }

  private computeDifferences(
    oldData: Record<string, unknown> | null | undefined,
    newData: Record<string, unknown> | null | undefined
  ) {
    const oldDiff: Record<string, unknown> = {};
    const newDiff: Record<string, unknown> = {};

    const allKeys = new Set([
      ...Object.keys(oldData || {}),
      ...Object.keys(newData || {}),
    ]);

    for (const key of allKeys) {
      if (["updated_at", "updated_by", "__v"].includes(key)) {
        continue;
      }

      const oldVal = oldData?.[key];
      const newVal = newData?.[key];

      if (this.isPlainObject(oldVal) && this.isPlainObject(newVal)) {
        const nested = this.computeDifferences(oldVal, newVal);
        if (
          Object.keys(nested.oldDiff).length > 0 ||
          Object.keys(nested.newDiff).length > 0
        ) {
          oldDiff[key] = nested.oldDiff;
          newDiff[key] = nested.newDiff;
        }
        continue;
      }

      if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        oldDiff[key] = oldVal;
        newDiff[key] = newVal;
      }
    }
    return { oldDiff, newDiff };
  }

  private getDifferences(
    oldData: any,
    newData: any,
    snapshot?: Record<string, unknown> | null
  ) {
    const sanitizedOld = this.stripSnapshot(oldData);
    const sanitizedNew = this.stripSnapshot(newData);
    const { oldDiff, newDiff } = this.computeDifferences(sanitizedOld, sanitizedNew);

    if (snapshot) {
      newDiff.snapshot = snapshot;
    }

    return { oldDiff, newDiff };
  }

  private sanitizeMedicalRecord(
    record: Record<string, unknown> | null | undefined
  ): Record<string, unknown> | null {
    if (!record || typeof record !== "object") {
      return null;
    }
    const sanitized = { ...(record as Record<string, unknown>) };
    delete sanitized.__v;
    return sanitized;
  }

  private buildUserSnapshot(user: IamUser | null | undefined): Record<string, unknown> | null {
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
  }

  private buildPatientSnapshot(patient: IPatient | null | undefined): Record<string, unknown> | null {
    if (!patient) {
      return null;
    }
    return {
      id: patient._id?.toString?.() ?? (patient._id as unknown as string),
      userId: patient.user_id ?? null,
      code: patient.patient_code ?? null,
      isActive: patient.is_active ?? null,
      isDeleted: patient.is_deleted ?? null,
      createdAt: patient.created_at ?? null,
      updatedAt: patient.updated_at ?? null,
      deletedAt: patient.deleted_at ?? null,
      lastVisitDate: patient.last_visit_date ?? null,
      lastTestType: patient.last_test_type ?? null,
      emergencyContact: patient.emergency_contact ?? null,
    };
  }

  private buildSnapshotPayload(
    medicalRecord: Record<string, unknown> | null,
    patient: IPatient | null,
    user: IamUser | null
  ): Record<string, unknown> | null {
    const snapshot: Record<string, unknown> = {};

    if (medicalRecord) {
      snapshot.medical_record = medicalRecord;
    }

    const patientSnapshot = this.buildPatientSnapshot(patient);
    if (patientSnapshot) {
      snapshot.patient = patientSnapshot;
    }

    const userSnapshot = this.buildUserSnapshot(user);
    if (userSnapshot) {
      snapshot.user = userSnapshot;
    }

    return Object.keys(snapshot).length > 0 ? snapshot : null;
  }

  private async fetchPatient(patientId: string | null | undefined): Promise<IPatient | null> {
    if (!patientId) {
      return null;
    }
    try {
      const patient = await Patient.findOne({ _id: patientId }).lean<IPatient | null>();
      return patient ?? null;
    } catch (error) {
      return null;
    }
  }

  private async buildSnapshot(
    patientId: string | null | undefined,
    medicalRecord: Record<string, unknown> | null | undefined
  ): Promise<Record<string, unknown> | null> {
    const sanitizedRecord = this.sanitizeMedicalRecord(medicalRecord);
    const patient = await this.fetchPatient(patientId);
    let user: IamUser | null = null;
    const userId = patient?.user_id;
    if (userId) {
      try {
        user = await iamServiceClient.getUserById(userId);
      } catch (error) {
        user = null;
      }
    }
    return this.buildSnapshotPayload(sanitizedRecord, patient, user);
  }

  async recordCreated(payload: MedicalRecordMonitoringPayload): Promise<void> {
    const snapshot = await this.buildSnapshot(payload.patientId, payload.newValues);
    const newValues = snapshot ? { snapshot } : payload.newValues ?? null;
    await this.sendEvent({
      ...payload,
      oldValues: null,
      newValues,
      eventCode: MonitoringEventCodes.MEDICAL_RECORD_CREATED,
      action: MonitoringEventActions.CREATE,
    });
  }

  async recordUpdated(payload: MedicalRecordMonitoringPayload): Promise<void> {
    const snapshot = await this.buildSnapshot(payload.patientId, payload.newValues);
    const { oldDiff, newDiff } = this.getDifferences(
      payload.oldValues,
      payload.newValues,
      snapshot
    );
    await this.sendEvent({
      ...payload,
      oldValues: oldDiff,
      newValues: newDiff,
      eventCode: MonitoringEventCodes.MEDICAL_RECORD_UPDATED,
      action: MonitoringEventActions.UPDATE,
    });
  }

  async recordDeleted(payload: MedicalRecordMonitoringPayload): Promise<void> {
    const snapshot = await this.buildSnapshot(payload.patientId, payload.oldValues);
    const oldValues = snapshot ? { snapshot } : payload.oldValues ?? null;
    await this.sendEvent({
      ...payload,
      oldValues,
      newValues: null,
      eventCode: MonitoringEventCodes.MEDICAL_RECORD_DELETED,
      action: MonitoringEventActions.DELETE,
    });
  }

  private async sendEvent(
    payload: MedicalRecordMonitoringPayload & { eventCode: string; action: string }
  ): Promise<void> {
    const operatorId = this.normalize(payload.operatorId) ?? "system";
    const operatorEmail = this.normalize(payload.operatorEmail);
    const operatorName = this.normalize(payload.operatorName);
    const operatorRole = this.normalize(payload.operatorRole);
    const operatorAvatar = this.normalize(payload.operatorAvatar);

    const monitoringPayload: MonitoringEventLogPayload = {
      event_code: payload.eventCode,
      action: payload.action,
      event_message: payload.eventMessage,
      service_name: MonitoringServiceName,
      entity_id: payload.medicalRecordId,
      old_values: payload.oldValues ?? null,
      new_values: payload.newValues ?? null,
      operator_id: operatorId,
      occurred_at: new Date(),
    };

    if (operatorName) {
      monitoringPayload.operator_name = operatorName;
    }

    if (operatorEmail && operatorEmail.includes("@")) {
      monitoringPayload.operator_gmail = operatorEmail;
    }

    if (operatorRole) {
      monitoringPayload.operator_role = operatorRole;
    }

    if (operatorAvatar) {
      monitoringPayload.operator_avatar = operatorAvatar;
    }

    try {
      await monitoringServiceClient.createEventLog(monitoringPayload);
    } catch (error) {
      // Swallow logging errors to avoid blocking business logic
    }
  }
}

const medicalRecordMonitoringService = new MedicalRecordMonitoringService();
export default medicalRecordMonitoringService;
export type { MedicalRecordMonitoringPayload };

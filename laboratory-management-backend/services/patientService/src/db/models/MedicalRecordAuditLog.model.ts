import { Schema, model, type Document } from "mongoose";

export type MedicalRecordAuditAction = "CREATE" | "UPDATE" | "DELETE" | "RESTORE";

export interface IMedicalRecordAuditLog extends Document {
  medical_record_id: string;
  patient_id: string;
  action: MedicalRecordAuditAction;
  event_message: string;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
  performed_by: string;
  performed_by_email?: string | null;
  performed_by_name?: string | null;
  performed_at: Date;
}

const MedicalRecordAuditLogSchema = new Schema<IMedicalRecordAuditLog>(
  {
    medical_record_id: {
      type: String,
      required: true,
      index: true,
    },
    patient_id: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "RESTORE"],
      required: true,
    },
    event_message: {
      type: String,
      required: true,
    },
    old_values: {
      type: Schema.Types.Mixed,
      default: null,
    },
    new_values: {
      type: Schema.Types.Mixed,
      default: null,
    },
    performed_by: {
      type: String,
      required: true,
    },
    performed_by_email: {
      type: String,
      default: null,
    },
    performed_by_name: {
      type: String,
      default: null,
    },
    performed_at: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    collection: "MedicalRecordAuditLog",
    timestamps: false,
    versionKey: false,
  }
);

MedicalRecordAuditLogSchema.index({ medical_record_id: 1, performed_at: -1 });
MedicalRecordAuditLogSchema.index({ patient_id: 1, performed_at: -1 });
MedicalRecordAuditLogSchema.index({ performed_by: 1, performed_at: -1 });

const MedicalRecordAuditLog = model<IMedicalRecordAuditLog>(
  "MedicalRecordAuditLog",
  MedicalRecordAuditLogSchema
);

export default MedicalRecordAuditLog;

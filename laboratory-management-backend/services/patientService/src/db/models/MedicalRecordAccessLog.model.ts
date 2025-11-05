import { randomUUID } from "crypto";
import { Schema, model, type Document } from "mongoose";

export type MedicalRecordAccessType = "VIEW" | "UPDATE" | "DELETE" | "EXPORT" | "CREATE";

export interface IMedicalRecordAccessLog extends Document {
  _id: string;
  medical_record_id: string;
  patient_id: string;
  accessed_by: string;
  accessed_by_email?: string | null;
  accessed_by_name?: string | null;
  accessed_at: Date;
  access_type: MedicalRecordAccessType;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
  ip_address?: string;
  user_agent?: string;
}

const MedicalRecordAccessLogSchema = new Schema<IMedicalRecordAccessLog>(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
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
    accessed_by: {
      type: String,
      required: true,
      index: true,
    },
    accessed_by_email: {
      type: String,
      default: null,
    },
    accessed_by_name: {
      type: String,
      default: null,
    },
    accessed_at: {
      type: Date,
      default: Date.now,
      index: true,
    },
    access_type: {
      type: String,
      enum: ["VIEW", "UPDATE", "DELETE", "EXPORT", "CREATE"],
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
    ip_address: {
      type: String,
      default: null,
    },
    user_agent: {
      type: String,
      default: null,
    },
  },
  {
    collection: "MedicalRecordAccessLog",
    timestamps: false,
  }
);

MedicalRecordAccessLogSchema.index({ medical_record_id: 1, accessed_at: -1 });
MedicalRecordAccessLogSchema.index({ patient_id: 1, accessed_at: -1 });
MedicalRecordAccessLogSchema.index({ accessed_by: 1, accessed_at: -1 });

const MedicalRecordAccessLog = model<IMedicalRecordAccessLog>(
  "MedicalRecordAccessLog",
  MedicalRecordAccessLogSchema
);

export default MedicalRecordAccessLog;

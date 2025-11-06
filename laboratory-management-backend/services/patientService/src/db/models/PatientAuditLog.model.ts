import { Schema, model, type Document } from "mongoose";

export interface IPatientAuditLog extends Document {
  patient_id: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  event_message: string;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
  performed_by: string;
  performed_at: Date;
}

const PatientAuditLogSchema = new Schema<IPatientAuditLog>(
  {
    patient_id: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE"],
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
    performed_at: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    collection: "PatientAuditLog",
    timestamps: false,
    versionKey: false,
  }
);

PatientAuditLogSchema.index({ patient_id: 1, performed_at: -1 });
PatientAuditLogSchema.index({ performed_by: 1, performed_at: -1 });

const PatientAuditLog = model<IPatientAuditLog>("PatientAuditLog", PatientAuditLogSchema);

export default PatientAuditLog;

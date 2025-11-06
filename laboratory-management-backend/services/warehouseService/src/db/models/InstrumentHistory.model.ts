import { randomUUID } from "crypto";
import { Schema, model, type Document } from "mongoose";

export type InstrumentHistoryType = "CREATE" | "UPDATE" | "DELETE";

export interface IInstrumentHistory extends Document {
  _id: string;
  instrument_id: string;
  instrument_code: string;
  history_type: InstrumentHistoryType;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
  instrument_snapshot?: Record<string, unknown> | null;
  performed_by: string;
  performed_at: Date;
}

const InstrumentHistorySchema = new Schema<IInstrumentHistory>(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    instrument_id: {
      type: String,
      required: true,
      ref: "Instrument",
      index: true,
    },
    instrument_code: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      index: true,
    },
    history_type: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE"],
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
    instrument_snapshot: {
      type: Schema.Types.Mixed,
      default: null,
    },
    performed_by: {
      type: String,
      required: true,
      index: true,
    },
    performed_at: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    collection: "InstrumentHistory",
    timestamps: false,
    versionKey: false,
  }
);

InstrumentHistorySchema.index({ instrument_id: 1, performed_at: -1 });

const InstrumentHistory = model<IInstrumentHistory>(
  "InstrumentHistory",
  InstrumentHistorySchema
);

export default InstrumentHistory;

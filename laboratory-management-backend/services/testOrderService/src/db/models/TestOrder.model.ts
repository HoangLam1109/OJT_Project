import mongoose, { Schema, Document } from "mongoose";

export interface ITestOrder extends Document {
  patient_id: string;
  barcode: string;
  status: string;
  created_at: Date;
  created_by: string;
  run_at?: Date;
  run_by?: string;
  updated_at?: Date;
  updated_by?: string;
  is_deleted?: boolean;
  deleted_at?: Date;
  deleted_by?: string;
}

const TestOrderSchema: Schema = new Schema({
  patient_id: { type: String, required: true },
  barcode: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  created_by: { type: String, required: true },
  run_at: Date,
  run_by: String,
  updated_at: { type: Date, default: Date.now },
  updated_by: String,
  is_deleted: { type: Boolean, default: false },
  deleted_at: Date,
  deleted_by: String
});

export default mongoose.model<ITestOrder>("TestOrder", TestOrderSchema);

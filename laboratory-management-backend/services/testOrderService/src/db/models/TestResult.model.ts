import mongoose, { Schema, Document } from "mongoose";

export interface ITestResult extends Document {
  test_order_id: string;
  parameter_code: string;
  raw_value?: string;
  processed_value?: number;
  reference_range?: string;
  flag?: string;
  created_at?: Date;
  updated_at?: Date;
  updated_by?: string;
}

const TestResultSchema: Schema = new Schema({
  test_order_id: { type: String, required: true },
  parameter_code: { type: String, required: true },
  raw_value: String,
  processed_value: Number,
  reference_range: String,
  flag: String,
  created_at: { type: Date, default: Date.now },
  updated_at: Date,
  updated_by: String
});

export default mongoose.model<ITestResult>("TestResult", TestResultSchema);

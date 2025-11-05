import mongoose, { Schema, Document } from "mongoose";

export interface IResult {
  parameter: string;
  value: number | string;
  unit?: string;
  reference_range?: string;
  flag?: string;
}

export interface ITestOrderResult extends Document {
  order_id: mongoose.Types.ObjectId;
  patient_id: mongoose.Types.ObjectId;
  test_type: string;
  results: IResult[];
  remarks?: string;
  verified_by?: string;
  status: "Pending" | "Completed" | "Reviewed" | "AI Reviewed";
  completed_at?: Date;
}

const ResultSchema = new Schema<IResult>({
  parameter: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
  unit: String,
  reference_range: String,
  flag: String,
});

const TestOrderResultSchema = new Schema<ITestOrderResult>(
  {
    order_id: { type: Schema.Types.ObjectId, ref: "TestOrder", required: true },
    patient_id: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    test_type: { type: String, required: true },
    results: [ResultSchema],
    remarks: String,
    verified_by: String,
    status: {
      type: String,
      enum: ["Pending", "Completed", "Reviewed", "AI Reviewed"],
      default: "Completed",
    },
    completed_at: Date,
  },
  { timestamps: true }
);

TestOrderResultSchema.index({ patient_id: 1 });
TestOrderResultSchema.index({ order_id: 1 });

export default mongoose.model<ITestOrderResult>(
  "TestOrderResult",
  TestOrderResultSchema,
  "testResults"
);

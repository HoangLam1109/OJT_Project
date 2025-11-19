import { Schema, model, Types } from "mongoose";

const TestOrderResultSchema = new Schema({
  test_order_id: { type: Schema.Types.ObjectId, ref: "TestOrder", required: true },
  test_item_id: { type: String, required: true },
  
  test_type: { type: String },
  name: { type: String },
  instrument_name: { type: String },
  patient_name: {type: String},
  reagent_names:{ type: [String] },
  code: { type: String },
  unit: { type: String },
  result_value: { type: Number },
  result_status: { type: String, enum: ["normal", "high", "low"], default: null },
  reviewed: { type: Boolean, default: false },
  reviewer_comment: { type: String },
  create_at: { type: Date, default: Date.now },
}, { timestamps: true }); // sẽ tự tạo createdAt, updatedAt

// Named export để import chuẩn ES Module
export const TestOrderResult = model("TestOrderResult", TestOrderResultSchema, "testResults");

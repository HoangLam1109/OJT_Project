import { Schema, model } from "mongoose";

const TestItemSchema = new Schema({
  test_type: {            // Ví dụ: "Huyết học tổng quát"
    type: String,
    required: true,
  },
  code: {                 // Ví dụ: "RBC", "WBC"
    type: String,
    required: true,
  },
  name: {                 // Ví dụ: "Hồng cầu"
    type: String,
    required: true,
  },
  unit: String,           // mg/dL, T/µL, K/µL…
  ref_min: Number,
  ref_max: Number,
  method: String,         // optional
}, { timestamps: true });

export const TestItem = model("TestItem", TestItemSchema,"testItems");

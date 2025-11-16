import { Types } from "mongoose";
import { TestOrderResult } from "../db/models/TestResult.model.js";

export const TestResultRepository = {
  
  // Tạo nhiều test results
  createMany: async (results: any[]) => {
    return TestOrderResult.insertMany(results);
  },
};

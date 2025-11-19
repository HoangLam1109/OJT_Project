import { Types } from "mongoose";
import { TestOrderResult } from "../db/models/TestResult.model.js";

export const TestResultRepository = {
  createMany: async (results: any[]) => {
    return TestOrderResult.insertMany(results);
  },

  softDeleteByOrderId(test_order_id: any) {
    return TestOrderResult.updateMany(
      { test_order_id },
      {
        is_deleted: true,
        deleted_at: new Date(),
      }
    );
  },

  updateById(id: string | Types.ObjectId, updateData: Partial<any>) {
    return TestOrderResult.findOneAndUpdate(
      { _id: id, is_deleted: false },
      updateData,
      { new: true } 
    );
  },

  findById(id: string | Types.ObjectId) {
    return TestOrderResult.findOne({ _id: id, is_deleted: false });
  },
};

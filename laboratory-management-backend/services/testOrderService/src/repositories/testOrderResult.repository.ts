import { TestOrderResultService } from "../services/testorder/testOrderResult.service.js";
import TestResult from "../db/models/TestResult.model.js";
import type { ITestOrderResult } from "../db/models/TestResult.model.js";
export class TestOrderResultRepository {
  async getAll(): Promise<ITestOrderResult[]> {
    return await TestResult.find() 
      .populate({
        path: "order_id",
        select: "barcode patient_name test_type"
      });
  }
}

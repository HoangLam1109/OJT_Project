import { TestOrderResultRepository } from "../repositories/testOrderResult.repository.js";
import { ITestOrderResult } from "../db/models/TestResult.model.js";

export class TestOrderResultService {
  private repo = new TestOrderResultRepository();

  async getAllResults() {
    const results = await this.repo.getAll();
    // format lại dữ liệu để frontend dễ dùng
    return results.map((r: any) => ({
      _id: r._id,
      barcode: r.order_id?.barcode,
      patient_name: r.order_id?.patient_name,
      test_type: r.order_id?.test_type ?? r.test_type,
      completed_at: r.completed_at,
      status: r.status,
    }));
  }
}
// controllers/testOrderResult.controller.ts
import { Request, Response } from "express";
import { TestOrderResultService } from "../services/testorder/testOrderResult.service.js"; "../services/testOrderResult.service.js";
const service =new TestOrderResultService();
export class TestOrderResultController {
  async getListResults(req: Request, res: Response) {
    try {
      const results = await service.getAllResults();

      // Chuẩn hóa dữ liệu trả ra cho frontend
      const formatted = results.map((r: any) => ({
        barcode: r.order_id?.barcode,
        patient_name: r.order_id?.patient_name,
        test_type: r.test_type,
        completed_at: r.completed_at,
        status: r.status,
      }));

      res.json({ success: true, data: formatted });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}

import { Request, Response } from "express";
import { TestResultService } from "../services/testorder/testResultService.js";



export const createRandomResults = async (req: Request, res: Response) => {
  try {
    const { test_order_id, test_item_ids } = req.body;
    if (!test_order_id || !test_item_ids || !Array.isArray(test_item_ids)) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const results = await TestResultService.createRandomResults(test_order_id, test_item_ids);

    return res.status(201).json({ success: true, data: results });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const getTestOrdersWithResultsSummary = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const testOrders = await TestResultService.getTestOrdersWithResultsSummary(page, limit);
    const totalPages = Math.ceil(testOrders.length / limit);
    return res.json({
      success: true,
      data: testOrders,
      pagination: {
        page,
        limit,
        totalPages: totalPages 
      }
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
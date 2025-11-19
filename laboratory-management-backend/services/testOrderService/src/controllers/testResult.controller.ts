import { Request, Response } from "express";
import { TestResultService } from "../services/testorder/testResultService.js";


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

export const getTestOrderById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Missing id"
      });
    }

    const result = await TestResultService.getTestOrderById(id);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Test Order not found"
      });
    }

    return res.json({
      success: true,
      data: result[0]
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const deleteTestResult = async (req: Request, res:Response ) => {
  try {
    const test_order_id = req.params.id;

    const result = await TestResultService.softDeleteByOrderId(test_order_id);

    return res.json({
      success: true,
      message: result.message,
      data: (result as any).data,
    });
  } catch (err: any) {
    // Nếu là Error do không tìm thấy -> trả 404
    if (err.message === "Test Result not found") {
      return res.status(404).json({ success: false, message: err.message });
    }

    console.error("deleteTestResult error:", err);
    return res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
};


export const updateTestResult = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    // Lấy các field muốn update từ body
    const { result_value, reviewed, reviewer_comment } = req.body;

    const updateData: {
      result_value?: number;
      reviewed?: boolean;
      reviewer_comment?: string;
    } = {};

    if (result_value !== undefined) updateData.result_value = result_value;
    if (reviewed !== undefined) updateData.reviewed = reviewed;
    if (reviewer_comment !== undefined) updateData.reviewer_comment = reviewer_comment;

    // Gọi service
    const result = await TestResultService.updateTestResult(id, updateData);

    return res.json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (err: unknown) {
    console.error("updateTestResult error:", err);

    if (err instanceof Error && err.message.includes("not found")) {
      return res.status(404).json({ success: false, message: err.message });
    }

    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Internal server error",
    });
  }
};

export const searchTestResultsPaginated = async (req: Request, res: Response) => {
  try {
    const keyword = (req.query.keyword as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!keyword.trim()) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const { results, total } = await TestResultService.searchResults(keyword, page, limit);

    // Chuẩn hóa dữ liệu
    const enrichedResults = results.map(r => ({
      _id: r._id,
      test_order_id: r.test_order_id,
      test_item_id: r.test_item_id,
      patient_name: r.patient_name,
      reagent_names: r.reagent_names,
      result_value: r.result_value,
      result_status: r.result_status,
      reviewed: r.reviewed,
      reviewer_comment: r.reviewer_comment,
      created_at: r.createdAt,
      updated_at: r.updatedAt,
      is_deleted: r.is_deleted,
      deleted_at: r.deleted_at,
    }));

    res.json({
      data: enrichedResults,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: unknown) {
    console.error("[TestResultController] Error searching results:", err);
    res.status(500).json({ message: err instanceof Error ? err.message : "Internal server error" });
  }
};


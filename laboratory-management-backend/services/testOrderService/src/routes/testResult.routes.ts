// routes/testResult.routes.ts
import express from "express";
import {
  getTestOrdersWithResultsSummary
} from "../controllers/testResult.controller.js";

const router = express.Router();

// Lấy danh sách test orders (phân trang)
router.get("/test-orders-summary", getTestOrdersWithResultsSummary);

export default router;

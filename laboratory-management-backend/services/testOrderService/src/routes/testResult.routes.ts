// routes/testResult.routes.ts
import express from "express";
import {
  getTestOrdersWithResultsSummary,
  getTestOrderById
} from "../controllers/testResult.controller.js";

const router = express.Router();

// Lấy danh sách test orders (phân trang)
router.get("/all", getTestOrdersWithResultsSummary);

router.get("/getById/:id", getTestOrderById);


export default router;

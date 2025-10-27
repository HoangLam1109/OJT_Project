// testOrder.routes.ts
import express from "express";
import {
  getAllTestOrders,
  getTestOrderById,
  createTestOrder,
  updateTestOrder,
  deleteTestOrder
} from "../controllers/testorder.controller.js";

const router = express.Router();


// Backwards-compatible routes matching older naming convention used elsewhere
router.get("/testOrder/all", getAllTestOrders);
router.get("/testOrder/:id", getTestOrderById);
router.post('/testOrder/create', createTestOrder);
router.put("/testOrder/update/:id", updateTestOrder);
router.delete("/testOrder/delete/:id", deleteTestOrder);

export default router;

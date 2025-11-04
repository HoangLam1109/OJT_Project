// testOrder.routes.ts
import express from "express";
import {
  getAllTestOrders,
  getTestOrderById,
  createTestOrder,
  updateTestOrder,
  softDeleteTestOrder,
  updateTestOrderStatus,
} from "../controllers/testorder.controller.js";
import { validateCreateTestOrder } from "../middlewares/validate.middleware.js";
import AuthenticateUser from "../middlewares/authenticate.middleware.js";
const router = express.Router();


// Backwards-compatible routes matching older naming convention used elsewhere
router.get("/testOrder/all", getAllTestOrders);
router.get("/testOrder/:id", getTestOrderById);
router.post("/testOrder/create",createTestOrder);
router.put("/testOrder/update/:id",updateTestOrder);
router.delete("/testOrder/delete/:id", softDeleteTestOrder);
router.patch('/testOrder/:id/status', updateTestOrderStatus);

export default router;

// testOrder.routes.ts
import express from "express";
import {
  getAllTestOrders,
  getTestOrderById,
  createTestOrder,
  updateTestOrder,
  softDeleteTestOrder,
  updateTestOrderStatus,
  searchTestOrders,
  getAllOrdersGroupedByPatientId
} from "../controllers/testorder.controller.js";
import { validateCreateTestOrder } from "../middlewares/validate.middleware.js";
import AuthenticateUser from "../middlewares/authenticate.middleware.js";
import { TestOrderResultController } from "../controllers/testOrderResult.controller.js";

const router = express.Router();
const controller = new TestOrderResultController();

// ✅ Static routes first
router.get("/testOrder/all", getAllTestOrders);
router.get("/testOrder/search", searchTestOrders);
router.get("/testOrder/result", controller.getListResults);
router.get("/testOrder/group-by-patient", getAllOrdersGroupedByPatientId);


// ✅ Dynamic routes after static routes
router.get("/testOrder/:id", getTestOrderById);

// CRUD
router.post("/testOrder/create", createTestOrder);
router.put("/testOrder/update/:id", updateTestOrder);
router.delete("/testOrder/delete/:id", softDeleteTestOrder);
router.patch("/testOrder/:id/status", updateTestOrderStatus);

export default router;

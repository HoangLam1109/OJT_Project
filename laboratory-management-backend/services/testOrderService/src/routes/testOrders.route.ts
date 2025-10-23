import express from "express";
import {
  getAllTestOrders,
  getTestOrderById,
  createTestOrder,
  updateTestOrder,
  deleteTestOrder
} from "../controllers/testOrdersController";
import { verifyIAMToken } from "../middleware/auth";

const router = express.Router();

router.use(verifyIAMToken);

router.get("/", getAllTestOrders);
router.get("/:id", getTestOrderById);
router.post("/", createTestOrder);
router.put("/:id", updateTestOrder);
router.delete("/:id", deleteTestOrder);

export default router;

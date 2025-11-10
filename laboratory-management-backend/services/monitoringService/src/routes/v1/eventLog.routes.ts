import express from "express";
import {
  createEventLog,
  getAllEventLogs,
  getEventLogById,
  getEventLogsByEntity,
  getEventStatistics,
  deleteEventLog,
} from "../../controllers/eventLog.controller.js";
import authenticateUser from "../../middlewares/authenticate.middleware.js";
import { authenticateInternalApi } from "../../middlewares/internalApi.middleware.js";

const router = express.Router();

// Public routes (with authentication)
router.get("/", authenticateUser.authenticateUser, getAllEventLogs);
router.get("/statistics", authenticateUser.authenticateUser, getEventStatistics);
router.get("/entity/:entityId", authenticateUser.authenticateUser, getEventLogsByEntity);
router.get("/:id", authenticateUser.authenticateUser, getEventLogById);

// Internal routes (requires internal API key)
router.post("/", authenticateInternalApi, createEventLog);
router.delete("/:id", authenticateInternalApi, deleteEventLog);

export default router;

import express from "express";
import {
  getAllEventCodes,
  getEventCodeByCode,
  createEventCode,
  updateEventCode,
  deleteEventCode,
} from "../../controllers/eventCode.controller.js";
import authenticateUser from "../../middlewares/authenticate.middleware.js";
import { authenticateInternalApi } from "../../middlewares/internalApi.middleware.js";

const router = express.Router();

// Public routes (with authentication)
router.get("/", authenticateUser.authenticateUser, getAllEventCodes);
router.get("/:code", authenticateUser.authenticateUser, getEventCodeByCode);

// Internal routes (requires internal API key)
router.post("/", authenticateInternalApi, createEventCode);
router.put("/:code", authenticateInternalApi, updateEventCode);
router.delete("/:code", authenticateInternalApi, deleteEventCode);

export default router;

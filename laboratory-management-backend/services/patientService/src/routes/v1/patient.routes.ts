import express from "express";
import {
  getAllPatients,
} from "../../controllers/patient.controller.js";
import authenticateUser from "../../middlewares/authenticate.middleware.js";

const router = express.Router();

// Get all patients with pagination and search
// Temporarily remove authentication for testing
router.get("/", getAllPatients);

export default router;

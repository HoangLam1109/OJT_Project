import express from "express";
import { createPatient, getAllPatients } from "../../controllers/patient.controller.js";
import authenticateInternalApi from "../../middlewares/internalApi.middleware.js";

const router = express.Router();

// Get all patients with pagination and search
router.get("/", getAllPatients);

// Create patient (called by IAM Service with internal API key)
router.post("/", authenticateInternalApi, createPatient);

export default router;

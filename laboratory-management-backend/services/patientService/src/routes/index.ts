import express from "express";
import patientRoutes from "./v1/patient.routes.js";

const router = express.Router();

router.use("/patients", patientRoutes);

export default router;

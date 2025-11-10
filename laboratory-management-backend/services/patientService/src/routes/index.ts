import express from "express";
import patientRoutes from "./v1/patient.routes.js";
import patientMedicalRecordRoutes from "./v1/patientMedicalRecord.routes.js";
import patientAuditLogRoutes from "./v1/patientAuditLog.routes.js";
import medicalRecordAccessLogRoutes from "./v1/medicalRecordAccessLog.routes.js";
import medicalRecordAuditLogRoutes from "./v1/medicalRecordAuditLog.routes.js";

const router = express.Router();

router.use("/patients", patientRoutes);
router.use("/patient-medical-records", patientMedicalRecordRoutes);
router.use("/patient-audit-logs", patientAuditLogRoutes);
router.use("/medical-record-access-logs", medicalRecordAccessLogRoutes);
router.use("/medical-record-audit-logs", medicalRecordAuditLogRoutes);

export default router;

import express from "express";
import {
	createPatientRecord,
	deletePatientRecord,
	getAllPatientRecords,
	updatePatientRecord,
} from "../../controllers/patientMedicalRecord.controller.js";
import authenticateUser from "../../middlewares/authenticate.middleware.js";

const router = express.Router();

router.get("/", authenticateUser.authenticateUser, getAllPatientRecords);
router.post("/", authenticateUser.authenticateUser, createPatientRecord);
router.put("/:id", authenticateUser.authenticateUser, updatePatientRecord);
router.delete("/:id", authenticateUser.authenticateUser, deletePatientRecord);

export default router;

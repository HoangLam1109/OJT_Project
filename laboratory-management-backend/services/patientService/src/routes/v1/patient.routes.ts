import express from "express";
import {
	createPatient,
	deletePatient,
	getAllPatients,
	getPatientById,
	updatePatient,
	softDeletePatientByUserId,
} from "../../controllers/patient.controller.js";
import authenticateUser from "../../middlewares/authenticate.middleware.js";
import { isInternalApiKeyValid } from "../../middlewares/internalApi.middleware.js";

const router = express.Router();

// Allow internal microservice key or fallback to JWT cookies for mutations
const authorizeWriteAccess = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (isInternalApiKeyValid(req)) {
		next();
		return;
	}

	authenticateUser.authenticateUser(req, res, next);
};

// Internal API only middleware
const requireInternalApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (!isInternalApiKeyValid(req)) {
		res.status(403).json({ message: "Forbidden: Internal API access only" });
		return;
	}
	next();
};

// [GET] List patients with pagination and search
router.get("/getAll/", getAllPatients);

// [GET] View patient detail
router.get("/viewDetail/:id", getPatientById);

// [POST] Create patient (IAM internal use)
router.post("/create/", authorizeWriteAccess, createPatient);

// [PUT] Update patient
router.put("/update/:id", authorizeWriteAccess, updatePatient);

// [DELETE] Delete patient
router.delete("/delete/:id", authorizeWriteAccess, deletePatient);

// [DELETE] Soft delete patient by user ID (Internal API only)
router.delete("/soft-delete-by-user/:userId", requireInternalApiKey, softDeletePatientByUserId);

export default router;

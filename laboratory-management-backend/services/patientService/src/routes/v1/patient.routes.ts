import express from "express";
import {
	createPatient,
	deletePatient,
	getAllPatients,
	getPatientById,
	updatePatient,
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

export default router;

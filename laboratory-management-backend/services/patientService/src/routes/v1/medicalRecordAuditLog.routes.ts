import express from "express";
import {
  getAllMedicalRecordAuditLogs,
  getMedicalRecordAuditLogDetail,
  deleteMedicalRecordAuditLog,
} from "../../controllers/medicalRecordAuditLog.controller.js";
import authenticateUser from "../../middlewares/authenticate.middleware.js";
import { isInternalApiKeyValid } from "../../middlewares/internalApi.middleware.js";

const router = express.Router();

const authorizeAccess = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (isInternalApiKeyValid(req)) {
    next();
    return;
  }

  authenticateUser.authenticateUser(req, res, next);
};

router.get("/", authorizeAccess, getAllMedicalRecordAuditLogs);
router.get("/:id", authorizeAccess, getMedicalRecordAuditLogDetail);
router.delete("/:id", authorizeAccess, deleteMedicalRecordAuditLog);

export default router;

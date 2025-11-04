import express from "express";
import {
  getAllAuditLogs,
  getAuditLogDetail,
  deleteAuditLog,
} from "../../controllers/patientAuditLog.controller.js";
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

const requireInternalApiKey = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!isInternalApiKeyValid(req)) {
    res.status(403).json({ message: "Forbidden: Internal API access only" });
    return;
  }
  next();
};

router.get("/", authorizeAccess, getAllAuditLogs);
router.get("/:id", authorizeAccess, getAuditLogDetail);
router.delete("/:id", requireInternalApiKey, deleteAuditLog);

export default router;

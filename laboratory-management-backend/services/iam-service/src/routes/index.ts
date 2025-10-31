import express from "express";
import { authenticateInternalApi } from "../middlewares/internalApi.middleware.js";
import { getUser, createUser } from "../controllers/user.controller.js";
import userRoutes from "./v1/user.routes.js";
import authRoutes from "./v1/auth.routes.js";
import authenticateUser from "../middlewares/authenticate.middleware.js";
import { ROLE_CODES } from "../constants/roles.constant.js";
import { validateCreateUser } from "../middlewares/validate.middleware.js";

const router = express.Router();

// ✅ Internal routes (không yêu cầu JWT)
router.get("/internal/:id", authenticateInternalApi, getUser);
router.post("/internal/user/create", authenticateInternalApi, validateCreateUser, createUser);

router.use("/", authRoutes);

// Allow both internal API key and JWT authentication
// Check internal API key first, if not present then require JWT
router.use("/user", (req, res, next) => {
  const internalApiKey = req.headers['x-internal-api-key'];
  
  console.log('[IAM Routes] Request to /user');
  console.log('[IAM Routes] Internal API Key header:', internalApiKey ? '***' + internalApiKey.slice(-4) : 'NOT PROVIDED');
  console.log('[IAM Routes] Expected key:', process.env.INTERNAL_API_KEY ? '***' + process.env.INTERNAL_API_KEY.slice(-4) : 'NOT SET');
  
  if (internalApiKey && internalApiKey === process.env.INTERNAL_API_KEY) {
    // Internal API key is valid, skip JWT check
    console.log('[IAM Routes] ✅ Internal API key valid, bypassing JWT');
    req.user = {
      _id: 'internal-service-user',
      email: 'internal@system.local',
      fullName: 'Internal Service',
      identityNumber: 'INTERNAL',
      gender: 'N/A',
      age: 0,
      dateOfBirth: new Date(0),
      role: ROLE_CODES.ADMIN,
      isActive: true,
      isDeleted: false,
    } as any;
    return next();
  }
  
  // No valid internal API key, require JWT
  console.log('[IAM Routes] ⚠️  No valid internal API key, requiring JWT');
  return authenticateUser.authenticateUser(req, res, next);
}, userRoutes);

export default router;
import express from "express";

import userRoutes from "./v1/user.routes.js";
import authRoutes from "./v1/auth.routes.js";
import roleRoutes from "./v1/role.routes.js";

import authenticateUser from "../middlewares/authenticate.middleware.js";
import { ROLE_CODES } from "../constants/roles.constant.js";

const router = express.Router();

router.use("/", authRoutes);

router.use("/user", authenticateUser.authenticateUser as any, userRoutes);
router.use("/role", authenticateUser.authenticateUser as any, roleRoutes);

export default router;

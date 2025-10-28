import express from "express";
import userRoutes from "./v1/user.routes.js";
import authRoutes from "./v1/auth.routes.js";
import authenticateUser from "../middlewares/authenticate.middleware.js";
import authenticateInternalApi from "../middlewares/internalApi.middleware.js";

const router = express.Router();

router.use("/", authRoutes);

// Temporarily remove all authentication for testing
router.use("/user", authenticateUser.authenticateUser, userRoutes);

export default router;

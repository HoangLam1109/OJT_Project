import {refreshUserToken, loginUser, logoutUser, registerUser } from "../../controllers/auth.controller.js";
import express from "express";
import authenticateUser from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateUser, logoutUser);
router.post("/refresh-token", authenticateUser, refreshUserToken);

export default router;
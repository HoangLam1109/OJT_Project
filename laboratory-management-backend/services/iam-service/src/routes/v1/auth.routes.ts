import { loginUser, logoutUser, registerUser } from "../../controllers/auth.controller.js";
import express from "express";
import authenticateUser from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateUser, logoutUser);

export default router;
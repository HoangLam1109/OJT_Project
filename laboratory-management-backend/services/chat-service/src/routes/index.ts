import express from "express";
import chatRouter from "./chat.route.js";

const router = express.Router();

router.use("/chat", chatRouter);

export default router;

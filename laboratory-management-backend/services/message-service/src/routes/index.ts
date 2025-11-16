
import express from "express";
import messageRoutes from "./message.route.js";
import roomRoutes from "./room.route.js";

const router = express.Router();

router.use("/messages", messageRoutes);
router.use("/rooms", roomRoutes);

export default router;

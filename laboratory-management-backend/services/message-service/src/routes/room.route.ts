import express from "express";
import { createRoom, getRooms, joinChat, leaveChat, deleteRoom, updateRoom } from "../controllers/room.controller.js";
import { authenticateUser } from "../middlewares/authenticate.middleware.js";
import { createValidator } from "../../../shared/src/validate.middleware.js";
import { createRoomSchema, updateRoomSchema } from "../validators/room.validator.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
/*
  #swagger.tags = ['Room Service']
*/

const router = express.Router();

router.post("/create", authenticateUser, createValidator(createRoomSchema), createRoom);
router.get("/all", authenticateUser, authorizeRoles("MANAGER", "ADMIN"), getRooms);
router.post("/join/:roomId", authenticateUser, joinChat);
router.post("/leave/:roomId", authenticateUser, leaveChat);
router.put("/update/:roomId", authenticateUser, createValidator(updateRoomSchema), updateRoom);
router.delete("/delete/:roomId", authenticateUser, deleteRoom);

export default router;
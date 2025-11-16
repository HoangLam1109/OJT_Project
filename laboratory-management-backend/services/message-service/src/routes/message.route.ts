import express from "express";
import { sendMessage, getRoomMessages, updateMessage, deleteMessage } from "../../src/controllers/message.controller.js";
import { authenticateUser } from "../../src/middlewares/authenticate.middleware.js";
import { createValidator } from "../../../shared/src/validate.middleware.js";
import { createMessageSchema, updateMessageSchema } from "../../src/validators/message.validator.js";

/*
  #swagger.tags = ['Message Service']
*/

const router = express.Router();

router.post('/send/:roomId', authenticateUser, createValidator(createMessageSchema), sendMessage);
router.get('/:roomId', authenticateUser, getRoomMessages);
router.patch(
  '/:roomId/:messageId',
  authenticateUser,
  createValidator(updateMessageSchema),
  updateMessage
);

router.delete(
  '/:roomId/:messageId',
  authenticateUser,
  deleteMessage
);

export default router;
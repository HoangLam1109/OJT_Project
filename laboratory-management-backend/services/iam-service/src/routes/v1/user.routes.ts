import { getUser, createUser, updateUser, deleteUser } from "../../controllers/user.controller.js";
import express from "express";
const router = express.Router();

router.get('/:id', getUser);
router.post('/create', createUser);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

export default router;
import { getRole, createRole, updateRole, deleteRole, getAll } from "../../controllers/role.controller.js";
import express from "express";
const router = express.Router();

router.get('/all', getAll);
router.get('/:id', getRole);

router.post('/create', createRole);
router.put('/update/:id', updateRole);
router.delete('/delete/:id', deleteRole);

export default router;
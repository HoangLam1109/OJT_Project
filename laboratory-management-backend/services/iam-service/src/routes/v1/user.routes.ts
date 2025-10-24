import express from "express";
import { getUser, createUser, updateUser, deleteUser, getAll } from "../../controllers/user.controller.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { validateCreateUser, validateUpdateUser } from "../../middlewares/validate.middleware.js";

/*
  #swagger.tags = ['User CRUD']
  #swagger.security = [{"apiKeyAuth": []}]
*/

const router = express.Router();

router.get('/all', authorize(['read:users']), getAll);
router.get('/:id', authorize(['read:users']), getUser);

router.post('/create', authorize(['manage:users']), validateCreateUser, createUser);
router.put('/update/:id', authorize(['manage:users']), validateUpdateUser, updateUser);
router.delete('/delete/:id', authorize(['manage:users']), deleteUser);

export default router;
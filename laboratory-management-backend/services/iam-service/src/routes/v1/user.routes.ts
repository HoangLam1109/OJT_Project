import express from "express";
import { getUser, createUser, updateUser, deleteUser, getAll } from "../../controllers/user.controller.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { validateCreateUser, validateUpdateUser } from "../../middlewares/validate.middleware.js";

/*
  #swagger.tags = ['User CRUD']
  #swagger.security = [{"apiKeyAuth": []}]
*/

const router = express.Router();

// Get all users - already authenticated in parent router
router.get('/all', getAll);

// Get user by ID - already authenticated in parent router  
router.get('/:id', getUser);

router.post('/create', authorize(['manage:users']), validateCreateUser, createUser);
router.put('/update/:id', authorize(['manage:users']), validateUpdateUser, updateUser);
router.delete('/delete/:id', authorize(['manage:users']), deleteUser);

export default router;
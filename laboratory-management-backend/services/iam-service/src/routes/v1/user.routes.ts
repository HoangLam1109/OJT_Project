import express from "express";
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUsersWithPagination,
  getUserRolesAndPrivileges,
  getCurrentUserRolesAndPrivileges,
  assignRoleToUser,
  lockUser,
} from "../../controllers/user.controller.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import {
  validateCreateUser,
  validateUpdateUser,
} from "../../middlewares/validate.middleware.js";

/*
  #swagger.tags = ['User CRUD']
  #swagger.security = [{"apiKeyAuth": []}]
*/

const router = express.Router();

router.get("/all", authorize(["read:user"]), getUsersWithPagination);
router.get("/me/roles", getCurrentUserRolesAndPrivileges);
router.get("/:id/roles", authorize(["read:user"]), getUserRolesAndPrivileges);
router.get("/:id", authorize(["read:user"]), getUser);

router.post(
  "/create",
  authorize(["create:user"]),
  validateCreateUser,
  createUser
);
router.put(
  "/update/:id",
  authorize(["update:user"]),
  validateUpdateUser,
  updateUser
);
router.delete("/delete/:id", authorize(["delete:user"]), deleteUser);

router.put("/assign-role/:id", authorize(["update:user"]), assignRoleToUser);
router.put("/lock/:id", authorize(["update:user"]), lockUser);

export default router;

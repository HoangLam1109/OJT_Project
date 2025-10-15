/*

import type { Request, Response } from "express";
import { RoleService } from "../services/role.service.js";
import { errorHandler } from "../utils/error.util.js";

const roleService = new RoleService();

const getRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id || req.user?._id;
    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const role = await roleService.getRole(userId);
    if (!role) {
      res.status(404).json({ message: "Role not found" });
      return;
    }

    res.status(200).json(role);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await roleService.getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    errorHandler(res, error);
  }
}

const createRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const roleData = req.body;
    const newRole = await roleService.createRole(roleData, req.user?._id);
    res.status(201).json({
      message: "Role created successfully!",
      roleId: newRole._id
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const roleId = req.params.id;
    if (!roleId) {
      res.status(400).json({ message: "Role ID is required" });
      return;
    }

    const roleData = req.body;
    const updatedRole = await roleService.updateRole(roleId, roleData, req.user?._id);

    if (!updatedRole) {
      res.status(404).json({ message: "Role not found" });
      return;
    }

    res.status(200).json({
      message: "Role updated successfully!",
      roleId: updatedRole._id
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const roleId = req.params.id;
    if (!roleId) {
      res.status(400).json({ message: "Role ID is required" });
      return;
    }

    const deletedRole = await roleService.deleteRole(roleId, req.user?._id);
    if (!deletedRole) {
      res.status(404).json({ message: "Role not found" });
      return;
    }

    res.status(200).json({
      message: "Role deleted successfully!",
      roleId: deletedRole._id
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export { getRole, getAll, createRole, updateRole, deleteRole };

*/
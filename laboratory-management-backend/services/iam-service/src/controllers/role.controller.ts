import type { Request, Response } from "express";
import type { IRole } from "../db/models/Role.model.js";
import { RoleService } from "../services/role.service.js";
import { errorHandler } from "../utils/error.util.js";
import { PaginationUtils } from "../utils/pagination.util.js";
import { PaginationOptions } from "../types/pagination.type.js";

// Define the type for authenticated user (matches what the middleware provides)
interface AuthenticatedUser {
  _id: string;
  email: string;
  fullName: string;
  identityNumber: string;
  gender: string;
  age: number;
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
  role: string[];
  isActive: boolean;
  isDeleted: boolean;
}

const roleService = new RoleService();

const getRole = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Role CRUD']
    #swagger.description = 'Get role by ID'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Role ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Role retrieved successfully',
      schema: {
        _id: 'string',
        roleCode: 'string',
        roleName: 'string',
        description: 'string',
        createdAt: 'string',
        updatedAt: 'string',
        privileges: 'string',
        isActive: 'boolean',
        isSystemRole: 'boolean'
      }
    }
    #swagger.responses[400] = { description: 'Role ID is required' }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[404] = { description: 'Role not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const roleId = req.params.id;
    if (!roleId) {
      res.status(400).json({ message: "Role ID is required" });
      return;
    }

    const role = await roleService.getRole(roleId);
    if (!role) {
      res.status(404).json({ message: "Role not found" });
      return;
    }

    res.status(200).json(role);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getRolesWithPagination = async (
  req: Request,
  res: Response
): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Role CRUD']
    #swagger.description = 'Get roles with pagination'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Number of roles per page (1-100)',
      required: false,
      type: 'integer',
      default: 10
    }
    #swagger.parameters['cursor'] = {
      in: 'query',
      description: 'Cursor for next page (role ID)',
      required: false,
      type: 'string'
    }
    #swagger.parameters['sortBy'] = {
      in: 'query',
      description: 'Field to sort by',
      required: false,
      type: 'string',
      enum: ['createdAt', '_id', 'roleCode', 'roleName'],
      default: '_id'
    }
    #swagger.parameters['search'] = {
      in: 'query',
      description: 'Search term to filter roles',
      required: false,
      type: 'string'
    }
    #swagger.parameters['searchField'] = {
      in: 'query',
      description: 'Fields to search by',
      required: false,
      type: 'string',
      enum: ['roleCode', 'roleName', 'privileges'],
      default: 'roleName'
    }
    #swagger.parameters['sortOrder'] = {
      in: 'query',
      description: 'Sort order',
      required: false,
      type: 'string',
      enum: ['asc', 'desc'],
      default: 'asc'
    }
    #swagger.responses[200] = {
      description: 'Roles retrieved successfully',
      schema: {
        data: {
          type: 'array',
          items: {
            _id: 'string',
            roleCode: 'string',
            roleName: 'string',
            description: 'string',
            createdAt: 'string',
            updatedAt: 'string',
            isActive: 'boolean',
            isSystemRole: 'boolean'
          }
        },
        pagination: {
          hasNextPage: 'boolean',
          hasPreviousPage: 'boolean',
          nextCursor: 'string',
          previousCursor: 'string',
          totalCount: 'number',
          limit: 'number'
        }
      }
    }
    #swagger.responses[400] = { description: 'Invalid pagination parameters' }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const options = PaginationUtils.parseQuery(req.query);
    const roles = await roleService.getRolesWithPagination(options);
    res.status(200).json(roles);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Role CRUD']
    #swagger.description = 'Get all roles'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.responses[200] = {
      description: 'Roles retrieved successfully',
      schema: {
        items: {
          _id: 'string',
          roleCode: 'string',
          roleName: 'string',
          description: 'string',
          createdAt: 'string',
          updatedAt: 'string',
          isActive: 'boolean',
          isSystemRole: 'boolean'
        }
      }
    }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const roles = await roleService.getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    errorHandler(res, error);
  }
};

const createRole = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Role CRUD']
    #swagger.description = 'Create a new role'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Role data',
      required: true,
      schema: {
        roleCode: 'USER',
        roleName: 'Test Role',
        description: 'Test Role',
        privileges: [''],
        isActive: true,
        isSystemRole: false,
      }
    }
    #swagger.responses[201] = {
      description: 'Role created successfully',
      schema: {
        message: 'Role created successfully!',
        roleId: 'string'
      }
    }
    #swagger.responses[400] = { description: 'Bad request or missing required fields' }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const roleData = req.body;
    const newRole = await roleService.createRole(
      roleData,
      (req.user as AuthenticatedUser)?._id
    );
    res.status(201).json({
      message: "Role created successfully!",
      roleId: newRole._id,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateRole = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Role CRUD']
    #swagger.description = 'Update role by ID'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Role ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Role update data',
      required: false,
      schema: {
        roleCode: 'USER',
        roleName: 'Test Role',
        description: 'Test Role',
        privileges: [''],
        isActive: true,
        isSystemRole: false,
      }
    }
    #swagger.responses[200] = {
      description: 'Role updated successfully',
      schema: {
        message: 'Role updated successfully!',
        roleId: 'string',
        privileges: 'array',
        isActive: 'boolean',
        isSystemRole: 'boolean'
      }
    }
    #swagger.responses[400] = { description: 'Role ID is required' }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[404] = { description: 'Role not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const roleId = req.params.id;
    if (!roleId) {
      res.status(400).json({ message: "Role ID is required" });
      return;
    }

    const roleData = req.body;
    const updatedRole = await roleService.updateRole(
      roleId,
      roleData,
      (req.user as AuthenticatedUser)?._id
    );

    if (!updatedRole) {
      res.status(404).json({ message: "Role not found" });
      return;
    }

    res.status(200).json({
      message: "Role updated successfully!",
      roleId: updatedRole._id,
      isActive: updatedRole.isActive,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteRole = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Role CRUD']
    #swagger.description = 'Delete role by ID'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Role ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Role deleted successfully',
      schema: {
        message: 'Role deleted successfully!',
        roleId: 'string'
      }
    }
    #swagger.responses[400] = { description: 'Role ID is required' }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[404] = { description: 'Role not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const roleId = req.params.id;
    if (!roleId) {
      res.status(400).json({ message: "Role ID is required" });
      return;
    }

    const deletedRole = await roleService.deleteRole(
      roleId,
      (req.user as AuthenticatedUser)?._id
    );
    if (!deletedRole) {
      res.status(404).json({ message: "Role not found" });
      return;
    }

    res.status(200).json({
      message: "Role deleted successfully!",
      roleId: deletedRole._id,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const assignPrivilegesToRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Additional']
    #swagger.description = 'Assign privileges to role'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Role ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Role update data',
      required: false,
      schema: {
        privileges: [''],
      }
    }
    #swagger.responses[200] = {
      description: 'Role updated successfully',
      schema: {
        message: 'Role updated successfully!',
        roleId: 'string',
        privileges: 'array',
        isActive: 'boolean',
        isSystemRole: 'boolean'
      }
    }
    #swagger.responses[400] = { description: 'Role ID is required' }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[404] = { description: 'Role not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const roleId = req.params.id;
    if (!roleId) {
      res.status(400).json({ message: "Role ID is required" });
      return;
    }

    const privileges = req.body.privileges;
    const updatedRole = await roleService.assignPrivilegesToRole(
      roleId,
      privileges,
      (req.user as AuthenticatedUser)?._id
    );

    if (!updatedRole) {
      res.status(404).json({ message: "Role not found" });
      return;
    }

    res.status(200).json({
      message: "Role updated successfully!",
      roleId: updatedRole._id,
      isActive: updatedRole.isActive,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const removePrivileges = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Additional']
    #swagger.description = 'Remove privileges from role'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Role ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Role update data',
      required: false,
      schema: {
        privileges: [''],
      }
    }
    #swagger.responses[200] = {
      description: 'Role updated successfully',
      schema: {
        message: 'Role updated successfully!',
        roleId: 'string',
        privileges: 'array',
        isActive: 'boolean',
        isSystemRole: 'boolean'
      }
    }
    #swagger.responses[400] = { description: 'Role ID is required' }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[404] = { description: 'Role not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const roleId = req.params.id;
    if (!roleId) {
      res.status(400).json({ message: "Role ID is required" });
      return;
    }

    const privileges = req.body.privileges;
    const updatedRole = await roleService.removePrivilegesFromRole(
      roleId,
      privileges,
      (req.user as AuthenticatedUser)?._id
    );

    if (!updatedRole) {
      res.status(404).json({ message: "Role not found" });
      return;
    }

    res.status(200).json({
      message: "Role updated successfully!",
      roleId: updatedRole._id,
      isActive: updatedRole.isActive,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export {
  getRole,
  getAll,
  createRole,
  updateRole,
  deleteRole,
  getRolesWithPagination,
  assignPrivilegesToRole,
  removePrivileges,
};

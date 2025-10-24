import type { Request, Response } from "express";
import type { IUser } from "../db/models/User.model.js";
import { UserService } from "../services/user.service.js";
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
  role: string;
}

const userService = new UserService();

const getUser = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['User CRUD']
    #swagger.description = 'Get user by ID'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'User ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'User retrieved successfully',
      schema: {
        _id: 'string',
        email: 'string',
        fullName: 'string',
        identityNumber: 'string',
        gender: 'string',
        age: 'number',
        dateOfBirth: 'string',
        phoneNumber: 'string',
        address: 'string',
        role: 'string',
        createdAt: 'string',
        updatedAt: 'string'
      }
    }
    #swagger.responses[400] = { description: 'User ID is required' }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[404] = { description: 'User not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const userId = req.params.id || (req.user as AuthenticatedUser)?._id;
    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const user = await userService.getUser(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Return in consistent format for internal API calls
    res.status(200).json({ user });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getUsersWithPagination = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['User CRUD']
    #swagger.description = 'Get users with pagination'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Number of users per page (1-100)',
      required: false,
      type: 'integer',
      default: 10
    }
    #swagger.parameters['cursor'] = {
      in: 'query',
      description: 'Cursor for next page (user ID)',
      required: false,
      type: 'string'
    }
    #swagger.parameters['sortBy'] = {
      in: 'query',
      description: 'Field to sort by',
      required: false,
      type: 'string',
      enum: ['createdAt', '_id', 'fullName', 'email'],
      default: '_id'
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
      description: 'Users retrieved successfully',
      schema: {
        data: {
          type: 'array',
          items: {
            _id: 'string',
            email: 'string',
            fullName: 'string',
            identityNumber: 'string',
            gender: 'string',
            age: 'number',
            dateOfBirth: 'string',
            phoneNumber: 'string',
            address: 'string',
            role: 'string',
            createdAt: 'string',
            updatedAt: 'string'
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
    const users = await userService.getUsersWithPagination(options);
    res.status(200).json(users);
  } catch (error) {
    errorHandler(res, error);
  }
}

const getAll = async (req: Request, res: Response): Promise<void> => {
   /*
    #swagger.auto = false
    #swagger.tags = ['User CRUD']
    #swagger.description = 'Get all users'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.responses[200] = {
      description: 'Users retrieved successfully',
      schema: {
        items: {
          _id: 'string',
          email: 'string',
          fullName: 'string',
          identityNumber: 'string',
          gender: 'string',
          age: 'number',
          dateOfBirth: 'string',
          phoneNumber: 'string',
          address: 'string',
          role: 'string',
          createdAt: 'string',
          updatedAt: 'string'
        }
      }
    }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    errorHandler(res, error);
  }
}

const createUser = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['User CRUD']
    #swagger.description = 'Create a new user'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User data',
      required: true,
      schema: {
        email: 'string@example.com',
        fullName: 'string',
        identityNumber: 'string',
        gender: 'Male',
        age: '12',
        dateOfBirth: '01/01/2002',
        password: 'string',
        phoneNumber: 'string',
        address: 'string'
      }
    }
    #swagger.responses[201] = {
      description: 'User created successfully',
      schema: {
        message: 'User created successfully!',
        userId: 'string'
      }
    }
    #swagger.responses[400] = { description: 'Bad request or missing required fields' }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const userData = req.body;
    const newUser = await userService.createUser(userData, (req.user as AuthenticatedUser)?._id);
    res.status(201).json({
      message: "User created successfully!",
      userId: newUser._id
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['User CRUD']
    #swagger.description = 'Update user by ID'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'User ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User update data',
      required: false,
      schema: {
        email: 'string@example.com',
        fullName: 'string',
        identityNumber: 'string',
        gender: 'Male',
        age: '22',
        dateOfBirth: '01/01/2002',
        phoneNumber: 'string',
        address: 'string',
        isActive: 'boolean'
      }
    }
    #swagger.responses[200] = {
      description: 'User updated successfully',
      schema: {
        message: 'User updated successfully!',
        userId: 'string'
      }
    }
    #swagger.responses[400] = { description: 'User ID is required' }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[404] = { description: 'User not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const userData = req.body;
    const updatedUser = await userService.updateUser(userId, userData, (req.user as AuthenticatedUser)?._id);

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User updated successfully!",
      userId: updatedUser._id,
      role: updatedUser.role
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['User CRUD']
    #swagger.description = 'Delete user by ID'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'User ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'User deleted successfully',
      schema: {
        message: 'User deleted successfully!',
        userId: 'string'
      }
    }
    #swagger.responses[400] = { description: 'User ID is required' }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[404] = { description: 'User not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const deletedUser = await userService.deleteUser(userId, (req.user as AuthenticatedUser)?._id);
    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User deleted successfully!",
      userId: deletedUser._id
    });
  } catch (error) {
    errorHandler(res, error); 
  }
};

export { getUser, getAll, createUser, updateUser, deleteUser, getUsersWithPagination};
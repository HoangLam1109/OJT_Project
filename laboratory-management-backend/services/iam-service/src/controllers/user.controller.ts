import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { errorHandler } from "../utils/error.util.js";

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
    const userId = req.params.id || req.user?._id;
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
        email: 'string',
        fullName: 'string',
        identityNumber: 'string',
        gender: 'string',
        age: 'number',
        dateOfBirth: 'string',
        password: 'string'
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
    const newUser = await userService.createUser(userData, req.user?._id);
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
        email: 'string',
        fullName: 'string',
        identityNumber: 'string',
        gender: 'string',
        age: 'number',
        dateOfBirth: 'string'
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
    const updatedUser = await userService.updateUser(userId, userData, req.user?._id);

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User updated successfully!",
      userId: updatedUser._id
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

    const deletedUser = await userService.deleteUser(userId, req.user?._id);
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

export { getUser, getAll, createUser, updateUser, deleteUser };
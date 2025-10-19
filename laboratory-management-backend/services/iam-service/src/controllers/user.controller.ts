import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { errorHandler } from "../utils/error.util.js";

const userService = new UserService();

const getUser = async (req: Request, res: Response): Promise<void> => {
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

    res.status(200).json(user);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    errorHandler(res, error);
  }
}

const createUser = async (req: Request, res: Response): Promise<void> => {
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
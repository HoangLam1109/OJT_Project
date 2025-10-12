import type { Request, Response } from "express";
import { userRepository } from "../repositories/index.js";
import { errorHandler } from "../utils/error.util.js";
import type { IUser } from "../db/models/User.model.ts";

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id || req.user?._id;
    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }
    const user = await userRepository.findById(userId, "_id username email fullName identityNumber gender age dateOfBirth");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    errorHandler(res, error);
  }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = req.body;
    const newUser = await userRepository.create(userData);
    res.status(201).json({ message: "User created successfully!" });
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
    const updatedUser = await userRepository.updateById(userId, userData);
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ message: "User updated successfully!" });
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
    const deletedUser = await userRepository.deleteById(userId);
    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    errorHandler(res, error);
  }
};

export { getUser, createUser, updateUser, deleteUser };
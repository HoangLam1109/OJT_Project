import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/index.js";
import { auditLogRepository } from "../repositories/index.js";
import { passwordHistoryRepository } from "../repositories/index.js";

import type { IUser } from "../db/models/User.model.js";
import { errorHandler } from "../utils/error.util.js";

export interface CreateUserData {
  email: string;
  fullName: string;
  identityNumber: string;
  gender: string;
  age: number;
  dateOfBirth: Date;
  password: string;
}

export interface UpdateUserData {
  email?: string;
  fullName?: string;
  identityNumber?: string;
  gender?: string;
  age?: number;
  dateOfBirth?: Date;
  password?: string;
}

export class UserService {
  async getUser(userId: string): Promise<IUser | null> {
    return await userRepository.findById(
      userId,
      "_id email fullName phoneNumber identityNumber gender age dateOfBirth address"
    );
  }

  async createUser(
    userData: CreateUserData,
    performedBy?: string
  ): Promise<IUser> {
    const newUser = await this._passwordCheck("", userData, performedBy);
    const createdUser = await userRepository.create(newUser);

    await this._logEvent(
      "E_00001",
      "CREATE",
      "User created successfully!",
      performedBy || createdUser._id
    );
    return createdUser;
  }

  async updateUser(
    userId: string,
    userData: UpdateUserData,
    performedBy?: string
  ): Promise<IUser | null> {
    const newUser = await this._passwordCheck(userId, userData, performedBy);
    const updatedUser = await userRepository.updateById(userId, newUser);

    await this._logEvent(
      "E_00002",
      "UPDATE",
      "User updated successfully!",
      performedBy || userId
    );

    return updatedUser;
  }

  async deleteUser(
    userId: string,
    performedBy?: string
  ): Promise<IUser | null> {
    const deletedUser = await userRepository.deleteById(userId);
    await this._logEvent(
      "E_00003",
      "DELETE",
      "User deleted successfully!",
      performedBy || userId
    );
    return deletedUser;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await userRepository.findByEmail(email);
  }

  async getUserByIdentityNumber(identityNumber: string): Promise<IUser | null> {
    return await userRepository.findByIdentityNumber(identityNumber);
  }

  async getAllUsers(): Promise<IUser[]> {
    return await userRepository.findAll(
      "_id email fullName phoneNumber identityNumber gender age dateOfBirth address"
    );
  }

  // Private helper method to hash passwords
  private async _passwordCheck(
    userId: string,
    userData: UpdateUserData | CreateUserData,
    performedBy?: string
  ): Promise<UpdateUserData | CreateUserData> {
    if (userData.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const newUser = {
        ...userData,
        passwordHash: hashedPassword,
      };

      try {
        if (userId) {
          await passwordHistoryRepository.create({
            userId: userId || "",
            passwordHash: hashedPassword,
            changedAt: new Date(),
            changedBy: performedBy || userId,
            changedReason: "Password changed through updating user!",
          });
        }
      } catch (error) {
        console.log(error);
      }

      delete (newUser as any).password;
      return newUser;
    } else return userData;
  }

  private async _logEvent(
    eventCode: string,
    action: string,
    eventMessage: string,
    perfomedBy: string
  ): Promise<void> {
    await auditLogRepository.create({
      eventCode,
      action,
      eventMessage,
      userId: perfomedBy,
      performedAt: new Date(),
      serviceName: "User Service",
    });
  }
}

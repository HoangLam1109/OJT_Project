import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/index.js";
import { auditLogRepository } from "../repositories/index.js";
import { passwordHistoryRepository } from "../repositories/index.js";

import type { IUser } from "../db/models/User.model.js";
import RoleModel from "../db/models/Role.model.js";
import {
  PaginationResponse,
  PaginationOptions,
} from "../types/pagination.type.js";
import { PaginationUtils } from "../utils/pagination.util.js";

export interface CreateUserData {
  email: string;
  fullName: string;
  identityNumber: string;
  gender: string;
  age: number;
  dateOfBirth: Date;
  password: string;
  phoneNumber: string;
  address: string;
  role?: string[];
}

export interface UpdateUserData {
  email?: string;
  fullName?: string;
  identityNumber?: string;
  gender?: string;
  age?: number;
  dateOfBirth?: Date;
  password?: string;
  phoneNumber?: string;
  address?: string;
  role?: string[];
  isActive?: boolean;
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
    if(!userData.role){
      newUser.role = ["USER"];
    }
    const createdUser = await userRepository.create(newUser);
    console.log(createdUser);

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

  async getUserByPhoneNumber(phoneNumber: string): Promise<IUser | null> {
    return await userRepository.findByPhoneNumber(phoneNumber);
  }

  async assignRoleToUser(userId: string, role: string[], performedBy?: string): Promise<IUser | null> {
    const updatedUser = await userRepository.updateById(userId, { role });
    await this._logEvent(
      "E_00002",
      "UPDATE",
      "User updated successfully!",
      performedBy || userId
    );
    return updatedUser;
  }

  async lockUser(userId: string, isActive: boolean, performedBy?: string): Promise<IUser | null> {
    const updatedUser = await userRepository.updateById(userId, { isActive });
    await this._logEvent(
      "E_00004",
      "UPDATE",
      "User locked successfully!",
      performedBy || userId
    );
    return updatedUser;
  }

  async getUsersWithPagination(
    options: PaginationOptions
  ): Promise<PaginationResponse<IUser>> {
    const result = await userRepository.findWithPagination(options);
    return PaginationUtils.formatResponse(
      result.data,
      result.hasNextPage,
      options,
      result.totalCount
    );
  }

  async getUserRolesAndPrivileges(userId: string): Promise<any> {
    // Get user with role IDs
    const user = await userRepository.findById(
      userId,
      "_id email fullName role isActive isDeleted"
    );

    if (!user) {
      return null;
    }

    // Fetch all roles with their details
    const roles = await RoleModel.find({
      roleCode: { $in: user.role },
    }).select(
      "_id roleCode roleName description privileges isActive isSystemRole"
    );

    return {
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      roles: roles.map((role) => ({
        _id: role._id,
        roleCode: role.roleCode,
        roleName: role.roleName,
        description: role.description,
        privileges: role.privileges,
        isActive: role.isActive,
        isSystemRole: role.isSystemRole,
      })),
    };
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

   // Private helper method to hash passwords (skip for OAuth users)
  private async _passwordCheck(
    userId: string,
    userData: UpdateUserData | CreateUserData,
    performedBy?: string
  ): Promise<UpdateUserData | CreateUserData> {
    // Skip password hashing for OAuth users
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
}

import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/index.js";
import { passwordHistoryRepository } from "../repositories/index.js";

import type { IUser } from "../db/models/User.model.js";
import RoleModel from "../db/models/Role.model.js";
import {
  PaginationResponse,
  PaginationOptions,
} from "../types/pagination.type.js";
import { PaginationUtils } from "../utils/pagination.util.js";
import { logEvent } from "../utils/logging.util.js";
import { computeChanges } from "../utils/diff.util.js";
import { AppError } from "../utils/error.util.js";

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
    const { data: newUser } = await this._passwordCheck("", userData, performedBy);
    if (!userData.role) {
      newUser.role = ["USER"];
    }
    const createdUser = await userRepository.create(newUser);
    console.log(createdUser);

    await logEvent({
      eventCode: "E_00023",
      action: "CREATE",
      eventMessage: "User created successfully!",
      performedBy: performedBy || createdUser._id,
      serviceName: "IAM_SERVICE",
      entityId: createdUser._id,
      newValues: {
        email: createdUser.email,
        fullName: createdUser.fullName,
        phoneNumber: createdUser.phoneNumber,
        address: createdUser.address,
        role: createdUser.role,
        isActive: createdUser.isActive,
      },
    });
    return createdUser;
  }

  async updateUser(
    userId: string,
    userData: UpdateUserData,
    performedBy?: string
  ): Promise<IUser | null> {

    const before = await userRepository.findById(userId);
    const { data: newUser, passwordChanged } = await this._passwordCheck(userId, userData, performedBy);
    const updatedUser = await userRepository.updateById(userId, newUser);

    const fields: (keyof IUser)[] = [
      "email",
      "fullName",
      "phoneNumber",
      "address",
      "isActive",
    ];

    if (typeof userData.role !== "undefined") {
      fields.push("role");
    }

    const diffs = computeChanges<IUser>(
      before ?? undefined,
      updatedUser ?? undefined,
      fields,
      passwordChanged ? { passwordChanged: true } : undefined
    );

    await logEvent({
      eventCode: "E_00025",
      action: "UPDATE",
      eventMessage: "User updated successfully!",
      performedBy: performedBy || userId,
      serviceName: "IAM_SERVICE",
      entityId: userId,
      ...diffs,
    });

    return updatedUser;
  }

  async deleteUser(
    userId: string,
    performedBy?: string
  ): Promise<IUser | null> {
    const before = await userRepository.findById(userId);
    const deletedUser = await userRepository.deleteById(userId);
    await logEvent({
      eventCode: "E_00026",
      action: "DELETE",
      eventMessage: "User deleted successfully!",
      performedBy: performedBy || userId,
      serviceName: "IAM_SERVICE",
      entityId: userId,
      ...(before
        ? {
            oldValues: {
              email: before.email,
              fullName: before.fullName,
              phoneNumber: before.phoneNumber,
              address: before.address,
              role: before.role,
              isActive: before.isActive,
            } as Record<string, unknown>,
          }
        : {}),
    });
    return deletedUser;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await userRepository.findByEmail(email);
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<IUser | null> {
    return await userRepository.findByPhoneNumber(phoneNumber);
  }

  async assignRoleToUser(
    userId: string,
    role: string[],
    performedBy?: string
  ): Promise<IUser | null> {
    const before = await userRepository.findById(userId);
    const updatedUser = await userRepository.updateById(userId, { role });
    await logEvent({
      eventCode: "E_00025",
      action: "UPDATE",
      eventMessage: "User updated successfully!",
      performedBy: performedBy || userId,
      serviceName: "IAM_SERVICE",
      entityId: userId,
      ...(before
        ? {
            oldValues: {
              role: before.role,
            } as Record<string, unknown>,
          }
        : {}),
      ...(updatedUser
        ? {
            newValues: {
              role: updatedUser.role,
            } as Record<string, unknown>,
          }
        : {}),
    });
    return updatedUser;
  }

  async lockUser(
    userId: string,
    isActive: boolean,
    performedBy?: string
  ): Promise<IUser | null> {
    const before = await userRepository.findById(userId);
    const updatedUser = await userRepository.updateById(userId, { isActive });
    await logEvent({
      eventCode: "E_00027",
      action: `${isActive ? "UNLOCK" : "LOCK"}`,
      eventMessage: "User locked/unlocked successfully!",
      performedBy: performedBy || userId,
      serviceName: "IAM_SERVICE",
      entityId: userId,
      ...(before
        ? {
            oldValues: {
              isActive: before.isActive,
            } as Record<string, unknown>,
          }
        : {}),
      ...(updatedUser
        ? {
            newValues: {
              isActive: updatedUser.isActive,
            } as Record<string, unknown>,
          }
        : {}),
    });
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

  // Private helper method to hash passwords (skip for OAuth users)
  private async _passwordCheck(
    userId: string,
    userData: UpdateUserData | CreateUserData,
    performedBy?: string
  ): Promise<{data: UpdateUserData | CreateUserData; passwordChanged: boolean}> {
    const existing = userId ? await userRepository.findById(userId, "passwordHash") : null;
    // Skip password hashing for OAuth users
    if (userData.password) {
      if (existing?.passwordHash) {
        const isMatch = await bcrypt.compare(
          userData.password,
          existing.passwordHash as string
        );
        if (isMatch) {
          throw new AppError(
            400,
            "New password must be different from the current password"
          );
        }
      }

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
      return { data: newUser, passwordChanged: true};
    } else return {data: userData, passwordChanged: false};
  }
}

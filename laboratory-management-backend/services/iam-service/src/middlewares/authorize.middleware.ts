import type { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../utils/error.util.js';
import RoleModel from '../db/models/Role.model.js';

// Define the type for authenticated user (matches what the authenticate middleware provides)
interface AuthenticatedUser {
  _id: string;
  email: string;
  fullName: string;
  identityNumber: string;
  gender: string;
  age: number;
  dateOfBirth: Date;
  role: string[];
  isActive: boolean;
  isDeleted: boolean;
}

export const authorize = (requiredPermissions: string[] | string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as AuthenticatedUser | undefined;

      if (!user || !user.role) {
        return errorHandler(res, { message: 'Unauthorized: User or role missing', status: 401 });
      }

      if (!user.isActive || user.isDeleted) {
        return errorHandler(res, { message: 'Unauthorized: User is not active or deleted', status: 401 });
      }

      // Fetch user roles with privileges
      const userRoles = await RoleModel.find({ 
        roleCode: { $in: user.role },
        isActive: true  // Only fetch active roles
      }).select('privileges isActive');

      if (userRoles.length === 0) {
        return errorHandler(res, { message: 'Unauthorized: No valid roles found', status: 401 });
      }

      // Aggregate all privileges from all user roles
      const permsArray = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
      const userPermissions = new Set<string>();
      userRoles.forEach(role => {
        role.privileges.forEach(priv => userPermissions.add(priv));
      });

      // Check if user has required permissions
      const hasPermission = permsArray.some((perm) =>
        userPermissions.has('*') || userPermissions.has(perm)
      );

      if (!hasPermission) {
        return errorHandler(res, { message: 'Forbidden: Insufficient permissions', status: 403 });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return errorHandler(res, { message: 'Authorization failed', status: 500 });
    }
  };
};
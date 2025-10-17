 import type { Request, Response, NextFunction } from 'express';
import { ROLE_PERMISSIONS, type RoleCode, isValidRoleCode } from '../constants/roles.constant.js';
import { errorHandler } from '../utils/error.util.js';

export const authorize = (requiredPermissions: string[] | string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !user.role) {
      return errorHandler(res, { message: 'Unauthorized: User or role missing', status: 401 });
    }

    if (!isValidRoleCode(user.role)) {
      return errorHandler(res, { message: 'Unauthorized: Invalid role', status: 401 });
    }

    const permsArray = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    const userPermissions = ROLE_PERMISSIONS[user.role as RoleCode] || [];

    const hasPermission = permsArray.some((perm) =>
      userPermissions.includes('*') || userPermissions.includes(perm)
    );

    if (!hasPermission) {
      return errorHandler(res, { message: 'Forbidden: Insufficient permissions', status: 403 });
    }

    next();
  };
};
import type { Request, Response, NextFunction } from 'express';
import { ROLE_PERMISSIONS, ROLE_CODES, type RoleCode, isValidRoleCode } from '../constants/roles.constant.js';
import { errorHandler } from '../utils/error.util.js';

// Define the type for authenticated user (matches what the authenticate middleware provides)
interface AuthenticatedUser {
  _id: string;
  email: string;
  fullName: string;
  identityNumber: string;
  gender: string;
  age: number;
  dateOfBirth: Date;
  role: string;
}

export const authorize = (requiredPermissions: string[] | string) => {  
  return (req: Request, res: Response, next: NextFunction) => {
    const internalApiKey = req.headers['x-internal-api-key'];
    const expectedKey = process.env.INTERNAL_API_KEY;

    if (internalApiKey && expectedKey && internalApiKey === expectedKey) {
      if (!req.user) {
        req.user = {
          _id: 'internal-service-user',
          email: 'internal@system.local',
          fullName: 'Internal Service',
          identityNumber: 'INTERNAL',
          gender: 'N/A',
          age: 0,
          dateOfBirth: new Date(0),
          role: ROLE_CODES.ADMIN,
        } as AuthenticatedUser;
      }

      return next();
    }

    const user = req.user as AuthenticatedUser | undefined;

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
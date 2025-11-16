import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../../shared/src/error.util.js";
import iamServiceClient from "../adapters/iam.adapter.js";

export const authorizeRoles = (...allowedRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authUser = (req as any).user as { userId: string };
    const user = await iamServiceClient.getUserById(authUser.userId);

    if (!user || !Array.isArray(user.role)) {
      return next(new AppError(403, "Forbidden permission"));
    }

    const hasRole = user.role.some((r) => allowedRoles.includes(r));
    if (!hasRole) {
      return next(new AppError(403, "You are not allowed to access chat"));
    }

    next();
  };
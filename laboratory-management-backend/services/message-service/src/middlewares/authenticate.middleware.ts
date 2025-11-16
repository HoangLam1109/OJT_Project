import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../../../shared/src/error.util.js";

interface AuthenticatedUser {
  userId: string;
}

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = (req as any).cookies?.accessToken;

  if (!token) {
    return next(new AppError(401, "Not authenticated"));
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    ) as AuthenticatedUser;

    (req as any).user = payload;
    next();
  } catch {
    return next(new AppError(401, "Invalid or expired token"));
  }
};
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.util.js";
import jwt from "jsonwebtoken";
import UserModel from "../db/models/User.model.js";

const refreshTokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(401, "No refresh token provided");
  }

  try {

    const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as {
      userId: string;
    };

    console.log("[AUTH MIDDLEWARE] Refresh Token authentication successful");
    (req as any).userId = decodedToken.userId;

    next();
  } catch (error) {
    console.error("Refresh Token authentication failed:", error);
    next(error);
  }
};

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw new AppError(401, "Not authorized, no token");
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new AppError(500, "JWT secret is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as {
      userId: string;
    };

    const user = await UserModel.findById(
      decoded.userId,
      "_id email fullName identityNumber gender age dateOfBirth role isActive isDeleted"
    );

    if (!user) {
      throw new AppError(401, "Not authorized, user not found");
    }

    if (!user.isActive || user.isDeleted) {
      throw new AppError(401, "Not authorized, user is not active or deleted");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default {
  authenticateUser,
  refreshTokenValidation,
};

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../db/models/User.model.js";
import { JWT_SECRET } from "../config/env.config.js";
import { SessionService } from "../services/session.service.js";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
    }
  }
}

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ message: "Not authorized, no token" });
      return;
    }

    if (!JWT_SECRET) {
      res.status(500).json({ message: "JWT secret is not defined" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await User.findById(
      decoded.userId,
      "_id email fullName identityNumber gender age dateOfBirth role"
    );

    if (!user) {
      res.status(401).json({ message: "Not authorized, user not found" });
      return;
    }

    console.log(`[AUTH MIDDLEWARE] Validating sessions for user: ${user._id}`);
    try {
      const sessionService = new SessionService();
      const activeSessions = await sessionService.getUserSessions(
        user._id as string
      );
      console.log(
        `[AUTH MIDDLEWARE] Found ${activeSessions.length} sessions for user ${user._id}`
      );

      if (activeSessions.length === 0) {
        console.log(
          `[AUTH MIDDLEWARE] No active sessions found for user ${user._id} - blocking request`
        );
        res.status(401).json({ message: "No active sessions found" });
        return;
      }

      // Check if any session is still valid (not expired and active)
      const validSession = activeSessions.find(
        (session) => session.isActive && new Date() < session.expiresAt
      );

      if (!validSession) {
        console.log(
          `[AUTH MIDDLEWARE] No valid active session found for user ${user._id} - blocking request`
        );
        res.status(401).json({ message: "No valid active session found" });
        return;
      }

      req.session = validSession;
    } catch (error) {
      console.error(
        `[AUTH MIDDLEWARE] Session validation error for user ${user._id}:`,
        error
      );
      res.status(500).json({ message: "Session validation failed" });
      return;
    }

    console.log(
      `[AUTH MIDDLEWARE] Session validation passed for user ${user._id}`
    );
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired" });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      console.log(error.message);
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    console.error("Authentication error:", error);
    res.status(500).json({ message: "Server error during authentication" });
    return;
  }
};

export default authenticateUser;

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../db/models/User.model.js";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
    }
  }
}

const refreshTokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
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

    return res.status(401).json({ message: "Invalid or expired refresh token" });
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
      res.status(401).json({ message: "Not authorized, no token" });
      return;
    }

    if (!process.env.JWT_SECRET_KEY) {
      res.status(500).json({ message: "JWT secret is not defined" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as {
      userId: string;
    };

    const user = await User.findById(
      decoded.userId,
      "_id email fullName identityNumber gender age dateOfBirth role"
    );

    if (!user) {
      res.status(401).json({ message: "Not authorized, user not found" });
      return;
    }

    // console.log(`[AUTH MIDDLEWARE] Validating sessions for user: ${user._id}`);
    // try {
    //   const sessionService = new SessionService();
    //   const activeSessions = await sessionService.getUserSessions(
    //     user._id as string
    //   );
    //   console.log(
    //     `[AUTH MIDDLEWARE] Found ${activeSessions.length} sessions for user ${user._id}`
    //   );

    //   if (activeSessions.length === 0) {
    //     console.log(
    //       `[AUTH MIDDLEWARE] No active sessions found for user ${user._id} - blocking request`
    //     );
    //     res.status(401).json({ message: "No active sessions found" });
    //     return;
    //   }

    //   const validSession = activeSessions.find(
    //     (session) => session.isActive && new Date() < session.expiresAt
    //   );

    //   if (!validSession) {
    //     console.log(
    //       `[AUTH MIDDLEWARE] No valid active session found for user ${user._id} - blocking request`
    //     );
    //     res.status(401).json({ message: "No valid active session found" });
    //     return;
    //   }

    //   req.session = validSession;
    // } catch (error) {
    //   console.error(
    //     `[AUTH MIDDLEWARE] Session validation error for user ${user._id}:`,
    //     error
    //   );
    //   res.status(500).json({ message: "Session validation failed" });
    //   return;
    // }

    // console.log(
    //   `[AUTH MIDDLEWARE] Session validation passed for user ${user._id}`
    // );
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

export default {
  authenticateUser,
  refreshTokenValidation,
};

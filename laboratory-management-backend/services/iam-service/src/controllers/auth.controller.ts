import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import type { IUser } from "../db/models/User.model.ts";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { errorHandler } from "../utils/error.util.js";
import { clearJWT, generateJWT, refreshJWT } from "../utils/jwt.util.js";
dotenv.config();

const userService = new UserService();

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      fullName,
      identityNumber,
      gender,
      age,
      dateOfBirth,
      password,
    } = req.body;

    if (
      !email ||
      !fullName ||
      !identityNumber ||
      !gender ||
      !age ||
      !dateOfBirth ||
      !password
    ) {
      res.status(400).json({ message: "Missing required fields!" });
      return;
    }

    const existingEmail = await userService.getUserByEmail(email);
    const existingIdentityNumber = await userService.getUserByIdentityNumber(
      identityNumber
    );
    if (existingEmail || existingIdentityNumber) {
      res.status(400).json({
        message: existingEmail
          ? "Email already exists!"
          : "Identity number already exists!",
      });
      return;
    }

    const newUser = await userService.createUser(
      {
        email,
        fullName,
        identityNumber,
        gender,
        age,
        dateOfBirth: new Date(dateOfBirth),
        password: password,
      },
      undefined
    );

    res.status(200).json({
      message: "User created successfully!",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Missing credentials" });
      return;
    }

    const user: IUser | null = await userService.getUserByEmail(email);

    if (!user) {
      res.status(400).json({ message: "User not found!" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid password!" });
      return;
    }

    generateJWT(res, user._id as string);

    // const session = await sessionService.createSession({
    //   userId: user._id as string,
    //   ipAddress: req.ip || "unknown",
    //   userAgent: req.headers["user-agent"] || "unknown",
    // });

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    clearJWT(res);
    if (req.user) {
      // await sessionService.invalidateAllUserSessions(req.user?._id as string);
    }

    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // const sessions = await sessionService.getUserSessions(userId);
    // const activeSession = sessions.find(s =>
    //   s.isActive &&
    //   s.refreshToken === refreshToken &&
    //   new Date() < s.expiresAt
    // );

    // if (!activeSession) {
    //   return Send.unauthorized(res, "Invalid or expired refresh token");
    // }

    // Generate new access token
    refreshJWT(res, userId);

    return res.status(200).json({ message: "Refresh token successful!" });
  } catch (error) {
    console.error("Refresh Token failed:", error);
    return res.status(500).json({ message: "Failed to refresh token" });
  }
};

export { registerUser, loginUser, logoutUser, refreshToken };

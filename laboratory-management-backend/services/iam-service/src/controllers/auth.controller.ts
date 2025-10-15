import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { SessionService } from "../services/session.service.js";
import type { IUser } from "../db/models/User.model.ts";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { errorHandler } from "../utils/error.util.js";
import { clearJWT, generateJWT } from "../utils/jwt.util.js";
dotenv.config();

const userService = new UserService();
const sessionService = new SessionService();

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, fullName, identityNumber, gender, age, dateOfBirth, password } = req.body;

    if (!email || !fullName || !identityNumber || !gender || !age || !dateOfBirth || !password) {
      res.status(400).json({ message: "Missing required fields!" });
      return;
    }

    const existingEmail = await userService.getUserByEmail(email);
    const existingIdentityNumber = await userService.getUserByIdentityNumber(identityNumber);
    if (existingEmail || existingIdentityNumber) {
      res.status(400).json({
        message: existingEmail
          ? "Email already exists!"
          : "Identity number already exists!",
      });
      return;
    }

    const newUser = await userService.createUser({
      email,
      fullName,
      identityNumber,
      gender,
      age,
      dateOfBirth: new Date(dateOfBirth),
      password: password,
    }, undefined);

    res.status(201).json({ message: "User created successfully!" });
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

    const session = await sessionService.createSession({
      userId: user._id as string,
      ipAddress: req.ip || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown'
    });

    res.status(200).json({
      message: "Login successful!",
      sessionToken: session.sessionToken,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    clearJWT(res);
    if (req.user) {
      await sessionService.invalidateAllUserSessions(req.user?._id as string);
    }

    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const refreshUserToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId, refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: "Missing refresh token" });
      return;
    }

    const session = await sessionService.refreshSessionWithToken(sessionId, refreshToken);
    if (!session) {
      res.status(400).json({ message: "Invalid refresh token" });
      return;
    }

    res.status(200).json({
      message: "Token refreshed successfully!",
      newSessionToken: session.newSessionToken,
      newRefreshToken: session.newRefreshToken
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export { registerUser, loginUser, logoutUser, refreshUserToken };
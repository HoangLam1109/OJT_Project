import type { Response } from "express";
import { JWT_SECRET, JWT_EXPIRY } from "../config/env.config.js";
import jwt from "jsonwebtoken";

// const JWT_SECRET: string = process.env.JWT_SECRET || "4534ec35d2f0763d5339201829c2cc6fd4552491";
// const JWT_EXPIRY: string = process.env.JWT_EXPIRY || "1h";

const generateJWT = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });

  const expiryInSeconds = parseInt(JWT_EXPIRY);
  if (isNaN(expiryInSeconds)) {
    throw new Error("Invalid JWT_EXPIRY value");
  }

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: expiryInSeconds * 1000,
    path: "/",
  });
};

const clearJWT = (res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });
};

export { generateJWT, clearJWT };
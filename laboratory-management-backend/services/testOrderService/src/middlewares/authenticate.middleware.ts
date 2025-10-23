import { Request, Response, NextFunction } from "express";
import axios from "axios";

export const verifyIAMToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    // gọi IAM Service để verify token
    const response = await axios.post("http://localhost:5002/api/iam/verify", { token });
    req.user = response.data.user; // giả sử IAM trả về user object
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

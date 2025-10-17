import express from "express";
import dotenv from "dotenv";

import authRouter from "./routes/v1/auth.routes.js";
import userRouter from "./routes/v1/user.routes.js";

import connectDB from "./config/database.config.js";
import cors from "cors";
import { PORT } from "./config/env.config.js";
import cookieParser from "cookie-parser";
import authenticateUser from "./middlewares/authenticate.middleware.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",  // frontend origin
  credentials: true                 // cho phép gửi cookie / credentials
}));


connectDB();

import { SessionService } from "./services/session.service.js";
const sessionService = new SessionService();

// Clean up expired sessions on startup
await sessionService.cleanupExpiredSessions();
console.log('Cleaned up expired sessions on startup');


app.use(express.json());
app.use(cookieParser());
app.use("/api", authRouter);
app.use("/api/user", authenticateUser, userRouter);

app.get("/", (req, res) => {
  res.send("JWT Authentication System is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import express from "express";
import dotenv from "dotenv";

import authRouter from "./routes/v1/auth.routes.js";
import userRouter from "./routes/v1/user.routes.js";

import connectDB from "./config/database.config.js";
import cors from "cors";
import { PORT } from "./config/env.config.js";
import cookieParser from "cookie-parser";
import authenticateUser from "./middlewares/auth.middleware.js";

dotenv.config();

// Add error handlers early for debugging
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

const app = express();
// Configure CORS to reflect the incoming origin and allow credentials.
// When credentials are used, Access-Control-Allow-Origin must not be '*'.
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));


connectDB();

app.use(express.json());
app.use(cookieParser());
app.use("/api", authRouter);
app.use("/api/user", authenticateUser, userRouter);

app.get("/", (req, res) => {
  res.send("JWT Authentication System is running!");
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Process PID:', process.pid);
});

// Clean up expired sessions after server starts listening
server.on('listening', async () => {
  try {
    const { SessionService } = await import("./services/session.service.js");
    const sessionService = new SessionService();
    await sessionService.cleanupExpiredSessions();
    console.log('Cleaned up expired sessions on startup');
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
  }
});

// Keep server alive
server.on('error', (error) => {
  console.error('Server error:', error);
});
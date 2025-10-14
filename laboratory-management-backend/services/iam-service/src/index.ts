import express from "express";
import dotenv from "dotenv";

import authRouter from "./routes/v1/auth.routes.js";
import userRouter from "./routes/v1/user.routes.js";
import roleRouter from "./routes/v1/role.routes.js";

import connectDB from "./config/database.config.js";
import { PORT } from "./config/env.config.js";
import cookieParser from "cookie-parser";
import authenticateUser from "./middlewares/auth.middleware.js";

dotenv.config();

const app = express();
//const PORT = process.env.PORT || 3000;

connectDB();

// Redis is disabled - using mock client
console.log('🚫 Redis is disabled - using mock client for caching');

app.use(express.json());
app.use(cookieParser());
app.use("/api", authRouter);
app.use("/api/user", authenticateUser, userRouter);
app.use("/api/role", authenticateUser, roleRouter);

app.get("/", (req, res) => {
  res.send("JWT Authentication System is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

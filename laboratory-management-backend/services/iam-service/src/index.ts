import dotenv from "dotenv";

import express from "express";
import passport from "passport";

import routes from "./routes/index.js";

import connectDB from "./config/database.config.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: "json"};

// Import OAuth config to initialize Passport strategies
import "./config/oauth.config.js";

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

// Initialize Passport
app.use(passport.initialize());

app.use("/api", routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("JWT Authentication System is running!");
});

app.listen(process.env.PORT, () => {
    console.log(`\n${"=".repeat(60)}`);
  console.log(`🚀 IAM Service Started Successfully!`);
  console.log(`${"=".repeat(60)}`);
  console.log(`📍 Server URL:     http://localhost:${process.env.PORT}`);
  console.log(`📚 Swagger UI:     http://localhost:${process.env.PORT}/api-docs`);
  console.log(`🔗 API Endpoint:   http://localhost:${process.env.PORT}/api`);
  console.log(`💾 Database:       IAM Service`);
  console.log(`${"=".repeat(60)}\n`);
});

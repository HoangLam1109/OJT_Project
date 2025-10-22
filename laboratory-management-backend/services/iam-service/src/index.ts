import dotenv from "dotenv";

import express from "express";

import routes from "./routes/index.js";

import connectDB from "./config/database.config.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: "json"};
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


app.use("/api", routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("JWT Authentication System is running!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

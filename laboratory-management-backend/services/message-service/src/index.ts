import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./config/database.config.js";
import routes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: "json" };
import { errorHandler, notFoundHandler } from "../../shared/src/error.util.js";

import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
  origin: process.env.WEB_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Message Service is running!");
});

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`Message Service listening on http://localhost:${port}`);
});


// MUST load env FIRST before any other imports that use process.env
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log('[Patient Service] Env loaded from:', envPath);
console.log('[Patient Service] INTERNAL_API_KEY:', process.env.INTERNAL_API_KEY ? '***' + process.env.INTERNAL_API_KEY.slice(-4) : 'NOT SET');

// Now import other modules (they will see the env vars)
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import connectDB from "./config/database.config.js";
import apiRoutes from "./routes/index.js";

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
connectDB();

// Swagger documentation
const swaggerDocument = JSON.parse(
  readFileSync("./services/patientService/src/swagger-output.json", "utf-8")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api", apiRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "Patient Service Running",
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PATIENT_SERVICE_PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🚀 Patient Service Started Successfully!`);
  console.log(`${"=".repeat(60)}`);
  console.log(`📍 Server URL:     http://localhost:${PORT}`);
  console.log(`📚 Swagger UI:     http://localhost:${PORT}/api-docs`);
  console.log(`🔗 API Endpoint:   http://localhost:${PORT}/api`);
  console.log(`💾 Database:       patientService`);
  console.log(`${"=".repeat(60)}\n`);
});

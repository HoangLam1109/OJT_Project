import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import connectDB from "./config/database.config.js";
import patientRoutes from "./routes/v1/patient.routes.js";

// Load environment variables
dotenv.config({ path: "./services/patientService/.env" });

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
app.use("/api/patients", patientRoutes);

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
  console.log(`🔗 API Endpoint:   http://localhost:${PORT}/api/patients`);
  console.log(`💾 Database:       patientService`);
  console.log(`${"=".repeat(60)}\n`);
});

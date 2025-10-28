import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import connectDB from "./config/database.config.js";
import testOrderRoutes from "./routes/testOrder.routes.js";

// Load environment variables
dotenv.config({ path: "./services/testOrderService/.env" });

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
  readFileSync("./services/testOrderService/src/swagger-output.json", "utf-8")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api", testOrderRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "TestOrder Service Running",
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.TESTORDER_SERVICE_PORT || 5002;
app.listen(PORT, () => {
  console.log(`TestOrder Service Started Successfully!`);
  console.log(`Server URL:     http://localhost:${PORT}`);
  console.log(`Swagger UI:     http://localhost:${PORT}/api-docs`);
  console.log(`Database:       TestOrder Service`);
});

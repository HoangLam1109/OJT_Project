import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { readFileSync, existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/database.config.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const defaultSwaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Warehouse Service API",
    version: "v1.0.0",
    description:
      "Inventory, instrument, and reagent management microservice for the Laboratory Information Management System.",
  },
  servers: [
    {
      url: `http://localhost:${process.env.WAREHOUSE_SERVICE_PORT || process.env.PORT || 5003}`,
      description: "Local development server",
    },
  ],
  tags: [
    {
      name: "Health",
      description: "Service heartbeat and readiness checks",
    },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        description: "Confirms the Warehouse Service is running.",
        responses: {
          200: {
            description: "Service is healthy.",
          },
        },
      },
    },
  },
};

const swaggerCandidatePaths = [
  resolve(process.cwd(), "src/swagger-output.json"),
  resolve(__dirname, "./swagger-output.json"),
  resolve(__dirname, "../swagger-output.json"),
];

let swaggerDocument: Record<string, unknown> = defaultSwaggerDocument;
let swaggerLoadedFrom: string | null = null;

for (const candidate of swaggerCandidatePaths) {
  if (!existsSync(candidate)) continue;

  try {
    const document = JSON.parse(readFileSync(candidate, "utf-8"));
    swaggerDocument = document;
    swaggerLoadedFrom = candidate;
    break;
  } catch (error) {
    console.warn(`[WarehouseService] Failed to parse swagger file at ${candidate}`, error);
  }
}

if (swaggerLoadedFrom) {
  console.log(`[WarehouseService] Swagger document loaded from ${swaggerLoadedFrom}`);
} else {
  console.warn(
    "[WarehouseService] swagger-output.json not generated yet. Using in-memory fallback so Swagger UI remains available."
  );
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", routes);

app.get("/", (_req, res) => {
  res.json({
    message: "Warehouse Service Running",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

const PORT = Number(process.env.WAREHOUSE_SERVICE_PORT || process.env.PORT || 5003);
app.listen(PORT, () => {
  console.log("".padStart(60, "="));
  console.log("🚀 Warehouse Service Started Successfully!");
  console.log("".padStart(60, "="));
  console.log(`📍 Server URL:     http://localhost:${PORT}`);
  console.log(`📚 Swagger UI:     http://localhost:${PORT}/api-docs`);
  console.log(`🔗 API Endpoint:   http://localhost:${PORT}/api`);
  console.log(`💾 Database:       ${process.env.MONGO_URI ?? "warehouseService"}`);
  console.log("".padStart(60, "="));
});

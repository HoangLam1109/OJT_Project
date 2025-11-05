import dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import swaggerAutogen from "swagger-autogen";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env so the generated document includes the correct server URL
dotenv.config({ path: resolve(__dirname, "../.env") });

const servicePort = process.env.WAREHOUSE_SERVICE_PORT || process.env.PORT || "5003";

const doc = {
  info: {
    title: "Warehouse Service API",
    version: "v1.0.0",
    description:
      "Inventory, instrument, and reagent management microservice for the Laboratory Information Management System.",
  },
  servers: [
    {
      url: `http://localhost:${servicePort}`,
      description: "Local development server",
    },
  ],
  basePath: "/api",
  schemes: ["http"],
  tags: [
    {
      name: "Health",
      description: "Service heartbeat and readiness checks",
    },
    {
      name: "Inventory",
      description: "Inventory management endpoints (placeholder)",
    },
  ],
  components: {
    securitySchemes: {
      internalApiKey: {
        type: "apiKey",
        in: "header",
        name: "x-internal-api-key",
        description: "Internal microservice API key provided by IAM Service.",
      },
    },
  },
};

const outputFile = resolve(__dirname, "./swagger-output.json");
const endpointsFiles = [resolve(__dirname, "./routes/index.ts")];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log(`[WarehouseService] Swagger file generated at ${outputFile}`);
  })
  .catch((error) => {
    console.error("[WarehouseService] Failed to generate swagger document:", error);
    process.exit(1);
  });

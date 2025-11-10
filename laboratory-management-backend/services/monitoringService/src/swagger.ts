import swaggerAutogen from "swagger-autogen";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const doc = {
  info: {
    title: "Monitoring Service API",
    version: "1.0.0",
    description: "Laboratory Management System - Monitoring Service API Documentation\nBased on Section 3.2 - Event Logs Management",
  },
  host: "localhost:3004",
  basePath: "/api",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Event Logs",
      description: "Event logs management endpoints - Section 3.2.1",
    },
    {
      name: "Event Codes",
      description: "Event codes reference endpoints - Section 2.8",
    },
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "JWT token in format: Bearer <token>",
    },
    internalApiKey: {
      type: "apiKey",
      in: "header",
      name: "X-Internal-API-Key",
      description: "Internal service API key",
    },
  },
  definitions: {
    EventLog: {
      event_id: "uuid-string",
      event_code: "E_00001",
      action: "CREATE",
      event_message: "Test order created",
      service_name: "TEST_ORDER",
      entity_id: "entity-id-string",
      old_values: {},
      new_values: {},
      operator_id: "user-id-string",
      operator_name: "John Doe",
      operator_role: "LAB_MANAGER",
      occurred_at: "2025-01-01T00:00:00.000Z",
      received_at: "2025-01-01T00:00:00.000Z",
    },
    EventCode: {
      event_code: "E_00001",
      event_name: "TEST_ORDER_CREATED",
      description: "Test order created",
      category: "TEST_ORDER",
      is_active: true,
      created_at: "2025-01-01T00:00:00.000Z",
    },
  },
};

const outputFile = resolve(__dirname, "./swagger-output.json");
const endpointsFiles = [resolve(__dirname, "./routes/index.ts")];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc).then(() => {
  console.log("✅ Swagger documentation generated successfully!");
});

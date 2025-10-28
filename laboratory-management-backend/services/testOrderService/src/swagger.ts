import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Laboratory Information Management System API",
    description: "Laboratory Information Management System API",
    version: "v1.0.0",
  },
  host: "localhost:5002",
  basePath: "/api",
  schemes: ["http", "https"],
  tags: [
    {
      name: "TestOrder CRUD",
      description: "TestOrder management operations (requires authentication)",
    },
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "cookie",
      name: "accessToken",
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/testOrder.routes.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);

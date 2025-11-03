// swagger.js
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const options = {
  definition: {
    openapi: "3.0.0", // Version of OpenAPI
    info: {
      title: "My API Documentation",
      version: "1.0.0",
      description: "API documentation for my Node.js backend using Swagger",
    },
    // Use a relative server URL so Swagger UI makes requests to the same
    // origin where it's served (works both locally and in production). If you
    // prefer an absolute URL in production, set SWAGGER_BASE_URL env var.
    servers: [
      {
        url: process.env.SWAGGER_BASE_URL || "/",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files
};

// Generate Swagger specs
const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };

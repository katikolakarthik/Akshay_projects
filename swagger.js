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
    servers: [
      {
        url: "http://localhost:4000", // Root URL (remove the `/user` base path to avoid route collisions)
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files
};

// Generate Swagger specs
const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };

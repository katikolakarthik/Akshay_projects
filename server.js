const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// Routes
const userRoutes = require("./routes/userroutes");
app.use("/user", userRoutes);

// Swagger
const { swaggerUi, swaggerSpec } = require("./swagger");

app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

// Serve swagger spec JSON
app.get("/api-docs/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

// Swagger UI (load from swagger.json endpoint)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      url: "/api-docs/swagger.json",
    },
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

// MongoDB connection
const mongoUri = process.env.MONGODB_URL;
if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

// Export for Vercel
module.exports = app;

// Local server
if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
}

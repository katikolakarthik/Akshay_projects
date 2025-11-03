// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const userRoutes = require('./routes/userroutes');
app.use('/user', userRoutes);
const { swaggerUi, swaggerSpec } = require('./swagger');


app.get("/", (req, res) => {
  res.send("✅ Server is running successfully 🚀");
});

app.get("/api-docs/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});


app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API Documentation",
  })
);


const mongoUri = process.env.MONGODB_URL;

if (mongoUri) {
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ Error connecting to MongoDB:", err));
} else {
  console.warn("⚠️ MONGODB_URL not set — skipping MongoDB connection.");
}

const PORT = process.env.PORT || 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

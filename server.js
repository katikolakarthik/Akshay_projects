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

// Try to serve static Swagger UI assets from swagger-ui-dist and a small
// HTML bootstrap page that loads the spec from /api-docs/swagger.json.
// This avoids cases where the UI's asset requests end up routed to HTML
// responses in some serverless setups, which causes the "Unexpected token '<'"
// errors in the browser console.
const path = require("path");
let swaggerDistPath;
try {
  const swaggerUiDist = require("swagger-ui-dist");
  swaggerDistPath = swaggerUiDist.getAbsoluteFSPath();
} catch (err) {
  swaggerDistPath = null;
}

if (swaggerDistPath) {
  // Serve static assets under /api-docs/dist
  app.use("/api-docs/dist", express.static(swaggerDistPath));

  // Serve a tiny HTML page that references the dist assets and the JSON spec
  // Use CDN-hosted assets as a fallback so styling works even if static asset
  // serving has issues in the production environment.
  app.get("/api-docs", (req, res) => {
    const cssUrl = 'https://unpkg.com/swagger-ui-dist@4.18.3/swagger-ui.css';
    const bundleUrl = 'https://unpkg.com/swagger-ui-dist@4.18.3/swagger-ui-bundle.js';
    const presetUrl = 'https://unpkg.com/swagger-ui-dist@4.18.3/swagger-ui-standalone-preset.js';

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>API Docs</title>
    <link rel="stylesheet" type="text/css" href="${cssUrl}" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="${bundleUrl}"></script>
    <script src="${presetUrl}"></script>
    <script>
      window.onload = function() {
        const ui = SwaggerUIBundle({
          url: '/api-docs/swagger.json',
          dom_id: '#swagger-ui',
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          layout: 'BaseLayout'
        });
        window.ui = ui;
      };
    </script>
  </body>
</html>`;
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  });
} else {
  // Fallback to swagger-ui-express if dist isn't available
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(null, {
      swaggerOptions: { url: "/api-docs/swagger.json" },
      customCss: ".swagger-ui .topbar { display: none }",
    })
  );
}

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

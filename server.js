const express = require('express');
const app = express();

// Use Express built-in JSON parser. Do not call body parsing middleware after
// exporting the app for serverless platforms.
app.use(express.json());

const userroutes = require('./routes/userroutes');
app.use('/user', userroutes);
const swaggerUi = require('swagger-ui-express');

// `swagger.js` exports `swaggerSpec` (and `swaggerUi`).
// The project file is `swagger.js`, so require that instead of a non-existent module.
const swaggerDocument = require('./swagger').swaggerSpec;

app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 4000;
const mongoose = require('mongoose');
require('dotenv').config();



const mongoUri = process.env.MONGODB_URL;
if (mongoUri) {
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });
} else {
  console.warn('MONGODB_URL is not set; skipping MongoDB connection. Some routes may not work.');
}


// When running on Vercel/@vercel/node or other serverless platforms we should
// export the Express `app` instead of calling `app.listen`. The Vercel Node
// builder will invoke this module per-request. For local development we still
// start a listening server.
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

const express = require('express');
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

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


app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
})

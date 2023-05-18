const express = require('express');
const router = require('./routes')
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config()


//database connection
connectDB()


//middlewares
app.use(bodyParser.json());
app.use('/', router)

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

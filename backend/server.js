const express = require('express');
const router = require('./store')
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
require('dotenv').config()

const { PORT } = process.env;

app.use('/', router)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

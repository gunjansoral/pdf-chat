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
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//socket.io implementaion
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000'
  },
});
io.on('connection', (socket) => {
  console.log('connection established on socket')
})
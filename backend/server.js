const express = require('express');
const router = require('./routes')
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const { requireAuth, connection } = require('./controllers/socketioControllers');
require('dotenv').config()


//database connection
connectDB()

//socket.io implementaion
const { PORT } = process.env;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL
  },
});

//middlewares
app.use(bodyParser.json());
app.use('/', router)
io.use(requireAuth);

//socket.io connection
io.on('connection', connection)
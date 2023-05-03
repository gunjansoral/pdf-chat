const express = require('express');
const multer = require('multer');
const router = express.Router();

require('dotenv').config();
const mongoose = require('mongoose');
const { uploadPdf, askAnything } = require('../controllers');
const uri = `mongodb+srv://gunjanpdfchat:${process.env.MONGODB_PASSWORD}@pdfchat.2vussga.mongodb.net/?retryWrites=true&w=majority`;


// Connect to the database
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//database connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database connected');
});


//middlewares
const upload = multer({ storage: multer.memoryStorage() });

//routes
//upload a pdf file
router.post('/upload', upload.single('pdf'), uploadPdf);

//ask any question from a pdf file
router.post('/ask', askAnything);

module.exports = router;

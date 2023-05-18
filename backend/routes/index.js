const express = require('express');
const multer = require('multer');
const router = express.Router();
const cors = require('cors')

require('dotenv').config();
const { authentication, authenticationCallback } = require('../controllers/authControllers')
const { uploadPdf, askAnything, getChats } = require('../controllers');
const { requireAuth } = require('../controllers/authControllers');

//middlewares
const upload = multer({ storage: multer.memoryStorage() });
router.use(cors())

//routes
router.get('/auth/google', authentication)
router.get('/auth/google/callback', authenticationCallback)
//upload a pdf file
router.post('/upload', requireAuth, upload.single('pdf'), uploadPdf);

//ask any question from a pdf file
router.post('/ask', requireAuth, askAnything);
router.get('/chats', requireAuth, getChats);

module.exports = router;
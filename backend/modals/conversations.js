const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
  chatId: { type: String, required: true },
  userId: { type: String, required: true },
  pdfId: { type: String, required: true },
  question: { type: String },
  answer: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  sender: String,
  content: String,
  timeStamp: Date
})

const chatSchema = new Schema({
  chatId: { type: String, required: true },
  userId: { type: String, required: true },
  messages: [messageSchema]
});

module.exports = mongoose.model('Chat', chatSchema);
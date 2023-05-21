const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String, trim: true, default: '' },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  chat: { type: Schema.Types.ObjectId, ref: "Chat" },
  pdf: { type: Schema.Types.ObjectId, ref: 'Pdf' }
})

module.exports = model('Message', messageSchema)
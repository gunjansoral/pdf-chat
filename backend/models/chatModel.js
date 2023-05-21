const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
  chatName: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  pdf: { type: Schema.Types.ObjectId, ref: "Pdf", required: true },
  messages: [
    { type: Schema.Types.ObjectId, ref: "Message", }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema);
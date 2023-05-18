const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
  chatName: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  pdf: { type: Schema.Types.ObjectId, ref: "Pdf", required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema);
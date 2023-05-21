const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  lastPdf: { type: String },
  lastChat: { type: String },
  pic: {
    type: String, required: true,
    default: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg"
  }
}, {
  timestamps: true
})

module.exports = model("User", userSchema)
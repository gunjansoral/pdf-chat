const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const aiSchema = new Schema({
  name: { type: String, required: true },
  pic: {
    type: String, required: true,
    default: "https://media.istockphoto.com/id/946531596/photo/artificial-intelligence-concept-with-virtual-human-avatar-3d-illustration.jpg?s=612x612&w=0&k=20&c=kwuzPwe6YuSawNMJsdOu_lDvzrbAmLdXV4fc7Vxmibs="
  }
}, {
  timestamps: true
})

module.exports = model("AiBot", aiSchema)
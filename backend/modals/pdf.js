const mongoose = require('mongoose');
const { Schema } = mongoose;

const pdfSchema = new Schema({
  data: { type: Buffer },
  contentType: String,
  fileName: String,
});

module.exports = mongoose.model('PDF', pdfSchema);

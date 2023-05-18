const mongoose = require('mongoose');
const { Schema } = mongoose;

const pdfSchema = new Schema({
  data: { type: Buffer },
  contentType: String,
  fileName: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Pdf', pdfSchema);

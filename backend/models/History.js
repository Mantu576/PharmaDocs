// const mongoose = require('mongoose');

// const documentHistorySchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   username: String,
//   filename: String,
//   fileType: String, // 'docx', 'pdf', 'xlsx'
//   module: String,   // 'AMV', 'Stability', etc.
//   timestamp: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('DocumentHistory', documentHistorySchema);
// models/History.js
const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  filename: { type: String, required: true },
  module: { type: String, required: true },   // e.g. "STP", "RawData", etc.
  fileType: { type: String, default: 'docx' },// e.g. "docx", "pdf", "xlsx"
  timestamp: { type: Date, default: Date.now }
}, { versionKey: false });

HistorySchema.index({ timestamp: -1 });

module.exports = mongoose.model('History', HistorySchema);

// models/Log.js
const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  username: { type: String, required: true },
  action: { type: String, required: true },
  filename: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { collection: 'logs' });

module.exports = mongoose.model('Log', LogSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  subscriptionPlan: { type: String, enum: ['Basic', 'Pro', 'Enterprise'], default: 'Basic' },
  modulesAllowed: [String], // e.g., ['AMV']
  downloadsThisMonth: { type: Number, default: 0 },
  activeSession: { type: Boolean, default: false },
  lastReset: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

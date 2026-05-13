const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'My Foreign Job' },
  siteDescription: { type: String, default: 'AI-powered admin dashboard' },
  timezone: { type: String, default: 'UTC' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
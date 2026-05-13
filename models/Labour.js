const mongoose = require('mongoose');

const labourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true },
  hourlyRate: Number
}, { timestamps: true });

module.exports = mongoose.model('Labour', labourSchema);

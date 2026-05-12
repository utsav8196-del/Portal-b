// const mongoose = require('mongoose');

// const labourSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   role: String,
//   project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
//   hourlyRate: Number
// });

// module.exports = mongoose.model('Labour', labourSchema);

const mongoose = require('mongoose');

const labourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  hourlyRate: Number
});

module.exports = mongoose.model('Labour', labourSchema);

// const mongoose = require('mongoose');

// const materialSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   quantity: { type: Number, default: 0 },
//   unit: { type: String, default: 'units' }
// });

// module.exports = mongoose.model('Material', materialSchema);

const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true },
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: 'units' }
});

materialSchema.index({ projectId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Material', materialSchema);

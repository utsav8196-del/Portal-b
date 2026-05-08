// const mongoose = require('mongoose');

// const materialSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   quantity: { type: Number, default: 0 },
//   unit: { type: String, default: 'units' }
// });

// module.exports = mongoose.model('Material', materialSchema);

const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: 'units' }
});

module.exports = mongoose.model('Material', materialSchema);
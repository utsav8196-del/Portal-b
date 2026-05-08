// const mongoose = require('mongoose');

// const machinerySchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   model: String,
//   status: { type: String, enum: ['available', 'in-use', 'maintenance'], default: 'available' }
// });

// module.exports = mongoose.model('Machinery', machinerySchema);

const mongoose = require('mongoose');

const machinerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: String,
  status: { type: String, enum: ['available', 'in-use', 'maintenance'], default: 'available' }
});

module.exports = mongoose.model('Machinery', machinerySchema);
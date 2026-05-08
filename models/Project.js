// // const mongoose = require('mongoose');

// // const projectSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   description: String,
// //   progress: { type: Number, default: 0, min: 0, max: 100 },
// //   startDate: Date,
// //   endDate: Date,
// //   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// // }, { timestamps: true });

// // module.exports = mongoose.model('Project', projectSchema);

// const mongoose = require('mongoose');

// const projectSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: String,
//   progress: { type: Number, default: 0, min: 0, max: 100 },
//   startDate: Date,
//   endDate: Date,
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// }, { timestamps: true });

// module.exports = mongoose.model('Project', projectSchema);


const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: '' },          // <-- add
  projectType: { type: String, default: '' },       // <-- add
  description: { type: String, default: '' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  startDate: Date,
  endDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
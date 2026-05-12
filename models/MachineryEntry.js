const mongoose = require('mongoose');

const machineryEntrySchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  machineryName: { type: String, required: true, trim: true },
  date: { type: Date, required: true, default: Date.now },
  challanNumber: { type: String, required: true, trim: true },
  vehicleNumber: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 0 },
  rate: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true },
  remarks: { type: String, default: '' }
}, { timestamps: true });

// Auto-calculate amount before saving
machineryEntrySchema.pre('save', function(next) {
  this.amount = this.quantity * this.rate;
  next();
});

module.exports = mongoose.model('MachineryEntry', machineryEntrySchema);

const mongoose = require('mongoose');

const materialEntrySchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  materialName: { type: String, required: true, trim: true },
  date: { type: Date, required: true, default: Date.now },
  challanNumber: { type: String, trim: true },
  vehicleNumber: { type: String, trim: true },
  supplierName: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  rate: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true }, // quantity * rate
  remarks: { type: String, default: '' }
}, { timestamps: true });

// Auto‑calculate amount before saving
materialEntrySchema.pre('save', function(next) {
  this.amount = this.quantity * this.rate;
  next();
});

module.exports = mongoose.model('MaterialEntry', materialEntrySchema);

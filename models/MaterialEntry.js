const mongoose = require('mongoose');

const materialEntrySchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  materialName: { type: String, required: true, trim: true },
  date: { type: Date, required: true, default: Date.now },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  quantity: { type: Number, default: 0 },
  rate: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
  remarks: { type: String, default: '' }
}, { timestamps: true, strict: false }); 

materialEntrySchema.pre('save', function (next) {
  let qty = this.data.Quantity || this.data.Weight || this.data.Bags || this.data.quantity || 0;
  let r = this.data.Rate || this.data.rate || 0;
  if (!qty && this.quantity) qty = this.quantity;
  if (!r && this.rate) r = this.rate;

  this.quantity = qty;
  this.rate = r;
  this.amount = qty * r;

  if (!this.data.Quantity && qty) this.data.Quantity = qty;
  if (!this.data.Rate && r) this.data.Rate = r;
  if (!this.data.Amount) this.data.Amount = this.amount;

  next();
});

module.exports = mongoose.model('MaterialEntry', materialEntrySchema);
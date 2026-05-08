const MachineryEntry = require('../models/MachineryEntry');

// Get all entries (sorted by date descending)
const getMachineryEntries = async (req, res) => {
  try {
    const entries = await MachineryEntry.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new entry
const addMachineryEntry = async (req, res) => {
  try {
    const { machineryName, date, challanNumber, vehicleNumber, description, quantity, rate, remarks } = req.body;
    if (!machineryName || !challanNumber || !vehicleNumber || quantity == null || rate == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const amount = quantity * rate;
    const newEntry = new MachineryEntry({
      machineryName,
      date,
      challanNumber,
      vehicleNumber,
      description,
      quantity,
      rate,
      amount,
      remarks
    });
    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an entry
const updateMachineryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.quantity !== undefined && updateData.rate !== undefined) {
      updateData.amount = updateData.quantity * updateData.rate;
    } else if (updateData.quantity !== undefined) {
      const existing = await MachineryEntry.findById(id);
      if (existing) updateData.amount = updateData.quantity * existing.rate;
    } else if (updateData.rate !== undefined) {
      const existing = await MachineryEntry.findById(id);
      if (existing) updateData.amount = existing.quantity * updateData.rate;
    }
    const updated = await MachineryEntry.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Entry not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an entry
const deleteMachineryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MachineryEntry.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMachineryEntries,
  addMachineryEntry,
  updateMachineryEntry,
  deleteMachineryEntry
};
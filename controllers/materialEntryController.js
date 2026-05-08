const MaterialEntry = require('../models/MaterialEntry');

// Get all entries (grouped by materialName) – exactly what your frontend wants
const getAllEntries = async (req, res) => {
  try {
    const entries = await MaterialEntry.find().sort({ date: -1 });
    const grouped = entries.reduce((acc, entry) => {
      const material = entry.materialName;
      if (!acc[material]) acc[material] = [];
      // Convert to plain object and remove internal fields
      const obj = entry.toObject();
      delete obj.__v;
      delete obj._id;
      delete obj.materialName;
      // Customise field names to match frontend expectations (optional)
      const frontendEntry = {
        Date: obj.date.toISOString().slice(0, 10),
        'Challan Number': obj.challanNumber,
        'Vehicle Number': obj.vehicleNumber,
        'Supplier Name': obj.supplierName,
        Quantity: obj.quantity,
        Rate: obj.rate,
        Amount: obj.amount,
        Remarks: obj.remarks,
        _id: entry._id   // keep id for updates/deletes
      };
      acc[material].push(frontendEntry);
      return acc;
    }, {});
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new entry (material + entry)
const addEntry = async (req, res) => {
  try {
    const { materialName, entry } = req.body;
    if (!materialName || !entry) {
      return res.status(400).json({ message: 'Material name and entry data required' });
    }
    if (!entry.Date || !entry['Supplier Name'] || entry.Quantity == null || entry.Rate == null) {
      return res.status(400).json({ message: 'Date, Supplier Name, Quantity and Rate are required' });
    }

    const newEntry = new MaterialEntry({
      materialName,
      date: entry.Date,
      challanNumber: entry['Challan Number'] || '',
      vehicleNumber: entry['Vehicle Number'] || '',
      supplierName: entry['Supplier Name'],
      quantity: entry.Quantity,
      rate: entry.Rate,
      amount: entry.Amount || entry.Quantity * entry.Rate,
      remarks: entry.Remarks || ''
    });
    await newEntry.save();
    res.status(201).json({ message: 'Entry added', entry: newEntry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an entry
const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const entry = await MaterialEntry.findById(id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    // Map frontend fields to model fields
    entry.date = updatedData.Date || entry.date;
    entry.challanNumber = updatedData['Challan Number'] || entry.challanNumber;
    entry.vehicleNumber = updatedData['Vehicle Number'] || entry.vehicleNumber;
    entry.supplierName = updatedData['Supplier Name'] || entry.supplierName;
    entry.quantity = updatedData.Quantity != null ? updatedData.Quantity : entry.quantity;
    entry.rate = updatedData.Rate != null ? updatedData.Rate : entry.rate;
    entry.remarks = updatedData.Remarks || entry.remarks;
    // amount auto‑recalculated in pre('save')
    await entry.save();

    res.json({ message: 'Entry updated', entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an entry
const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MaterialEntry.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllEntries, addEntry, updateEntry, deleteEntry };
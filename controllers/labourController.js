// const Labour = require('../models/Labour');

// exports.getLabour = async (req, res) => {
//   try {
//     const labour = await Labour.find().populate('project', 'name');
//     res.json(labour);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.addLabour = async (req, res) => {
//   try {
//     const labour = new Labour(req.body);
//     await labour.save();
//     res.status(201).json(labour);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.updateLabour = async (req, res) => {
//   try {
//     const labour = await Labour.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(labour);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.deleteLabour = async (req, res) => {
//   try {
//     await Labour.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



const Labour = require('../models/Labour');

const getLabour = async (req, res) => {
  try {
    const labour = await Labour.find().populate('project', 'name');
    res.json(labour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addLabour = async (req, res) => {
  try {
    const labour = new Labour(req.body);
    await labour.save();
    res.status(201).json(labour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateLabour = async (req, res) => {
  try {
    const labour = await Labour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!labour) return res.status(404).json({ message: 'Labour not found' });
    res.json(labour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteLabour = async (req, res) => {
  try {
    await Labour.findByIdAndDelete(req.params.id);
    res.json({ message: 'Labour deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLabour, addLabour, updateLabour, deleteLabour };
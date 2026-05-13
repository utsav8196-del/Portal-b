const MachineryEntry = require('../models/MachineryEntry');
const Project = require('../models/Project');

const ensureProjectAccess = async (projectId, userId) => {
  if (!projectId) return null;
  return Project.findOne({ _id: projectId, createdBy: userId });
};

const getMachineryEntries = async (req, res) => {
  try {
    const query = {};
    if (req.query.projectId) {
      const project = await ensureProjectAccess(req.query.projectId, req.userId);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      query.projectId = req.query.projectId;
    }
    const entries = await MachineryEntry.find(query).populate('projectId', 'name').sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addMachineryEntry = async (req, res) => {
  try {
    const { projectId, machineryName, date, challanNumber, vehicleNumber, description, quantity, rate, remarks } = req.body;
    const project = await ensureProjectAccess(projectId, req.userId);
    if (!project) return res.status(400).json({ message: 'Valid project is required' });
    if (!machineryName || !challanNumber || !vehicleNumber || quantity == null || rate == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const amount = quantity * rate;
    const newEntry = new MachineryEntry({
      projectId,
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

const updateMachineryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    const existing = await MachineryEntry.findById(id);
    if (!existing) return res.status(404).json({ message: 'Entry not found' });
    if (existing.projectId) {
      const existingProject = await ensureProjectAccess(existing.projectId, req.userId);
      if (!existingProject) return res.status(403).json({ message: 'Not authorized for this entry' });
    }
    const selectedProjectId = updateData.projectId;
    const project = await ensureProjectAccess(selectedProjectId, req.userId);
    if (!project) return res.status(400).json({ message: 'Valid project is required' });
    if (updateData.quantity !== undefined && updateData.rate !== undefined) {
      updateData.amount = updateData.quantity * updateData.rate;
    } else if (updateData.quantity !== undefined) {
      if (existing) updateData.amount = updateData.quantity * existing.rate;
    } else if (updateData.rate !== undefined) {
      if (existing) updateData.amount = existing.quantity * updateData.rate;
    }
    const updated = await MachineryEntry.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Entry not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteMachineryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await MachineryEntry.findById(id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    if (entry.projectId) {
      const project = await ensureProjectAccess(entry.projectId, req.userId);
      if (!project) return res.status(403).json({ message: 'Not authorized for this entry' });
    }
    await entry.deleteOne();
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

const Labour = require('../models/Labour');
const Project = require('../models/Project');

const ensureProjectAccess = async (projectId, userId) => {
  if (!projectId) return null;
  return Project.findOne({ _id: projectId, createdBy: userId });
};

const getLabour = async (req, res) => {
  try {
    const query = {};
    if (req.query.projectId) {
      const project = await ensureProjectAccess(req.query.projectId, req.userId);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      query.projectId = req.query.projectId;
    }
    const labour = await Labour.find(query).populate('projectId', 'name');
    res.json(labour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addLabour = async (req, res) => {
  try {
    const { name, role, projectId, hourlyRate } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    if (!projectId) return res.status(400).json({ message: 'Project is required' });
    
    const project = await ensureProjectAccess(projectId, req.userId);
    if (!project) return res.status(400).json({ message: 'Valid project is required' });
    
    const labour = new Labour({ name, role, projectId, hourlyRate });
    await labour.save();
    res.status(201).json(labour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateLabour = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, projectId, hourlyRate } = req.body;
    
    const labour = await Labour.findById(id);
    if (!labour) return res.status(404).json({ message: 'Labour not found' });
    
    if (projectId && projectId !== labour.projectId?.toString()) {
      const project = await ensureProjectAccess(projectId, req.userId);
      if (!project) return res.status(400).json({ message: 'Valid project is required' });
    }
    
    labour.name = name || labour.name;
    labour.role = role !== undefined ? role : labour.role;
    labour.projectId = projectId || labour.projectId;
    labour.hourlyRate = hourlyRate !== undefined ? hourlyRate : labour.hourlyRate;
    
    await labour.save();
    res.json(labour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteLabour = async (req, res) => {
  try {
    const { id } = req.params;
    const labour = await Labour.findById(id);
    if (!labour) return res.status(404).json({ message: 'Labour not found' });
    
    if (labour.projectId) {
      const project = await ensureProjectAccess(labour.projectId, req.userId);
      if (!project) return res.status(403).json({ message: 'Not authorized for this worker' });
    }
    await labour.deleteOne();
    res.json({ message: 'Labour deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLabour, addLabour, updateLabour, deleteLabour };
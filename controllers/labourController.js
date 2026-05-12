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
      query.$or = [{ projectId: req.query.projectId }, { project: req.query.projectId }];
    }
    const labour = await Labour.find(query).populate('project', 'name').populate('projectId', 'name');
    res.json(labour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addLabour = async (req, res) => {
  try {
    const projectId = req.body.projectId || req.body.project;
    const project = await ensureProjectAccess(projectId, req.userId);
    if (!project) return res.status(400).json({ message: 'Valid project is required' });
    const labour = new Labour({ ...req.body, projectId, project: projectId });
    await labour.save();
    res.status(201).json(labour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateLabour = async (req, res) => {
  try {
    const projectId = req.body.projectId || req.body.project;
    const project = await ensureProjectAccess(projectId, req.userId);
    if (!project) return res.status(400).json({ message: 'Valid project is required' });
    const labour = await Labour.findByIdAndUpdate(
      req.params.id,
      { ...req.body, projectId, project: projectId },
      { new: true }
    );
    if (!labour) return res.status(404).json({ message: 'Labour not found' });
    res.json(labour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteLabour = async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) return res.status(404).json({ message: 'Labour not found' });
    const projectId = labour.projectId || labour.project;
    if (projectId) {
      const project = await ensureProjectAccess(projectId, req.userId);
      if (!project) return res.status(403).json({ message: 'Not authorized for this worker' });
    }
    await labour.deleteOne();
    res.json({ message: 'Labour deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLabour, addLabour, updateLabour, deleteLabour };

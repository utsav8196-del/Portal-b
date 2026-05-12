// const Project = require('../models/Project');

// exports.createProject = async (req, res) => {
//   try {
//     const project = new Project({ ...req.body, createdBy: req.userId });
//     await project.save();
//     res.status(201).json(project);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.getProjects = async (req, res) => {
//   try {
//     const projects = await Project.find().populate('createdBy', 'name');
//     res.json(projects);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.updateProject = async (req, res) => {
//   try {
//     const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(project);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.deleteProject = async (req, res) => {
//   try {
//     await Project.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


const Project = require('../models/Project');

const createProject = async (req, res) => {
  try {
    const project = new Project({ ...req.body, createdBy: req.userId });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.userId }).populate('createdBy', 'name');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, createdBy: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createProject, getProjects, updateProject, deleteProject };

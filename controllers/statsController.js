// const Project = require('../models/Project');
// const Labour = require('../models/Labour');

// exports.getStats = async (req, res) => {
//   try {
//     const totalProjects = await Project.countDocuments();
//     const totalWorkers = await Labour.countDocuments();
//     const projects = await Project.find();
//     const avgProgress = projects.length ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length : 0;
//     res.json({ totalProjects, totalWorkers, averageProgress: Math.round(avgProgress) });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


const Project = require('../models/Project');
const Labour = require('../models/Labour');

const getStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalWorkers = await Labour.countDocuments();
    const projects = await Project.find();
    const avgProgress = projects.length
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
      : 0;
    res.json({ totalProjects, totalWorkers, averageProgress: avgProgress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats };
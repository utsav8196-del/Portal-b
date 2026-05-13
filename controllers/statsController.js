const Project = require('../models/Project');
const Labour = require('../models/Labour');
const MaterialEntry = require('../models/MaterialEntry');

const getStats = async (req, res) => {
  try {
    const projectQuery = { createdBy: req.userId };
    const projects = await Project.find(projectQuery);
    const projectIds = projects.map((project) => project._id);
    const totalProjects = projects.length;
    const totalWorkers = await Labour.countDocuments({
      $or: [{ projectId: { $in: projectIds } }, { project: { $in: projectIds } }]
    });
    const avgProgress = projects.length
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
      : 0;
    res.json({ totalProjects, totalWorkers, averageProgress: avgProgress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getSandStock = async (req, res) => {
  try {
    const result = await MaterialEntry.aggregate([
      { $match: { materialName: { $regex: '^sand$', $options: 'i' } } },
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    const total = result.length > 0 ? result[0].total : 0;
    res.json({ sandStock: total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats, getSandStock };

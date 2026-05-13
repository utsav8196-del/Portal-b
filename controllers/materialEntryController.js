const MaterialEntry = require('../models/MaterialEntry');
const Project = require('../models/Project');

const ensureProjectAccess = async (projectId, userId) => {
  if (!projectId) return null;
  return Project.findOne({ _id: projectId, createdBy: userId });
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getOwnedProjectIds = async (userId) => {
  const projects = await Project.find({ createdBy: userId }).select('_id');
  return projects.map((project) => project._id);
};

const getMaterialScopeQuery = async (materialName, projectId, userId) => {
  const query = { materialName };
  if (projectId) {
    const project = await ensureProjectAccess(projectId, userId);
    if (!project) return null;
    query.projectId = projectId;
    return query;
  }
  query.$or = [
    { projectId: { $in: await getOwnedProjectIds(userId) } },
    { projectId: { $exists: false } },
    { projectId: null }
  ];
  return query;
};

const getAllEntries = async (req, res) => {
  try {
    const query = {};
    if (req.query.projectId) {
      const project = await ensureProjectAccess(req.query.projectId, req.userId);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      query.projectId = req.query.projectId;
    } else {
      query.$or = [
        { projectId: { $in: await getOwnedProjectIds(req.userId) } },
        { projectId: { $exists: false } },
        { projectId: null }
      ];
    }
    if (req.query.materialName) query.materialName = req.query.materialName;

    const entries = await MaterialEntry.find(query).populate('projectId', 'name').sort({ date: -1 });

    const grouped = entries.reduce((acc, entry) => {
      const material = entry.materialName;
      if (!acc[material]) acc[material] = [];

      const frontendEntry = {
        _id: entry._id,
        projectId: entry.projectId?._id || entry.projectId,
        projectName: entry.projectId?.name || '',
        Date: entry.date.toISOString().slice(0, 10),
        ...entry.data,
        Remarks: entry.data.Remarks || entry.remarks || '',
        Amount: entry.amount,
        Rate: entry.data.Rate || entry.rate,
        Quantity: entry.data.Quantity || entry.data.Weight || entry.data.Bags || entry.quantity,
        'Supplier Name': entry.data['Supplier Name'] || '',
        'Challan Number': entry.data['Challan Number'] || '',
        'Vehicle Number': entry.data['Vehicle Number'] || '',
      };
      acc[material].push(frontendEntry);
      return acc;
    }, {});
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addEntry = async (req, res) => {
  try {
    const { materialName, entry, projectId } = req.body;
    const trimmedMaterialName = typeof materialName === 'string' ? materialName.trim() : '';
    if (!trimmedMaterialName || !entry) {
      return res.status(400).json({ message: 'Material name and entry data required' });
    }
    const selectedProjectId = projectId || entry.projectId;
    const project = await ensureProjectAccess(selectedProjectId, req.userId);
    if (!project) return res.status(400).json({ message: 'Valid project is required' });

    if (!entry.Date || !entry['Supplier Name'] || (entry.Quantity == null && entry.Weight == null && entry.Bags == null)) {
      return res.status(400).json({ message: 'Date, Supplier Name and Quantity (or Weight/Bags) are required' });
    }

    const isMaterialCreation = String(entry['Supplier Name']).trim().toLowerCase() === 'initial stock';
    if (isMaterialCreation) {
      const existing = await MaterialEntry.findOne({
        projectId: selectedProjectId,
        materialName: { $regex: `^${escapeRegex(trimmedMaterialName)}$`, $options: 'i' }
      });
      if (existing) return res.status(400).json({ message: 'Material already exists for this project' });
    }

    let quantity = entry.Quantity || entry.Weight || entry.Bags || 0;
    let rate = entry.Rate || 0;
    let amount = quantity * rate;

    const newEntry = new MaterialEntry({
      projectId: selectedProjectId,
      materialName: trimmedMaterialName,
      date: entry.Date,
      data: { ...entry },
      quantity,
      rate,
      amount,
      remarks: entry.Remarks || ''
    });

    await newEntry.save();
    res.status(201).json({ message: 'Entry added', entry: newEntry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const entry = await MaterialEntry.findById(id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    if (entry.projectId) {
      const existingProject = await ensureProjectAccess(entry.projectId, req.userId);
      if (!existingProject) return res.status(403).json({ message: 'Not authorized for this entry' });
    }
    const selectedProjectId = updatedData.projectId || entry.projectId;
    const project = await ensureProjectAccess(selectedProjectId, req.userId);
    if (!project) return res.status(400).json({ message: 'Valid project is required' });

    entry.projectId = selectedProjectId;
    if (updatedData.Date) entry.date = updatedData.Date;
    if (updatedData.Remarks !== undefined) entry.remarks = updatedData.Remarks;

    entry.data = { ...entry.data, ...updatedData };

    let quantity = entry.data.Quantity || entry.data.Weight || entry.data.Bags || 0;
    let rate = entry.data.Rate || 0;
    entry.quantity = quantity;
    entry.rate = rate;
    entry.amount = quantity * rate;

    await entry.save();
    res.json({ message: 'Entry updated', entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await MaterialEntry.findById(id);
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

const getMaterialNames = async (req, res) => {
  try {
    const query = {};
    if (req.query.projectId) {
      const project = await ensureProjectAccess(req.query.projectId, req.userId);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      query.projectId = req.query.projectId;
    } else {
      query.$or = [
        { projectId: { $in: await getOwnedProjectIds(req.userId) } },
        { projectId: { $exists: false } },
        { projectId: null }
      ];
    }
    const entries = await MaterialEntry.find(query).select('materialName createdAt').sort({ createdAt: 1 });
    const seen = new Set();
    const orderedNames = [];
    for (const entry of entries) {
      const name = entry.materialName;
      if (!seen.has(name)) {
        seen.add(name);
        orderedNames.push(name);
      }
    }
    res.json(orderedNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const renameMaterial = async (req, res) => {
  try {
    const { materialName } = req.params;
    const { newName, projectId } = req.body;
    const trimmedName = typeof newName === 'string' ? newName.trim() : '';
    if (!trimmedName) return res.status(400).json({ message: 'New material name is required' });

    const query = await getMaterialScopeQuery(materialName, projectId, req.userId);
    if (!query) return res.status(404).json({ message: 'Project not found' });

    const duplicateQuery = { materialName: { $regex: `^${escapeRegex(trimmedName)}$`, $options: 'i' } };
    if (projectId) duplicateQuery.projectId = projectId;
    else duplicateQuery.$or = [
      { projectId: { $in: await getOwnedProjectIds(req.userId) } },
      { projectId: { $exists: false } },
      { projectId: null }
    ];
    const duplicate = await MaterialEntry.findOne(duplicateQuery).select('materialName');
    if (duplicate && duplicate.materialName.toLowerCase() !== materialName.toLowerCase()) {
      return res.status(400).json({ message: 'Material name already exists for this project' });
    }

    const result = await MaterialEntry.updateMany(query, { $set: { materialName: trimmedName } });
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Material not found' });
    res.json({ message: 'Material updated', modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { materialName } = req.params;
    const { projectId } = req.query;
    const query = await getMaterialScopeQuery(materialName, projectId, req.userId);
    if (!query) return res.status(404).json({ message: 'Project not found' });
    const result = await MaterialEntry.deleteMany(query);
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Material not found' });
    res.json({ message: 'Material deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMaterialStock = async (req, res) => {
  try {
    const { materialName } = req.params;
    const matchStage = { materialName: { $regex: `^${materialName}$`, $options: 'i' } };
    if (req.query.projectId) matchStage.projectId = req.query.projectId;
    const result = await MaterialEntry.aggregate([
      { $match: matchStage },
      { $group: { _id: null, totalStock: { $sum: '$quantity' } } }
    ]);
    const totalStock = result.length > 0 ? result[0].totalStock : 0;
    res.json({ materialName, totalStock });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  getMaterialNames,
  renameMaterial,
  deleteMaterial,
  getMaterialStock
};
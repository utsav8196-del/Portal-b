const Material = require('../models/Material');

const DEFAULT_MATERIALS = [
  'Sand', 'Aggregate', 'Cement', 'Steel', 'Fabrication', 'Hardware',
  'Bricks', 'Stone', 'Tiles', 'Granite', 'Electric', 'Plumbing', 'Plywood', 'Paint'
];

const seedMaterials = async () => {
  for (let name of DEFAULT_MATERIALS) {
    const exists = await Material.findOne({ name });
    if (!exists) await Material.create({ name, quantity: 0, unit: 'units' });
  }
};

const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createMaterial = async (req, res) => {
  try {
    const { name, quantity, unit } = req.body;
    if (!name) return res.status(400).json({ message: 'Material name is required' });

    const existing = await Material.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Material already exists' });

    const newMaterial = await Material.create({
      name,
      quantity: quantity || 0,
      unit: unit || 'units'
    });
    res.status(201).json(newMaterial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { name, quantity, unit } = req.body;
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    if (name && name !== material.name) {
      const duplicate = await Material.findOne({ name });
      if (duplicate) return res.status(400).json({ message: 'Material name already exists' });
      material.name = name;
    }
    if (quantity !== undefined) material.quantity = quantity;
    if (unit !== undefined) material.unit = unit;

    await material.save();
    res.json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    res.json({ message: 'Material deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  seedMaterials,
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial
};
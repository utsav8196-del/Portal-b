const express = require('express');
const {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial
} = require('../controllers/materialController');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', getMaterials);
router.post('/', createMaterial);
router.put('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);

module.exports = router;
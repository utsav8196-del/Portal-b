const express = require('express');
const {
  getAllEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  getMaterialNames,
  renameMaterial,
  deleteMaterial,
  getMaterialStock
} = require('../controllers/materialEntryController');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// ── Named/static routes MUST come before param routes (/:id) ──────────────
// Express matches top-to-bottom. If /:id is listed first, then a request
// to /names or /stock/sand would be caught by /:id instead.

router.get('/names', getMaterialNames);                     // GET  /api/materials/names
router.get('/stock/:materialName', getMaterialStock);       // GET  /api/materials/stock/sand
router.put('/material/:materialName', renameMaterial);      // PUT  /api/materials/material/sand
router.delete('/material/:materialName', deleteMaterial);   // DEL  /api/materials/material/sand

// ── General CRUD ──────────────────────────────────────────────────────────
router.get('/', getAllEntries);                             // GET  /api/materials?projectId=xxx
router.post('/', addEntry);                                // POST /api/materials

// ── These use MongoDB _id so must be last ─────────────────────────────────
router.put('/:id', updateEntry);                           // PUT  /api/materials/:id
router.delete('/:id', deleteEntry);                        // DEL  /api/materials/:id

module.exports = router;
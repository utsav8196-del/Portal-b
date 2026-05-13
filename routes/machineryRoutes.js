const express = require('express');
const {
  getMachineryEntries,
  addMachineryEntry,
  updateMachineryEntry,
  deleteMachineryEntry
} = require('../controllers/machineryController');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', getMachineryEntries);
router.post('/', addMachineryEntry);
router.put('/:id', updateMachineryEntry);
router.delete('/:id', deleteMachineryEntry);

module.exports = router;    
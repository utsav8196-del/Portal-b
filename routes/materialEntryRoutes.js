const express = require('express');
const {
  getAllEntries,
  addEntry,
  updateEntry,
  deleteEntry
} = require('../controllers/materialEntryController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();
router.use(auth);

router.get('/', getAllEntries);
router.post('/', admin, addEntry);
router.put('/:id', admin, updateEntry);
router.delete('/:id', admin, deleteEntry);

module.exports = router;
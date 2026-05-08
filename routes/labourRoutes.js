const express = require('express');
const { getLabour, addLabour, updateLabour, deleteLabour } = require('../controllers/labourController');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', getLabour);
router.post('/', addLabour);
router.put('/:id', updateLabour);
router.delete('/:id', deleteLabour);

module.exports = router;
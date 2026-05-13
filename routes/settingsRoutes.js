const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);
router.get('/', getSettings);
router.put('/', updateSettings);

module.exports = router;
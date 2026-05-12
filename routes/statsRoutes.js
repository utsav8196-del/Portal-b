const express = require('express');
const { getStats, getSandStock } = require('../controllers/statsController');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);
router.get('/', getStats);
router.get('/sand-stock', getSandStock);

module.exports = router;
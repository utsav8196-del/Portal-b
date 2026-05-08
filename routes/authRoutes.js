const express = require('express');
const { register, login, logout, me, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth, me);
router.post('/change-password', auth, changePassword);

module.exports = router;
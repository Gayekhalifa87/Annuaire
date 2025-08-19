
 
const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/authController');
const authenticateToken = require('../Middlewares/authMiddleware');

router.post('/login', login);
router.get('/Me', authenticateToken, getMe)

router.post('/logout', authenticateToken, logout);

module.exports = router;


 
const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/authController');
const authenticateToken = require('../Middlewares/authMiddleware');

router.post('/login', login);


router.post('/logout', authenticateToken, logout);

module.exports = router;

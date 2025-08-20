
 
const express = require('express');
const router = express.Router();
const { login, logout, getMe, forgotPassword, resetPassword  } = require('../controllers/authController');
const authenticateToken = require('../Middlewares/authMiddleware');

router.post('/login', login);
router.get('/Me', authenticateToken, getMe)

router.post('/logout', authenticateToken, logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


module.exports = router;

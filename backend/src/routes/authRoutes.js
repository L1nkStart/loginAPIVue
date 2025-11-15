const express = require('express');
const rateLimit = require('express-rate-limit');
const {
    register,
    login,
    logout,
    getProfile,
    registerValidation,
    loginValidation
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        success: false,
        error: 'Demasiados intentos de autenticación. Intenta de nuevo más tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Public routes
router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

module.exports = router;

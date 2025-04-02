import express from 'express';
import {
    register,
    login,
    handleOTPVerification,
    handleForgotPassword,
    handleResetPassword,
    changePassword
} from '../controllers/usersController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/verify-otp', handleOTPVerification);
router.post('/forgot-password', handleForgotPassword);
router.post('/reset-password', handleResetPassword);
router.post('/login', login);

// Protected routes
router.put('/change-password', authenticateToken, changePassword);

export default router; 
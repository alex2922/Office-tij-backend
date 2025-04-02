import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { registerUser, loginUser, verifyRegistrationOTP, forgotPassword, resetPassword } from "../services/userService.js";
import { database } from "../db/config.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables.");
}

const registerSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const verifyOTPSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
});

const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    newPassword: Joi.string().min(6).required(),
});

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
});

// Register new user
export const register = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const result = await registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Verify OTP after registration
export const handleOTPVerification = async (req, res) => {
    try {
        const { error } = verifyOTPSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const result = await verifyRegistrationOTP(req.body.email, req.body.otp);
        res.json(result);
    } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Forgot password
export const handleForgotPassword = async (req, res) => {
    try {
        const { error } = Joi.object({ email: Joi.string().email().required() }).validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const result = await forgotPassword(req.body.email);
        res.json(result);
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Reset password
export const handleResetPassword = async (req, res) => {
    try {
        const { error } = resetPasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const result = await resetPassword(req.body.email, req.body.otp, req.body.newPassword);
        res.json(result);
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const result = await loginUser(req.body.email, req.body.password);
        res.json(result);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const { error } = changePasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { currentPassword, newPassword } = req.body;
        const email = req.user.email;

        // Get user
        const [users] = await database.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = users[0];

        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await database.query(
            "UPDATE users SET password = ? WHERE email = ?",
            [hashedPassword, email]
        );

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ error: error.message });
    }
};

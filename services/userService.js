import { database } from "../db/config.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOTP } from "./otpService.js";
import { sentOTP } from "./emailService.js";

const userTableSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(), // Ensuring password security
    otp_code: Joi.string().length(6).optional(),
    otp_expires_at: Joi.date().optional(),
    is_verified: Joi.boolean().default(false),
    createdAt: Joi.date().default(() => new Date()),
});

// Register a new user
export const registerUser = async (userData) => {
    try {
        const { error } = userTableSchema.validate(userData);
        if (error) throw new Error(error.details[0].message);

        // Check if user exists
        const [existingUser] = await database.query(
            "SELECT id FROM users WHERE email = ?",
            [userData.email]
        );
        if (existingUser.length > 0) throw new Error("User already exists");

        // Hash password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // Generate OTP
        const otp = await generateOTP(userData.email);

        // Insert user into database with OTP
        const [result] = await database.query(
            "INSERT INTO users (name, email, password, otp_code, otp_expires_at, is_verified) VALUES (?, ?, ?, ?, ?, ?)",
            [userData.name, userData.email, hashedPassword, otp, new Date(Date.now() + 10 * 60 * 1000), false]
        );

        // Send OTP via email
        await sentOTP(userData.email, otp);

        return {
            id: result.insertId,
            name: userData.name,
            email: userData.email,
            message: "Registration successful. Please verify your email with the OTP sent."
        };
    } catch (error) {
        throw new Error(`User registration failed: ${error.message}`);
    }
};

// Verify OTP for registration
export const verifyRegistrationOTP = async (email, otp) => {
    try {
        const [users] = await database.query(
            "SELECT * FROM users WHERE email = ? AND otp_code = ? AND otp_expires_at > NOW()",
            [email, otp]
        );

        if (users.length === 0) {
            throw new Error("Invalid or expired OTP");
        }

        // Update user verification status
        await database.query(
            "UPDATE users SET is_verified = true, otp_code = NULL, otp_expires_at = NULL WHERE email = ?",
            [email]
        );

        return { message: "Email verified successfully" };
    } catch (error) {
        throw new Error(`OTP verification failed: ${error.message}`);
    }
};

// Login user
export const loginUser = async (email, password) => {
    try {
        // Find user by email
        const [users] = await database.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) throw new Error("Invalid email or password");

        const user = users[0];

        // Check if email is verified
        if (!user.is_verified) {
            throw new Error("Please verify your email before logging in");
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new Error("Invalid email or password");

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET_KEY, // Use secure secret key
            { expiresIn: "24h" }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
    }
};

// Forgot password - send OTP
export const forgotPassword = async (email) => {
    try {
        // Check if user exists
        const [users] = await database.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );
        if (users.length === 0) {
            throw new Error("User not found");
        }

        // Generate OTP
        const otp = await generateOTP(email);

        // Update user with new OTP
        await database.query(
            "UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE email = ?",
            [otp, new Date(Date.now() + 10 * 60 * 1000), email]
        );

        // Send OTP via email
        await sentOTP(email, otp);

        return { message: "Password reset OTP sent to your email" };
    } catch (error) {
        throw new Error(`Forgot password failed: ${error.message}`);
    }
};

// Reset password with OTP
export const resetPassword = async (email, otp, newPassword) => {
    try {
        // Validate new password
        if (!newPassword || newPassword.length < 6) {
            throw new Error("New password must be at least 6 characters long");
        }

        // Verify OTP
        const [users] = await database.query(
            "SELECT * FROM users WHERE email = ? AND otp_code = ? AND otp_expires_at > NOW()",
            [email, otp]
        );

        if (users.length === 0) {
            throw new Error("Invalid or expired OTP");
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear OTP
        await database.query(
            "UPDATE users SET password = ?, otp_code = NULL, otp_expires_at = NULL WHERE email = ?",
            [hashedPassword, email]
        );

        return { message: "Password reset successfully" };
    } catch (error) {
        throw new Error(`Password reset failed: ${error.message}`);
    }
};

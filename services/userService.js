import { database } from "../db/config.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userTableSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(), // Ensuring password security
    createdAt: Joi.date().default(() => new Date()),
});

// Register a new user
export const registerUser = async (userData) => {
    try {
        const { error } = userTableSchema.validate(userData);
        if (error) throw new Error(error.details[0].message);

        // Check if user exists
        const [existingUser] = await database.query(
            "SELECT id FROM user WHERE email = ?",
            [userData.email]
        );
        if (existingUser.length > 0) throw new Error("User already exists");

        // Hash password securely
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // Insert user into database
        const [result] = await database.query(
            "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
            [userData.name, userData.email, hashedPassword]
        );

        return {
            id: result.insertId,
            name: userData.name,
            email: userData.email,
        };
    } catch (error) {
        throw new Error(`User registration failed: ${error.message}`);
    }
};

// Login user
export const loginUser = async (email, password) => {
    try {
        // Find user by email
        const [users] = await database.query("SELECT * FROM user WHERE email = ?", [email]);
        if (users.length === 0) throw new Error("Invalid email or password");

        const user = users[0];

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

// Get user by ID
export const getUserById = async (userId) => {
    try {
        const [users] = await database.query(
            "SELECT id, name, email, createdAt FROM user WHERE id = ?",
            [userId]
        );
        if (users.length === 0) throw new Error("User not found");
        return users[0];
    } catch (error) {
        throw new Error(`User retrieval failed: ${error.message}`);
    }
};

// Update user (with secure query)
export const updateUser = async (userId, updateData) => {
    try {
        if (updateData.password) {
            const salt = await bcrypt.genSalt(12);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const allowedUpdates = ["name", "email", "password"];
        const updates = Object.keys(updateData)
            .filter((key) => allowedUpdates.includes(key))
            .map((key) => `${key} = ?`)
            .join(", ");

        if (!updates) throw new Error("No valid fields to update");

        const values = Object.keys(updateData)
            .filter((key) => allowedUpdates.includes(key))
            .map((key) => updateData[key]);

        values.push(userId);

        await database.query(`UPDATE user SET ${updates} WHERE id = ?`, values);
        return await getUserById(userId);
    } catch (error) {
        throw new Error(`User update failed: ${error.message}`);
    }
};

// Delete user
export const deleteUser = async (userId) => {
    try {
        const [result] = await database.query("DELETE FROM user WHERE id = ?", [userId]);
        if (result.affectedRows === 0) throw new Error("User not found");
        return { message: "User deleted successfully" };
    } catch (error) {
        throw new Error(`User deletion failed: ${error.message}`);
    }
};

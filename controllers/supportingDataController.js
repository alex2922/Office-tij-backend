import {
    addSupportingDataService,
    getAllSupportingDataService,
    getSupportingDataByIdService,
    updateSupportingDataService,
    deleteSupportingDataService
} from '../services/supportingDataService.js';
import Joi from 'joi';
import { authenticateToken } from '../middlewares/authMiddleware.js';

// Validation schema
const supportingDataSchema = Joi.object({
    type: Joi.string().trim().min(2).max(50).required(),
    value: Joi.string().trim().min(1).max(200).required(),
    description: Joi.string().trim().max(500).optional(),
    isActive: Joi.boolean().default(true)
});

// Add new supporting data
export const addSupportingData = async (req, res) => {
    try {
        // Validate request body
        const { error } = supportingDataSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await addSupportingDataService(req.body);
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);
    } catch (error) {
        console.error("Error in addSupportingData:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all supporting data
export const getAllSupportingData = async (req, res) => {
    try {
        const { type } = req.query; // Optional type filter
        const result = await getAllSupportingDataService(type);
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in getAllSupportingData:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get supporting data by ID
export const getSupportingDataById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Supporting Data ID is required"
            });
        }

        const result = await getSupportingDataByIdService(id);
        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in getSupportingDataById:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Update supporting data
export const updateSupportingData = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Supporting Data ID is required"
            });
        }

        // Validate request body
        const { error } = supportingDataSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await updateSupportingDataService(id, req.body);
        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in updateSupportingData:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete supporting data
export const deleteSupportingData = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Supporting Data ID is required"
            });
        }

        const result = await deleteSupportingDataService(id);
        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in deleteSupportingData:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

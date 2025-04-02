import {
    addMasterTableService,
    getAllMasterTableService,
    getMasterTableByIdService,
    updateMasterTableService,
    deleteMasterTableService
} from '../services/masterTableService.js';
import Joi from 'joi';
import { authenticateToken } from '../middlewares/authMiddleware.js';

// Validation schema
const masterTableSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    code: Joi.string().trim().min(2).max(50).required(),
    description: Joi.string().trim().max(500).optional(),
    parentId: Joi.number().integer().min(1).optional(),
    isActive: Joi.boolean().default(true),
    metadata: Joi.object().optional()
});

// Add new master table entry
export const addMasterTable = async (req, res) => {
    try {
        // Validate request body
        const { error } = masterTableSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await addMasterTableService(req.body);
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);
    } catch (error) {
        console.error("Error in addMasterTable:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all master table entries
export const getAllMasterTable = async (req, res) => {
    try {
        const { type, parentId } = req.query; // Optional filters
        const result = await getAllMasterTableService(type, parentId);
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in getAllMasterTable:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get master table entry by ID
export const getMasterTableById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Master Table ID is required"
            });
        }

        const result = await getMasterTableByIdService(id);
        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in getMasterTableById:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Update master table entry
export const updateMasterTable = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Master Table ID is required"
            });
        }

        // Validate request body
        const { error } = masterTableSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await updateMasterTableService(id, req.body);
        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in updateMasterTable:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete master table entry
export const deleteMasterTable = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Master Table ID is required"
            });
        }

        const result = await deleteMasterTableService(id);
        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in deleteMasterTable:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

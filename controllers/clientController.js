import {
    addClientService,
    getAllClientsService,
    getClientByIdService,
    updateClientService,
    deleteClientService
} from '../services/ClientService.js';
import Joi from 'joi';
import { authenticateToken } from '../middlewares/authMiddleware.js';

// Validation schema
const clientSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().email().trim().required(),
    contact: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required(),
    address: Joi.string().trim().min(5).max(200).required(),
    gstnum: Joi.string().trim().min(1).max(15).optional()
});

// Add new client
export const addClient = async (req, res) => {
    try {
        // Validate request body
        const { error } = clientSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await addClientService(req.body);
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);
    } catch (error) {
        console.error("Error in addClient:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all clients
export const getAllClients = async (req, res) => {
    try {
        const result = await getAllClientsService();
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in getAllClients:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get client by ID
export const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Client ID is required"
            });
        }

        const result = await getClientByIdService(id);
        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in getClientById:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Update client
export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Client ID is required"
            });
        }

        // Validate request body
        const { error } = clientSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await updateClientService(id, req.body);
        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in updateClient:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete client
export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Client ID is required"
            });
        }

        const result = await deleteClientService(id);
        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in deleteClient:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}; 
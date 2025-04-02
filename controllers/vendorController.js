import {
    addVendorService,
    getAllVendorsService,
    getVendorByIdService,
    updateVendorService,
    deleteVendorService
} from '../services/VendorService.js';
import Joi from 'joi';

// Validation schema
const vendorSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().email().trim().required(),
    contact: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required(),
    gstnum: Joi.string().trim().min(1).max(15).optional()
});

// Add new vendor
export const addVendor = async (req, res) => {
    try {
        // Validate request body
        const { error } = vendorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await addVendorService(req.body);
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);
    } catch (error) {
        console.error("Error in addVendor:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all vendors
export const getAllVendors = async (req, res) => {
    try {
        const result = await getAllVendorsService();
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in getAllVendors:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get vendor by ID
export const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Vendor ID is required"
            });
        }

        const result = await getVendorByIdService(id);
        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in getVendorById:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Update vendor
export const updateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Vendor ID is required"
            });
        }

        // Validate request body
        const { error } = vendorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await updateVendorService(id, req.body);
        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in updateVendor:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete vendor
export const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Vendor ID is required"
            });
        }

        const result = await deleteVendorService(id);
        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in deleteVendor:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

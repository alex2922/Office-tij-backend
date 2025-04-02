import express from 'express';
import {
    addVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor
} from '../controllers/vendorController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All vendor routes require authentication
router.use(authenticateToken);

// CRUD routes for vendors
router.post('/', addVendor);
router.get('/', getAllVendors);
router.get('/:id', getVendorById);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);

export default router; 
import express from 'express';
import {
    addSupportingData,
    getAllSupportingData,
    getSupportingDataById,
    updateSupportingData,
    deleteSupportingData
} from '../controllers/supportingDataController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All supporting data routes require authentication
router.use(authenticateToken);

// CRUD routes for supporting data
router.post('/', addSupportingData);
router.get('/', getAllSupportingData);
router.get('/:id', getSupportingDataById);
router.put('/:id', updateSupportingData);
router.delete('/:id', deleteSupportingData);

export default router; 
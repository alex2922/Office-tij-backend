import express from 'express';
import {
    addMasterTable,
    getAllMasterTable,
    getMasterTableById,
    updateMasterTable,
    deleteMasterTable
} from '../controllers/masterTableController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All master table routes require authentication
router.use(authenticateToken);

// CRUD routes for master table
router.post('/', addMasterTable);
router.get('/', getAllMasterTable);
router.get('/:id', getMasterTableById);
router.put('/:id', updateMasterTable);
router.delete('/:id', deleteMasterTable);

export default router; 
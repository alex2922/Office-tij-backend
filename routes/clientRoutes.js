import express from 'express';
import {
    addClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient
} from '../controllers/clientController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All client routes require authentication
router.use(authenticateToken);

// CRUD routes for clients
router.post('/', addClient);
router.get('/', getAllClients);
router.get('/:id', getClientById);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router; 
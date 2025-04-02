import { pool } from '../config/database.js';

// Add new client
export const addClientService = async (clientData) => {
    try {
        const { name, email, contact, address, gstnum } = clientData;
        
        const query = `
            INSERT INTO clients (name, email, contact, address, gstnum)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        
        const values = [name, email, contact, address, gstnum];
        const result = await pool.query(query, values);
        
        return {
            success: true,
            data: result.rows[0],
            message: "Client added successfully"
        };
    } catch (error) {
        console.error("Error in addClientService:", error);
        return {
            success: false,
            message: "Failed to add client",
            error: error.message
        };
    }
};

// Get all clients
export const getAllClientsService = async () => {
    try {
        const query = "SELECT * FROM clients ORDER BY created_at DESC";
        const result = await pool.query(query);
        
        return {
            success: true,
            data: result.rows,
            message: "Clients retrieved successfully"
        };
    } catch (error) {
        console.error("Error in getAllClientsService:", error);
        return {
            success: false,
            message: "Failed to retrieve clients",
            error: error.message
        };
    }
};

// Get client by ID
export const getClientByIdService = async (id) => {
    try {
        const query = "SELECT * FROM clients WHERE id = $1";
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return {
                success: false,
                message: "Client not found"
            };
        }
        
        return {
            success: true,
            data: result.rows[0],
            message: "Client retrieved successfully"
        };
    } catch (error) {
        console.error("Error in getClientByIdService:", error);
        return {
            success: false,
            message: "Failed to retrieve client",
            error: error.message
        };
    }
};

// Update client
export const updateClientService = async (id, clientData) => {
    try {
        const { name, email, contact, address, gstnum } = clientData;
        
        const query = `
            UPDATE clients 
            SET name = $1, email = $2, contact = $3, address = $4, gstnum = $5, updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *
        `;
        
        const values = [name, email, contact, address, gstnum, id];
        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return {
                success: false,
                message: "Client not found"
            };
        }
        
        return {
            success: true,
            data: result.rows[0],
            message: "Client updated successfully"
        };
    } catch (error) {
        console.error("Error in updateClientService:", error);
        return {
            success: false,
            message: "Failed to update client",
            error: error.message
        };
    }
};

// Delete client
export const deleteClientService = async (id) => {
    try {
        const query = "DELETE FROM clients WHERE id = $1 RETURNING *";
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return {
                success: false,
                message: "Client not found"
            };
        }
        
        return {
            success: true,
            data: result.rows[0],
            message: "Client deleted successfully"
        };
    } catch (error) {
        console.error("Error in deleteClientService:", error);
        return {
            success: false,
            message: "Failed to delete client",
            error: error.message
        };
    }
}; 
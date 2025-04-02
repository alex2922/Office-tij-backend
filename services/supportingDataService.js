import { pool } from '../config/database.js';

// Add new supporting data
export const addSupportingDataService = async (data) => {
    try {
        const { type, value, description, isActive } = data;
        
        const query = `
            INSERT INTO supporting_data (type, value, description, is_active)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        
        const values = [type, value, description, isActive];
        const result = await pool.query(query, values);
        
        return {
            success: true,
            data: result.rows[0],
            message: "Supporting data added successfully"
        };
    } catch (error) {
        console.error("Error in addSupportingDataService:", error);
        return {
            success: false,
            message: "Failed to add supporting data",
            error: error.message
        };
    }
};

// Get all supporting data
export const getAllSupportingDataService = async (type = null) => {
    try {
        let query = "SELECT * FROM supporting_data";
        let values = [];
        
        if (type) {
            query += " WHERE type = $1";
            values.push(type);
        }
        
        query += " ORDER BY type, value ASC";
        const result = await pool.query(query, values);
        
        return {
            success: true,
            data: result.rows,
            message: "Supporting data retrieved successfully"
        };
    } catch (error) {
        console.error("Error in getAllSupportingDataService:", error);
        return {
            success: false,
            message: "Failed to retrieve supporting data",
            error: error.message
        };
    }
};

// Get supporting data by ID
export const getSupportingDataByIdService = async (id) => {
    try {
        const query = "SELECT * FROM supporting_data WHERE id = $1";
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return {
                success: false,
                message: "Supporting data not found"
            };
        }
        
        return {
            success: true,
            data: result.rows[0],
            message: "Supporting data retrieved successfully"
        };
    } catch (error) {
        console.error("Error in getSupportingDataByIdService:", error);
        return {
            success: false,
            message: "Failed to retrieve supporting data",
            error: error.message
        };
    }
};

// Update supporting data
export const updateSupportingDataService = async (id, data) => {
    try {
        const { type, value, description, isActive } = data;
        
        const query = `
            UPDATE supporting_data 
            SET type = $1, value = $2, description = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *
        `;
        
        const values = [type, value, description, isActive, id];
        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return {
                success: false,
                message: "Supporting data not found"
            };
        }
        
        return {
            success: true,
            data: result.rows[0],
            message: "Supporting data updated successfully"
        };
    } catch (error) {
        console.error("Error in updateSupportingDataService:", error);
        return {
            success: false,
            message: "Failed to update supporting data",
            error: error.message
        };
    }
};

// Delete supporting data
export const deleteSupportingDataService = async (id) => {
    try {
        const query = "DELETE FROM supporting_data WHERE id = $1 RETURNING *";
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return {
                success: false,
                message: "Supporting data not found"
            };
        }
        
        return {
            success: true,
            data: result.rows[0],
            message: "Supporting data deleted successfully"
        };
    } catch (error) {
        console.error("Error in deleteSupportingDataService:", error);
        return {
            success: false,
            message: "Failed to delete supporting data",
            error: error.message
        };
    }
};

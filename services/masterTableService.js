import { pool } from '../config/database.js';
import Joi from "joi"; // Validation library

// ✅ Define a schema for validation
const masterTableSchema = Joi.object({
    status: Joi.string().required(),
    invoiceNum: Joi.string().required(),
    dateofBooking: Joi.date().required(),
    dateOfJourney: Joi.date().required(),
    modeOfPayment: Joi.string().required(),
    service: Joi.string().required(),
    description: Joi.string().optional(),
    PNR: Joi.string().optional(),
    systemRef: Joi.string().required(),
    vendor: Joi.string().required(),
    vendorGST: Joi.string().required(),
    depCity: Joi.string().optional(),
    arrCity: Joi.string().optional(),
    passengerName: Joi.string().required(),
    paymentParty: Joi.string().required(),
    paymentPartyGST: Joi.string().optional(),
    netAmount: Joi.number().precision(2).required(),
    markup: Joi.number().precision(2).required(),
    gst: Joi.number().precision(2).required(),
    totalAmount: Joi.number().precision(2).required(),
    modeOfPaymentForClient: Joi.string().required(),
    amount: Joi.number().precision(2).required(),
    refundDate: Joi.date().optional(),
    refundAmount: Joi.number().precision(2).optional(),
    cancelCharge: Joi.number().precision(2).optional(),
    refundMode: Joi.string().optional()
});

// ✅ Service function to add a master table entry
export const addMasterTableService = async (data) => {
    try {
        const { name, code, description, parentId, isActive, metadata } = data;
        
        const query = `
            INSERT INTO master_table (name, code, description, parent_id, is_active, metadata)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const values = [name, code, description, parentId, isActive, metadata];
        const result = await pool.query(query, values);
        
        return {
            success: true,
            data: result.rows[0],
            message: "Master table entry added successfully"
        };
    } catch (error) {
        console.error("Error in addMasterTableService:", error);
        return {
            success: false,
            message: "Failed to add master table entry",
            error: error.message
        };
    }
};

// Get all master table entries
export const getAllMasterTableService = async (type = null, parentId = null) => {
    try {
        let query = "SELECT * FROM master_table";
        let values = [];
        let conditions = [];
        
        if (type) {
            conditions.push("type = $" + (values.length + 1));
            values.push(type);
        }
        
        if (parentId) {
            conditions.push("parent_id = $" + (values.length + 1));
            values.push(parentId);
        }
        
        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }
        
        query += " ORDER BY name ASC";
        const result = await pool.query(query, values);
        
        return {
            success: true,
            data: result.rows,
            message: "Master table entries retrieved successfully"
        };
    } catch (error) {
        console.error("Error in getAllMasterTableService:", error);
        return {
            success: false,
            message: "Failed to retrieve master table entries",
            error: error.message
        };
    }
};

// Get master table entry by ID
export const getMasterTableByIdService = async (id) => {
    try {
        const query = "SELECT * FROM master_table WHERE id = $1";
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return {
                success: false,
                message: "Master table entry not found"
            };
        }
        
        return {
            success: true,
            data: result.rows[0],
            message: "Master table entry retrieved successfully"
        };
    } catch (error) {
        console.error("Error in getMasterTableByIdService:", error);
        return {
            success: false,
            message: "Failed to retrieve master table entry",
            error: error.message
        };
    }
};

// Update master table entry
export const updateMasterTableService = async (id, data) => {
    try {
        const { name, code, description, parentId, isActive, metadata } = data;
        
        const query = `
            UPDATE master_table 
            SET name = $1, code = $2, description = $3, parent_id = $4, 
                is_active = $5, metadata = $6, updated_at = CURRENT_TIMESTAMP
            WHERE id = $7
            RETURNING *
        `;
        
        const values = [name, code, description, parentId, isActive, metadata, id];
        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return {
                success: false,
                message: "Master table entry not found"
            };
        }
        
        return {
            success: true,
            data: result.rows[0],
            message: "Master table entry updated successfully"
        };
    } catch (error) {
        console.error("Error in updateMasterTableService:", error);
        return {
            success: false,
            message: "Failed to update master table entry",
            error: error.message
        };
    }
};

// Delete master table entry
export const deleteMasterTableService = async (id) => {
    try {
        // First check if there are any child entries
        const checkQuery = "SELECT COUNT(*) FROM master_table WHERE parent_id = $1";
        const checkResult = await pool.query(checkQuery, [id]);
        
        if (checkResult.rows[0].count > 0) {
            return {
                success: false,
                message: "Cannot delete master table entry with child entries"
            };
        }
        
        const query = "DELETE FROM master_table WHERE id = $1 RETURNING *";
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return {
                success: false,
                message: "Master table entry not found"
            };
        }
        
        return {
            success: true,
            data: result.rows[0],
            message: "Master table entry deleted successfully"
        };
    } catch (error) {
        console.error("Error in deleteMasterTableService:", error);
        return {
            success: false,
            message: "Failed to delete master table entry",
            error: error.message
        };
    }
};

export const getFilteredMasterTableService = async (filters) => {
    try {
        let query = `SELECT * FROM masterTable WHERE 1=1`;
        const values = [];

        // Dynamically add filters based on available fields
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                query += ` AND ${key} = ?`;
                values.push(value);
            }
        });

        query += ` ORDER BY dateofBooking DESC`;

        const [results] = await pool.query(query, values);

        return {
            success: true,
            message: "Filtered master table entries retrieved successfully",
            data: results.rows
        };
    } catch (error) {
        console.error("Error in getFilteredMasterTableService:", error);
        return {
            success: false,
            message: "Failed to retrieve filtered master table entries",
            error: error.message
        };
    }
};






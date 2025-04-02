import { database } from "../db/config.js";
import Joi from "joi";

const vendorTableSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().email().trim().required(),
    contact: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required(),
    gstnum: Joi.string().trim().min(1).max(15).optional(), 
});


export const addVendorService = async (data) => {
    try {
        const {error, value} = vendorTableSchema.validate(data);
        if(error){
            throw new Error(`Validation Error: ${error.details.map(d => d.message).join(', ')}`);
        }
        const query = `INSERT INTO vendors (name, email, contact, gstnum) VALUES (?, ?, ?, ?)`;
        const values = [value.name, value.email, value.contact, value.gstnum];
        const [results] = await database.query(query, values);

        return {
            success: true,
            message: "Vendor added successfully",
            data: {id: results.insertId}
        }
    } catch (error) {
        console.error("Error in addVendorService:", error);
        return {
            success: false,
            message: "Failed to add vendor",
            error: error.message
        }
    }
}


export const getAllVendorsService = async () => {
    try {
        const query = `SELECT * FROM vendors`;
        const [results] = await database.query(query);
        return {
            success: true,
            message: "Vendors fetched successfully",
            data: results
        }
    } catch (error) {
        console.error("Error in getAllVendorsService:", error);
        return {
            success: false,
            message: "Failed to fetch vendors",
            error: error.message
        }
    }
}


export const getVendorByIdService = async (id) => {
    try {
        const query = `SELECT * FROM vendors WHERE id = ?`;
        const [results] = await database.query(query, [id]);
        if(results.length === 0){
            throw new Error("Vendor not found");
        }
        return {
            success: true,
            message: "Vendor fetched successfully",
            data: results[0]
        }
    } catch (error) {
        console.error("Error in getVendorByIdService:", error);
        return {
            success: false,
            message: "Failed to fetch vendor",
            error: error.message
        }
    }
}


export const updateVendorService = async (id, data) => {
    try {
        const { error, value } = vendorTableSchema.validate(data);
        if (error) {
            throw new Error(`Validation Error: ${error.details.map(d => d.message).join(', ')}`);
        }

        const query = `UPDATE vendors SET name = ?, email = ?, contact = ?, gstnum = ? WHERE id = ?`;
        const values = [value.name, value.email, value.contact, value.gstnum, id];
        const [results] = await database.query(query, values);

        if (results.affectedRows === 0) {
            return {
                success: false,
                message: "Vendor not found or no changes made",
            };
        }

        return {
            success: true,
            message: "Vendor updated successfully",
        };
    } catch (error) {
        console.error("Error in updateVendorService:", error);
        return {
            success: false,
            message: error.message || "Failed to update vendor",
        };
    }
};


export const deleteVendorService = async (id) => {
    try {
        const query = `DELETE FROM vendors WHERE id = ?`;
        const [results] = await database.query(query, [id]);

        if (results.affectedRows === 0) {
            return {
                success: false,
                message: "Vendor not found",
            };
        }

        return {
            success: true,
            message: "Vendor deleted successfully",
        };
    } catch (error) {
        console.error("Error in deleteVendorService:", error);
        return {
            success: false,
            message: error.message || "Failed to delete vendor",
        };
    }
};


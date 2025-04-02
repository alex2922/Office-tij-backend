import { database } from "../db/config.js";
import Joi from "joi";

const vendorTableSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    contact: Joi.string().required(),
    gstnum: Joi.string().optional(),
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
        const {error, value} = vendorTableSchema.validate(data);
        if(error){
            throw new Error(`Validation Error: ${error.details.map(d => d.message).join(', ')}`);
        }
        const query = `UPDATE vendors SET name = ?, email = ?, contact = ?, gstnum = ? WHERE id = ?`;
        const values = [value.name, value.email, value.contact, value.gstnum, id];
        const [results] = await database.query(query, values);
        if(results.affectedRows === 0){
            throw new Error("Vendor not found");
        }
        return {
            success: true,
            message: "Vendor updated successfully",
            data: {id: results.insertId}
        }
    } catch (error) {
        console.error("Error in updateVendorService:", error);
        return {
            success: false,
            message: "Failed to update vendor",
            error: error.message
        }
    }
}

export const deleteVendorService = async (id) => {
    try {
        const query = `DELETE FROM vendors WHERE id = ?`;
        const [results] = await database.query(query, [id]);
        if(results.affectedRows === 0){
            throw new Error("Vendor not found");
        }
        return {
            success: true,
            message: "Vendor deleted successfully",
            data: {id: results.insertId}
        }
    } catch (error) {
        console.error("Error in deleteVendorService:", error);
        return {
            success: false,
            message: "Failed to delete vendor",
            error: error.message
        }
    }
}

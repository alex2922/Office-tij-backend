import { database } from "../db/config.js";
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
        // ✅ Validate input data
        const { error, value } = masterTableSchema.validate(data);
        if (error) {
            throw new Error(`Validation Error: ${error.details.map(d => d.message).join(', ')}`);
        }

        // ✅ SQL Query
        const query = `INSERT INTO masterTable (
            status, invoiceNum, dateofBooking, dateOfJourney, modeOfPayment, service,
            description, PNR, systemRef, vendor, vendorGST, depCity, arrCity, passengerName, 
            paymentParty, paymentPartyGST, netAmount, markup, gst, totalAmount, 
            modeOfPaymentForClient, amount, refundDate, refundAmount, cancelCharge, refundMode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // ✅ Extract values safely
        const values = [
            value.status, value.invoiceNum, value.dateofBooking, value.dateOfJourney,
            value.modeOfPayment, value.service, value.description, value.PNR, value.systemRef,
            value.vendor, value.vendorGST, value.depCity, value.arrCity, value.passengerName,
            value.paymentParty, value.paymentPartyGST, value.netAmount, value.markup, value.gst,
            value.totalAmount, value.modeOfPaymentForClient, value.amount, value.refundDate,
            value.refundAmount, value.cancelCharge, value.refundMode
        ];

        // ✅ Execute Query
        const [result] = await database.query(query, values);

        return {
            success: true,
            message: "Master table entry added successfully",
            data: { id: result.insertId }
        };
    } catch (error) {
        console.error("Error in addMasterTableService:", error);
        return {
            success: false,
            message: "Master table entry addition failed",
            error: error.message
        };
    }
};



export const getAllMasterTableService = async () => {
    try {
        const query = `SELECT * FROM masterTable ORDER BY dateofBooking DESC`;
        const [results] = await database.query(query);
        
        return {
            success: true,
            message: "Master table entries retrieved successfully",
            data: results
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


export const getMasterTableByIdService = async (id) => {
    try {
        const query = `SELECT * FROM masterTable WHERE id = ?`;
        const [results] = await database.query(query, [id]);
        
        if (results.length === 0) {
            return {
                success: false,
                message: "Master table entry not found"
            };
        }

        return {
            success: true,
            message: "Master table entry retrieved successfully",
            data: results[0]
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


export const updateMasterTableService = async (id, data) => {
    try {
        // Validate input data
        const { error, value } = masterTableSchema.validate(data);
        if (error) {
            throw new Error(`Validation Error: ${error.details.map(d => d.message).join(', ')}`);
        }

        const query = `UPDATE masterTable SET 
            status = ?, invoiceNum = ?, dateofBooking = ?, dateOfJourney = ?, 
            modeOfPayment = ?, service = ?, description = ?, PNR = ?, 
            systemRef = ?, vendor = ?, vendorGST = ?, depCity = ?, 
            arrCity = ?, passengerName = ?, paymentParty = ?, paymentPartyGST = ?, 
            netAmount = ?, markup = ?, gst = ?, totalAmount = ?, 
            modeOfPaymentForClient = ?, amount = ?, refundDate = ?, 
            refundAmount = ?, cancelCharge = ?, refundMode = ?
            WHERE id = ?`;

        const values = [
            value.status, value.invoiceNum, value.dateofBooking, value.dateOfJourney,
            value.modeOfPayment, value.service, value.description, value.PNR, 
            value.systemRef, value.vendor, value.vendorGST, value.depCity, 
            value.arrCity, value.passengerName, value.paymentParty, value.paymentPartyGST,
            value.netAmount, value.markup, value.gst, value.totalAmount,
            value.modeOfPaymentForClient, value.amount, value.refundDate,
            value.refundAmount, value.cancelCharge, value.refundMode, id
        ];

        const [result] = await database.query(query, values);

        if (result.affectedRows === 0) {
            return {
                success: false,
                message: "Master table entry not found"
            };
        }

        return {
            success: true,
            message: "Master table entry updated successfully",
            data: { id }
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


export const deleteMasterTableService = async (id) => {
    try {
        const query = `DELETE FROM masterTable WHERE id = ?`;
        const [result] = await database.query(query, [id]);

        if (result.affectedRows === 0) {
            return {
                success: false,
                message: "Master table entry not found"
            };
        }

        return {
            success: true,
            message: "Master table entry deleted successfully",
            data: { id }
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

        const [results] = await database.query(query, values);

        return {
            success: true,
            message: "Filtered master table entries retrieved successfully",
            data: results
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






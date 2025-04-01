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
    description: Joi.string().required(),
    PNR: Joi.string().required(),
    systemRef: Joi.string().required(),
    vendor: Joi.string().required(),
    vendorGST: Joi.string().required(),
    depCity: Joi.string().required(),
    arrCity: Joi.string().required(),
    passengerName: Joi.string().required(),
    paymentParty: Joi.string().required(),
    paymentPartyGST: Joi.string().required(),
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

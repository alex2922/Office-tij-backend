import express from "express";
import { database } from "../db/config.js";
import { invoiceNumber } from "../middleware/newInvoiceNum.js";

export const master = express.Router();

master.post("/add", async (req, res) => {
  try {
    const prefix = await invoiceNumber();

    const [rows] = await database.query(
      `SELECT invoiceNum FROM masterTable 
       WHERE invoiceNum LIKE '${prefix}/%' 
       ORDER BY invoiceNum DESC LIMIT 1`
    );

    let nextInvoiceNum;

    if (rows.length === 0) {
      // No invoice for this financial year, start at 001
      nextInvoiceNum = `${prefix}/001`;
    } else {
      const latestInvoice = rows[0].invoiceNum;
      const lastNumber = parseInt(latestInvoice.split("/")[1]); // Extract number part
      const newNumber = String(lastNumber + 1).padStart(3, "0");
      nextInvoiceNum = `${prefix}/${newNumber}`;
    }

    console.log("Next Invoice Number:", nextInvoiceNum);
    const {
      status,
      dateofBooking,
      dateOfJourney,
      modeOfPayment,
      service,
      description,
      PNR,
      systemRef,
      vendor,
      vendorGST,
      depCity,
      arrCity,
      passengerName,
      paymentParty,
      paymentPartyGST,
      netAmount,
      markup,
      gst,
      totalAmount,
      modeOfPaymentForClient,
      paymentdatebyclient,
      paymenamtbyclient,
      amount,
      refundDate,
      refundAmount,
      cancelCharge,
      refundMode,
    } = req.body;

    if (
      !status ||
      !dateofBooking ||
      !dateOfJourney ||
    
      !modeOfPayment ||
      !service ||
      !systemRef ||
      !vendor ||
      !passengerName ||

      !netAmount ||
      !markup ||
      !totalAmount ||
      !amount
    ) {
      return res.status(401).json({
        message: "all fileds are required",
      });
    }

    await database.query(
      `INSERT INTO masterTable (status,
      invoiceNum,
      dateofBooking,
      dateOfJourney,
      modeOfPayment,
      service,
      description,
      PNR,
      systemRef,
      vendor,
      vendorGST,
      depCity,
      arrCity,
      passengerName,
      paymentParty,
      paymentPartyGST,
      netAmount,
      markup,
      gst,
      totalAmount,
      modeOfPaymentForClient,
        paymentdatebyclient,
      paymenamtbyclient,
      amount,
      refundDate,
      refundAmount,
      cancelCharge,
      refundMode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        status,
        nextInvoiceNum,
        dateofBooking,
        dateOfJourney,
        modeOfPayment,
        service,
        description,
        PNR,
        systemRef,
        vendor,
        vendorGST,
        depCity,
        arrCity,
        passengerName,
        paymentParty,
        paymentPartyGST,
        netAmount,
        markup,
        gst,
        totalAmount,
        modeOfPaymentForClient,
        paymentdatebyclient,
        paymenamtbyclient,
        amount,
        refundDate,
        refundAmount,
        cancelCharge,
        refundMode,
      ]
    );

    return res.status(201).json({
      message: "client added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});


master.post("/addInvoice", async (req,res)=>{
  try {

    const {
      status,
      invoiceNum,
      dateofBooking,
      dateOfJourney,
      modeOfPayment,
      service,
      description,
      PNR,
      systemRef,
      vendor,
      vendorGST,
      depCity,
      arrCity,
      passengerName,
      paymentParty,
      paymentPartyGST,
      netAmount,
      markup,
      gst,
      totalAmount,
      modeOfPaymentForClient,
      paymentdatebyclient,
      paymenamtbyclient,
      amount,
      refundDate,
      refundAmount,
      cancelCharge,
      refundMode,
    } = req.body;

    if (
      !status ||
      !invoiceNum||
      !dateofBooking ||
      !dateOfJourney ||
      !dateofBooking ||
      !modeOfPayment ||
      !service ||
      !systemRef ||
      !vendor ||
      !passengerName ||
      !paymentParty ||
      !netAmount ||
      !markup ||
      !totalAmount ||
      !amount
    ) {
      return res.status(401).json({
        message: "all fileds are required",
      });
    }

    await database.query(
      `INSERT INTO masterTable (status,
      invoiceNum,
      dateofBooking,
      dateOfJourney,
      modeOfPayment,
      service,
      description,
      PNR,
      systemRef,
      vendor,
      vendorGST,
      depCity,
      arrCity,
      passengerName,
      paymentParty,
      paymentPartyGST,
      netAmount,
      markup,
      gst,
      totalAmount,
      modeOfPaymentForClient,
        paymentdatebyclient,
      paymenamtbyclient,
      amount,
      refundDate,
      refundAmount,
      cancelCharge,
      refundMode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        status,
        invoiceNum,
        dateofBooking,
        dateOfJourney,
        modeOfPayment,
        service,
        description,
        PNR,
        systemRef,
        vendor,
        vendorGST,
        depCity,
        arrCity,
        passengerName,
        paymentParty,
        paymentPartyGST,
        netAmount,
        markup,
        gst,
        totalAmount,
        modeOfPaymentForClient,
        paymentdatebyclient,
        paymenamtbyclient,
        amount,
        refundDate,
        refundAmount,
        cancelCharge,
        refundMode,
      ]
    );

    return res.status(201).json({
      message: "client added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
})

master.get("/getAllMasterData", async (req, res) => {
  try {

    const [latestInoviceNumber] = await database.query(`SELECT invoiceNum FROM masterTable ORDER BY invoiceNum DESC LIMIT 1`);

    const [response] = await database.query(`SELECT * FROM masterTable`);

    return res.status(200).json({
      message: "success",
      data: response,
      latestInovice : latestInoviceNumber[0].invoiceNum
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

master.put("/editMasterData", async (req, res) => {
  try {
    const { masterId } = req.query;
    const {
      status,
      invoiceNum,
      dateofBooking,
      dateOfJourney,
      modeOfPayment,
      service,
      description,
      PNR,
      systemRef,
      vendor,
      vendorGST,
      depCity,
      arrCity,
      passengerName,
      paymentParty,
      paymentPartyGST,
      netAmount,
      markup,
      gst,
      totalAmount,
      modeOfPaymentForClient,
      paymentdatebyclient,
      paymenamtbyclient,
      amount,
      refundDate,
      refundAmount,
      cancelCharge,
      refundMode,
    } = req.body;

    if (!masterId) {
      return res.status(401).json({
        message: "masterId is required",
      });
    }

    if (
      !status ||
      !dateofBooking ||
      !invoiceNum ||
      !dateOfJourney ||
      !modeOfPayment ||
      !service ||
      !systemRef ||
      !vendor ||
      !passengerName ||
      !netAmount ||
      !markup ||
      !totalAmount ||
      !amount
    ) {
      return res.status(401).json({
        message: "all fileds are required",
      });
    }

    const response = await database.query(
      `UPDATE masterTable SET status=?,
      invoiceNum=?,
      dateofBooking=?,
      dateOfJourney=?,
      modeOfPayment=?,
      service=?,
      description=?,
      PNR=?,
      systemRef=?,
      vendor=?,
      vendorGST=?,
      depCity=?,
      arrCity=?,
      passengerName=?,
      paymentParty=?,
      paymentPartyGST=?,
      netAmount=?,
      markup=?,
      gst=?,
      totalAmount=?,
      modeOfPaymentForClient=?,
        paymentdatebyclient=?,
      paymenamtbyclient=?,
      amount=?,
      refundDate=?,
      refundAmount=?,
      cancelCharge=?,
      refundMode=? WHERE id=?`,
      [
        status,
        invoiceNum,
        dateofBooking,
        dateOfJourney,
        modeOfPayment,
        service,
        description,
        PNR,
        systemRef,
        vendor,
        vendorGST,
        depCity,
        arrCity,
        passengerName,
        paymentParty,
        paymentPartyGST,
        netAmount,
        markup,
        gst,
        totalAmount,
        modeOfPaymentForClient,
        paymentdatebyclient,
        paymenamtbyclient,
        amount,
        refundDate,
        refundAmount,
        cancelCharge,
        refundMode,
        masterId,
      ]
    );

    return res.status(201).json({
      message: "master data updated successfully",
      // data: response[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

master.delete("/deleteMasterData", async (req, res) => {
  try {
    const { masterId } = req.query;

    const [response] = await database.query(
      `DELETE FROM masterTable WHERE id =?`,
      [masterId]
    );
    return res.status(201).json({
      message: "deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

master.get("/getmasterDatabyid", async (req, res) => {
  try {
    const { masterId } = req.query;

    if (!masterId) {
      return res.status(401).json({
        message: "masterId is required",
      });
    }

    const [response] = await database.query(
      `SELECT * FROM masterTable WHERE id=?`,
      [masterId]
    );

    if (response.length === 0) {
      return res.status(401).json({
        message: "master data not found",
      });
    }

    return res.status(201).json({
      message: "success",
      data: response[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

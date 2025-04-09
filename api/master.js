import express from "express";
import { database } from "../db/config.js";

export const master = express.Router();

master.post("/add", async (req, res) => {
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
      amount,
      refundDate,
      refundAmount,
      cancelCharge,
      refundMode,
    } = req.body;

    if (
      !status ||
      !dateofBooking ||
      !invoiceNum ||
      !dateOfJourney ||
      !dateofBooking ||
      !modeOfPayment ||
      !service ||
      !systemRef ||
      !vendor ||
      !vendorGST ||
      !passengerName ||
      !paymentParty ||
      !netAmount ||
      !markup ||
      !gst ||
      !totalAmount ||
      !modeOfPaymentForClient ||
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
      amount,
      refundDate,
      refundAmount,
      cancelCharge,
      refundMode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [status,
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
        amount,
        refundDate,
        refundAmount,
        cancelCharge,
        refundMode]
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

master.get("/getAllMasterData", async (req, res) => {
  try {
    const [response] = await database.query(`SELECT * FROM masterTable`);

    return res.status(200).json({
      message: "success",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

master.get("/getmasterDataById", async (req, res) => {
  try {
    const { masterId } = req.query;

    if (!masterId) {
      return res.status(401).json({
        message: "clientId is required",
      });
    }

    const [response] = await database.query(
      `SELECT * FROM masterTable WHERE id=?`,
      [masterId]
    );

    return res.status(200).json({
      message: "success",
      data: response[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

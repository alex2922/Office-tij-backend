import express from "express";
import { database } from "../db/config.js";
import { invoiceNumber } from "../middleware/newInvoiceNum.js";
import fs from "fs";
import csv from "csv-parser";
import upload from "../multer.js";

export const master = express.Router();

master.post(
  "/add",
  upload.fields([
    {
      name: "ticket",
      maxCount: 1,
    },
    {
      name: "boardingPass",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      let connection;

      connection = await database.getConnection();

      await connection.beginTransaction();
      const parsedData = JSON.parse(req.body.parsedData);
      const {
        status,
        invoiceNum,
        dateofBooking,
        dateOfJourney,
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
        travelType,
        netAmount,
        markup,
        gst,
        totalAmount,
        modeOfPayment,
        modeOfPaymentForClient,
        paymentdatebyclient,
        paymenamtbyclient,
        refundDate,
        refundAmount,
        cancelCharge,
        refundMode,
      } = parsedData;

      const ticket =
        `https://diwise.cloud/tij-invoice/${req.files?.ticket?.[0]?.filename}` ||
        null;
      const boardingPass =
        `https://diwise.cloud/tij-invoice/${req.files?.boardingPass?.[0]?.filename}` ||
        null;

      if (
        !status ||
        !dateofBooking ||
        !dateOfJourney ||
        !service ||
        !systemRef ||
        !vendor ||
        !passengerName ||
        !netAmount ||
        !markup ||
        !totalAmount
      ) {
        return res.status(401).json({
          message: "all fileds are required",
        });
      }

      const [response] = await connection.query(
        `INSERT INTO masterTable (status,
      invoiceNum,
      dateofBooking,
      dateOfJourney,
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
      travelType,
      netAmount,
      markup,
      gst,
      totalAmount,
      modeOfPayment,
      modeOfPaymentForClient,
      paymentdatebyclient,
      paymenamtbyclient,
      refundDate,
      refundAmount,
      cancelCharge,
      refundMode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          status,
          invoiceNum,
          dateofBooking,
          dateOfJourney,
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
          travelType,
          netAmount,
          markup,
          gst,
          totalAmount,
          modeOfPayment,
          modeOfPaymentForClient,
          paymentdatebyclient,
          paymenamtbyclient,

          refundDate,
          refundAmount,
          cancelCharge,
          refundMode,
        ]
      );

      const imageQuery = `INSERT INTO documents (masterId,ticket,boardingPass) VALUES (?,?,?)`;
      const values = [response.insertId, ticket, boardingPass];

      await connection.query(imageQuery, values);
      await connection.commit();
      connection.release();

      return res.status(201).json({
        message: "client added successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
);

master.post("/addInvoice", async (req, res) => {
  try {
    let connection;

    connection = await database.getConnection();

    await connection.beginTransaction();

    const parsedData = JSON.parse(req.body.parsedData);

    const {
      status,
      invoiceNum,
      dateofBooking,
      dateOfJourney,

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
      travelType,
      netAmount,
      markup,
      gst,
      totalAmount,
      modeOfPayment,
      modeOfPaymentForClient,
      paymentdatebyclient,
      paymenamtbyclient,

      refundDate,
      refundAmount,
      cancelCharge,
      refundMode,
    } = parsedData;

    if (
      !status ||
      !invoiceNum ||
      !dateofBooking ||
      !dateOfJourney ||
      !service ||
      !systemRef ||
      !vendor ||
      !passengerName ||
      !netAmount ||
      !markup ||
      !totalAmount
    ) {
      return res.status(401).json({
        message: "all fileds are required",
      });
    }

    const ticket =
      `https://diwise.cloud/tij-invoice/${req.files?.ticket?.[0]?.filename}` ||
      null;
    const boardingPass =
      `https://diwise.cloud/tij-invoice/${req.files?.boardingPass?.[0]?.filename}` ||
      null;

    const [response] = await database.query(
      `INSERT INTO masterTable (status,
      invoiceNum,
      dateofBooking,
      dateOfJourney,

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
      travelType,
      netAmount,
      markup,
      gst,
      totalAmount,
      modeOfPayment,
      modeOfPaymentForClient,
        paymentdatebyclient,
      paymenamtbyclient,
 
      refundDate,
      refundAmount,
      cancelCharge,
      refundMode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        status,
        invoiceNum,
        dateofBooking,
        dateOfJourney,

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
        travelType,
        netAmount,
        markup,
        gst,
        totalAmount,
        modeOfPayment,
        modeOfPaymentForClient,
        paymentdatebyclient,
        paymenamtbyclient,

        refundDate,
        refundAmount,
        cancelCharge,
        refundMode,
      ]
    );

    const imageQuery = `INSERT INTO documents (masterId,ticket,boardingPass) VALUES (?,?,?)`;
    const values = [response.insertId, ticket, boardingPass];

    await connection.query(imageQuery, values);
    await connection.commit();
    connection.release();

    return res.status(201).json({
      message: "client added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

master.get("/getAllYear", async (req, res) => {
  try {
    const [response] = await database.query(`SELECT * FROM masterTable`);

    const years = [
      ...new Set(
        response
          .map((item) => {
            const match = item.invoiceNum.match(/\d{4}-\d{4}/);

            return match ? match[0] : null;
          })
          .filter(Boolean)
      ),
    ];

    return res.status(200).json({
      message: "successfully",
      data: years,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

master.get("/getAllMasterData", async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(401).json({
        message: "year is required",
      });
    }

    const [latestInoviceNumber] = await database.query(
      `SELECT invoiceNum FROM masterTable ORDER BY invoiceNum DESC LIMIT 1`
    );

    const [response] = await database.query(`SELECT 
  masterTable.id AS masterId,
  masterTable.entryCreatedOn,
  masterTable.status,
  masterTable.invoiceNum,
  masterTable.dateofBooking,
  masterTable.dateOfJourney,
  masterTable.service,
  masterTable.description,
  masterTable.PNR,
  masterTable.systemRef,
  masterTable.vendor,
  masterTable.vendorGST,
  masterTable.depCity,
  masterTable.arrCity,
  masterTable.passengerName,
  masterTable.paymentParty,
  masterTable.travelType,
  masterTable.netAmount,
  masterTable.markup,
  masterTable.gst,
  masterTable.totalAmount,
  masterTable.modeOfPayment,
  masterTable.modeOfPaymentForClient,
  masterTable.paymentdatebyclient,
  masterTable.paymenamtbyclient,
  masterTable.refundDate,
  masterTable.refundAmount,
  masterTable.cancelCharge,
  masterTable.refundMode,

  documents.id AS documentId,
  documents.ticket,
  documents.boardingPass
FROM masterTable
LEFT JOIN documents 
ON masterTable.id = documents.masterId
`);

    const filterdData = response.filter((item) =>
      item.invoiceNum.includes(year)
    );

    return res.status(200).json({
      message: "success",
      // data: response,
      filterdData: filterdData,
      latestInovice: latestInoviceNumber[0].invoiceNum,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

master.put(
  "/editMasterData",
  upload.fields([
    { name: "ticket", maxCount: 1 },
    { name: "boardingPass", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { masterId } = req.query;
      let connection;

      connection = await database.getConnection();

      await connection.beginTransaction();

      const parsedData = JSON.parse(req.body.parsedData);

      const {
        status,
        invoiceNum,
        dateofBooking,
        dateOfJourney,

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
        travelType,
        netAmount,
        markup,
        gst,
        totalAmount,
        modeOfPayment,
        modeOfPaymentForClient,
        paymentdatebyclient,
        paymenamtbyclient,

        refundDate,
        refundAmount,
        cancelCharge,
        refundMode,
      } = parsedData;

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
        !service ||
        !systemRef ||
        !vendor ||
        !passengerName ||
        !netAmount ||
        !markup ||
        !totalAmount
      ) {
        return res.status(401).json({
          message: "all fileds are required",
        });
      }

      // Step 1: Get existing ticket & boardingPass from DB
      const [existingDoc] = await connection.query(
        "SELECT ticket, boardingPass, id FROM documents WHERE masterId = ?",
        [masterId]
      );

      const existingTicket = existingDoc[0]?.ticket || null;
      const existingBoardingPass = existingDoc[0]?.boardingPass || null;
      const documentId = existingDoc[0]?.id;

      // Step 2: Use new file if provided, else fallback to existing
      const ticket = req.files?.ticket?.[0]?.filename
        ? `https://diwise.cloud/tij-invoice/${req.files.ticket[0].filename}`
        : existingTicket;

      const boardingPass = req.files?.boardingPass?.[0]?.filename
        ? `https://diwise.cloud/tij-invoice/${req.files.boardingPass[0].filename}`
        : existingBoardingPass;

      const response = await database.query(
        `UPDATE masterTable SET status=?,
      invoiceNum=?,
      dateofBooking=?,
      dateOfJourney=?,

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
      travelType=?,
      netAmount=?,
      markup=?,
      gst=?,
      totalAmount=?,
      modeOfPayment=?,
      modeOfPaymentForClient=?,
        paymentdatebyclient=?,
      paymenamtbyclient=?,

      refundDate=?,
      refundAmount=?,
      cancelCharge=?,
      refundMode=? WHERE id=?`,
        [
          status,
          invoiceNum,
          dateofBooking,
          dateOfJourney,

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
          travelType,
          netAmount,
          markup,
          gst,
          totalAmount,
          modeOfPayment,
          modeOfPaymentForClient,
          paymentdatebyclient,
          paymenamtbyclient,

          refundDate,
          refundAmount,
          cancelCharge,
          refundMode,
          masterId,
        ]
      );

      const imageQuery = `UPDATE documents SET ticket = ?, boardingPass = ? WHERE masterId = ?`;
      const values = [ticket, boardingPass, masterId];

      await connection.query(imageQuery, values);
      await connection.commit();
      connection.release();

      return res.status(201).json({
        message: "master data updated successfully",
        // data: response[0],
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
);

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
      `SELECT 
  masterTable.id AS masterId,
  masterTable.entryCreatedOn,
  masterTable.status,
  masterTable.invoiceNum,
  masterTable.dateofBooking,
  masterTable.dateOfJourney,
  masterTable.service,
  masterTable.description,
  masterTable.PNR,
  masterTable.systemRef,
  masterTable.vendor,
  masterTable.vendorGST,
  masterTable.depCity,
  masterTable.arrCity,
  masterTable.passengerName,
  masterTable.paymentParty,
  masterTable.travelType,
  masterTable.netAmount,
  masterTable.markup,
  masterTable.gst,
  masterTable.totalAmount,
  masterTable.modeOfPayment,
  masterTable.modeOfPaymentForClient,
  masterTable.paymentdatebyclient,
  masterTable.paymenamtbyclient,
  masterTable.refundDate,
  masterTable.refundAmount,
  masterTable.cancelCharge,
  masterTable.refundMode,

  documents.id AS documentId,
  documents.ticket,
  documents.boardingPass
FROM masterTable
LEFT JOIN documents 
ON masterTable.id = documents.masterId WHERE masterTable.id=?`,
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

// add data via csv

master.post("/addDataviacsv", upload.single("fileData"), async (req, res) => {
  try {
    const fileData = req.file?.path;

    if (!fileData) {
      return res.status(401).json({
        message: "file is required",
      });
    }

    const rowdata = [];

    fs.createReadStream(fileData)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim(), // This trims spaces from header names
        })
      )
      .on("data", (row) => {
        const data = {
          dateofBooking: row["dateofBooking"] || "",
          dateOfJourney: row["dateOfJourney"] || "",
          invoiceNum: row["invoiceNum"] || "",
          passengerName: row["passengerName"] || "",
          paymentParty: row["paymentParty"] || "",

          systemRef: row["systemRef"] || "",
          vendor: row["vendor"] || "",
          service: row["service"] || "",
          description: row["description"] || "",
          PNR: row["PNR"] || "",
          depCity: row["depCity"] || "",
          arrCity: row["arrCity"] || "",
          netAmount: row["netAmount"]
            ? parseFloat(row["netAmount"].replace(/,/g, ""))
            : 0,
          markup: row["markup"]
            ? parseFloat(row["markup"].replace(/,/g, ""))
            : 0,
          gst: row["gst"] ? parseFloat(row["gst"].replace(/,/g, "")) : 0,

          totalAmount: row["totalAmount"]
            ? parseFloat(row["totalAmount"].replace(/,/g, ""))
            : 0,
          modeOfPaymentForClient: row["modeOfPayment"] || "",
          status: row["status"] || "Pending",
          refundDate: row["refundDate"] || "",
          refundAmount: row["refundAmount"]
            ? parseFloat(row["refundAmount"].replace(/,/g, ""))
            : 0,
          refundMode: row["refundMode"] || "",
        };

        if (row["invoiceNum"] && row["invoiceNum"] !== "") {
          rowdata.push(data);
        }
      })

      .on("end", async () => {
        if (rowdata.length === 0) {
          return res.status(400).json({
            message: "No valid data to insert",
          });
        }

        await database.query(
          `
      INSERT INTO masterTable (
        dateofBooking,
        dateOfJourney,
        invoiceNum,
        passengerName,
        paymentParty,
        systemRef,
        vendor,
        service,
        description,
        PNR,
        depCity,
        arrCity,
        netAmount,
        markup,
        gst,
        totalAmount,
        modeOfPaymentForClient,
        status,
        refundDate,
        refundAmount,
        refundMode
      ) VALUES ?
      `,
          [
            rowdata.map((data) => [
              data.dateofBooking,
              data.dateOfJourney,
              data.invoiceNum,
              data.passengerName,
              data.paymentParty,
              data.systemRef,
              data.vendor,
              data.service,
              data.description,
              data.PNR,
              data.depCity,
              data.arrCity,
              data.netAmount,
              data.markup,
              data.gst,
              data.totalAmount,
              data.modeOfPaymentForClient,
              data.status,
              data.refundDate,
              data.refundAmount,
              data.refundMode,
            ]),
          ]
        );

        return res.status(201).json({
          message: "success",
          data: rowdata,
        });
      })

      .on("error", (err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

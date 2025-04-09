import express from "express";
import { database } from "../db/config.js";

export const client = express.Router();

client.post("/add", async (req, res) => {
  try {
    const { name, contact, email, gstnum, address } = req.body;

    if (!name || !contact || !email || !address) {
      return res.status(401).json({
        message: "all fileds are required",
      });
    }

    const [response] = await database.query(
      `INSERT INTO clients (name,contact,email,gstnum,address) VALUES (?,?,?,?,?)`,
      [name, contact, email, gstnum, address]
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

client.get("/getAllClient", async (req, res) => {
  try {
    const [response] = await database.query(`SELECT * FROM clients`);

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

client.get("/getClientById", async (req, res) => {
  try {
    const { clientId } = req.query;

    if (!clientId) {
        return res.status(401).json({
            message:"clientId is required"
        })
    }

    const [response] = await database.query(
      `SELECT * FROM clients WHERE id=?`,
      [clientId]
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

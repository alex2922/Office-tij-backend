import express from "express";
import { database } from "../db/config.js";

export const vendor = express.Router();

vendor.post("/add", async (req, res) => {
  try {
    const { name, contact, email, gstnum } = req.body;

    // if (!name || !contact || !email) {
    //   return res.status(401).json({
    //     message: "all fileds are required",
    //   });
    // }

    await database.query(
      `INSERT INTO vendors (name,contact,email,gstnum) VALUES (?,?,?,?)`,
      [name, contact, email, gstnum]
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

vendor.get("/getAllvendors", async (req, res) => {
  try {
    const [response] = await database.query(`SELECT * FROM vendors`);

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

vendor.get("/getvendorsById", async (req, res) => {
  try {
    const { vendorId } = req.query;

    if (!vendorId) {
      return res.status(401).json({
        message: "vendorId is required",
      });
    }

    const [response] = await database.query(
      `SELECT * FROM vendors WHERE name=?`,
      [vendorId]
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

vendor.put("/updateVendor", async (req, res) => {
  try {
    const { id } = req.query;
    const { name, contact, email, gstnum } = req.body;

    if (!id) {
      return res.status(401).json({
        message: "id is required",
      });
    }

    await database.query(
      `UPDATE vendors SET name=?,contact=?,email=?,gstnum=? WHERE id=?`,
      [name, contact, email, gstnum, id]
    );

    return res.status(201).json({
      message:"vendor data updated successfully"
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

vendor.delete("/deletVendor", async (req,res)=>{
  try {
    const {vendorId} = req.query;

    if(!vendorId){
      return res.status(401).json({
        message:"vendorid is requried"
      })
    }


    await database.query(`DELETE FROM vendors WHERE id =?`,[vendorId]);

    return res.status(201).json({
      message:"delete successfully"
    })
  } catch (error) {
    return res.status(500).json({
      message:error.message
    })
  }
})
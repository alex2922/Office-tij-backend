import express from "express";
import { database } from "../db/config.js";

export const modePayment = express.Router();

modePayment.post("/add", async (req, res) => {
  try {
    const { name } = req.body;

    // if (!name || !contact || !email || !address) {
    //   return res.status(401).json({
    //     message: "all fileds are required",
    //   });
    // }

    const [response] = await database.query(
      `INSERT INTO modePayments (name) VALUES ?`,
      [name]
    );

    return res.status(201).json({
      message: "payment added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

modePayment.get("/getAllPayments", async (req, res) => {
  try {
    const [response] = await database.query(`SELECT * FROM modePayments`);

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

modePayment.get("/getPaymentById", async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
        return res.status(401).json({
            message:"name is required"
        })
    }

    const [response] = await database.query(
      `SELECT * FROM modePayments WHERE name=?`,
      [name]
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


modePayment.put("/updatePayment", async (req, res) => {
  try {
    const { id } = req.query;
    const { name } = req.body;

    if (!id) {
      return res.status(401).json({
        message: "id is required",
      });
    }

    await database.query(
      `UPDATE modePayments SET name=? WHERE id=?`,
      [name, id]
    );

    return res.status(201).json({
      message:"payments data updated successfully"
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

modePayment.delete("/deletpayments", async (req,res)=>{
  try {
    const {payId} = req.query;

    if(!payId){
      return res.status(401).json({
        message:"vendorid is requried"
      })
    }


    await database.query(`DELETE FROM modePayments WHERE id =?`,[payId]);

    return res.status(201).json({
      message:"delete successfully"
    })
  } catch (error) {
    return res.status(500).json({
      message:error.message
    })
  }
})
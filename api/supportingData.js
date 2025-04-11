import express from "express";
import { database } from "../db/config.js";
import { json } from "stream/consumers";

export const supportingData = express.Router();


supportingData.post("/add", async (req, res) => {
    try {
        const { name, value } = req.body;
        if(!name || !value){
            return res.status(401).json({
                message:"name or value is required"
            });
        }

        const [response] = await database.query(
            `INSERT INTO supportingData (name, value) VALUES (?, ?)`,
            [name, JSON.stringify(value)]
        );

        return res.status(201).json({
            message: "supporting data added successfully",
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        })
    }
})

supportingData.get("/getAll", async (req, res) => {
    try {
        const [response] = await database.query(`SELECT * FROM supportingData`);

        return res.status(200).json({
            message: "success",
            data: response,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        })
    }
})

supportingData.get("/getById", async (req, res) => {
    try {
        const { id } = req.query;

        if(!id){
            return res.status(401).json({
                message:"id is required"
            })
        }
        const [response] = await database.query(`SELECT * FROM supportingData WHERE id=?`, [id]);

        if(response.length === 0){
            return res.status(404).json({
                message: "supporting data not found"
            })
        }
        return res.status(200).json({
            message: "success",
            data: response[0],
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        })
    }
})

supportingData.get("/getByName" , async (req , res) => {
    try {
        const {name} = req.query;

        if(!name){
            return res.status(401).json({
                message: "name is required"
            })
        }

        const [response] = await database.query(`SELECT * FROM supportingData WHERE name=?`,[name]);


        if(response.length === 0){
            return res.status(404).json({
                message: "supporting data not found"
            })
        }
        return res.status(200).json({
            message: "success",
            data: response[0],
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        })
    }
})

supportingData.put("/update", async (req, res) => {
    try {
        const { id, name, value } = req.body;

        if (!id || !name || !value) {
            return res.status(401).json({
                message: "id, name, and value are required"
            });
        }

        const [response] = await database.query(
            `UPDATE supportingData SET name = ?, value = ? WHERE id = ?`,
            [name, JSON.stringify(value), id]
        );

        if (response.affectedRows === 0) {
            return res.status(404).json({
                message: "supporting data not found"
            });
        }

        return res.status(200).json({
            message: "supporting data updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});


supportingData.delete("/delete", async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(401).json({
                message: "id is required"
            });
        }

        const [response] = await database.query(
            `DELETE FROM supportingData WHERE id = ?`,
            [id]
        );

        if (response.affectedRows === 0) {
            return res.status(404).json({
                message: "supporting data not found"
            });
        }

        return res.status(200).json({
            message: "supporting data deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
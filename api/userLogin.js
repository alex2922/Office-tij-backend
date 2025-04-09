import express from "express";
import { database } from "../db/config.js";

export const userLogin = express.Router();

userLogin.post("/login", async (req,res)=>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
          return res.status(401).json({
                message:"email or password is required"
            })
        }

        const [user] = await database.query(`SELECT * FROM users WHERE email=?`,[email]);

     
        const data = user[0];
        
        if(!data){
            return res.status(401).json({
                message:"user not found"
            })
        }

    
        // passowrd campare

       

        if(data.password !== password){
            return res.status(401).json({
                message:"invalid password"
            })
        }

        return res.status(200).json({
            message:"login successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
})
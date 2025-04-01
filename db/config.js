import mysql2 from "mysql2/promise.js"
import dotenv from "dotenv";

dotenv.config()

const database = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const checkConnection = async ()=>{
    let connection;
    try {
        connection = await database.getConnection();
        console.log("database connected");
        return true;
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export {database, checkConnection}


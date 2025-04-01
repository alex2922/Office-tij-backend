import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { checkConnection } from "./db/config.js";
import { createTables } from "./tables/tableSetup.js";

dotenv.config();

const app = express();




try {
    await checkConnection();
    await createTables();
    const server = http.createServer(app);
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log("Server is running at", port);
    });
} catch (error) {
    console.error("Error starting server:", error);
}

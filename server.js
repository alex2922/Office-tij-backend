import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { checkConnection } from "./db/config.js";
import { createTables } from "./tables/tableSetup.js";
import userRoutes from "./routes/userRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
// import clientRoutes from "./routes/clientRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/vendors", vendorRoutes);
// app.use("/api/clients", clientRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

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

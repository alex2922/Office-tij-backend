import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { checkConnection } from "./db/config.js";
import { createTables } from "./tables/tableSetup.js";
import { userLogin } from "./api/userLogin.js";
import { client } from "./api/client.js";
import { vendor } from "./api/vendor.js";
import { master } from "./api/master.js";
import { supportingData } from "./api/supportingData.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

app.use("/api/user", userLogin);
app.use("/api/client", client);
app.use("/api/vendor", vendor);
app.use("/api/master", master);
app.use("/api/supportingData", supportingData);

try {
  await checkConnection();
  await createTables();

  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`your server running on ${port}`);
  });
} catch (error) {
  console.log(error);
}

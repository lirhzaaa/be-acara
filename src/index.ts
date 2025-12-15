import dotenv from "dotenv";
dotenv.config();

import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import db from "./config/database";

const app = express();
const PORT = 3000;

async function init() {
  try {
    const result = await db();
    console.log(`database status: ${result}`);

    app.use(bodyParser.json());
    app.use("/api", router);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

init();
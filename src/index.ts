import dotenv from "dotenv";
dotenv.config();

import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./config/database";
import docs from "./docs/route";
import errorMiddleware from "./middleware/errorMiddleware";

const app = express();
const PORT = 3000;  

async function init() {
  try {
    const result = await db();
    console.log(`database status: ${result}`);

    app.get("/", (req, res) => {
      res.json({
        message: "Server is running",
        data: null,
      });
    });

    app.use(cors());
    app.use(bodyParser.json());
    app.use("/api", router);
    docs(app);

    app.use(errorMiddleware.serverRoute());
    app.use(errorMiddleware.serverError());

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

init();

import express, { Request, Response } from "express";
import authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/auth/register", authController.register);

export default router;

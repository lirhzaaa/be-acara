import express from "express";
import authController from '../controllers/auth.controller'
const router = express.Router();

router.use('/auth/register', authController.register)

export default router
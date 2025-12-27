import express, { Request, Response } from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/authMiddleware";
import aclMiddleware from "../middleware/aclMiddleware";
import { ROLES } from "../utils/constant";

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);
router.post("/auth/activation", authController.activationCode);

router.get("/test-acl", aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]), (req, res) => {
    res.status(200).json({
        message: "Success"
    })
});

export default router;

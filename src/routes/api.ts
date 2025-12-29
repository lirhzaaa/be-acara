import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/authMiddleware";
import aclMiddleware from "../middleware/aclMiddleware";
import mediaMiddleware from "../middleware/mediaMiddleware";
import { ROLES } from "../utils/constant";
import mediaController from "../controllers/media.controller";

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);
router.post("/auth/activation", authController.activationCode);

router.post("/media/upload/single", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
  mediaMiddleware.single("file"),
  mediaController.single,
]);
router.post("/media/upload/multiple", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
  mediaMiddleware.multiple("files"),
  mediaController.multiple,
]);
router.delete("/media/remove", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
  mediaController.remove,
]);

router.post("/create/category", authMiddleware, )

export default router;

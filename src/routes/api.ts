import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/authMiddleware";
import aclMiddleware from "../middleware/aclMiddleware";
import mediaMiddleware from "../middleware/mediaMiddleware";
import { ROLES } from "../utils/constant";
import mediaController from "../controllers/media.controller";
import categoryController from "../controllers/category.controller";
import regionController from "../controllers/region.controller";
import eventController from "../controllers/event.controller";

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

router.post(
  "/create/category",
  authMiddleware,
  aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
  categoryController.create
);
router.get(
  "/all/category",
  authMiddleware,
  aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
  categoryController.findAll
);
router.get(
  "/one/category/:id",
  authMiddleware,
  aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
  categoryController.findOne
);
router.put(
  "/update/category/:id",
  authMiddleware,
  aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
  categoryController.update
);
router.delete(
  "/delete/category/:id",
  authMiddleware,
  aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
  categoryController.remove
);

router.get("/regions", regionController.getAllProvinces);
router.get("/regions/:id/province", regionController.getProvince);
router.get("/regions/:id/regency", regionController.getRegency);
router.get("/regions/:id/district", regionController.getDistrict);
router.get("/regions/:id/village", regionController.getVillage);
router.get("/regions-search", regionController.findByCity);

router.post(
  "/events",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.create
);
router.get("/events", eventController.findAll);
router.get("/events/:id", eventController.findOne);
router.put(
  "/events/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.update
);
router.delete(
  "/events/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.remove
);
router.get("/events/:slug/slug", eventController.findOneBySlug);

export default router;

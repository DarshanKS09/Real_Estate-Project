import express from "express";
import {
  createProperty,
  getAllProperties,
  getMyProperties,
  updateProperty,
  deleteProperty,
  getPropertyById,
} from "../controllers/propertyController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */

// IMPORTANT: /my must come BEFORE /:id

router.get("/", getAllProperties);

router.get("/my", protect, authorizeRoles("agent"), getMyProperties);

router.get("/:id", getPropertyById);

/* ================= PROTECTED AGENT ROUTES ================= */

router.post(
  "/",
  protect,
  authorizeRoles("agent"),
  upload.array("images", 5),
  createProperty
);

router.put(
  "/:id",
  protect,
  authorizeRoles("agent"),
  upload.array("images", 5),
  updateProperty
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("agent"),
  deleteProperty
);

export default router;

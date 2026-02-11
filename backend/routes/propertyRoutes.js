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

// ---------- PUBLIC ROUTES ----------
router.get("/", getAllProperties);

// ---------- PROTECTED AGENT ROUTES ----------
router.use(protect, authorizeRoles("agent"));

router.get("/my", getMyProperties);

// Create property with images (max 5)
router.post("/", upload.array("images", 5), createProperty);

// Update property with images (max 5)
router.put("/:id", upload.array("images", 5), updateProperty);

router.delete("/:id", deleteProperty);

// ---------- PUBLIC SINGLE PROPERTY (KEEP LAST) ----------
router.get("/:id", getPropertyById);

export default router;

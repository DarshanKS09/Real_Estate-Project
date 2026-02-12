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
import upload from "../middlewares/uploadMiddleware.js"; // if using multer

const router = express.Router();

/* ===========================
   PUBLIC ROUTES
=========================== */

// IMPORTANT: Specific routes FIRST
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

/* ===========================
   PROTECTED AGENT ROUTES
=========================== */

// Apply auth AFTER public routes
router.use(protect, authorizeRoles("agent"));

// IMPORTANT: /my must come BEFORE /:id in protected scope
router.get("/my", getMyProperties);

router.post("/", upload.array("images", 5), createProperty);

router.put("/:id", upload.array("images", 5), updateProperty);

router.delete("/:id", deleteProperty);

export default router;

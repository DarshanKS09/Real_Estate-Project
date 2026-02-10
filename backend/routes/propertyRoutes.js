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

const router = express.Router();

// ---------- PUBLIC ROUTES ----------
router.get("/", getAllProperties);

// ---------- PROTECTED AGENT ROUTES ----------
router.use(protect, authorizeRoles("agent"));

router.get("/my", getMyProperties);
router.post("/", createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

// ---------- PUBLIC SINGLE PROPERTY (KEEP LAST) ----------
router.get("/:id", getPropertyById);

export default router;

import express from "express";
import {
  getMe,
  updateProfile,
  toggleSaveProperty,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);
router.post("/save/:propertyId", protect, toggleSaveProperty);

export default router;

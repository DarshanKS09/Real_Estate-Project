import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorizeRoles("agent"),
  (req, res) => {
    res.json({
      message: "Welcome Agent",
      agentId: req.user._id,
    });
  }
);

export default router;

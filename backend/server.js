import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();

// ---------- CORS (CRITICAL FIX) ----------
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allow cookies
  })
);

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(cookieParser());

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/notifications", notificationRoutes);

// ---------- DATABASE ----------
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed");
    console.error(err.message);
    process.exit(1);
  }
};

// ---------- SERVER ----------
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
};

startServer();

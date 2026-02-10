import User from "../models/User.js";
import bcrypt from "bcrypt";
import { hashPassword, comparePassword } from "../utils/password.js";
import generateToken from "../utils/generateToken.js";
import generateOtp from "../utils/generateOtp.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

/**
 * SEND OTP → before registration
 */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const otp = generateOtp(); // ✅ FIXED
    const hashedOtp = await bcrypt.hash(otp, 10);

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        role: "user", // TEMP default (schema requires it)
        isVerified: false,
        isActive: true,
      });
    }

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    await user.save();
    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/**
 * REGISTER → verify OTP + set password (FINAL REGISTRATION)
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, otp, role } = req.body;

    if (!name || !email || !password || !otp || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.otp) {
      return res.status(400).json({ message: "OTP not requested" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.name = name;
    user.password = await hashPassword(password);
    user.role = role === "agent" ? "agent" : "user";
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(201).json({
      message: "Registration successful. Please login.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

/**
 * LOGIN → email + password only (NO OTP HERE)
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "User blocked" });
    }

    generateToken(res, user._id);

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

/**
 * LOGOUT → clear cookie
 */
export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });

  res.json({ message: "Logged out successfully" });
};

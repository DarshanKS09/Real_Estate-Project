export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        role: "user", // temp role
        isVerified: false,
        isActive: true,
      });
    }

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    // 🔥 THIS IS WHERE IT FAILS
    await sendOtpEmail(email, otp);

    return res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("SEND OTP FAILED 👉", error); // 👈 IMPORTANT
    return res.status(500).json({
      message: "Failed to send OTP",
      error: error.message, // expose reason
    });
  }
};

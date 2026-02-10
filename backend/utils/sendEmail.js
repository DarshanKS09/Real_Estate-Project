import axios from "axios";

export const sendOtpEmail = async (to, otp) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY missing in environment variables");
  }

  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Real Estate App",
          email: process.env.BREVO_SENDER_EMAIL, // ✅ REAL EMAIL
        },
        to: [
          {
            email: to,
          },
        ],
        subject: "Your OTP Code",
        htmlContent: `
          <h2>Email Verification</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP expires in 5 minutes.</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );
  } catch (error) {
    console.error(
      "❌ Brevo OTP email failed:",
      error.response?.data || error.message
    );
    throw new Error("Failed to send OTP email");
  }
};

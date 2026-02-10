import axios from "axios";

export const sendOtpEmail = async (to, otp) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  // 🔒 Fail fast — no silent crashes
  if (!apiKey) {
    throw new Error("BREVO_API_KEY missing in environment variables");
  }

  if (!senderEmail) {
    throw new Error("BREVO_SENDER_EMAIL missing in environment variables");
  }

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Real Estate App",
          email: senderEmail, // MUST be verified in Brevo
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
          "api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000,
      }
    );

    return response.data; // ✅ useful for logs if needed
  } catch (error) {
    console.error("❌ Brevo OTP email failed", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw new Error("Failed to send OTP email");
  }
};

import nodemailer from "nodemailer";

export const sendOtpEmail = async (to, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER or EMAIL_PASS missing in environment");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // MUST be App Password
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  // 🔎 VERIFY SMTP CONNECTION FIRST
  await transporter.verify();

  // 📧 SEND MAIL
  await transporter.sendMail({
    from: `"Real Estate App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 5 minutes.</p>
    `,
  });
};

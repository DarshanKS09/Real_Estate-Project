import nodemailer from "nodemailer";

export const sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // MUST be false
    auth: {
      user: String(process.env.EMAIL_USER),
      pass: String(process.env.EMAIL_PASS),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // HARD FAIL if auth is wrong
  await transporter.verify();

  await transporter.sendMail({
    from: `"RealEstate App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `
      <h2>Your OTP</h2>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
    `,
  });
};

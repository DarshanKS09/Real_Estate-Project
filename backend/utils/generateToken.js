import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // REQUIRED for HTTPS
    sameSite: "none",    // REQUIRED for cross-site (Vercel → Render)
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;

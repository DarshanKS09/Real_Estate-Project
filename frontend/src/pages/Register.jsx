import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", otp: "", password: "" });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const sendOtp = async () => {
    if (!form.email) {
      alert("Please enter email first");
      return;
    }
    try {
      setLoading(true);
      await api.post("/auth/send-otp", { email: form.email });
      setOtpSent(true);
      alert("OTP sent to your email");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        otp: form.otp,
        role,
      });
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="re-panel w-full max-w-lg p-7">
        <p className="re-badge re-badge-soft mb-3">Create Account</p>
        <h1 className="text-3xl font-extrabold mb-6">Join As Buyer Or Agent</h1>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`re-btn ${role === "user" ? "re-btn-primary" : "re-btn-ghost"}`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setRole("agent")}
            className={`re-btn ${role === "agent" ? "re-btn-primary" : "re-btn-ghost"}`}
          >
            Agent
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <input
            name="name"
            className="re-input"
            placeholder="Full Name"
            required
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            className="re-input"
            placeholder="Email"
            required
            onChange={handleChange}
          />

          {!otpSent && (
            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="re-btn re-btn-primary w-full"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          )}

          {otpSent && (
            <>
              <input
                name="otp"
                className="re-input"
                placeholder="Enter OTP"
                required
                onChange={handleChange}
              />
              <input
                name="password"
                type="password"
                className="re-input"
                placeholder="Set Password"
                required
                onChange={handleChange}
              />
              <button disabled={loading} type="submit" className="re-btn re-btn-primary w-full">
                {loading ? "Registering..." : `Register as ${role}`}
              </button>
            </>
          )}
        </form>

        <p className="text-sm text-slate-600 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

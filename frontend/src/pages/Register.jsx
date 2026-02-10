import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 1️⃣ Send OTP
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

  // 2️⃣ Final Registration (OTP + Password)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        {/* Role Selector */}
        <div className="flex mb-6 rounded-lg overflow-hidden border">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`flex-1 py-2 font-semibold ${
              role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setRole("agent")}
            className={`flex-1 py-2 font-semibold ${
              role === "agent"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Agent
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />

          {/* Send OTP */}
          {!otpSent && (
            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          )}

          {/* OTP + Password */}
          {otpSent && (
            <>
              <input
                name="otp"
                placeholder="Enter OTP"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />

              <input
                name="password"
                type="password"
                placeholder="Set Password"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Registering..." : `Register as ${role}`}
              </button>
            </>
          )}
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

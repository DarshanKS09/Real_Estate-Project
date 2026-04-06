import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);
      const loggedInUser = res.data;
      if (loggedInUser.role === "agent") navigate("/agent/dashboard");
      else navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="re-panel w-full max-w-md p-7">
        <p className="re-badge re-badge-soft mb-3">Account Access</p>
        <h1 className="text-3xl font-extrabold mb-2">Welcome Back</h1>
        <p className="text-slate-600 mb-6">Sign in to continue browsing properties.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="re-input"
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />
          <input
            className="re-input"
            name="password"
            type="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />
          <button disabled={loading} className="re-btn re-btn-primary w-full">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-5">
          New user?{" "}
          <Link to="/register" className="font-semibold text-blue-700 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

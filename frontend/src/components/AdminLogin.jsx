import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("adminToken", token);
      navigate("/AdminDashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="admin-shell admin-bg flex min-h-screen items-center justify-center px-4 py-12">
      <div className="admin-card admin-animate w-full max-w-md rounded-3xl p-10">
        <div className="mb-8 text-center">
          <p className="admin-chip mx-auto w-fit text-emerald-700">Secure Portal</p>
          <h1 className="admin-title mt-4 text-4xl font-semibold text-slate-900">
            Wardaan Admin
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage orders, inventory, and finance.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-2">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              placeholder="admin@wardaan.pk"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:shadow-emerald-300"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;

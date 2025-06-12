import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserShield } from "react-icons/fa";

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("adminToken"); // ⛔ Remove token
    navigate("/adminLogin"); // 🔁 Redirect to login
  };

  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Logo */}
        <div className="flex items-center space-x-2">
          <FaUserShield className="text-2xl text-amber-500" />
          <h1
            className="text-2xl font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
            onClick={() => navigate("/AdminDashboard")}
          >
            Wardaan Admin
          </h1>
        </div>

        {/* Right Side: Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition"
        >
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}

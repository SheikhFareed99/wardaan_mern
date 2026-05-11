import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserShield, FaBars, FaTimes } from "react-icons/fa";

export default function AdminHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("adminToken");
    navigate("/adminLogin");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/75 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <FaUserShield className="text-lg" />
          </span>
          <h1
            className="admin-title text-xl sm:text-2xl font-bold text-slate-900 hover:text-emerald-600 cursor-pointer transition"
            onClick={() => navigate("/AdminDashboard")}
          >
            Vardaan Admin
          </h1>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-700">
          <button
            onClick={() => navigate("/AdminDashboard")}
            className="hover:text-emerald-600 transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/OrdersManagment")}
            className="hover:text-emerald-600 transition"
          >
            Orders
          </button>
          <button
            onClick={() => navigate("/ProductManagment")}
            className="hover:text-emerald-600 transition"
          >
            Products
          </button>
          <button
            onClick={() => navigate("/FinanceManagment")}
            className="hover:text-emerald-600 transition"
          >
            Finance
          </button>
          <button
            onClick={() => navigate("/AdminReports")}
            className="hover:text-emerald-600 transition"
          >
            Reports
          </button>
        </nav>

        {/* Right: Sign Out (Desktop) */}
        <div className="hidden md:flex">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-xl text-slate-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white/95 border-t border-slate-200/60">
          <button
            onClick={() => {
              navigate("/AdminDashboard");
              setMenuOpen(false);
            }}
            className="block w-full text-left text-sm font-semibold text-slate-700 hover:text-emerald-600"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              navigate("/OrdersManagment");
              setMenuOpen(false);
            }}
            className="block w-full text-left text-sm font-semibold text-slate-700 hover:text-emerald-600"
          >
            Orders
          </button>
          <button
            onClick={() => {
              navigate("/ProductManagment");
              setMenuOpen(false);
            }}
            className="block w-full text-left text-sm font-semibold text-slate-700 hover:text-emerald-600"
          >
            Products
          </button>
          <button
            onClick={() => {
              navigate("/FinanceManagment");
              setMenuOpen(false);
            }}
            className="block w-full text-left text-sm font-semibold text-slate-700 hover:text-emerald-600"
          >
            Finance
          </button>
          <button
            onClick={() => {
              navigate("/AdminReports");
              setMenuOpen(false);
            }}
            className="block w-full text-left text-sm font-semibold text-slate-700 hover:text-emerald-600"
          >
            Reports
          </button>
          <button
            onClick={() => {
              handleSignOut();
              setMenuOpen(false);
            }}
            className="flex items-center justify-center space-x-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
}

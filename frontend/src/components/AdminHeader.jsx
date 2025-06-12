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
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <FaUserShield className="text-2xl text-amber-500" />
          <h1
            className="text-xl sm:text-2xl font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
            onClick={() => navigate("/AdminDashboard")}
          >
            Wardaan Admin
          </h1>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex space-x-6 font-medium">
          <button
            onClick={() => navigate("/admin/orders")}
            className="hover:text-amber-500 transition"
          >
            Order 
          </button>
          <button
            onClick={() => navigate("/admin/products")}
            className="hover:text-amber-500 transition"
          >
            Products
          </button>
          <button
            onClick={() => navigate("/admin/finance")}
            className="hover:text-amber-500 transition"
          >
            Finance
          </button>
        </nav>

        {/* Right: Sign Out (Desktop) */}
        <div className="hidden md:flex">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-black">
          <button
            onClick={() => {
              navigate("/admin/orders");
              setMenuOpen(false);
            }}
            className="block w-full text-left hover:text-amber-500"
          >
            Order 
          </button>
          <button
            onClick={() => {
              navigate("/admin/products");
              setMenuOpen(false);
            }}
            className="block w-full text-left hover:text-amber-500"
          >
            Products
          </button>
          <button
            onClick={() => {
              navigate("/admin/finance");
              setMenuOpen(false);
            }}
            className="block w-full text-left hover:text-amber-500"
          >
            Finance
          </button>
          <button
            onClick={() => {
              handleSignOut();
              setMenuOpen(false);
            }}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition w-full justify-center"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
}

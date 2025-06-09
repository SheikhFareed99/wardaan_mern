import React, { useState } from "react";
import { FaBars, FaShoppingCart, FaUserCircle, FaTimes } from "react-icons/fa";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
  
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          w-[60%] md:w-64`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-6 space-y-6">
          <a
            href="#salwar-kameez"
            onClick={() => setSidebarOpen(false)}
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Salwar Kameez
          </a>
          <a
            href="#shoes"
            onClick={() => setSidebarOpen(false)}
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Shoes
          </a>
        </nav>
      </aside>

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Hamburger icon */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Open sidebar menu"
          >
            <FaBars className="text-2xl text-gray-700" />
          </button>

          {/* Center: Brand */}
          <div className="flex-grow flex justify-center">
            <h1 className="text-3xl font-bold text-gray-900 select-none">Wardaan</h1>
          </div>

          {/* Right: Cart and Profile icons */}
          <div className="flex items-center space-x-6">
            <button
              aria-label="Shopping Cart"
              className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FaShoppingCart className="text-2xl text-gray-700" />
            </button>
            <button
              aria-label="User Profile"
              className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FaUserCircle className="text-2xl text-gray-700" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

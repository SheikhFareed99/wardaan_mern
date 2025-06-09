import React, { useState } from "react";
import { FaBars, FaShoppingCart, FaUserCircle, FaTimes } from "react-icons/fa";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-black shadow-lg z-50 transform transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          w-[60%] md:w-64`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-xl text-amber-800 font-bold">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="p-2 rounded-md hover:bg-gray-800"
          >
            <FaTimes className="text-2xl text-white" />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-6 space-y-6">
          <a
            href="#salwar-kameez"
            onClick={() => setSidebarOpen(false)}
            className="text-gray-100 hover:text-indigo-600 font-medium"
          >
            Salwar Kameez
          </a>
          <a
            href="#shoes"
            onClick={() => setSidebarOpen(false)}
            className="text-gray-100 hover:text-indigo-600 font-medium"
          >
            Shoes
          </a>
        </nav>
      </aside>

      {/* Header */}
      <header className="bg-black shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-800"
            aria-label="Open sidebar menu"
          >
            <FaBars className="text-2xl text-white" />
          </button>

          <div className="flex-grow flex justify-center">
            <h1 className="text-3xl text-amber-800 font-bold select-none">Wardaan</h1>
          </div>

          <div className="flex items-center space-x-6">
            <button aria-label="Cart" className="p-2 rounded-md hover:bg-gray-800">
              <FaShoppingCart className="text-2xl text-white" />
            </button>
            <button aria-label="Profile" className="p-2 rounded-md hover:bg-gray-800">
              <FaUserCircle className="text-2xl text-white" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

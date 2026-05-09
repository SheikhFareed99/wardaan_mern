import React, { useState } from "react";
import { FaBars, FaShoppingCart, FaUserCircle, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const bagItems = useSelector((state) => state.bag.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const goToCategory = (category) => {
    setSidebarOpen(false);
    navigate(`/products/${encodeURIComponent(category)}`);
  };

  return (
    <>
      {/* Sidebar Overlay */}
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
          <h2 className="text-xl text-amber-500 font-bold">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="p-2 rounded-md hover:bg-gray-800"
          >
            <FaTimes className="text-2xl text-white" />
          </button>
        </div>

        <nav className="flex flex-col px-5 py-5 space-y-3">
        <button
            onClick={() => navigate('/')}
            className="text-left text-gray-100 hover:text-indigo-600 font-medium"
          >
            Home
          </button>
          <hr className="border-gray-600" />
          <button
            onClick={() => goToCategory("kameez-shalwar")}
            className="text-left text-gray-100 hover:text-indigo-600 font-medium"
          >
            Salwar Kameez
          </button>
          <hr className="border-gray-600" />
          <button
            onClick={() => goToCategory("chappal")}
            className="text-left text-gray-100 hover:text-indigo-600 font-medium"
          >
            Chappal
          </button>
          {/* <hr className="border-gray-600" />
          <button
            onClick={() => goToCategory("Wardaan-Special")}
            className="text-left text-gray-100 hover:text-indigo-600 font-medium"
          >
            Vardaan Special
          </button> */}
          <hr className="border-gray-600"/>
          <button
            onClick={() => goToCategory("Vardaans-Unstitched")}
            className="text-left text-gray-100 hover:text-indigo-600 font-medium"
          >
            Vardaan Unstitched
          </button>
          <hr className="border-gray-600" />
          <button
            onClick={() => goToCategory("Discount")}
            className="text-left font-medium animate-blink"
          >
            Discount
          </button>
          <hr className="border-gray-600" />
          <button
            onClick={() => navigate('/OrderTrack')}
            className="text-left text-gray-100 hover:text-indigo-600 font-medium"
          >
            Track your order
          </button>
       
        </nav>
      </aside>
      <div className="w-full bg-gradient-to-r from-amber-700 via-amber-600 to-burgundy-800 text-white py-2 overflow-hidden whitespace-nowrap z-50 shadow-md">
        <div className="animate-marquee inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide px-4 text-white drop-shadow-md">
          Unwrap Elegance – Upto 50% OFF on all products • Vardaan's Summer Sale Live! • New in: Vardaan Rivayat Collection!
        </div>
      </div>

      <style>
        {`
          .animate-marquee {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 12s linear infinite;
          }

          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          
          .bg-burgundy-800 {
            background-color: #722F37;
          }
        `}
      </style>
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
            <button
              onClick={() => navigate("/")}
              className="text-3xl text-amber-600 font-bold select-none hover:text-amber-500 transition duration-200"
            >
              Vardaan
            </button>
          </div>

          <div className="flex items-center space-x-6">
            <button
              aria-label="Cart"
              className="relative p-2 rounded-md hover:bg-gray-800"
              onClick={() => navigate("/CheckOut")}
            >
              <FaShoppingCart className="text-2xl text-white" />
              {bagItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {bagItems.length}
                </span>
              )}
            </button>

            <button
              aria-label="Wishlist"
              className="relative p-2 rounded-md hover:bg-gray-800"
              onClick={() => navigate("/wishlist")}
              title="View Wishlist"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </button>
            
              {/* will do it when profile system for customer is done  */}

            {/* <button aria-label="Profile" className="p-2 rounded-md hover:bg-gray-800">
              <FaUserCircle className="text-2xl text-white" />
            </button> */}
          </div>
        </div>
      </header>
    </>
  );
}

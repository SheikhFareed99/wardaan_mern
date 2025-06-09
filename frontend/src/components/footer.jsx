import React, { useState } from 'react';
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { FaInstagram, FaSquareXTwitter, FaSnapchat } from "react-icons/fa6";
import { AiOutlinePinterest } from "react-icons/ai";
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <>
      <footer className="bg-black text-white px-4 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Logo and Support */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl text-amber-600 font-bold tracking-wide">Wardaan</h1>

            <div>
              <h2 className="font-semibold">Customer Support</h2>
              <p>Mon–Sat: 9:00 AM – 2:00 AM</p>
              <p>Sun: 12:00 PM – 12:00 AM</p>
            </div>

            <div>
              <h2 className="font-semibold">Contact Information</h2>
              <p className="hover:underline">Landline: 0303-6578904</p>
              <p className="hover:underline">Email: Wardaanofficial@gmail.com</p>
            </div>
          </div>

          {/* Information Links */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Information</h2>
            <ul className="space-y-1">
              <li className="hover:underline">Blogs</li>
              <li className="hover:underline"><Link to="/terms">Terms & Conditions</Link></li>
              <li className="hover:underline">Store Locator</li>
            </ul>
          </div>

          {/* Customer Care Links */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Customer Care</h2>
            <ul className="space-y-1">
              <li className="hover:underline"><Link to="/contact">Contact Us</Link></li>
              <li className="hover:underline">FAQ's</li>
              <li className="hover:underline">Feedback/Complaint</li>
              <li className="hover:underline">Track your order</li>
              <li className="hover:underline"><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter & Social Icons */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Sign up and save</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-white rounded-md placeholder-white"
            />
            <div className="flex flex-wrap gap-3 mt-2">
              <FaFacebook size={24} className="hover:text-amber-500 cursor-pointer" />
              <FaInstagram size={24} className="hover:text-amber-500 cursor-pointer" />
              <FaSquareXTwitter size={24} className="hover:text-amber-500 cursor-pointer" />
              <AiOutlinePinterest size={24} className="hover:text-amber-500 cursor-pointer" />
              <FaYoutube size={24} className="hover:text-amber-500 cursor-pointer" />
              <FaSnapchat size={24} className="hover:text-amber-500 cursor-pointer" />
            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <hr className="border-slate-700 my-6" />
        <div className="text-center py-4">
          <p className="text-sm">
            © 2025, <a href="/" className="hover:underline">Wardaan Clothing</a> – Powered by SheikhFareed
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;

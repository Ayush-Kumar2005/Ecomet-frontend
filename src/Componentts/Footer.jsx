import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#020617] text-gray-300 mt-10 border-t border-gray-800">

      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-emerald-400 mb-3">
            🛍️ Ecomet
          </h2>
          <p className="text-sm text-gray-400">
            Your one-stop destination for all your shopping needs.
            Discover quality products at the best prices.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-emerald-400 cursor-pointer transition">About Us</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Careers</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Blog</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Contact</li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-white font-semibold mb-3">Help</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-emerald-400 cursor-pointer transition">Payments</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Shipping</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Returns</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">FAQ</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-3">Subscribe</h3>
          <p className="text-sm text-gray-400 mb-3">
            Get latest updates & offers
          </p>

          <div className="flex items-center bg-[#1e293b] rounded-full overflow-hidden border border-gray-700 focus-within:ring-2 focus-within:ring-emerald-400">
            <input
              type="email"
              placeholder="Enter email"
              className="w-full bg-transparent px-3 py-2 outline-none text-sm text-white"
            />
            <button className="bg-emerald-400 text-black px-4 py-2 text-sm font-medium hover:bg-emerald-300 transition">
              Join
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 py-4 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">

        <p className="text-xs text-gray-500 text-center md:text-left">
          © {new Date().getFullYear()} Ecomet. All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex gap-4">
          <div className="p-2 bg-[#1e293b] rounded-full hover:bg-emerald-400 hover:text-black transition cursor-pointer">
            <FaFacebookF />
          </div>
          <div className="p-2 bg-[#1e293b] rounded-full hover:bg-emerald-400 hover:text-black transition cursor-pointer">
            <FaInstagram />
          </div>
          <div className="p-2 bg-[#1e293b] rounded-full hover:bg-emerald-400 hover:text-black transition cursor-pointer">
            <FaTwitter />
          </div>
          <div className="p-2 bg-[#1e293b] rounded-full hover:bg-emerald-400 hover:text-black transition cursor-pointer">
            <FaLinkedinIn />
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
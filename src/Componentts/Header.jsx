import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";

import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaListUl,
  FaHeart,
  FaBoxOpen,
  FaTags,
  FaTimes,
  FaBars,
  FaSignOutAlt
} from "react-icons/fa";


const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Mobiles",
  "Home",
  "Appliances",
  "Books",
  "Toys"
];

const Header = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const clearFilter = () => setActiveCategory(null);

  const dispatch = useDispatch();
  const items = useSelector((store) => store.cart.items);
  console.log(items);


  const handleLogout = () => {
    dispatch(logout());
  };

  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="w-full bg-[#0f172a] text-white shadow-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 md:px-8 py-3 max-w-7xl mx-auto">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <FaBars
              className="md:hidden text-xl cursor-pointer hover:text-emerald-400 transition"
              onClick={() => setMenuOpen(true)}
            />

            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-xl md:text-2xl">🛍️</span>
              <h1 className="text-lg md:text-2xl font-bold text-emerald-400">
                Ecomet
              </h1>
            </div>
          </div>

          {/* SEARCH (DESKTOP) */}
          <div className="hidden md:flex flex-1 mx-8 items-center bg-[#1e293b] rounded-full border border-gray-700 focus-within:ring-2 focus-within:ring-emerald-400 max-w-xl transition">
            <FaSearch className="mx-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent px-2 py-2 outline-none text-sm text-white placeholder-gray-400"
            />
            <FaListUl className="mx-4 text-gray-400" />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 md:gap-6">

            <FaSearch className="md:hidden text-lg cursor-pointer hover:text-emerald-400 transition" />

            <FaHeart className="cursor-pointer hidden sm:block hover:text-emerald-400 transition" />

            <FaBoxOpen className="cursor-pointer hidden md:block hover:text-emerald-400 transition" />

            {userInfo ? (
              <FaSignOutAlt
                onClick={handleLogout}
                className="text-lg cursor-pointer hover:text-red-500"
              />
            ) : (
              <FaUser className="text-lg cursor-pointer hover:text-emerald-400" />
            )}

            <Link to="/cart">
              <div className="relative">
                <FaShoppingCart className="cursor-pointer text-lg hover:text-emerald-400 transition" />
                <span className="absolute -top-2 -right-2 bg-emerald-400 text-black text-xs px-1 rounded-full animate-pulse">
                  {items.length}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center bg-[#1e293b] rounded-full border border-gray-700 focus-within:ring-2 focus-within:ring-emerald-400 transition">
            <FaSearch className="mx-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent px-2 py-2 outline-none text-sm text-white"
            />
          </div>
        </div>
      </header>

      {/* ================= FILTER BAR (DESKTOP ONLY) ================= */}
      <div className="hidden md:block w-full bg-[#020617] border-t border-gray-800">
        <div className="flex flex-wrap gap-3 px-8 py-3 max-w-7xl mx-auto">

          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const isDisabled = activeCategory && !isActive;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                disabled={isDisabled}
                className={`
                  flex items-center gap-2 px-4 py-1 rounded-full text-sm transition-all duration-200
                  ${
                    isActive
                      ? "bg-emerald-400 text-black scale-105"
                      : "bg-[#1e293b] text-gray-300 hover:bg-emerald-400 hover:text-black hover:scale-105"
                  }
                  ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}
                `}
              >
                {cat}

                {isActive && (
                  <FaTimes
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFilter();
                    }}
                    className="text-xs"
                  />
                )}
              </button>
            );
          })}

          <button className="flex items-center gap-2 px-4 py-1 rounded-full bg-[#1e293b] text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all duration-200">
            <FaTags />
            Offers
          </button>
        </div>
      </div>

      {/* ================= SIDEBAR (MOBILE) ================= */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          menuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* Sidebar */}
        <div
          className={`absolute top-0 left-0 h-full w-72 bg-[#020617] text-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-emerald-400">
              Menu
            </h2>
            <FaTimes
              className="cursor-pointer hover:text-red-400 transition"
              onClick={() => setMenuOpen(false)}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col p-4 gap-3 text-sm">

            {/* Top Links */}
            <div className="flex items-center gap-3 cursor-pointer hover:text-emerald-400 transition">
              <FaUser /> Profile
            </div>

            <div className="flex items-center gap-3 cursor-pointer hover:text-emerald-400 transition">
              <FaBoxOpen /> Orders
            </div>

            <div className="flex items-center gap-3 cursor-pointer hover:text-emerald-400 transition">
              <FaHeart /> Wishlist
            </div>

            <div className="flex items-center gap-3 cursor-pointer hover:text-emerald-400 transition">
              <FaShoppingCart /> Cart
            </div>

            <div className="border-t border-gray-800 my-3"></div>

            {/* Categories */}
            <span className="text-gray-400 text-xs uppercase tracking-wide">
              Categories
            </span>

            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const isDisabled = activeCategory && !isActive;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setMenuOpen(false);
                  }}
                  disabled={isDisabled}
                  className={`
                    flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200
                    ${
                      isActive
                        ? "bg-emerald-400 text-black font-medium scale-105"
                        : "hover:bg-[#1e293b]"
                    }
                    ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}
                  `}
                >
                  {cat}

                  {isActive && (
                    <FaTimes
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFilter();
                      }}
                      className="text-xs"
                    />
                  )}
                </button>
              );
            })}

            <div className="flex items-center gap-2 mt-3 text-emerald-400 cursor-pointer hover:opacity-80 transition">
              <FaTags />
              Offers
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaSearch, FaShoppingCart, FaUser, FaHeart } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle"; // Corrected Import

const Header = () => {
  const items = useSelector((store) => store.cart.items);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-8">
        
        {/* Brand */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-xl">🛍️</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
            ECOMET
          </h1>
        </div>

        {/* Search - Glass Effect */}
        <div className="hidden md:flex flex-1 max-w-xl items-center bg-slate-100 dark:bg-white/5 rounded-2xl border border-transparent focus-within:border-emerald-500/50 transition-all px-4 py-2">
          <FaSearch className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="bg-transparent border-none outline-none px-4 w-full text-sm dark:text-white"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <ThemeToggle />
          
          <div className="relative group cursor-pointer text-slate-600 dark:text-slate-400 hover:text-emerald-500">
            <FaHeart size={20} />
          </div>

          <div className="relative group cursor-pointer">
            <FaShoppingCart size={22} className="text-slate-600 dark:text-slate-400 group-hover:text-emerald-500" />
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-4 ring-white dark:ring-[#0f172a]">
              {items.length}
            </span>
          </div>

          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center cursor-pointer border border-transparent hover:border-emerald-500/50 transition-all">
            <FaUser className="text-slate-600 dark:text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
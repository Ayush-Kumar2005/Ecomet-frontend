import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaBox,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaSearch,
  FaShieldAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import ThemeToggle from "./ThemeToggle";
import EcometLogo from "./EcometLogo";
import SearchBar from "./SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import { isAdminUser } from "../utils/isAdmin";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((store) => store.cart.items);
  const { userInfo } = useSelector((state) => state.auth);
  const admin = isAdminUser(userInfo);

  const [showMenu, setShowMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const menuRef = useRef();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
    setShowMenu(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileSearchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSearchOpen]);

  const cartCount = items.length;

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full bg-slate-900 dark:bg-[#030712] border-b border-slate-700/80 dark:border-white/10 shadow-lg shadow-slate-900/20"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <Link to="/" className="flex-shrink-0" aria-label="Ecomet home">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <EcometLogo size={40} />
              </motion.div>
            </Link>

            <div className="hidden md:block flex-1 flex justify-center px-4">
              <SearchBar />
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={() => setMobileSearchOpen(true)}
                className="md:hidden p-2.5 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                aria-label="Open search"
              >
                <FaSearch size={18} />
              </button>

              <ThemeToggle />

              <Link
                to="/wishlist"
                className="p-2.5 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                aria-label="Wishlist"
              >
                <FaHeart size={18} />
              </Link>

              <Link
                to="/cart"
                className="p-2.5 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors relative"
                aria-label={`Shopping cart, ${cartCount} items`}
              >
                <FaShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-emerald-500 text-slate-900 text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-slate-900">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                  aria-expanded={showMenu}
                  aria-haspopup="true"
                  aria-label="Account menu"
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-600/50 flex items-center justify-center text-slate-200 hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
                >
                  <FaUser />
                </button>

                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-14 w-72 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-5 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                        {userInfo ? (
                          <>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Hello 👋
                            </p>
                            <h3 className="font-bold text-slate-900 dark:text-white mt-0.5">
                              {userInfo.name}
                            </h3>
                            {admin && (
                              <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">
                                Administrator
                              </span>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Welcome to Ecomet
                          </p>
                        )}
                      </div>

                      <div className="p-2">
                        {userInfo ? (
                          <>
                            {admin && (
                              <Link
                                to="/admin"
                                onClick={() => setShowMenu(false)}
                              >
                                <button
                                  type="button"
                                  className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 transition-colors mb-1"
                                >
                                  <FaShieldAlt /> Admin Dashboard
                                </button>
                              </Link>
                            )}
                            <button
                              type="button"
                              className="w-full flex items-center gap-3 p-3 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                            >
                              <FaUserCircle className="text-emerald-500" /> My
                              Profile
                            </button>
                            <button
                              type="button"
                              className="w-full flex items-center gap-3 p-3 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                            >
                              <FaBox className="text-emerald-500" /> My Orders
                            </button>
                            <button
                              type="button"
                              className="w-full flex items-center gap-3 p-3 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                            >
                              <FaCog className="text-emerald-500" /> Settings
                            </button>
                            <button
                              type="button"
                              onClick={logoutHandler}
                              className="w-full flex items-center gap-3 p-3 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition-colors mt-1"
                            >
                              <FaSignOutAlt /> Logout
                            </button>
                          </>
                        ) : (
                          <div className="p-2 space-y-2">
                            <Link to="/login" onClick={() => setShowMenu(false)}>
                              <button type="button" className="btn-primary w-full">
                                Login
                              </button>
                            </Link>
                            <Link to="/signup" onClick={() => setShowMenu(false)}>
                              <button type="button" className="btn-secondary w-full">
                                Create Account
                              </button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] md:hidden"
          >
            <div
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setMobileSearchOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="relative bg-white dark:bg-[#0f172a] p-4 pt-6 shadow-2xl"
            >
              <SearchBar
                variant="page"
                autoFocus
                onClose={() => setMobileSearchOpen(false)}
              />
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="mt-4 w-full py-3 text-sm font-semibold text-slate-500"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

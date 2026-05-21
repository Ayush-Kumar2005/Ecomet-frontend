import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaBox,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

import ThemeToggle from "./ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((store) => store.cart.items);
  const { userInfo } = useSelector((state) => state.auth);

  const [showMenu, setShowMenu] = useState(false);

  // 🔍 SEARCH STATES
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const menuRef = useRef();
  const searchRef = useRef();

  // LOGOUT
  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
    setShowMenu(false);
  };

  // OUTSIDE CLICK CLOSE USER MENU
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // OUTSIDE CLICK CLOSE SEARCH DROPDOWN
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 🔥 DEBOUNCED SUGGESTIONS
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      fetchSuggestions(query);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  // API CALL (LIMITED RESULTS)
  const fetchSuggestions = async (text) => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/products/search?q=${text}`
      );

      const data = await res.json();

      setSuggestions(data.slice(0, 6)); // top 6 only
      setShowSuggestions(true);
    } catch (err) {
      console.log(err);
    }
  };

  // SEARCH SUBMIT → GO TO SEARCH PAGE
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-8">

        {/* BRAND */}
        <Link to="/">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              🛍️
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              ECOMET
            </h1>
          </div>
        </Link>

        {/* SEARCH */}
        <form
          onSubmit={handleSearchSubmit}
          ref={searchRef}
          className="relative hidden md:flex flex-1 max-w-xl items-center bg-slate-100 dark:bg-white/5 rounded-2xl px-4 py-2"
        >
          <FaSearch className="text-slate-400" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="bg-transparent outline-none px-4 w-full text-sm dark:text-white"
            onFocus={() => query && setShowSuggestions(true)}
          />

          {/* DROPDOWN SUGGESTIONS */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-12 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">

              {suggestions.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(item.name)}`);
                    setQuery("");
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {item.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 md:gap-6">

          <ThemeToggle />

          <Link to="/wishlist">
            <FaHeart className="text-slate-600 dark:text-slate-400 hover:text-emerald-500" />
          </Link>

          <Link to="/cart" className="relative">
            <FaShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              {items.length}
            </span>
          </Link>

          {/* USER MENU */}
          <div className="relative" ref={menuRef}>

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center"
            >
              <FaUser />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-14 w-72 bg-white dark:bg-[#0f172a] border rounded-3xl shadow-2xl">

                <div className="p-5 border-b">
                  {userInfo ? (
                    <>
                      <p>Hello 👋</p>
                      <h3 className="font-bold">{userInfo.name}</h3>
                    </>
                  ) : (
                    <p>Welcome</p>
                  )}
                </div>

                <div className="p-3">

                  {userInfo ? (
                    <>
                      <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-white/5">
                        <FaUserCircle /> My Profile
                      </button>

                      <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-white/5">
                        <FaBox /> My Orders
                      </button>

                      <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-white/5">
                        <FaCog /> Settings
                      </button>

                      <button
                        onClick={logoutHandler}
                        className="w-full flex items-center gap-3 p-3 text-red-500"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login">
                        <button className="w-full bg-emerald-500 py-3 rounded-xl font-bold">
                          Login
                        </button>
                      </Link>

                      <Link to="/signup">
                        <button className="w-full mt-2 border py-3 rounded-xl">
                          Create Account
                        </button>
                      </Link>
                    </>
                  )}

                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaTimes,
  FaArrowRight,
  FaFire,
  FaClock,
} from "react-icons/fa";

const TRENDING = ["Sneakers", "Headphones", "Summer dress", "Smart watch", "Skincare"];
const RECENT_KEY = "ecomet_recent_searches";
const MAX_RECENT = 6;

const normalizeResults = (data) => {
  if (Array.isArray(data)) return data;
  return data?.main || data?.products || data?.data || [];
};

const SearchBar = ({
  variant = "header",
  autoFocus = false,
  onClose,
  className = "",
}) => {
  const navigate = useNavigate();
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [activeIndex, setActiveIndex] = useState(-1);

  const isPage = variant === "page";
  const isExpanded = open || isPage;

  const saveRecent = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(
      0,
      MAX_RECENT
    );
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  const fetchSuggestions = useCallback(async (text) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5001/api/products/search?q=${encodeURIComponent(text)}`
      );
      const data = await res.json();
      setSuggestions(normalizeResults(data).slice(0, 8));
    } catch (err) {
      console.log(err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    const t = setTimeout(() => fetchSuggestions(query), 280);
    return () => clearTimeout(t);
  }, [query, fetchSuggestions]);

  useEffect(() => {
    if (!autoFocus) return;
    inputRef.current?.focus();
    setOpen(true);
  }, [autoFocus]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        if (!isPage) setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isPage]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && !isPage && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        onClose?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPage, onClose]);

  const goSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    saveRecent(trimmed);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    onClose?.();
  };

  const goProduct = (id) => {
    navigate(`/productDetails/${id}`);
    setQuery("");
    setOpen(false);
    onClose?.();
  };

  const flatItems = [
    ...(query.length < 2 && recent.length
      ? recent.map((r) => ({ type: "recent", label: r }))
      : []),
    ...(query.length < 2
      ? TRENDING.map((t) => ({ type: "trending", label: t }))
      : []),
    ...suggestions.map((p) => ({ type: "product", product: p })),
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeIndex >= 0 && flatItems[activeIndex]) {
      const item = flatItems[activeIndex];
      if (item.type === "product") goProduct(item.product._id);
      else goSearch(item.label);
      return;
    }
    goSearch(query);
  };

  const handleKeyDown = (e) => {
    if (!isExpanded) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    }
  };

  const shellClass = isPage
    ? "w-full"
    : `flex-1 max-w-2xl ${open ? "max-w-3xl" : ""}`;

  const fieldClass = isPage
    ? "flex items-center gap-3 bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 shadow-lg focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15"
    : `flex items-center gap-2 bg-slate-800/95 border rounded-2xl px-4 py-2.5 transition-all duration-300 ${
        open
          ? "border-emerald-500/70 ring-2 ring-emerald-500/25 shadow-lg shadow-emerald-500/10"
          : "border-slate-600/60 hover:border-slate-500"
      }`;

  return (
    <div ref={wrapRef} className={`relative ${shellClass} ${className}`}>
      <form onSubmit={handleSubmit} role="search" className={fieldClass}>
        <FaSearch
          className={`flex-shrink-0 ${isPage ? "text-emerald-500 text-lg" : "text-slate-400"}`}
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            isPage
              ? "Search products, brands, categories…"
              : "Search products, brands…"
          }
          aria-label="Search products"
          aria-expanded={isExpanded}
          aria-autocomplete="list"
          className={`flex-1 bg-transparent outline-none min-w-0 ${
            isPage
              ? "text-base text-slate-900 dark:text-white placeholder:text-slate-400"
              : "text-sm text-white placeholder:text-slate-500 px-2"
          }`}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
            aria-label="Clear search"
          >
            <FaTimes className="text-xs" />
          </button>
        )}

        {!isPage && !open && (
          <kbd className="hidden lg:inline-flex text-[10px] font-mono text-slate-500 bg-slate-700/80 px-2 py-1 rounded-md border border-slate-600">
            /
          </kbd>
        )}

        <button
          type="submit"
          className={
            isPage
              ? "btn-primary !py-2.5 !px-5 !text-sm flex-shrink-0"
              : "text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 hover:text-slate-900 transition-colors flex-shrink-0"
          }
        >
          {isPage ? "Search" : "Go"}
        </button>
      </form>

      <AnimatePresence>
        {isExpanded && (query.length >= 2 || recent.length > 0 || !query) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className={`absolute left-0 right-0 z-[60] mt-2 rounded-2xl border overflow-hidden shadow-2xl ${
              isPage
                ? "bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/10"
                : "bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/10"
            }`}
          >
            {loading && (
              <div className="px-4 py-3 text-xs text-slate-500 flex items-center gap-2 border-b border-slate-100 dark:border-white/5">
                <span className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                Searching…
              </div>
            )}

            <div className="max-h-[min(420px,70vh)] overflow-y-auto">
              {query.length < 2 && recent.length > 0 && (
                <div className="p-2 border-b border-slate-100 dark:border-white/5">
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FaClock /> Recent
                  </p>
                  {recent.map((r, i) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => goSearch(r)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm ${
                        activeIndex === i
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      <FaClock className="text-slate-400 text-xs" />
                      {r}
                    </button>
                  ))}
                </div>
              )}

              {query.length < 2 && (
                <div className="p-2">
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FaFire className="text-orange-400" /> Trending
                  </p>
                  <div className="flex flex-wrap gap-2 px-2 pb-2">
                    {TRENDING.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => goSearch(t)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-emerald-500/15 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="p-2">
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Products
                  </p>
                  {suggestions.map((item, i) => {
                    const idx =
                      (query.length < 2 ? 0 : 0) +
                      (query.length < 2 ? recent.length : 0) +
                      i;
                    const price =
                      item.price > 1000
                        ? Math.round(item.price / 100)
                        : item.price;
                    return (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => goProduct(item._id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${
                          activeIndex === idx
                            ? "bg-emerald-500/10"
                            : "hover:bg-slate-50 dark:hover:bg-white/5"
                        }`}
                      >
                        <img
                          src={item.images?.[0]?.url || item.image}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                            ₹{price}
                          </p>
                        </div>
                        <FaArrowRight className="text-slate-300 text-xs flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}

              {query.length >= 2 && !loading && suggestions.length === 0 && (
                <p className="px-4 py-6 text-sm text-slate-500 text-center">
                  No quick results — press Go for full search
                </p>
              )}
            </div>

            {query.length >= 2 && (
              <button
                type="button"
                onClick={() => goSearch(query)}
                className="w-full px-4 py-3 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 border-t border-slate-100 dark:border-white/5 flex items-center justify-center gap-2"
              >
                See all results for &ldquo;{query}&rdquo;
                <FaArrowRight className="text-xs" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;

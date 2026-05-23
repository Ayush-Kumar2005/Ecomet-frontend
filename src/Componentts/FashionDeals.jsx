import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaBolt } from "react-icons/fa";
import FashionCard from "./FashionCard";
import { SEASONAL_DEALS, DEAL_FILTERS } from "./seasonalDealsData";

const FashionDeal = () => {
  const scrollRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const filteredDeals =
    activeFilter === "all"
      ? SEASONAL_DEALS
      : SEASONAL_DEALS.filter((d) => d.filter === activeFilter);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? (el.scrollLeft / max) * 100 : 0);
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [activeFilter, updateScrollState]);

  // Gentle auto-scroll (pauses on hover)
  useEffect(() => {
    if (isPaused || filteredDeals.length <= 2) return;
    const id = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 260, behavior: "smooth" });
      }
    }, 4500);
    return () => clearInterval(id);
  }, [isPaused, activeFilter, filteredDeals.length]);

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-2 -mx-1 px-1">
        {DEAL_FILTERS.map((f) => {
          const isActive = activeFilter === f.id;
          const count =
            f.id === "all"
              ? SEASONAL_DEALS.length
              : SEASONAL_DEALS.filter((d) => d.filter === f.id).length;
          if (f.id !== "all" && count === 0) return null;

          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`relative flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                isActive
                  ? "text-white shadow-md shadow-emerald-500/30"
                  : "text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 hover:border-emerald-500/40"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="deal-filter-pill"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {f.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20"
                      : "bg-slate-100 dark:bg-white/10"
                  }`}
                >
                  {count}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Live deals", value: filteredDeals.length, icon: FaBolt },
          {
            label: "Up to",
            value: filteredDeals.length
              ? `${Math.max(...filteredDeals.map((d) => d.discount))}%`
              : "0%",
            icon: null,
          },
          { label: "Ends in", value: "48h", icon: null },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl bg-white/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 px-3 py-3 text-center backdrop-blur-sm"
          >
            {stat.icon && (
              <stat.icon className="text-amber-500 text-sm mx-auto mb-1" />
            )}
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Carousel */}
      <div
        className="relative group/carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              type="button"
              onClick={() => scrollBy("left")}
              aria-label="Previous deals"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-xl text-slate-700 dark:text-white hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors opacity-0 group-hover/carousel:opacity-100 md:opacity-100"
            >
              <FaChevronLeft size={14} />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {canScrollRight && filteredDeals.length > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              type="button"
              onClick={() => scrollBy("right")}
              aria-label="Next deals"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-xl text-slate-700 dark:text-white hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors opacity-0 group-hover/carousel:opacity-100 md:opacity-100"
            >
              <FaChevronRight size={14} />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          className="overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory px-1 py-2 -mx-1"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex gap-4 md:gap-5 w-max"
            >
              {filteredDeals.length > 0 ? (
                filteredDeals.map((deal, index) => (
                  <FashionCard key={deal.id} deal={deal} index={index} />
                ))
              ) : (
                <div className="w-full min-w-[280px] py-16 text-center text-slate-500 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
                  No deals in this category yet.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-1 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            style={{ width: `${scrollProgress}%` }}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* CTA row */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10 border border-emerald-500/20">
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left">
          <span className="font-bold text-slate-900 dark:text-white">
            Flash weekend
          </span>{" "}
          — Extra 10% off with code{" "}
          <code className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
            ECOMET10
          </code>
        </p>
        <Link to="/ViewAllFashionDeals">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary !py-2.5 !px-6 text-xs whitespace-nowrap"
          >
            Explore all deals
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default FashionDeal;

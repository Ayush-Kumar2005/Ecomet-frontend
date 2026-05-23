import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FashionCard from "./FashionCard";
import { SEASONAL_DEALS, DEAL_FILTERS } from "./seasonalDealsData";

const ViewAllFashionDeals = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredDeals =
    activeFilter === "all"
      ? SEASONAL_DEALS
      : SEASONAL_DEALS.filter((d) => d.filter === activeFilter);

  return (
    <div className="page-shell">
      <div className="page-container">
        <header className="mb-8">
          <p className="section-eyebrow mb-2">Deals</p>
          <h1 className="section-title">Fashion Deals</h1>
          <div className="section-accent" />
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm max-w-xl">
            Browse every seasonal collection. Tap a category to filter.
          </p>
        </header>

        <div className="flex flex-wrap gap-2 mb-8">
          {DEAL_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeFilter === f.id
                  ? "bg-emerald-500 text-slate-900 shadow-md"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 justify-items-center"
        >
          {filteredDeals.map((deal, index) => (
            <div key={deal.id} className="w-full max-w-[240px]">
              <FashionCard deal={deal} index={index} fullWidth />
            </div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Link to="/">
            <button type="button" className="btn-secondary">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewAllFashionDeals;

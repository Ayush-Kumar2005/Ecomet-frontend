import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaFire } from "react-icons/fa";

const TAG_STYLES = {
  HOT: "bg-orange-500 text-white",
  NEW: "bg-emerald-500 text-white",
  SALE: "bg-red-500 text-white",
  TRENDING: "bg-violet-500 text-white",
};

const FashionCard = ({ deal, index = 0, fullWidth = false }) => {
  const tagClass = TAG_STYLES[deal.tag] || TAG_STYLES.NEW;

  const sizeClass = fullWidth
    ? "relative w-full h-[300px] sm:h-[320px]"
    : "relative w-[200px] sm:w-[220px] md:w-[240px] h-[300px] sm:h-[320px]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={`${fullWidth ? "w-full" : "flex-shrink-0 snap-start"}`}
    >
      <Link to={deal.link} className="block group">
        <motion.article
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          className={`${sizeClass} rounded-3xl overflow-hidden bg-slate-900 shadow-lg shadow-slate-900/10 dark:shadow-black/40 border border-slate-200/50 dark:border-white/10`}
        >
          {/* Image */}
          <img
            src={deal.image}
            alt={deal.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${deal.accent} opacity-0 group-hover:opacity-25 transition-opacity duration-500 mix-blend-overlay`}
          />

          {/* Tag */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={`${tagClass} text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm`}
            >
              {deal.tag}
            </span>
            {deal.tag === "HOT" && (
              <FaFire className="text-orange-400 text-xs animate-pulse" />
            )}
          </div>

          {/* Discount pill */}
          <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl px-2.5 py-1.5 shadow-md">
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              {deal.discount}%
            </span>
            <span className="text-[9px] font-bold text-slate-500 block leading-none">
              OFF
            </span>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-300/90 mb-1">
              {deal.subtitle}
            </p>
            <h3 className="text-lg font-bold text-white leading-tight mb-3">
              {deal.title}
            </h3>

            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-white/90 group-hover:text-emerald-300 transition-colors">
                Shop deal
                <span className="w-7 h-7 rounded-full bg-white/15 group-hover:bg-emerald-500 flex items-center justify-center transition-all group-hover:translate-x-0.5">
                  <FaArrowRight className="text-[10px] group-hover:text-slate-900" />
                </span>
              </span>
            </div>
          </div>

          {/* Shine on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transform transition-transform duration-1000" />
        </motion.article>
      </Link>
    </motion.div>
  );
};

export default FashionCard;

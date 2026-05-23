import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSortAmountDown,
  FaFire,
  FaStar,
  FaTag,
  FaChevronDown,
  FaTh,
  FaThLarge,
} from "react-icons/fa";
import ProductCard from "./ProductCard";

const SORT_OPTIONS = [
  { id: "featured", label: "Featured", icon: FaFire },
  { id: "rating", label: "Top Rated", icon: FaStar },
  { id: "price-low", label: "Price ↑", icon: FaTag },
  { id: "price-high", label: "Price ↓", icon: FaSortAmountDown },
];

const INITIAL_VISIBLE = 8;

const getDisplayPrice = (p) => {
  const price = p.price ?? 0;
  return price > 1000 ? price / 100 : Number(price);
};

const ProductGrid = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [denseGrid, setDenseGrid] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5001/api/products");
        const json = await response.json();
        setProducts(json.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let list =
      selectedCategory === "All"
        ? [...products]
        : products.filter(
            (p) =>
              p.category?.name === selectedCategory ||
              p.category === selectedCategory
          );

    switch (sortBy) {
      case "rating":
        list.sort((a, b) => (b.ratings ?? 0) - (a.ratings ?? 0));
        break;
      case "price-low":
        list.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
        break;
      case "price-high":
        list.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
        break;
      default:
        break;
    }
    return list;
  }, [products, selectedCategory, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;
  const hasStructuredProducts = filteredProducts.some((p) => p._id && (p.images?.length || p.image));

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [sortBy, selectedCategory]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-10 w-24 rounded-full flex-shrink-0" />
          ))}
        </div>
        <div
          className={`grid gap-4 md:gap-6 ${
            denseGrid
              ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          <div className="col-span-2 row-span-2 hidden md:block skeleton min-h-[420px] rounded-3xl" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="skeleton aspect-[3/4] w-full" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📦</div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          No products found
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Try browsing another category or check back later.
        </p>
      </div>
    );
  }

  if (!hasStructuredProducts) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product, index) => (
          <ProductCard key={product._id || index} product={product} index={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
          {SORT_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = sortBy === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSortBy(opt.id)}
                className={`relative flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                  active
                    ? "text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="product-sort-pill"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-md shadow-emerald-500/25"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="text-[10px]" />
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {visibleProducts.length}
            </span>{" "}
            of {filteredProducts.length}
          </p>
          <div className="flex rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <button
              type="button"
              onClick={() => setDenseGrid(false)}
              aria-label="Comfortable grid"
              className={`p-2.5 transition-colors ${
                !denseGrid
                  ? "bg-emerald-500 text-slate-900"
                  : "bg-white dark:bg-slate-800 text-slate-500"
              }`}
            >
              <FaThLarge className="text-sm" />
            </button>
            <button
              type="button"
              onClick={() => setDenseGrid(true)}
              aria-label="Compact grid"
              className={`p-2.5 transition-colors ${
                denseGrid
                  ? "bg-emerald-500 text-slate-900"
                  : "bg-white dark:bg-slate-800 text-slate-500"
              }`}
            >
              <FaTh className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Product grid — bento featured + standard cards */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`${sortBy}-${denseGrid}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`grid gap-4 md:gap-6 ${
            denseGrid
              ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
              : "grid-cols-2 md:grid-cols-4"
          }`}
        >
          {!denseGrid && visibleProducts[0] && (
            <>
              <div className="col-span-2 row-span-2 hidden md:block">
                <ProductCard product={visibleProducts[0]} index={0} featured />
              </div>
              <div className="col-span-2 md:hidden">
                <ProductCard product={visibleProducts[0]} index={0} featured />
              </div>
            </>
          )}

          {(denseGrid ? visibleProducts : visibleProducts.slice(1)).map(
            (product, i) => (
              <ProductCard
                key={product._id}
                product={product}
                index={denseGrid ? i : i + 1}
              />
            )
          )}
        </motion.div>
      </AnimatePresence>

      {/* Load more */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-4"
        >
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + 8)}
            className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 font-bold text-sm hover:bg-emerald-500 hover:text-slate-900 hover:border-emerald-500 transition-all"
          >
            Load more products
            <FaChevronDown className="group-hover:translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ProductGrid;

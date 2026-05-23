import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CategoryTab = ({ cat, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative flex flex-col items-center cursor-pointer outline-none px-2 py-1 flex-shrink-0"
    aria-pressed={isActive}
  >
    <span
      className={`text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 whitespace-nowrap ${
        isActive
          ? "text-emerald-500"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
      }`}
    >
      {cat.name || "ALL"}
    </span>
    <div
      className={`absolute -bottom-[17px] left-0 right-0 h-0.5 bg-emerald-500 rounded-full transition-all duration-300 ${
        isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
      }`}
    />
  </button>
);

const Categories = ({ selectedCategory, setSelectedCategory }) => {
  const [categories, setApiCategories] = useState([]);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const staticCategories = [
    { name: "Electronics" },
    { name: "Fashion" },
    { name: "Mobiles" },
    { name: "Home" },
    { name: "Appliances" },
    { name: "Gaming" },
    { name: "Beauty" },
    { name: "Grocery" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/categories/main"
        );
        const json = await response.json();
        console.log(json);
        if (json?.data) setApiCategories(json.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  const displayCategories =
    categories.length > 0 ? categories : staticCategories;

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Start from the left so ALL and first categories are visible
    el.scrollLeft = 0;
    updateScrollButtons();

    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    const observer = new ResizeObserver(updateScrollButtons);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
      observer.disconnect();
    };
  }, [displayCategories.length, updateScrollButtons]);

  const scrollBy = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(200, el.clientWidth * 0.6);
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <nav
      className="w-full bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/10 shadow-sm sticky top-[72px] z-40"
      aria-label="Product categories"
    >
      <div className="max-w-7xl mx-auto relative px-2 sm:px-4 md:px-6">
        {/* Left scroll */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollBy("left")}
            aria-label="Scroll categories left"
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-md text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500/40 transition-colors"
          >
            <FaChevronLeft size={12} />
          </button>
        )}

        {/* Right scroll */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollBy("right")}
            aria-label="Scroll categories right"
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-md text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500/40 transition-colors"
          >
            <FaChevronRight size={12} />
          </button>
        )}

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth px-6 sm:px-10"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex items-center justify-start gap-5 sm:gap-8 md:gap-10 py-4 w-max min-h-[44px]">
            <CategoryTab
              cat={{ name: "ALL" }}
              isActive={!selectedCategory}
              onClick={() => setSelectedCategory(null)}
            />

            {displayCategories.map((cat, index) => (
              <CategoryTab
                key={cat._id || `${cat.name}-${index}`}
                cat={cat}
                isActive={selectedCategory?._id === cat._id}
                onClick={() => {
                  console.log("Clicked category:", cat);
                  console.log("Category ID:", cat._id);
                  setSelectedCategory(cat);
                }}
              />
            ))}
          </div>
        </div>

        {/* Edge fade hints on mobile */}
        {canScrollLeft && (
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-[#0f172a] to-transparent sm:hidden"
            aria-hidden
          />
        )}
        {canScrollRight && (
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#0f172a] to-transparent sm:hidden"
            aria-hidden
          />
        )}
      </div>
    </nav>
  );
};

export default Categories;

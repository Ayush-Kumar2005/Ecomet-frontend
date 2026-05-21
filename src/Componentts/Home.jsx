import React, { useState } from "react";
import Categories from "./Categories";
import ProductGrid from "./ProductGrid";
import Carousels from "./Carousels";
import FashionDeal from "./FashionDeals";
import Footer from "./Footer";


import SubCategoriesPreview from "./SubCategoriesPreview";
import CategoryProductsSection from "./CategoryProductsSection";

const Home = () => {

  // null = ALL category
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="bg-slate-50 dark:bg-[#020617] min-h-screen text-slate-900 dark:text-white transition-colors duration-500 font-sans">

      {/* TOP CATEGORY BAR */}
      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* HERO CAROUSEL */}
      <section className="max-w-[1440px] mx-auto pt-4 px-2 md:px-4">
        <Carousels />
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ========================= */}
        {/* ALL PRODUCTS VIEW */}
        {/* ========================= */}
        {!selectedCategory && (
          <section className="py-12 md:py-16">

            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">

              <div className="space-y-1">
                <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em]">
                  Featured
                </span>

                <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
                  Top Collections
                </h2>

                <div className="h-1.5 w-20 bg-emerald-500 rounded-full"></div>
              </div>

            </div>

            <ProductGrid />

          </section>
        )}

        {/* ========================= */}
        {/* CATEGORY VIEW */}
        {/* ========================= */}
        {selectedCategory && (
          <>
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 mt-10">

              <div>
                <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em]">
                  Category Filter
                </span>

                <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
                  {selectedCategory.name}
                </h2>

                <div className="h-1.5 w-20 bg-emerald-500 rounded-full mt-2"></div>
              </div>

              <button
                onClick={() => setSelectedCategory(null)}
                className="bg-slate-200 dark:bg-white/10 px-4 py-2 rounded-full text-xs font-bold hover:bg-emerald-500 hover:text-black transition-all"
              >
                Clear Filters ✕
              </button>

            </div>

            {/* 1. SUB CATEGORIES SECTION */}
            <SubCategoriesPreview
              categoryId={selectedCategory._id}
            />

            {/* 2. LATEST PRODUCTS SECTION */}
            <CategoryProductsSection
              categoryId={selectedCategory._id}
            />
          </>
        )}

        {/* MID BANNER */}
        <div className="my-10 w-full rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-teal-900 p-10 md:p-16 shadow-2xl relative overflow-hidden text-white">

          <div className="relative z-10 max-w-xl">
            <h3 className="text-4xl md:text-6xl font-black mb-4 leading-none">
              MEGA SALE <br /> IS LIVE.
            </h3>

            <p className="text-emerald-100 text-lg opacity-90 mb-8">
              Get up to 60% off on all electronics.
            </p>

            <button className="bg-white text-black px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all">
              SHOP NOW
            </button>
          </div>

          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* FASHION SECTION */}
        <section className="py-20 bg-slate-50 dark:bg-white/5 transition-colors duration-500">

          <div className="max-w-7xl mx-auto px-6 md:px-10">

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">

              <div className="relative">

                <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.4em] mb-2 block">
                  Seasonal Trends
                </span>

                <h2 className="text-3xl md:text-5xl font-black uppercase italic">
                  Fashion <span className="text-emerald-500">Deals</span>
                </h2>

              </div>

              <button className="px-6 py-3 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-black hover:bg-emerald-500 hover:text-black transition-all">
                See All Items
              </button>

            </div>

            <FashionDeal />

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
};

export default Home;
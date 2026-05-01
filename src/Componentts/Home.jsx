import React, { useState } from "react";
import Categories from "./Categories";
import ProductGrid from "./ProductGrid";
import Carousels from "./Carousels";
import FashionDeal from "./FashionDeals"; // Ensure this file exists or comment it out
import Footer from "./Footer";

const Home = () => {
  // This state is the "Brain" of your home page - it controls the sorting
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="bg-slate-50 dark:bg-[#020617] min-h-screen text-slate-900 dark:text-white transition-colors duration-500 font-sans">
      
      {/* 1. TOP QUICK-NAV (The Amazon/Flipkart Bar) */}
      <Categories 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />

      {/* 2. HERO CAROUSEL */}
      <section className="max-w-[1440px] mx-auto pt-4 px-2 md:px-4">
        <Carousels />
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* 3. DYNAMIC PRODUCT GRID (The main sorting area) */}
        <section className="py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="space-y-1">
              <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em]">
                {selectedCategory === "All" ? "Featured" : "Category Filter"}
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                {selectedCategory === "All" ? "Top Collections" : selectedCategory}
              </h2>
              <div className="h-1.5 w-20 bg-emerald-500 rounded-full"></div>
            </div>

            {/* Clear Filter Button */}
            {selectedCategory !== "All" && (
              <button 
                onClick={() => setSelectedCategory("All")}
                className="bg-slate-200 dark:bg-white/10 px-4 py-2 rounded-full text-xs font-bold hover:bg-emerald-500 hover:text-black transition-all"
              >
                Clear Filters ✕
              </button>
            )}
          </div>

          {/* This is the file you just created! */}
          <ProductGrid selectedCategory={selectedCategory} />
        </section>

        {/* 4. MID-PAGE PROMO BANNER (Fills the 'rest' of the page) */}
        <div className="my-10 w-full rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-teal-900 p-10 md:p-16 shadow-2xl relative overflow-hidden text-white">
           <div className="relative z-10 max-w-xl">
              <h3 className="text-4xl md:text-6xl font-black mb-4 leading-none">
                MEGA SALE <br/> IS LIVE.
              </h3>
              <p className="text-emerald-100 text-lg opacity-90 mb-8">
                Get up to 60% off on all electronics. Valid for a limited time only!
              </p>
              <button className="bg-white text-black px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all">
                SHOP NOW
              </button>
           </div>
           {/* Abstract shape for premium look */}
           <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

       {/* 5. FASHION DEALS - Boutique Gallery */}
<section className="py-20 bg-slate-50 dark:bg-white/5 transition-colors duration-500">
  <div className="max-w-7xl mx-auto px-6 md:px-10">
    
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
      <div className="relative">
        <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.4em] mb-2 block">
          Seasonal Trends
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
          Fashion <span className="text-emerald-500">Deals</span>
        </h2>
        {/* Decorative line */}
        <div className="absolute -bottom-4 left-0 h-1.5 w-24 bg-gradient-to-r from-emerald-500 to-transparent rounded-full"></div>
      </div>
      
      <div className="flex items-center gap-4">
        <p className="hidden md:block text-slate-500 dark:text-gray-400 text-sm font-medium">
          Limited time luxury offers
        </p>
        <button className="px-6 py-3 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-black hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all shadow-sm uppercase tracking-widest">
          See All Items
        </button>
      </div>
    </div>

    <FashionDeal />
    
  </div>
</section>

      </main>

      {/* 6. FOOTER */}
      <Footer />

    </div>
  );
};

export default Home;
import React, { useState } from "react";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import Categories from "./Categories";

import ProductGrid from "./ProductGrid";

import Carousels from "./Carousels";

import FashionDeal from "./FashionDeals";

import Footer from "./Footer";

import SubCategoriesPreview from "./SubCategoriesPreview";

import CategoryProductsSection from "./CategoryProductsSection";



const Home = () => {

  const [selectedCategory, setSelectedCategory] = useState(null);



  return (

    <div className="page-shell flex flex-col">

      <Categories

        selectedCategory={selectedCategory}

        setSelectedCategory={setSelectedCategory}

      />



      <section className="max-w-[1440px] mx-auto w-full pt-4 px-2 sm:px-4 md:px-6">

        <Carousels />

      </section>



      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 flex-1">

        {!selectedCategory && (
          <section className="relative py-12 md:py-16">
            <div
              className="absolute inset-0 -mx-4 sm:-mx-6 md:-mx-8 rounded-3xl bg-gradient-to-b from-white via-slate-50/50 to-transparent dark:from-slate-900/50 dark:via-transparent dark:to-transparent pointer-events-none"
              aria-hidden
            />

            <div className="relative">
              <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 md:mb-10">
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 dark:bg-emerald-500/20 text-white dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Featured
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
                  >
                    Top{" "}
                    <span className="bg-gradient-to-r from-slate-800 to-emerald-600 dark:from-white dark:to-emerald-400 bg-clip-text text-transparent">
                      Collections
                    </span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-500 dark:text-slate-400 mt-3 max-w-lg text-sm md:text-base"
                  >
                    Editor&apos;s picks with quick add, live ratings, and sortable
                    deals — updated from our catalog.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-wrap gap-3"
                >
                  <Link to="/ViewAllCategories">
                    <button type="button" className="btn-secondary text-sm">
                      All categories
                    </button>
                  </Link>
                </motion.div>
              </header>

              <ProductGrid />
            </div>
          </section>
        )}



        {selectedCategory && (

          <>

            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10 mt-8 md:mt-10">

              <div>

                <span className="section-eyebrow">Category Filter</span>

                <h2 className="section-title mt-2">{selectedCategory.name}</h2>

                <div className="section-accent" />

              </div>

              <button

                type="button"

                onClick={() => setSelectedCategory(null)}

                className="btn-secondary !py-2.5 !px-5 !text-xs self-start sm:self-auto"

              >

                Clear Filters ✕

              </button>

            </header>



            <SubCategoriesPreview categoryId={selectedCategory._id} />

            <CategoryProductsSection categoryId={selectedCategory._id} />

          </>

        )}



        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="my-12 md:my-16 w-full rounded-3xl border border-emerald-800/40 bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900 p-8 md:p-14 shadow-xl shadow-emerald-900/25 relative overflow-hidden"
        >
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-900 mb-4">
              Limited Time
            </span>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight text-white drop-shadow-sm">
              Mega Sale Is Live
            </h3>

            <p className="text-emerald-50 text-base md:text-lg mb-8 max-w-md font-medium">
              Get up to 60% off on all electronics. Don&apos;t miss out.
            </p>

            <button
              type="button"
              className="bg-white text-emerald-800 px-8 py-3.5 rounded-2xl font-bold hover:bg-emerald-50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/20"
            >
              Shop Now
            </button>
          </div>

          <div
            className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"
            aria-hidden
          />
          <div
            className="absolute -left-10 bottom-0 w-64 h-64 bg-teal-500/15 rounded-full blur-2xl pointer-events-none"
            aria-hidden
          />
        </motion.div>



        <section className="relative py-14 md:py-20 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-slate-100 via-white to-slate-50 dark:from-slate-900/80 dark:via-[#020617] dark:to-[#020617] rounded-t-[2.5rem]"
            aria-hidden
          />
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"
            aria-hidden
          />
          <div
            className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"
            aria-hidden
          />

          <div className="relative max-w-7xl mx-auto">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Seasonal Trends
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
                >
                  Curated{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    Fashion Deals
                  </span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-slate-500 dark:text-slate-400 mt-3 max-w-lg text-sm md:text-base"
                >
                  Hand-picked drops with live discounts. Filter by category and
                  swipe through this week&apos;s best offers.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <div className="hidden sm:flex flex-col items-end text-right mr-2">
                  <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    8+
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Active collections
                  </span>
                </div>
                <Link to="/ViewAllFashionDeals">
                  <button type="button" className="btn-secondary text-sm">
                    View catalog →
                  </button>
                </Link>
              </motion.div>
            </header>

            <FashionDeal />
          </div>
        </section>

      </main>



      <Footer />

    </div>

  );

};



export default Home;


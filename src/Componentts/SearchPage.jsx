import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("q") || "";

  const [products, setProducts] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("relevance");

  const fetchSearchResults = async (q) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5001/api/products/search?q=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      const main = Array.isArray(data) ? data : data.main || data.products || [];
      setProducts(main);
      setRelated(data.related || []);
    } catch (err) {
      console.log(err);
      setProducts([]);
      setRelated([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!query) return;
    fetchSearchResults(query);
  }, [query]);

  const sortedProducts = [...products].sort((a, b) => {
    const pa = a.price > 1000 ? a.price / 100 : a.price;
    const pb = b.price > 1000 ? b.price / 100 : b.price;
    if (sort === "price-low") return pa - pb;
    if (sort === "price-high") return pb - pa;
    if (sort === "rating") return (b.ratings ?? 0) - (a.ratings ?? 0);
    return 0;
  });

  return (
    <div className="page-shell">
      <div className="page-container max-w-5xl">
        {/* Hero search */}
        <section className="mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="section-eyebrow mb-2">Discover</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              What are you looking for?
            </h1>
          </motion.div>
          <SearchBar variant="page" />
        </section>

        {!query ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaSearch />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Start typing to search
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-md">
              Use the search bar above or press{" "}
              <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-xs font-mono">
                /
              </kbd>{" "}
              from any page on desktop.
            </p>
          </div>
        ) : (
          <>
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Results for &ldquo;{query}&rdquo;
                </h2>
                {!loading && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {products.length} match{products.length !== 1 ? "es" : ""}{" "}
                    found
                  </p>
                )}
              </div>

              {products.length > 0 && (
                <div className="flex items-center gap-2">
                  <FaFilter className="text-slate-400 text-sm" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="input-field !py-2.5 !px-4 !text-sm !w-auto min-w-[160px]"
                    aria-label="Sort results"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Top rated</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                  </select>
                </div>
              )}
            </header>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="skeleton aspect-[3/4] w-full" />
                    <div className="skeleton h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaSearch />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  No results found
                </h2>
                <p className="text-sm text-slate-500 max-w-md">
                  Try different keywords or browse{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="text-emerald-600 font-semibold hover:underline"
                  >
                    all collections
                  </button>
                  .
                </p>
              </div>
            ) : (
              <>
                <section className="mb-12">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {sortedProducts.map((p, index) => (
                      <ProductCard key={p._id} product={p} index={index} />
                    ))}
                  </div>
                </section>

                {related.length > 0 && (
                  <section className="pt-8 border-t border-slate-200 dark:border-white/10">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                      You may also like
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {related.map((p, index) => (
                        <ProductCard key={p._id} product={p} index={index} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";

const Product = () => {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [id]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await fetch(
        `http://localhost:5001/api/products/sub-category/${id}`
      );

      const json = await data.json();

      setProducts(json?.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="section-eyebrow">Premium Collection</span>
            <h1 className="section-title mt-2">Products</h1>
            <div className="section-accent" />
          </div>

          {!loading && (
            <div className="card !p-4 !rounded-2xl self-start">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-bold text-slate-900 dark:text-white">
                  {products.length}
                </span>{" "}
                products available
              </p>
            </div>
          )}
        </header>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton aspect-[3/4] w-full" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((prod, index) => (
              <ProductCard key={prod._id} product={prod} index={index} />
            ))}
          </div>
        ) : (
          <div className="empty-state py-16">
            <div className="empty-state-icon">
              <span className="text-3xl">🛍️</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No products found
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
              We couldn&apos;t find any products in this category right now.
              Please check again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
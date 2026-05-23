import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const CategoryProductsSection = ({ categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5001/api/products/category/${categoryId}`
        );

        console.log("PRODUCTS API:", res.data);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.products || res.data?.data || [];

        setProducts(data);
      } catch (error) {
        console.log(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return (
    <section className="pb-12">
      <header className="mb-8">
        <span className="section-eyebrow">Trending Now</span>
        <h2 className="section-title mt-2">Fresh Picks</h2>
        <div className="section-accent" />
      </header>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton aspect-[3/4] w-full" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state py-12">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No products in this category yet. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {(Array.isArray(products) ? products : []).map((product, index) =>
            product.images?.length ? (
              <ProductCard
                key={product._id}
                product={product}
                index={index}
              />
            ) : (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Link to={`/productDetails/${product._id}`}>
                  <article className="card-product overflow-hidden">
                    <img
                      src={product?.images?.[0]?.url || "/placeholder.png"}
                      alt={product?.name || "product"}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-1 text-slate-900 dark:text-white">
                        {product?.name}
                      </h3>
                      <p className="text-brand-600 dark:text-brand-400 font-extrabold text-lg mt-2">
                        ₹{product?.price}
                      </p>
                    </div>
                  </article>
                </Link>
              </motion.div>
            )
          )}
        </div>
      )}
    </section>
  );
};

export default CategoryProductsSection;

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
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-10">
        
        {/* HEADER */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          <div>
            <span className="text-emerald-400 uppercase tracking-[0.35em] text-xs font-bold">
              Premium Collection
            </span>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight italic mt-2">
              Products
            </h1>

            <div className="mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 to-transparent"></div>
          </div>

          <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-xl">
            <p className="text-sm text-gray-300">
              {products.length} Products Available
            </p>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-[320px] rounded-[2rem] bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          
          /* PRODUCT GRID */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((prod) => (
              <div
                key={prod._id}
                className="
                  transform
                  hover:-translate-y-2
                  transition-all
                  duration-500
                "
              >
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        ) : (
          
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <span className="text-4xl">🛍️</span>
            </div>

            <h2 className="text-2xl font-bold mb-3">
              No Products Found
            </h2>

            <p className="text-gray-400 max-w-md">
              We couldn't find any products in this category right now.
              Please check again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
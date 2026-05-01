import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaStar, FaRegHeart } from "react-icons/fa";

const ProductGrid = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category?.name === selectedCategory || p.category === selectedCategory);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 bg-slate-200 dark:bg-white/5 animate-pulse rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {filteredProducts.map((product) => (
        <div key={product._id} className="group bg-white dark:bg-[#1e293b] rounded-[2rem] p-4 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-[#0f172a] mb-4">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{product.name}</h3>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xl font-black text-slate-900 dark:text-white">${product.price}</span>
              <button className="bg-emerald-500 text-black p-3 rounded-xl hover:scale-110 transition-transform">
                <FaShoppingCart />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
import React, { useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import { motion } from "framer-motion";

const ViewAllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetch("http://localhost:5001/api/categories/main");
        const json = await data.json();
        console.log(json);
        setCategories(json?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="page-shell">
      <div className="page-container">
        <header className="mb-10">
          <p className="section-eyebrow mb-2">Browse</p>
          <h1 className="section-title">All Categories</h1>
          <div className="section-accent" />
        </header>

        {loading ? (
          <div className="flex flex-wrap gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton w-44 h-56 rounded-3xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <p className="text-slate-500 text-sm">No categories available.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-5"
          >
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ViewAllCategories;

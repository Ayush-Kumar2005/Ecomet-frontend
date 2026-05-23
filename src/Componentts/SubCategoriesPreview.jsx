import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SubCategoriesPreview = ({ categoryId }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  useEffect(() => {
    if (!categoryId) return;

    const fetchSubCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5001/api/categories/sub/${categoryId}`
        );

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.subCategories || [];

        setSubCategories(data);
      } catch (error) {
        console.log(error);
        setSubCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [categoryId]);

  const items = (Array.isArray(subCategories) ? subCategories : []).slice(
    0,
    12
  );

  return (
    <div className="mb-16">
      <header className="mb-8">
        <h3 className="section-title text-2xl md:text-3xl">
          Shop By Category
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Discover trending collections
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-4">
              <div className="skeleton h-28 w-full rounded-2xl mb-3" />
              <div className="skeleton h-4 w-2/3 mx-auto" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state py-10">
          <p className="text-sm text-slate-500">
            No subcategories available for this selection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04 }}
            >
              <Link to={`/product/${item._id}`}>
                <article className="card-interactive p-4 text-center h-full">
                  <img
                    src={item?.images?.[0]?.url || DEFAULT_IMAGE}
                    alt={item?.name || "subcategory"}
                    className="w-full h-24 sm:h-28 object-cover rounded-2xl mb-3 bg-slate-100 dark:bg-surface-dark"
                  />
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2">
                    {item?.name}
                  </h4>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCategoriesPreview;

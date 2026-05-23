import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CategoryCard = ({ category }) => {
  const imageUrl =
    category?.images?.[0]?.url ||
    "https://cottonfolk.in/cdn/shop/files/Men_sBrownPinstripeShort-SleeveShirt.jpg?v=1732268509&width=2048";

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} layout={false}>
      <Link to={`/category/${category._id}`}>
        <article className="card-interactive w-40 sm:w-44 h-56 flex flex-col overflow-hidden">
          <div className="flex-1 bg-slate-100 dark:bg-surface-dark overflow-hidden">
            <img
              src={imageUrl}
              alt={category?.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex items-center justify-center h-16 px-3 border-t border-slate-100 dark:border-white/5">
            <p className="text-sm font-semibold text-slate-900 dark:text-white text-center line-clamp-2">
              {category?.name}
            </p>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;

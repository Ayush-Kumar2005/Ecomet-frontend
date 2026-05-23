import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaHeart, FaEye, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addItem } from "../slices/cartSlice";
import toast from "react-hot-toast";

const ProductCard = ({ product, index = 0, featured = false }) => {
  const dispatch = useDispatch();
  const [wishlisted, setWishlisted] = useState(false);

  const { _id, name, ratings, numOfReviews, price, images, category } = product;

  const image_url =
    images?.[0]?.url ||
    product.image ||
    "https://cottonfolk.in/cdn/shop/files/Men_sBrownPinstripeShort-SleeveShirt.jpg?v=1732268509&width=2048";

  const displayPrice =
    price > 1000 ? Math.round(price / 100) : Number(price) || 0;
  const mrp = Math.floor(displayPrice + displayPrice * 0.25);
  const categoryLabel = category?.name || product.brand?.name || "Collection";

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addItem({
        id: _id,
        name,
        title: name,
        price: displayPrice,
        image: image_url,
        quantity: 1,
        color: "Default",
        size: null,
      })
    );
    toast.success("Added to cart", { icon: "🛒" });
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((w) => !w);
    toast.success(wishlisted ? "Removed from wishlist" : "Saved to wishlist", {
      icon: wishlisted ? "💔" : "❤️",
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.35) }}
      className={`h-full ${featured ? "md:row-span-2" : ""}`}
    >
      <Link to={`/productDetails/${_id}`} className="block group h-full">
        <motion.article
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`relative h-full flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-shadow duration-300 ${
            featured ? "md:min-h-[420px]" : ""
          }`}
        >
          <div
            className={`relative overflow-hidden bg-slate-100 dark:bg-[#020617] ${
              featured ? "aspect-[3/4] md:aspect-auto md:flex-1 md:min-h-[280px]" : "aspect-[3/4]"
            }`}
          >
            <img
              src={image_url}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

            <span className="absolute top-3 left-3 bg-emerald-500 text-slate-900 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg shadow-sm">
              20% OFF
            </span>

            {featured && (
              <span className="absolute top-3 right-3 bg-amber-400 text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                ⭐ Featured
              </span>
            )}

            {/* Hover actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              {!featured && (
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  aria-label="Toggle wishlist"
                  className="w-9 h-9 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <FaHeart
                    className={`text-sm ${wishlisted ? "text-red-500" : "text-slate-500"}`}
                  />
                </button>
              )}
              <span className="w-9 h-9 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-md flex items-center justify-center">
                <FaEye className="text-sm text-slate-600" />
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <button
                type="button"
                onClick={handleQuickAdd}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-slate-900 text-xs font-bold hover:bg-emerald-400 transition-colors shadow-lg"
              >
                <FaShoppingCart className="text-[11px]" />
                Quick Add
              </button>
            </div>
          </div>

          <div className={`flex flex-col flex-1 ${featured ? "p-5 md:p-6" : "p-4"}`}>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-bold">
              {categoryLabel}
            </p>

            <h3
              className={`font-bold text-slate-900 dark:text-white line-clamp-2 mt-1 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors ${
                featured ? "text-base md:text-xl min-h-[3rem]" : "text-sm min-h-[2.5rem]"
              }`}
            >
              {name}
            </h3>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-md font-bold">
                <span>{ratings?.toFixed(1) || "4.5"}</span>
                <FaStar className="text-[9px]" aria-hidden />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({numOfReviews || 0} reviews)
              </span>
            </div>

            <div className="mt-auto pt-3 flex items-end justify-between gap-2">
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span
                    className={`font-extrabold text-slate-900 dark:text-white ${
                      featured ? "text-2xl" : "text-lg"
                    }`}
                  >
                    ₹{displayPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    ₹{mrp.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  Free delivery
                </p>
              </div>

              {featured && (
                <button
                  type="button"
                  onClick={handleQuickAdd}
                  className="hidden sm:flex w-12 h-12 rounded-2xl bg-emerald-500 text-slate-900 items-center justify-center hover:bg-emerald-400 hover:scale-105 transition-all shadow-md"
                  aria-label="Add to cart"
                >
                  <FaShoppingCart />
                </button>
              )}
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

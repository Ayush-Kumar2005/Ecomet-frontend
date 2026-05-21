import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaHeart } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const {
    _id,
    name,
    ratings,
    numOfReviews,
    price,
    images,
  } = product;

  const image_url =
    images?.[0]?.url ||
    "https://cottonfolk.in/cdn/shop/files/Men_sBrownPinstripeShort-SleeveShirt.jpg?v=1732268509&width=2048";

  return (
    <Link to={`/productDetails/${_id}`} className="block">
      <div
        className="
          group
          bg-white
          dark:bg-[#0f172a]
          border
          border-slate-200
          dark:border-white/10
          rounded-lg
          overflow-hidden
          transition-all
          duration-300
          hover:shadow-lg
          hover:border-emerald-500/30
        "
      >
        {/* IMAGE */}
        <div className="relative bg-slate-100 dark:bg-[#020617] overflow-hidden">
          
          <img
            src={image_url}
            alt={name}
            className="
              w-full
              aspect-[3/4]
              object-cover
              group-hover:scale-[1.03]
              transition-transform
              duration-300
            "
          />

          {/* DISCOUNT BADGE */}
          <span
            className="
              absolute
              top-2
              left-2
              bg-emerald-500
              text-black
              text-[10px]
              font-bold
              px-2
              py-1
              rounded
            "
          >
            20% OFF
          </span>

        </div>

        {/* CONTENT */}
        <div className="p-3">
          
          {/* BRAND */}
          <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wide">
            Fashion
          </p>

          {/* PRODUCT NAME */}
          <h3
            className="
              text-sm
              font-medium
              text-slate-900
              dark:text-white
              line-clamp-2
              mt-1
              leading-5
              min-h-[40px]
            "
          >
            {name}
          </h3>

          {/* RATING */}
          <div className="flex items-center gap-1 mt-2">
            
            <div
              className="
                flex
                items-center
                gap-1
                bg-emerald-500
                text-white
                text-xs
                px-1.5
                py-0.5
                rounded
                font-semibold
              "
            >
              <span>{ratings?.toFixed(1) || "4.5"}</span>
              <FaStar className="text-[10px]" />
            </div>

            <span className="text-xs text-slate-500">
              ({numOfReviews})
            </span>
          </div>

          {/* PRICE */}
          <div className="mt-3 flex items-center gap-2">
            
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              ₹{price / 100}
            </span>

            <span className="text-sm text-slate-400 line-through">
              ₹{Math.floor(price / 100 + 400)}
            </span>

            <span className="text-sm font-medium text-emerald-500">
              20% off
            </span>
          </div>

          {/* DELIVERY */}
          <p className="text-xs text-slate-500 mt-2">
            Free delivery
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
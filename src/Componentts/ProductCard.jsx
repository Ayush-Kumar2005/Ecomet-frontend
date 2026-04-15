import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const { _id, name, ratings, numOfReviews, description, price, images } = product;

  const image_url =
    images?.[0]?.url ||
    "https://cottonfolk.in/cdn/shop/files/Men_sBrownPinstripeShort-SleeveShirt.jpg?v=1732268509&width=2048";

  return (
    <Link to={`/productDetails/${_id}`}>
      <div
        className="
        w-44 md:w-48 lg:w-56 
        bg-gray-50 m-3 rounded-xl shadow-md 
        transition-all duration-300 ease-in-out 
        hover:scale-110 hover:z-20 hover:shadow-2xl
        cursor-pointer group
        "
      >
        {/* Image */}
        <div className="relative w-full h-40 md:h-44 bg-gray-200 flex items-center justify-center overflow-hidden rounded-t-xl">
          <img
            src={image_url}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
          />

          {/* Rating */}
          <div className="absolute bottom-2 left-2 bg-black/60 text-white rounded px-2 py-0.5 flex items-center gap-1 text-xs">
            <FaStar className="w-3 h-3 text-yellow-400" />
            <span>{ratings?.toFixed(1) || "0.0"}</span>
            <span>({numOfReviews})</span>
          </div>
        </div>

        {/* Info */}
        <div className="px-3 py-2 flex flex-col gap-1">

          {/* Name */}
          <p className="text-sm font-semibold text-gray-900 line-clamp-2">
            {name}
          </p>

          {/* Price */}
          <p className="text-sm font-bold text-emerald-600">
            ₹{price / 100}
          </p>

          {/* Extra Details on Hover */}
          <div
            className="
            opacity-0 max-h-0 overflow-hidden 
            group-hover:opacity-100 group-hover:max-h-32 
            transition-all duration-300
            "
          >
            <p className="text-xs text-gray-600 mt-2">
              {description}
            </p>

            <p className="text-xs text-gray-500">
              Reviews: {numOfReviews}
            </p>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
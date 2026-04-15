import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ subCategory }) => {
  return (
    <Link to={`/product/${subCategory._id}`}>
      <div className="w-40 h-52 bg-gray-50 rounded-xl shadow hover:shadow-md transition duration-300 overflow-hidden cursor-pointer">

        {/* Image */}
        <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
          <img
            src="https://cottonfolk.in/cdn/shop/files/Men_sBrownPinstripeShort-SleeveShirt.jpg?v=1732268509&width=2048"
            alt={subCategory?.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Name */}
        <div className="flex items-center justify-center h-20 px-2 text-center">
          <p className="text-sm font-medium text-black">
            {subCategory?.name}
          </p>
        </div>

      </div>
    </Link>
  );
};

export default CategoryCard;
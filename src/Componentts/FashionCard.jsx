import React from "react";
import { Link } from "react-router-dom";

const FashionCard = () => {
  return (
    <Link to={`/category`}>
      <div className="bg-gray-50 w-48 h-48 m-2 p-2 cursor-pointer rounded-lg shadow hover:shadow-md flex items-center justify-center">
        ELECTRONICS
      </div>
    </Link>
  );
};

export default FashionCard;
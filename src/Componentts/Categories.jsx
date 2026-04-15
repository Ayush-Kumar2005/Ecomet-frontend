import React, { useEffect, useRef, useState } from "react";
import CategoryCard from "./CategoryCard";
import { Link } from "react-router-dom";

const Categories = () => {
  const scrollRef = useRef(null);
  const [allParentCategories , setAllParentCategories] = useState([]);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -scrollRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: scrollRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  useEffect(()=>{
    fetchData();
  },[]);

  const fetchData = async () =>{
    const data = await fetch("http://localhost:5001/api/categories/main");
    const json = await data.json();
    setAllParentCategories(json?.data);
    console.log(json);
  }

  return (
    <div className="relative px-4 md:px-8 py-6 bg-[#020617] text-white">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-emerald-400">
          Shop from Top Categories
        </h2>

        <Link
          to="/ViewAllCategories"
          className="text-sm text-gray-400 hover:text-emerald-400 transition"
        >
          View more →
        </Link>
      </div>

      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[#1e293b] hover:bg-emerald-400 hover:text-black text-white shadow-lg rounded-full p-3 transition"
      >
        ◀
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scroll-smooth scrollbar-hide"
      >
        <div className="flex gap-4 w-max">

          {allParentCategories.map((category) => (
            <div
              key={category._id}
              className="min-w-[120px] sm:min-w-[140px] md:min-w-[160px] transform hover:scale-105 transition duration-300"
            >
              <CategoryCard category={category} />
            </div>
          ))}

        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[#1e293b] hover:bg-emerald-400 hover:text-black text-white shadow-lg rounded-full p-3 transition"
      >
        ▶
      </button>

    </div>
  );
};

export default Categories;
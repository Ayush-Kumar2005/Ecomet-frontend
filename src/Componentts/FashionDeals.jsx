import React, { useRef } from "react";
import { Link } from "react-router-dom";
import FashionCard from "./FashionCard";

const FashionDeal = () => {
  const scrollRef = useRef(null);

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

  return (
    <div className="relative px-4 md:px-8 py-6 bg-[#020617] text-white">

      {/* Heading */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-emerald-400">
          Fashion's Top Deals
        </h2>

        <Link
          to="/ViewAllFashionDeals"
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

          {[...Array(20)].map((_, index) => (
            <div
              key={index}
              className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] transform hover:scale-105 transition duration-300"
            >
              <FashionCard />
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

export default FashionDeal;
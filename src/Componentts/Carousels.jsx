import React from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom Arrows
const NextArrow = ({ onClick }) => (
  <div
    className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black text-white p-2 rounded-full cursor-pointer"
    onClick={onClick}
  >
    <FaChevronRight />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black text-white p-2 rounded-full cursor-pointer"
    onClick={onClick}
  >
    <FaChevronLeft />
  </div>
);

const Carousels = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  const products = [
    {
      id: 1,
      name: "T-shirt",
      img: "https://tse3.mm.bing.net/th/id/OIP.XoghGx2arlsQQ0woWl6QVgHaDc?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
      id: 2,
      name: "Shoes",
      img: "https://tse1.mm.bing.net/th/id/OIP.Q9-KkCoDZjN9BB8yjlSpbgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
      id: 3,
      name: "Jacket",
      img: "https://tse3.mm.bing.net/th/id/OIP.XoghGx2arlsQQ0woWl6QVgHaDc?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
      id: 4,
      name: "Jeans",
      img: "https://tse1.mm.bing.net/th/id/OIP.Q9-KkCoDZjN9BB8yjlSpbgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3"
    }
  ];

  return (
    <div className="w-full px-2 md:px-6 lg:px-10 mt-4">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-1 md:px-2">
            <div className="relative overflow-hidden rounded-xl shadow-lg group">

              {/* Image */}
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-[180px] sm:h-[220px] md:h-[300px] lg:h-[350px] object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>

              {/* Text */}
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-sm sm:text-lg md:text-xl font-semibold">
                  {product.name}
                </h2>
                <button className="mt-1 text-xs sm:text-sm bg-emerald-400 text-black px-3 py-1 rounded-full hover:bg-emerald-300 transition">
                  Shop Now
                </button>
              </div>

            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousels;
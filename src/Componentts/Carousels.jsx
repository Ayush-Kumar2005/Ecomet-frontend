import React from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = ({ onClick }) => (
  <div
    className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 backdrop-blur-xl bg-white/10 hover:bg-emerald-400 hover:text-black text-white p-4 rounded-full cursor-pointer transition-all duration-300 border border-white/20"
    onClick={onClick}
  >
    <FaChevronRight size={20} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 backdrop-blur-xl bg-white/10 hover:bg-emerald-400 hover:text-black text-white p-4 rounded-full cursor-pointer transition-all duration-300 border border-white/20"
    onClick={onClick}
  >
    <FaChevronLeft size={20} />
  </div>
);

const Carousels = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const products = [
    {
      id: 1,
      name: "Urban Collection 2026",
      desc: "Premium fabrics engineered for the modern explorer.",
      img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Next-Gen Footwear",
      desc: "Step into the future with unparalleled comfort.",
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <div className="w-full px-2 md:px-6 lg:px-10 overflow-hidden">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="outline-none py-4">
            <div className="relative overflow-hidden rounded-3xl md:rounded-4xl shadow-card-hover group cursor-pointer border border-slate-200/50 dark:border-white/5 bg-surface-card-dark">
              
              {/* Image Container with Fixed Aspect Ratio */}
              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  loading="eager"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              
              {/* Cinematic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent opacity-90"></div>

              {/* Content Box */}
              <div className="absolute bottom-10 left-6 md:bottom-20 md:left-20 text-white max-w-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-black uppercase bg-emerald-400 rounded-full">
                  Featured Trend
                </span>
                
                <h2 className="text-3xl md:text-7xl font-black mb-4 leading-tight tracking-tighter">
                  {product.name}
                </h2>
                
                <p className="hidden md:block text-gray-300 text-lg mb-8 max-w-md font-light leading-relaxed">
                  {product.desc}
                </p>

                <div className="flex items-center gap-4">
                  <button className="bg-emerald-400 text-black px-8 md:px-12 py-3.5 rounded-full font-black text-sm hover:bg-white transition-all shadow-lg">
                    SHOP COLLECTION
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousels;
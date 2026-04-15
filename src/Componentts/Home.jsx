import React from "react";
import Categories from "./Categories";
import FashionDeal from "./FashionDeals";
import Carousels from "./Carousels";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="bg-[#020617] min-h-screen text-white">

      {/* Carousel */}
      <div className="pt-3 md:pt-5">
        <Carousels />
      </div>

      {/* Categories */}
      <div className="mt-6 md:mt-10">
        <Categories />
      </div>

      {/* Fashion Deals */}
      <div className="mt-6 md:mt-10">
        <FashionDeal />
      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Home;
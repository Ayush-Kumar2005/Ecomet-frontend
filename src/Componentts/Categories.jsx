import React, { useEffect, useState } from "react";

const Categories = ({ selectedCategory, setSelectedCategory }) => {
  const [categories, setApiCategories] = useState([]);

  const staticCategories = [
    { name: "Electronics" },
    { name: "Fashion" },
    { name: "Mobiles" },
    { name: "Home" },
    { name: "Appliances" },
    { name: "Gaming" },
    { name: "Beauty" },
    { name: "Grocery" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/categories/main");
        const json = await response.json();
        if (json?.data) setApiCategories(json.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  const displayCategories = categories.length > 0 ? categories : staticCategories;

  return (
    <div className="w-full bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/10 transition-colors duration-500 shadow-sm sticky top-[72px] z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between gap-6 md:gap-10 py-4 min-w-max md:min-w-0">
          
          {/* "All" Tab */}
          <button 
            onClick={() => setSelectedCategory("All")}
            className="group relative flex flex-col items-center cursor-pointer outline-none"
          >
            <span className={`text-xs md:text-sm font-bold tracking-wider transition-all duration-300 ${
              selectedCategory === "All" 
              ? "text-emerald-500 scale-110" 
              : "text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            }`}>
              ALL
            </span>
            {/* Active Indicator Underline */}
            <div className={`absolute -bottom-[17px] h-1 w-full bg-emerald-500 rounded-t-full transition-all duration-300 ${
              selectedCategory === "All" ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}></div>
          </button>

          {/* Dynamic Category Names */}
          {displayCategories.map((cat, index) => (
            <button 
              key={cat._id || index}
              onClick={() => setSelectedCategory(cat.name)}
              className="group relative flex flex-col items-center cursor-pointer outline-none"
            >
              <span className={`text-xs md:text-sm font-bold tracking-wider transition-all duration-300 uppercase ${
                selectedCategory === cat.name 
                ? "text-emerald-500 scale-110" 
                : "text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}>
                {cat.name}
              </span>
              
              {/* Active Indicator Underline */}
              <div className={`absolute -bottom-[17px] h-1 w-full bg-emerald-500 rounded-t-full transition-all duration-300 ${
                selectedCategory === cat.name ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}></div>
            </button>
          ))}

        </div>
      </div>

      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Categories;
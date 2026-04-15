import React from "react";
import { useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";

const ViewAllCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetch("http://localhost:5001/api/categories/main");
        const json = await data.json();
        console.log(json);
        setCategories(json?.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-[90%] mx-auto mt-5">
      <h1 className="text-2xl font-bold mb-4">All Categories</h1>

      {/* Flex Container with Wrap */}
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex-shrink-0 transform hover:scale-105 transition duration-200"
          >
            <CategoryCard category={category} />
          </div>
        ))}
      </div>

    </div>
  );
};

export default ViewAllCategories;
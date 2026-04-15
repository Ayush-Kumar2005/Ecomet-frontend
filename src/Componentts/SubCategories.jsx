import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SubCategoryCard from "./SubCategoryCard";

const SubCategories = () => {
  const { id } = useParams();
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    fetchSubCategories();
  }, [id]);

  const fetchSubCategories = async () => {
    try {
      const data = await fetch(`http://localhost:5001/api/categories/sub/${id}`);
      const json = await data.json();
      console.log(json);
      setSubCategories(json.data);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 md:px-8 py-6">
      {/* Header */}
      <h2 className="text-xl md:text-2xl font-semibold text-emerald-400 mb-6">
        Sub Categories
      </h2>

      {/* Flex Container with Wrap */}
      <div className="flex flex-wrap gap-4">
        {subCategories.map((sub) => (
          <div
            key={sub._id}
            className="flex-shrink-0 transform hover:scale-105 transition duration-200"
          >
            <SubCategoryCard subCategory={sub} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {subCategories.length === 0 && (
        <p className="text-gray-400 mt-6">No sub-categories found.</p>
      )}
    </div>
  );
};

export default SubCategories;
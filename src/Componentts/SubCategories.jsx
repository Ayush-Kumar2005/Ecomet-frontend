import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SubCategoryCard from "./SubCategoryCard";

const SubCategories = () => {
  const { id } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubCategories();
  }, [id]);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const data = await fetch(`http://localhost:5001/api/categories/sub/${id}`);
      const json = await data.json();
      console.log(json);
      setSubCategories(json.data || []);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <header className="mb-10">
          <p className="section-eyebrow mb-2">Browse</p>
          <h1 className="section-title">Sub Categories</h1>
          <div className="section-accent" />
        </header>

        {loading ? (
          <div className="flex flex-wrap gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton w-44 h-56 rounded-3xl" />
            ))}
          </div>
        ) : subCategories.length === 0 ? (
          <div className="empty-state">
            <p className="text-slate-500 text-sm">No sub-categories found.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-5">
            {subCategories.map((sub) => (
              <SubCategoryCard key={sub._id} subCategory={sub} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategories;

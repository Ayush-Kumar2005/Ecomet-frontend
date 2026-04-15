import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SubCategoryCard from "./SubCategoryCard";
import ProductCard from "./ProductCard";

const Product = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [id]);

  const fetchProducts = async () => {
    try {
      const data = await fetch(`http://localhost:5001/api/products/sub-category/${id}`);
      const json = await data.json();
      console.log(json);
      setProducts(json?.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 md:px-8 py-6">
      {/* Header */}
      <h2 className="text-xl md:text-2xl font-semibold text-emerald-400 mb-6">
        Products
      </h2>

      {/* Flex Container with Wrap */}
      <div className="flex flex-wrap gap-4">
        {products.map((prod) => (
          <div
            key={prod._id}
            className="flex-shrink-0 transform hover:scale-105 transition duration-200"
          >
            <ProductCard product={prod} />

          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <p className="text-gray-400 mt-6">No sub-categories found.</p>
      )}
    </div>
  );
};

export default Product;
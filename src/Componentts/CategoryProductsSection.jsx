import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CategoryProductsSection = ({ categoryId }) => {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    if (!categoryId) return;

    const fetchProducts = async () => {

      try {

        const res = await axios.get(
          `http://localhost:5001/api/products/category/${categoryId}`
        );

        console.log("PRODUCTS API:", res.data);

        const data =
          Array.isArray(res.data)
            ? res.data
            : res.data?.products || res.data?.data || [];

        setProducts(data);

      } catch (error) {
        console.log(error);
        setProducts([]);
      }
    };

    fetchProducts();

  }, [categoryId]);

  return (

    <section>

      <div className="mb-8">

        <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em]">
          Trending Now
        </span>

        <h2 className="text-3xl md:text-5xl font-black uppercase italic mt-2">
          Fresh Picks
        </h2>

        <div className="h-1.5 w-20 bg-emerald-500 rounded-full mt-3"></div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {(Array.isArray(products) ? products : []).map((product) => (

            <Link to={`/productDetails/${product._id}`}>
              <div
                key={product._id}
                className="bg-white dark:bg-[#0f172a] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10"
              >

                <img
                  src={product?.images?.[0]?.url || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-60 object-cover"
                />

                <div className="p-5">

                  <h3 className="font-bold text-lg line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-emerald-500 font-black text-xl mt-2">
                    ₹{product.price}
                  </p>

                </div>

              </div>
            </Link>

        ))}

      </div>

    </section>
  );
};

export default CategoryProductsSection;
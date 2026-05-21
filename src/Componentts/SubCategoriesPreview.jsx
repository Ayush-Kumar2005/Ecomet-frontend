import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

const SubCategoriesPreview = ({ categoryId }) => {

  const [subCategories, setSubCategories] = useState([]);

  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

  useEffect(() => {

    if (!categoryId) return;

    const fetchSubCategories = async () => {
      try {

        const res = await axios.get(
          `http://localhost:5001/api/categories/sub/${categoryId}`
        );

        const data =
          Array.isArray(res.data)
            ? res.data
            : res.data?.data || res.data?.subCategories || [];

        setSubCategories(data);

      } catch (error) {
        console.log(error);
        setSubCategories([]);
      }
    };

    fetchSubCategories();

  }, [categoryId]);

  return (

    <div className="mb-16">

      <div className="flex items-center justify-between mb-8">

        <div>
          <h3 className="text-2xl md:text-3xl font-black uppercase italic">
            Shop By Category
          </h3>

          <p className="text-slate-500 dark:text-gray-400 mt-2">
            Discover trending collections
          </p>
        </div>

      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">

        {(Array.isArray(subCategories) ? subCategories : [])
          .slice(0, 12)
          .map((item) => (

            <Link to={`/product/${item._id}`}>
              <div
                key={item._id}
                className="bg-white dark:bg-[#0f172a] rounded-3xl p-5 border border-slate-200 dark:border-white/10 hover:scale-105 transition-all cursor-pointer"
              >

                <img
                  src={item?.images[0]?.url || DEFAULT_IMAGE}
                  alt={item.name}
                  className="w-full h-28 object-cover rounded-2xl mb-4"
                />

                <h4 className="font-bold text-sm text-center">
                  {item.name}
                </h4>

              </div>
            </Link>

          ))}

      </div>

    </div>
  );
};

export default SubCategoriesPreview;
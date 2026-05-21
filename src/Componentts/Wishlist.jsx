// ==========================================
// Wishlist.jsx
// ==========================================

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaHeart, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Wishlist = () => {

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);


  // ==========================================
  // FETCH WISHLIST
  // ==========================================

  const fetchWishlist = async () => {
    try {

      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        "http://localhost:5001/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlist(data.wishlist);

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch wishlist"
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // REMOVE FROM WISHLIST
  // ==========================================

  const removeWishlistItem = async (productId) => {
    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5001/api/wishlist/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlist((prev) =>
        prev.filter(
          (item) => item.product._id !== productId
        )
      );

      toast.success("Removed from wishlist");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };


  useEffect(() => {
    fetchWishlist();
  }, []);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold dark:text-white">
        Loading Wishlist...
      </div>
    );
  }


  // ==========================================
  // EMPTY WISHLIST
  // ==========================================

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">

        <FaHeart className="text-6xl text-red-500" />

        <h1 className="text-3xl font-bold dark:text-white">
          Your Wishlist is Empty
        </h1>

        <p className="text-zinc-500 text-center">
          Save your favorite products here.
        </p>

        <Link
          to="/shop"
          className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
        >
          Continue Shopping
        </Link>

      </div>
    );
  }


  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 md:px-10 py-10">

      {/* HEADING */}
      <div className="mb-10">

        <h1 className="text-4xl font-bold dark:text-white">
          My Wishlist
        </h1>

        <p className="text-zinc-500 mt-2">
          {wishlist.length} item(s) saved
        </p>

      </div>


      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

        {wishlist.map((item, index) => {

          const product = item?.product;

          console.log(item?.product);

          return (

            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >

              {/* IMAGE */}
              <div className="relative overflow-hidden">

                <img
                  src={product?.images[0].url}
                  alt={product?.name}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* REMOVE BUTTON */}
                <button
                  onClick={() =>
                    removeWishlistItem(product._id)
                  }
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-md flex items-center justify-center hover:scale-110 transition"
                >
                  <FaTrash className="text-red-500" />
                </button>

              </div>


              {/* CONTENT */}
              <div className="p-5">

                <h2 className="text-lg font-semibold dark:text-white line-clamp-1">
                  {product?.name}
                </h2>

                <p className="text-emerald-500 font-bold text-xl mt-2">
                  ₹{product.price}
                </p>


                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-5">

                  <Link
                    to={`/productDetails/${product._id}`}
                    className="flex-1 text-center px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    View
                  </Link>

                  <button
                    className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
                  >
                    Add to Cart
                  </button>

                </div>

              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaHeart, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get("http://localhost:5001/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist(data.wishlist);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    } finally {
      setLoading(false);
    }
  };

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
        prev.filter((item) => item.product._id !== productId)
      );

      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="page-shell page-container">
        <div className="mb-10">
          <div className="skeleton h-8 w-48 mb-3" />
          <div className="skeleton h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton h-72 w-full rounded-none" />
              <div className="p-5 space-y-3">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-6 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="page-shell flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="empty-state max-w-md w-full"
        >
          <div className="empty-state-icon">
            <FaHeart className="text-red-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
            Your wishlist is empty
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Save your favorite products here for quick access later.
          </p>
          <Link to="/">
            <button type="button" className="btn-primary">
              Continue Shopping
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-container">
        <header className="mb-10">
          <p className="section-eyebrow mb-2">Saved Items</p>
          <h1 className="section-title">My Wishlist</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {wishlist.map((item, index) => {
            const product = item?.product;
            console.log(item?.product);

            return (
              <motion.article
                key={item._id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-product group"
              >
                <div className="relative overflow-hidden aspect-[4/5] bg-slate-100 dark:bg-surface-dark">
                  <img
                    src={product?.images[0].url}
                    alt={product?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeWishlistItem(product._id)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 dark:bg-surface-card-dark shadow-md flex items-center justify-center hover:scale-105 transition-transform"
                    aria-label="Remove from wishlist"
                  >
                    <FaTrash className="text-red-500 text-sm" />
                  </button>
                </div>

                <div className="p-5">
                  <h2 className="text-base font-semibold dark:text-white line-clamp-1">
                    {product?.name}
                  </h2>
                  <p className="text-brand-600 dark:text-brand-400 font-extrabold text-xl mt-2">
                    ₹{product.price}
                  </p>

                  <div className="flex gap-3 mt-5">
                    <Link
                      to={`/productDetails/${product._id}`}
                      className="btn-secondary flex-1 !py-3 !text-sm"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      className="btn-primary flex-1 !py-3 !text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../slices/cartSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaShoppingBag,
  FaArrowLeft,
  FaTruck,
  FaShieldAlt,
} from "react-icons/fa";

import CartItemCard from "./CartItemCard";

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector((store) => store.cart.items);

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="section-eyebrow mb-2">Shopping Cart</p>
            <h1 className="section-title">Your Cart</h1>
            {items.length > 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {totalItems} item{totalItems !== 1 ? "s" : ""} in your bag
              </p>
            )}
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              className="btn-danger self-start sm:self-auto"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="empty-state"
          >
            <div className="empty-state-icon">
              <FaShoppingBag aria-hidden />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
              Looks like you haven&apos;t added anything yet. Explore our
              collections and find something you love.
            </p>
            <Link to="/">
              <button type="button" className="btn-primary">
                Continue Shopping
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-500 transition-colors mb-6"
              >
                <FaArrowLeft size={12} />
                Continue Shopping
              </Link>

              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            <aside className="h-fit lg:sticky lg:top-24 card p-6 md:p-8">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Items ({totalItems})</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    ₹{totalAmount}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Delivery</span>
                  <span className="text-brand-600 dark:text-brand-400 font-semibold">
                    Free
                  </span>
                </div>
                <div className="border-t border-slate-200 dark:border-white/10 pt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              <Link to="/checkout" className="block mt-8">
                <button type="button" className="btn-primary w-full text-base">
                  Proceed to Checkout
                </button>
              </Link>

              <div className="mt-8 space-y-3 pt-6 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <FaTruck className="text-brand-500 flex-shrink-0" />
                  Free shipping on all orders
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <FaShieldAlt className="text-brand-500 flex-shrink-0" />
                  Secure payment checkout
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

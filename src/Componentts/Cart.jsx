import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../slices/cartSlice";
import { Link } from "react-router-dom";

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

  const totalItems = items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">

          <div>
            <p className="text-emerald-500 text-xs font-bold uppercase tracking-[0.3em] mb-2">
              Shopping Cart
            </p>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Your Cart
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="px-5 py-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* EMPTY STATE */}
        {items.length === 0 ? (
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-[2rem] p-10 md:p-20 text-center shadow-sm">

            <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-emerald-500 text-4xl" />
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3">
              Your Cart is Empty
            </h2>

            <p className="text-slate-500 dark:text-gray-400 mb-8">
              Looks like you haven’t added anything yet.
            </p>

            <Link to="/">
              <button className="px-8 py-4 rounded-2xl bg-emerald-500 text-black font-black hover:scale-105 transition-all duration-300">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">

            {/* LEFT SIDE */}
            <div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400 hover:text-emerald-500 transition-colors mb-6"
              >
                <FaArrowLeft />
                Continue Shopping
              </Link>

              <div className="space-y-5">
                {items.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="h-fit sticky top-6 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 shadow-sm">

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">

                <div className="flex items-center justify-between text-slate-600 dark:text-gray-400">
                  <span>Items ({totalItems})</span>
                  <span>₹{totalAmount}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-gray-400">
                  <span>Delivery</span>
                  <span className="text-emerald-500 font-semibold">
                    Free
                  </span>
                </div>

                <div className="border-t border-slate-200 dark:border-white/10 pt-4 flex items-center justify-between">

                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    Total
                  </span>

                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              <Link to="/checkout">
                <button className="w-full mt-8 bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-2xl font-black text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-emerald-500/20">
                  Proceed to Checkout
                </button>
              </Link>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-400">
                  <FaTruck className="text-emerald-500" />
                  Free shipping on all orders
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-400">
                  <FaShieldAlt className="text-emerald-500" />
                  Secure payment checkout
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
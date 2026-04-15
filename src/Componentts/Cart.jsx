import React from "react";
import { useSelector, useDispatch } from "react-redux";
import CartItemCard from "./CartItemCard";
import { clearCart } from "../slices/cartSlice";
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector((store) => store.cart.items);

  // ✅ Calculate total price
  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>

        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Empty Cart */}
      {items.length === 0 ? (
        <div className="text-center mt-20">
          <h2 className="text-xl font-semibold text-gray-600">
            Your cart is empty 🛒
          </h2>
          <p className="text-gray-400 mt-2">
            Add some items to get started!
          </p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div>
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Summary Section */}
          <div className="mt-8 bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Cart Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Total Items</span>
              <span>
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>

            <div className="flex justify-between mb-4">
              <span>Total Amount</span>
              <span className="font-bold text-lg">₹{totalAmount}</span>
            </div>
            
            <Link to="/buy-now">
                <button className="w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition">
                Proceed to Checkout
                </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
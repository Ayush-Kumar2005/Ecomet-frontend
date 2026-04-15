import React from "react";
import { useDispatch } from "react-redux";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { removeItem, addItem , updateQuantity } from "../slices/cartSlice";

const CartItemCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleIncrease = () => {
    dispatch(addItem({ ...item, quantity: item.quantity + 1 }));
  };


    const handleDecrease = () => {
    if (item.quantity > 1) {
        dispatch(
        updateQuantity({
            id: item.id,
            size: item.size,
            color: item.color,
            quantity: item.quantity - 1,
        })
        );
    } else {
        dispatch(
        removeItem({
            id: item.id,
            size: item.size,
            color: item.color,
        })
        );
    }
    };

    const handleRemove = () => {
    dispatch(
        removeItem({
        id: item.id,
        size: item.size,
        color: item.color,
        })
    );
    };
  return (
    <div className="flex gap-4 bg-white shadow-lg rounded-2xl p-4 mb-4 items-center">
      
      {/* Product Image */}
      <img
        src={item.image}
        alt={item.title}
        className="w-28 h-28 object-cover rounded-xl"
      />

      {/* Product Details */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{item.title}</h2>
        <p className="text-gray-500 text-sm line-clamp-2">
          {item.description}
        </p>
        <p className="text-lg font-bold mt-2">₹{item.price}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={handleDecrease}
            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
          >
            <FaMinus size={12} />
          </button>

          <span className="font-semibold">{item.quantity}</span>

          <button
            onClick={handleIncrease}
            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
          >
            <FaPlus size={12} />
          </button>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="text-red-500 hover:text-red-600"
      >
        <FaTrash size={18} />
      </button>
    </div>
  );
};

export default CartItemCard;
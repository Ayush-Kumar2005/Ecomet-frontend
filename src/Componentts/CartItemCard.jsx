import React from "react";
import { useDispatch } from "react-redux";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { removeItem, addItem, updateQuantity } from "../slices/cartSlice";

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
    <article className="card flex gap-4 sm:gap-5 p-4 sm:p-5 items-center">
      <img
        src={item.image}
        alt={item.title}
        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl bg-slate-100 dark:bg-surface-dark flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-1">
          {item.title}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mt-0.5">
          {item.description}
        </p>
        {(item.color || item.size) && (
          <p className="text-xs text-slate-400 mt-1">
            {[item.color, item.size].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-2">
          ₹{item.price}
        </p>

        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={handleDecrease}
            className="btn-icon !w-9 !h-9"
            aria-label="Decrease quantity"
          >
            <FaMinus size={10} />
          </button>
          <span className="font-semibold text-sm w-8 text-center tabular-nums">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            className="btn-icon !w-9 !h-9"
            aria-label="Increase quantity"
          >
            <FaPlus size={10} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleRemove}
        className="btn-icon text-red-500 hover:bg-red-500/10 hover:text-red-500 flex-shrink-0"
        aria-label="Remove item"
      >
        <FaTrash size={16} />
      </button>
    </article>
  );
};

export default CartItemCard;

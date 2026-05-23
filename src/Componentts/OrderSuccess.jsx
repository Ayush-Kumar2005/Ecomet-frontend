import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5001/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setOrder(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="page-shell flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Loading order details…
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-shell flex items-center justify-center min-h-[60vh] px-4">
        <div className="empty-state max-w-md">
          <p className="text-red-500 font-semibold">Order not found</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn-primary mt-6"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell flex items-center justify-center p-4 sm:p-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full card p-8 md:p-10 text-center shadow-card-hover"
      >
        <div className="w-20 h-20 mx-auto bg-brand-500/10 rounded-full flex items-center justify-center mb-6">
          <FaCheckCircle className="text-4xl text-brand-500" aria-hidden />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-brand-600 dark:text-brand-400">
          Order Placed Successfully!
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Thank you for shopping with us
        </p>

        <p className="mt-4 text-xs text-slate-400 font-mono bg-slate-50 dark:bg-white/5 inline-block px-3 py-1.5 rounded-lg">
          Order ID: {order._id}
        </p>

        <hr className="my-8 border-slate-200 dark:border-white/10" />

        <div className="text-left space-y-3">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-3">
            Order Summary
          </h2>

          {order.orderItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between text-sm text-slate-600 dark:text-slate-400"
            >
              <span>
                {item.name} × {item.qty}
              </span>
              <span className="font-medium text-slate-900 dark:text-white">
                ₹{item.price * item.qty}
              </span>
            </div>
          ))}

          <hr className="border-slate-200 dark:border-white/10" />

          <div className="flex justify-between font-extrabold text-slate-900 dark:text-white">
            <span>Total</span>
            <span>₹{order.totalPrice}</span>
          </div>
        </div>

        <div className="mt-6 text-left text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 rounded-2xl p-4">
          <p>
            <strong className="text-slate-700 dark:text-slate-200">
              Deliver to:
            </strong>{" "}
            {order.shippingAddress.fullName}, {order.shippingAddress.city}
          </p>
        </div>

        <div className="mt-4">
          <span className="badge bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            Payment: {order.paymentStatus}
          </span>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn-secondary flex-1"
          >
            Continue Shopping
          </button>

          <button
            type="button"
            onClick={() => navigate(`/order/${order._id}`)}
            className="btn-primary flex-1"
          >
            Track Order
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;

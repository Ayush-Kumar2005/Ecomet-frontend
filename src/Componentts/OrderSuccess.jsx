import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================
  // FETCH ORDER
  // ======================
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
      <div className="h-screen flex items-center justify-center text-lg">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-6">

      <div className="max-w-2xl w-full bg-white dark:bg-[#0f172a] rounded-3xl shadow-lg p-8 text-center">

        {/* SUCCESS ICON */}
        <div className="w-20 h-20 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">✅</span>
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-black text-emerald-500">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-500 mt-2">
          Thank you for shopping with us
        </p>

        {/* ORDER ID */}
        <div className="mt-4 text-sm text-gray-400">
          Order ID: <span className="font-mono">{order._id}</span>
        </div>

        <hr className="my-6" />

        {/* ORDER SUMMARY */}
        <div className="text-left space-y-3">

          <h2 className="font-bold text-lg mb-2">
            Order Summary
          </h2>

          {order.orderItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between text-sm"
            >
              <span>{item.name} × {item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <hr />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{order.totalPrice}</span>
          </div>
        </div>

        {/* SHIPPING */}
        <div className="mt-6 text-left text-sm text-gray-500">
          <p>
            <strong>Deliver to:</strong>{" "}
            {order.shippingAddress.fullName},{" "}
            {order.shippingAddress.city}
          </p>
        </div>

        {/* STATUS */}
        <div className="mt-4">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm">
            Payment: {order.paymentStatus}
          </span>
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex gap-3">

          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-200 dark:bg-white/10 py-3 rounded-xl font-semibold"
          >
            Continue Shopping
          </button>

          <button
            onClick={() =>
              navigate(`/order/${order._id}`)
            }
            className="flex-1 bg-emerald-500 text-black py-3 rounded-xl font-bold"
          >
            Track Order
          </button>

        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
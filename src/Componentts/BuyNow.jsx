import React, { useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";

const BuyNow = () => {
  const cartItems = useSelector((store) => store.cart.items);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );


  const handlePlaceOrder = async () => {
    if (!address.name || !address.phone || !address.address) {
      alert("Please fill all address fields");
      return;
    }

    try {
      // ✅ 1. Create Order in DB (pending)
      const { data: createdOrder } = await axios.post(
        "http://localhost:5001/api/orders",
        {
          orderItems: cartItems,
          shippingAddress: address,
          paymentMethod,
          totalPrice: totalAmount,
        }
      );

      // ✅ 2. Create Razorpay Order
      const { data: razorpayOrder } = await axios.post(
        "http://localhost:5001/api/payment/create-order",
        { amount: totalAmount }
      );

      // ✅ 3. Open Razorpay
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID",
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Your Store",
        description: "Order Payment",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            // ✅ 4. Verify payment
            const { data } = await axios.post(
              "http://localhost:5001/api/payment/verify",
              response
            );

            if (data.success) {
              // ✅ 5. Update order status
              await axios.put(
                `http://localhost:5001/api/orders/${createdOrder._id}/pay`,
                {
                  paymentResult: response,
                }
              );

              alert("Payment Successful 🎉");
            } else {
              alert("Payment Verification Failed ❌");
            }
          } catch (err) {
            console.error(err);
          }
        },

        theme: {
          color: "#10B981", // your emerald theme 💚
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="md:col-span-2 flex flex-col gap-6">

          {/* 🏠 Shipping Address */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Shipping Address
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Full Name"
                className="p-3 rounded border outline-none focus:ring-2 focus:ring-emerald-400"
                onChange={(e) =>
                  setAddress({ ...address, name: e.target.value })
                }
              />
              <input
                placeholder="Phone"
                className="p-3 rounded border outline-none focus:ring-2 focus:ring-emerald-400"
                onChange={(e) =>
                  setAddress({ ...address, phone: e.target.value })
                }
              />
              <input
                placeholder="City"
                className="p-3 rounded border outline-none focus:ring-2 focus:ring-emerald-400"
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />
              <input
                placeholder="Pincode"
                className="p-3 rounded border outline-none focus:ring-2 focus:ring-emerald-400"
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
              />
            </div>

            <textarea
              placeholder="Full Address"
              className="w-full mt-4 p-3 rounded border outline-none focus:ring-2 focus:ring-emerald-400"
              onChange={(e) =>
                setAddress({ ...address, address: e.target.value })
              }
            />
          </div>

          {/* 📦 Product List */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Your Items
            </h2>

            {cartItems.map((item) => (
              <div
                key={item.id + item.size + item.color}
                className="flex items-center gap-4 mb-4 border-b pb-4"
              >
                <img
                  src={item.image}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.color} {item.size && `| ${item.size}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-gray-800">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* 💳 Payment Method */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Payment Method
            </h2>

            <div className="flex flex-col gap-3 text-gray-700">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                />
                UPI / Card (Coming Soon)
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Order Summary
          </h2>

          <div className="flex justify-between mb-2 text-gray-600">
            <span>Items</span>
            <span>{totalItems}</span>
          </div>

          <div className="flex justify-between mb-2 text-gray-600">
            <span>Subtotal</span>
            <span>₹{totalAmount}</span>
          </div>

          <div className="flex justify-between mb-2 text-gray-600">
            <span>Delivery</span>
            <span className="text-green-500">Free</span>
          </div>

          <div className="border-t my-3"></div>

          <div className="flex justify-between text-lg font-bold text-gray-800">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full mt-5 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold"
          >
            Place Order
          </button>
        </div>

      </div>
    </div>
  );
};

export default BuyNow;
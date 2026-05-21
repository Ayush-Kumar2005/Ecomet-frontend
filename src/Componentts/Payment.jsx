import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const METHODS = [
  {
    id: "COD",
    label: "Cash on Delivery",
    desc: "Pay when your order arrives",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    id: "UPI",
    label: "UPI Payment",
    desc: "PhonePe, GPay, Paytm & more",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15h3" />
      </svg>
    ),
  },
  {
    id: "CARD",
    label: "Credit / Debit Card",
    desc: "Visa, Mastercard, Rupay",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
];

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState("COD");
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5001/api/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setOrder(data);
    } catch {
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [orderId]);

  const handlePayment = async () => {
    try {
      setPaying(true);
      setError("");
      const { data } = await axios.put(
        `http://localhost:5001/api/orders/${orderId}/pay`,
        {
          id: "PAY_" + Date.now(),
          status: "success",
          update_time: new Date().toISOString(),
          email_address: userInfo.email,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      navigate(`/order-success/${data._id}`);
    } catch {
      setError("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-zinc-200 dark:border-zinc-700 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-sm text-zinc-400 dark:text-zinc-500 tracking-wide">Loading your order…</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="font-medium text-zinc-800 dark:text-zinc-200">Order not found</p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">The order may have expired or been removed.</p>
        </div>
      </div>
    );
  }

  const subtotal = order.orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = order.shippingPrice ?? 0;
  const tax = order.taxPrice ?? 0;

  // ── Main UI ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-10 md:py-16">

      {/* Header breadcrumb */}
      <div className="max-w-5xl mx-auto mb-8 flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500">
        <span>Cart</span>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <span>Shipping</span>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <span className="text-zinc-800 dark:text-zinc-200 font-medium">Payment</span>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_380px] gap-6 items-start">

        {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Payment method card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-semibold text-zinc-800 dark:text-zinc-100">Payment Method</h2>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900 rounded-xl px-4 py-3 mb-5">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {METHODS.map((m) => {
                const active = method === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 w-full
                      ${active
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
                        : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                      ${active
                        ? "bg-emerald-500 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                      }`}>
                      {m.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${active ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-800 dark:text-zinc-200"}`}>{m.label}</p>
                      <p className={`text-xs mt-0.5 ${active ? "text-emerald-600/80 dark:text-emerald-400/80" : "text-zinc-400 dark:text-zinc-500"}`}>{m.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                      ${active ? "border-emerald-500 bg-emerald-500" : "border-zinc-300 dark:border-zinc-600"}`}>
                      {active && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* COD note */}
            {method === "COD" && (
              <div className="flex items-start gap-2.5 mt-4 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                Keep the exact amount ready at the time of delivery.
              </div>
            )}
          </div>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-6 py-4">
            {[
              { label: "256-bit SSL", icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" },
              { label: "Secure Checkout", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
              { label: "RBI Compliant", icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={b.icon} />
                </svg>
                {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 sticky top-6">

          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="font-semibold text-zinc-800 dark:text-zinc-100">Order Summary</h2>
          </div>

          {/* Items list */}
          <div className="flex flex-col gap-3 mb-5">
            {order.orderItems.map((item) => (
              <div key={item._id} className="flex items-center gap-3">
                {item.image && (
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{item.name}</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">Qty: {item.qty}</p>
                </div>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 shrink-0">
                  ₹{(item.price * item.qty).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-zinc-100 dark:bg-zinc-800 mb-4" />

          {/* Price breakdown */}
          <div className="flex flex-col gap-2.5 text-sm mb-5">
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free</span> : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Tax (GST)</span>
              <span>₹{tax.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 mb-4" />

          {/* Total */}
          <div className="flex justify-between items-baseline mb-6">
            <span className="font-semibold text-zinc-800 dark:text-zinc-100">Total</span>
            <div className="text-right">
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                ₹{Number(order.totalPrice).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">Incl. all taxes</p>
            </div>
          </div>

          {/* Pay button */}
          <button
            onClick={handlePayment}
            disabled={paying}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
              ${paying
                ? "bg-emerald-400 dark:bg-emerald-700 text-white cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white shadow-lg shadow-emerald-500/20"
              }`}
          >
            {paying ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Pay ₹{Number(order.totalPrice).toLocaleString("en-IN")}
              </>
            )}
          </button>

          {/* Order ID */}
          <p className="text-xs text-center text-zinc-400 dark:text-zinc-600 mt-4">
            Order #{orderId?.slice(-8).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
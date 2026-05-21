import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../slices/cartSlice";

import {
  FaCreditCard,
  FaMoneyBillWave,
  FaShieldAlt,
  FaTruck,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaUniversity,
  FaWallet,
  FaLock,
  FaCheckCircle,
  FaTag,
} from "react-icons/fa";

/* ─── Google Font import ─── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;1,9..40,400&display=swap";
document.head.appendChild(fontLink);

/* ─── Styles ─── */
const style = document.createElement("style");
style.textContent = `
  .co-root { font-family: 'DM Sans', sans-serif; }
  .co-heading { font-family: 'Sora', sans-serif; }
  .co-step-badge {
    width: 26px; height: 26px; border-radius: 50%;
    background: #0f172a; color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 700;
    flex-shrink: 0;
  }
  .dark .co-step-badge { background: #e2e8f0; color: #0f172a; }

  .co-input {
    width: 100%; padding: 11px 14px; border-radius: 10px;
    border: 1.5px solid #e2e8f0;
    background: #f8fafc; color: #0f172a;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    outline: none; transition: border 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .co-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
  .dark .co-input {
    background: #1e293b; border-color: #334155; color: #f1f5f9;
  }
  .dark .co-input:focus { border-color: #818cf8; box-shadow: 0 0 0 3px rgba(129,140,248,0.15); }

  .co-card {
    background: #fff; border: 1px solid #f1f5f9;
    border-radius: 18px; padding: 24px;
    box-shadow: 0 1px 4px rgba(15,23,42,0.04);
  }
  .dark .co-card { background: #0f172a; border-color: #1e293b; }

  .co-pay-option {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 16px; border-radius: 12px;
    border: 1.5px solid #e2e8f0; cursor: pointer;
    transition: border 0.15s, background 0.15s;
    margin-bottom: 10px;
  }
  .co-pay-option:last-child { margin-bottom: 0; }
  .co-pay-option.selected {
    border-color: #6366f1; background: #f5f3ff;
  }
  .dark .co-pay-option { border-color: #1e293b; }
  .dark .co-pay-option.selected { border-color: #818cf8; background: #1e1b4b; }
  .co-pay-option:hover:not(.selected) { border-color: #c7d2fe; background: #f8f9ff; }

  .co-radio {
    width: 18px; height: 18px; border-radius: 50%;
    border: 2px solid #cbd5e1; margin-left: auto; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: border 0.15s;
  }
  .co-pay-option.selected .co-radio { border-color: #6366f1; }
  .dark .co-pay-option.selected .co-radio { border-color: #818cf8; }
  .co-radio-dot {
    width: 9px; height: 9px; border-radius: 50%; background: #6366f1;
    transform: scale(0); transition: transform 0.15s;
  }
  .co-pay-option.selected .co-radio-dot { transform: scale(1); }
  .dark .co-pay-option.selected .co-radio-dot { background: #818cf8; }

  .co-place-btn {
    width: 100%; padding: 15px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: #fff; border: none; border-radius: 14px;
    font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: opacity 0.15s, transform 0.1s;
    letter-spacing: 0.01em; margin-top: 20px;
  }
  .co-place-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
  .co-place-btn:active:not(:disabled) { transform: translateY(0); }
  .co-place-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .co-divider { border: none; border-top: 1px solid #f1f5f9; margin: 18px 0; }
  .dark .co-divider { border-color: #1e293b; }

  .co-pill {
    display: inline-flex; align-items: center; gap: 5px;
    background: #f1f5f9; border-radius: 6px;
    padding: 4px 10px; font-size: 12px; font-weight: 500;
  }
  .dark .co-pill { background: #1e293b; color: #94a3b8; }

  .co-summary-row {
    display: flex; justify-content: space-between;
    font-size: 14px; color: #64748b; padding: 5px 0;
  }
  .dark .co-summary-row { color: #94a3b8; }
  .co-summary-row.total {
    font-family: 'Sora', sans-serif; font-size: 18px;
    font-weight: 700; color: #0f172a; padding-top: 8px;
  }
  .dark .co-summary-row.total { color: #f1f5f9; }

  .co-item-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0; border-bottom: 1px solid #f8fafc;
  }
  .dark .co-item-row { border-bottom-color: #1e293b; }
  .co-item-row:last-child { border-bottom: none; }
  .co-badge-free {
    font-size: 11px; font-weight: 600; color: #059669;
    background: #d1fae5; padding: 2px 8px; border-radius: 20px;
  }

  .co-trust {
    display: flex; align-items: center; justify-content: center;
    gap: 18px; padding: 14px 0 0;
  }
  .co-trust-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: #94a3b8;
  }
`;
document.head.appendChild(style);

/* ─── Payment Method Config ─── */
const PAYMENT_METHODS = [
  { id: "COD",         label: "Cash on Delivery",  sub: "Pay when you receive",      icon: FaMoneyBillWave },
  { id: "UPI",         label: "UPI",                sub: "PhonePe, GPay, Paytm…",    icon: FaMobileAlt },
  { id: "CARD",        label: "Credit / Debit Card",sub: "Visa, Mastercard, RuPay",   icon: FaCreditCard },
  { id: "NET_BANKING", label: "Net Banking",        sub: "All major banks",           icon: FaUniversity },
  { id: "WALLET",      label: "Wallet",             sub: "Amazon Pay, Mobikwik…",     icon: FaWallet },
];

const Checkout = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const items      = useSelector((store) => store.cart.items);
  const { userInfo } = useSelector((state) => state.auth);

  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [fullName,      setFullName]      = useState("");
  const [phone,         setPhone]         = useState("");
  const [city,          setCity]          = useState("");
  const [stateVal,      setStateVal]      = useState("");
  const [postalCode,    setPostalCode]    = useState("");
  const [address,       setAddress]       = useState("");

  /* ── Calculations ── */
  const itemsPrice    = items.reduce((t, i) => t + i.price * i.quantity, 0);
  const taxPrice      = Math.round(itemsPrice * 0.18);
  const shippingPrice = itemsPrice > 999 ? 0 : 99;
  const discountPrice = 0;
  const totalPrice    = itemsPrice + taxPrice + shippingPrice - discountPrice;
  const totalItems    = items.reduce((a, i) => a + i.quantity, 0);

  /* ── Place Order ── */
  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      setError("");
      if (!fullName || !phone || !address || !city || !stateVal || !postalCode) {
        setError("Please fill in all address fields before proceeding.");
        setLoading(false);
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const payload = {
        orderItems: items.map((item) => ({
          name: item.name, qty: item.quantity, image: item.image,
          price: Number(item.price), product: item.id,
        })),
        shippingAddress: {
          fullName, phone, address, city, state: stateVal, postalCode, country: "India",
        },
        paymentMethod,
        itemsPrice, taxPrice, shippingPrice, discountPrice, totalPrice,
      };
      const { data } = await axios.post("http://localhost:5001/api/orders", payload, config);
      dispatch(clearCart());
      navigate(`/payment/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="co-root min-h-screen bg-slate-50 dark:bg-[#020617]"
      style={{ paddingBottom: "60px" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px 0" }}>

        {/* ── Page Header ── */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500 }}>
            Almost there
          </p>
          <h1
            className="co-heading"
            style={{ fontSize: 30, fontWeight: 700, color: "#0f172a", margin: 0 }}
          >
            Checkout
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>
            {totalItems} item{totalItems !== 1 ? "s" : ""} · ₹{totalPrice.toLocaleString("en-IN")} total
          </p>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div
            style={{
              marginBottom: 20, padding: "12px 16px", borderRadius: 12,
              background: "#fef2f2", border: "1px solid #fecaca",
              color: "#dc2626", fontSize: 14, display: "flex", alignItems: "center", gap: 10,
            }}
          >
            <FaShieldAlt style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* ── Main Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}
          className="lg:grid-cols-[1fr_380px]"
        >
          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Shipping Address */}
            <div className="co-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div className="co-step-badge">1</div>
                <div>
                  <h2 className="co-heading" style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                    Shipping Address
                  </h2>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Where should we deliver?</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6, letterSpacing: "0.03em" }}>
                    FULL NAME
                  </label>
                  <input
                    className="co-input"
                    placeholder="e.g. Rahul Sharma"
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6, letterSpacing: "0.03em" }}>
                    PHONE NUMBER
                  </label>
                  <input
                    className="co-input"
                    placeholder="+91 98765 43210"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6, letterSpacing: "0.03em" }}>
                    ADDRESS
                  </label>
                  <input
                    className="co-input"
                    placeholder="Flat / House no., Street, Area"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6, letterSpacing: "0.03em" }}>
                    CITY
                  </label>
                  <input
                    className="co-input"
                    placeholder="Mumbai"
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6, letterSpacing: "0.03em" }}>
                    STATE
                  </label>
                  <input
                    className="co-input"
                    placeholder="Maharashtra"
                    onChange={(e) => setStateVal(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6, letterSpacing: "0.03em" }}>
                    PINCODE
                  </label>
                  <input
                    className="co-input"
                    placeholder="400001"
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 2 }}>
                  <span className="co-pill">
                    <span style={{ fontSize: 11 }}>🇮🇳</span> India
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="co-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div className="co-step-badge">2</div>
                <div>
                  <h2 className="co-heading" style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                    Payment Method
                  </h2>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>All transactions are secured</p>
                </div>
              </div>

              {PAYMENT_METHODS.map((m) => {
                const Icon = m.icon;
                const selected = paymentMethod === m.id;
                return (
                  <div
                    key={m.id}
                    className={`co-pay-option${selected ? " selected" : ""}`}
                    onClick={() => setPaymentMethod(m.id)}
                  >
                    <div
                      style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: selected ? "#ede9fe" : "#f1f5f9",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, transition: "background 0.15s",
                      }}
                    >
                      <Icon size={16} color={selected ? "#6366f1" : "#94a3b8"} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{m.label}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{m.sub}</p>
                    </div>
                    <div className="co-radio">
                      <div className="co-radio-dot" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN — Order Summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="co-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div className="co-step-badge">3</div>
                <div>
                  <h2 className="co-heading" style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                    Order Summary
                  </h2>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{totalItems} item{totalItems !== 1 ? "s" : ""} in cart</p>
                </div>
              </div>

              {/* Cart Items */}
              <div style={{ marginBottom: 4 }}>
                {items.map((item) => (
                  <div key={item._id} className="co-item-row">
                    <div style={{ flex: 1, paddingRight: 12 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#0f172a", lineHeight: 1.4 }}>
                        {item.name}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", flexShrink: 0 }}>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="co-divider" />

              {/* Price Breakdown */}
              <div>
                <div className="co-summary-row">
                  <span>Subtotal ({totalItems} items)</span>
                  <span style={{ color: "#0f172a", fontWeight: 500 }}>₹{itemsPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="co-summary-row">
                  <span>GST (18%)</span>
                  <span style={{ color: "#0f172a", fontWeight: 500 }}>₹{taxPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="co-summary-row">
                  <span>Delivery</span>
                  {shippingPrice === 0 ? (
                    <span className="co-badge-free">FREE</span>
                  ) : (
                    <span style={{ color: "#0f172a", fontWeight: 500 }}>₹{shippingPrice}</span>
                  )}
                </div>
              </div>

              <hr className="co-divider" />

              <div className="co-summary-row total">
                <span>Total Payable</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>

              {shippingPrice === 0 && (
                <div
                  style={{
                    marginTop: 12, padding: "10px 14px", borderRadius: 10,
                    background: "#f0fdf4", border: "1px solid #bbf7d0",
                    display: "flex", alignItems: "center", gap: 8,
                    fontSize: 13, color: "#059669", fontWeight: 500,
                  }}
                >
                  <FaTruck size={14} />
                  You've unlocked free delivery!
                </div>
              )}

              <button
                className="co-place-btn"
                onClick={placeOrderHandler}
                disabled={loading}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 2 A10 10 0 0 1 22 12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Placing Order…
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <FaLock size={13} />
                    Place Order · ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </button>

              {/* Trust Badges */}
              <div className="co-trust">
                <div className="co-trust-item">
                  <FaShieldAlt size={12} style={{ color: "#6366f1" }} />
                  Secure checkout
                </div>
                <div className="co-trust-item">
                  <FaTruck size={12} style={{ color: "#6366f1" }} />
                  Fast delivery
                </div>
                <div className="co-trust-item">
                  <FaCheckCircle size={12} style={{ color: "#6366f1" }} />
                  Easy returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 1024px) {
          .lg\\:grid-cols-\\[1fr_380px\\] { grid-template-columns: 1fr 380px !important; }
        }
        .dark .co-card { background: #0f172a !important; border-color: #1e293b !important; }
        .dark .co-heading { color: #f1f5f9 !important; }
        .dark h1 { color: #f1f5f9 !important; }
        .dark .co-summary-row.total { color: #f1f5f9 !important; }
        .dark p[style*="color: #0f172a"] { color: #f1f5f9 !important; }
        .dark span[style*="color: #0f172a"] { color: #f1f5f9 !important; }
      `}</style>
    </div>
  );
};

export default Checkout;
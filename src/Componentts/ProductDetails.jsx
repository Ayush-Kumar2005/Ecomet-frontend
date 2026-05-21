import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import StarRating from "./StarRating";
import axios from "axios";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaTag,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaMinus,
  FaPlus,
  FaBolt,
  FaStar,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItem } from "../slices/cartSlice";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Google Font injection ─── */
const FontInjector = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
};

/* ─── Tiny sub-components ─── */
const Badge = ({ children, variant = "green" }) => {
  const map = {
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    orange: "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    blue: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    red: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[variant]}`}>
      {children}
    </span>
  );
};

const Divider = () => (
  <div className="border-t border-zinc-100 dark:border-zinc-800/70" />
);

/* ─── Main Component ─── */
const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  /* fetch */
  const fetchProductDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/products/${id}`);
      const data = await res.json();
      setProduct(data?.data);
      setMainImage(data?.data?.images?.[0]?.url);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchProductDetails(); }, [id]);

  useEffect(() => {
    if (product?.images?.length > 0) setMainImage(product.images[currentIndex].url);
  }, [currentIndex, product]);

  const isClothing = product?.category?.name?.toLowerCase()?.includes("cloth");
  const discountedPrice = product ? Math.floor((product.price / 100) * 1.2) : 0;
  const actualPrice = product ? product.price / 100 : 0;

  /* handlers */
  const handleNext = () =>
    setCurrentIndex((p) => (p === product.images.length - 1 ? 0 : p + 1));
  const handlePrev = () =>
    setCurrentIndex((p) => (p === 0 ? product.images.length - 1 : p - 1));

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    if (product.stock === 0) { toast.error("Product is out of stock ❌"); return; }
    if (!selectedColor) { toast.error("Please select a color 🎨"); return; }
    if (isClothing && !selectedSize) { toast.error("Please select a size 📏"); return; }
    const cartItem = {
      id: product._id,
      name: product.name,
      title: product.name,
      description: product.description,
      price: actualPrice,
      image: product.images?.[0]?.url,
      quantity,
      color: selectedColor,
      size: selectedSize || null,
    };
    dispatch(addItem(cartItem));
    toast.success("Added to cart!", {
      style: { background: "#10b981", color: "#fff", borderRadius: "12px" },
      icon: "🛒",
    });
  };

  const handleWishlist = async () => {

    try {

      const token = localStorage.getItem("token");

      // IF ALREADY WISHLISTED
      if (wishlisted) {

        await axios.delete(
          `http://localhost:5001/api/wishlist/remove/${product._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWishlisted(false);

        toast.success("Removed from wishlist");

      } else {
        console.log(product?._id);

        // ADD TO WISHLIST
        await axios.post(
          "http://localhost:5001/api/wishlist/add",
          {
            productId: product._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWishlisted(true);

        toast.success("Added to wishlist");
      }

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  const checkPincode = () => {
    if (pincode.length !== 6) { setPincodeMsg({ ok: false, msg: "Enter a valid 6-digit pincode" }); return; }
    setTimeout(() => {
      setPincodeMsg({ ok: true, msg: `Delivery available by ${getDeliveryDate()} — FREE` });
    }, 600);
  };

  const getDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  };

  /* loading */
  if (!product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Loading product…
        </p>
      </div>
    );

  /* ─── render ─── */
  return (
    <>
      <FontInjector />
      <style>{`
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .display-font { font-family: 'Fraunces', serif; }
        .zoom-lens {
          background-image: var(--zoom-src);
          background-repeat: no-repeat;
          background-size: 250%;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
      `}</style>

      <div className="min-h-screen bg-[#f8f8f6] dark:bg-zinc-950 text-zinc-900 dark:text-white">

        {/* ── Breadcrumb ── */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="hover:text-emerald-600 cursor-pointer transition">Home</span>
            <span>/</span>
            <span className="hover:text-emerald-600 cursor-pointer transition">{product.category?.name}</span>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

          {/* ══════════════════════════════
              TOP SECTION: Image + Details
          ══════════════════════════════ */}
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-start">

            {/* LEFT — Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="sticky top-[56px]"
            >
              {/* Main image */}
              <div
                ref={imgRef}
                className="relative rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md cursor-zoom-in"
                style={{ aspectRatio: "1/1" }}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-opacity duration-300"
                  style={
                    isZoomed
                      ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: "scale(2)", transition: "none" }
                      : {}
                  }
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                  <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow">20% OFF</span>
                  {product.stock > 0 && product.stock <= 10 && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow animate-pulse">
                      Only {product.stock} left!
                    </span>
                  )}
                </div>

                {/* Wishlist */}
                <button
                  onClick={handleWishlist}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-md flex items-center justify-center transition-all hover:scale-110"
                >
                  <AnimatePresence mode="wait">

                    {wishlisted ? (

                      <motion.span
                        key="filled"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <FaHeart className="text-red-500" />
                      </motion.span>

                    ) : (

                      <motion.span
                        key="empty"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <FaRegHeart className="text-zinc-400" />
                      </motion.span>

                    )}

                  </AnimatePresence>
                </button>

                {/* Nav arrows */}
                {product.images?.length > 1 && (
                  <>
                    <button onClick={handlePrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-zinc-800/90 rounded-full shadow flex items-center justify-center hover:bg-white transition">
                      <FaChevronLeft className="text-sm" />
                    </button>
                    <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-zinc-800/90 rounded-full shadow flex items-center justify-center hover:bg-white transition">
                      <FaChevronRight className="text-sm" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide">
                {product.images?.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setMainImage(img.url); setCurrentIndex(i); }}
                    className={`flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white dark:bg-zinc-900
                      ${currentIndex === i ? "border-emerald-500 shadow-md shadow-emerald-100 dark:shadow-emerald-900/30 scale-105" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>

              {/* Share row */}
              <div className="flex items-center gap-3 mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                <button className="flex items-center gap-1.5 hover:text-emerald-600 transition">
                  <FaShareAlt className="text-xs" /> Share
                </button>
              </div>
            </motion.div>

            {/* RIGHT — Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="flex flex-col gap-5"
            >
              {/* Brand + Category */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  {product.brand?.name || "Brand"}
                </span>
                <span className="text-zinc-300 dark:text-zinc-600">•</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  {product.category?.name}
                </span>
              </div>

              {/* Title */}
              <h1 className="display-font text-3xl lg:text-4xl font-bold leading-snug text-zinc-900 dark:text-white">
                {product.name}
              </h1>

              {/* Rating bar */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-bold px-3 py-1 rounded-lg">
                  <FaStar className="text-xs" />
                  {product.ratings?.toFixed(1) || "0.0"}
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {product.numOfReviews} ratings
                </span>
                <span className="text-zinc-200 dark:text-zinc-700">|</span>
                <Badge variant="blue">Top Rated</Badge>
              </div>

              <Divider />

              {/* Pricing */}
              <div className="flex items-end gap-3 flex-wrap">
                <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">
                  ₹{actualPrice.toLocaleString("en-IN")}
                </span>
                <span className="line-through text-zinc-400 text-xl mb-0.5">
                  ₹{discountedPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg mb-0.5">20% off</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 -mt-3">Inclusive of all taxes</p>

              {/* Offers */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <FaTag className="text-emerald-500" /> Available Offers
                </h3>
                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Bank Offer</strong> — 10% off on HDFC Bank Cards, up to ₹500</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No Cost EMI</strong> — starting ₹{Math.floor(actualPrice / 6)}/month for 6 months</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Partner Offer</strong> — Extra 5% off with SuperCoins</span>
                  </li>
                </ul>
              </div>

              <Divider />

              {/* Color picker */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Color{selectedColor && <span className="text-zinc-400 font-normal ml-1">— {selectedColor}</span>}
                  </h2>
                </div>
                <div className="flex gap-3">
                  {[
                    { name: "Jet Black", value: "#18181b" },
                    { name: "Ocean Blue", value: "#3b82f6" },
                    { name: "Forest Green", value: "#16a34a" },
                    { name: "Crimson", value: "#ef4444" },
                    { name: "Ivory", value: "#f5f5f0", border: true },
                  ].map((color) => (
                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-9 h-9 rounded-full transition-all duration-200 flex-shrink-0
                        ${selectedColor === color.name
                          ? "ring-2 ring-offset-2 ring-emerald-500 dark:ring-offset-zinc-950 scale-110"
                          : "hover:scale-105"
                        }
                        ${color.border ? "border border-zinc-300" : ""}`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>

              {/* Size picker */}
              {isClothing && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Select Size</h2>
                    <button className="text-xs text-emerald-600 dark:text-emerald-400 font-medium underline underline-offset-2">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex gap-2.5 flex-wrap">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-10 rounded-xl text-sm font-semibold border-2 transition-all duration-200
                          ${selectedSize === size
                            ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow"
                            : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Qty</span>
                <div className="flex items-center border-2 border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-600 dark:text-zinc-400"
                  >
                    <FaMinus className="text-xs" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-600 dark:text-zinc-400"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>

                {/* Stock status */}
                <div className="flex items-center gap-2 ml-2">
                  <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
                  <span className={`text-xs font-medium ${product.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                    {product.stock === 0 ? "Out of stock" : product.stock <= 10 ? `Only ${product.stock} left` : "In stock"}
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white bg-transparent hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all duration-200"
                >
                  Add to Cart
                </button>
                <button className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 transition-all duration-200 flex items-center justify-center gap-2">
                  <FaBolt className="text-xs" />
                  Buy Now
                </button>
              </div>

              <Divider />

              {/* Pincode checker */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-emerald-500" /> Check Delivery
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "")); setPincodeMsg(null); }}
                    placeholder="Enter pincode"
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:border-emerald-500 transition"
                  />
                  <button
                    onClick={checkPincode}
                    className="px-5 py-2.5 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition"
                  >
                    Check
                  </button>
                </div>
                <AnimatePresence>
                  {pincodeMsg && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className={`mt-2 text-xs font-medium ${pincodeMsg.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}
                    >
                      {pincodeMsg.ok ? "✓" : "✕"} {pincodeMsg.msg}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <FaTruck />, label: "Free Delivery", sub: "On orders above ₹499" },
                  { icon: <FaUndo />, label: "7-Day Returns", sub: "Easy replacement" },
                  { icon: <FaShieldAlt />, label: "1 Year Warranty", sub: "Brand guarantee" },
                ].map((b) => (
                  <div key={b.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 flex flex-col items-center gap-1.5 text-center">
                    <div className="text-emerald-500 text-base">{b.icon}</div>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-tight">{b.label}</span>
                    <span className="text-[10px] text-zinc-400">{b.sub}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ══════════════════════════════
              TABS: Description / Specs / Reviews
          ══════════════════════════════ */}
          <div className="mt-16">
            {/* Tab nav */}
            <div className="flex gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1 w-fit">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200
                    ${activeTab === tab
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                >
                  {tab} {tab === "reviews" && `(${product.numOfReviews})`}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mt-6"
              >

                {/* ── Description ── */}
                {activeTab === "description" && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                      <h3 className="display-font text-xl font-bold mb-4">About this product</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {product.description || "Premium quality product designed for durability and comfort. Built with meticulous attention to detail."}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                      <h3 className="display-font text-xl font-bold mb-4">Key Highlights</h3>
                      <ul className="space-y-3">
                        {(product.features?.length > 0
                          ? product.features
                          : ["Premium quality material", "Modern stylish design", "Highly durable build", "Lightweight & comfortable", "Perfect for daily use", "Value for money"]
                        ).map((f, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                            <span className="w-5 h-5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* ── Specifications ── */}
                {activeTab === "specifications" && (
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        {[
                          ["Brand", product.brand?.name || "—"],
                          ["Category", product.category?.name || "—"],
                          ["Stock Available", product.stock || 0],
                          ["Rating", `${product.ratings?.toFixed(1)} / 5`],
                          ["Total Reviews", product.numOfReviews],
                          ["SKU", product._id?.slice(-8).toUpperCase() || "N/A"],
                          ["Warranty", "1 Year"],
                          ["Return Policy", "7 Days"],
                        ].map(([key, val], i) => (
                          <tr key={key} className={i % 2 === 0 ? "bg-zinc-50 dark:bg-zinc-800/40" : ""}>
                            <td className="px-6 py-3.5 font-semibold text-zinc-500 dark:text-zinc-400 w-1/3">{key}</td>
                            <td className="px-6 py-3.5 text-zinc-800 dark:text-zinc-200">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ── Reviews ── */}
                {activeTab === "reviews" && (
                  <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">

                    {/* Summary card */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sticky top-16">
                      <div className="text-center mb-6">
                        <div className="display-font text-6xl font-bold mb-1">
                          {product.ratings?.toFixed(1) || "0.0"}
                        </div>
                        <StarRating rating={product.ratings} />
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                          {product.numOfReviews} reviews
                        </p>
                      </div>
                      <div className="space-y-2.5">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = product.reviews?.filter((r) => Math.round(r.rating) === star).length || 0;
                          const percent = product.numOfReviews > 0 ? (count / product.numOfReviews) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-3 text-xs">
                              <span className="w-5 text-zinc-500">{star}★</span>
                              <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-700" style={{ width: `${percent}%` }} />
                              </div>
                              <span className="w-5 text-zinc-400">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                      <button className="w-full mt-6 py-3 rounded-xl border-2 border-zinc-900 dark:border-white text-sm font-bold hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all duration-200">
                        Write a Review
                      </button>
                    </div>

                    {/* Review list */}
                    <div className="flex flex-col gap-4">
                      {product.reviews?.length > 0 ? (
                        product.reviews.map((rev, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3 gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                                  {rev.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div>
                                  <p className="font-semibold text-sm">{rev.name || "User"}</p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <FaStar key={s} className={`text-xs ${s <= rev.rating ? "text-amber-400" : "text-zinc-200 dark:text-zinc-700"}`} />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <Badge variant="green">✓ Verified</Badge>
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{rev.comment}</p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center">
                          <div className="text-5xl mb-4">💬</div>
                          <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">No reviews yet</p>
                          <p className="text-sm text-zinc-400">Be the first to review this product</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* ── Mobile sticky CTA ── */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-4 flex gap-3 z-40 shadow-2xl">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white bg-transparent hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all duration-200"
          >
            Add to Cart
          </button>
          <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center gap-2">
            <FaBolt className="text-xs" /> Buy Now
          </button>
        </div>

      </div>
    </>
  );
};

export default ProductDetails;
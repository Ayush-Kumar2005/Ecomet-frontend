import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRating from "./StarRating";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../slices/cartSlice";
import toast from "react-hot-toast";


const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const dispatch = useDispatch();

    const handleAddToCart = () => {
        if (product.stock === 0) {
            toast.error("Product is out of stock ❌");
            return;
        }

        if (!selectedColor) {
            toast.error("Please select a color");
            return;
        }

        if (isClothing && !selectedSize) {
            toast.error("Please select a size");
            return;
        }

        const cartItem = {
            id: product._id,
            title: product.name,
            description: product.description,
            price: product.price / 100,
            image: product.images?.[0]?.url,
            quantity: 1,
            color: selectedColor,
            size: selectedSize || null,
        };


        dispatch(addItem(cartItem));

        // ✅ SUCCESS TOAST
        toast.success("Added to cart successfully!", {
            style: {
            background: "#16a34a", // green
            color: "#fff",
            borderRadius: "10px",
            padding: "12px 16px",
            },
            iconTheme: {
            primary: "#fff",
            secondary: "#16a34a",
            },
        });
    };



  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/products/${id}`);
      console.log(res);
      const data = await res.json();
      setProduct(data?.data);
      setMainImage(data?.data?.images?.[0]?.url);
    } catch (err) {
      console.error(err);
    }
  };


    // Sync main image when index changes
    useEffect(() => {
    if (product?.images?.length > 0) {
        setMainImage(product.images[currentIndex].url);
    }
    }, [currentIndex, product]);

    const handleNext = () => {
    setCurrentIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
    );
    };

    const handlePrev = () => {
    setCurrentIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
    );
    };

    const isClothing = product?.category?.name
        ?.toLowerCase()
        ?.includes("cloth"); // you can adjust this

  if (!product) {
    return <p className="text-gray-800 p-6">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 px-4 md:px-12 py-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

            {/* LEFT: IMAGE GALLERY */}
            <div className="bg-white p-5 rounded-3xl shadow">

            {/* Main Image */}
            <div className="relative h-[420px] bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden group">
            
            <img
                src={mainImage}
                alt="product"
                className="h-full object-contain transition duration-500 group-hover:scale-110"
            />


                {/* LEFT BUTTON */}
                <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 
                bg-white shadow p-2 rounded-full text-gray-700 hover:bg-gray-100"
                >
                <FaChevronLeft />
                </button>

                {/* RIGHT BUTTON */}
                <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 
                bg-white shadow p-2 rounded-full text-gray-700 hover:bg-gray-100"
                >
                <FaChevronRight />
                </button>

            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-5 overflow-x-auto overflow-y-hidden scrollbar-hide">
            {product.images?.map((img, i) => (
                <img
                key={i}
                src={img.url}
                onClick={() => {
                    setMainImage(img.url);
                    setCurrentIndex(i);
                }}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition 
                    ${mainImage === img.url 
                    ? "border-emerald-400 scale-105" 
                    : "border-transparent hover:border-gray-500"}
                `}
                />
            ))}
            </div>

            </div>

            {/* RIGHT: PRODUCT INFO */}
            <div className="flex flex-col gap-6">

            {/* Category / Brand */}
            <p className="text-sm text-gray-500">
                {product.category?.name || "Category"} • {product.brand?.name || "Brand"}
            </p>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-3">
                <span className="bg-emerald-500 px-2 py-1 rounded text-sm font-semibold">
                ★ {product.ratings?.toFixed(1) || "0.0"}
                </span>
                <span className="text-gray-500 text-sm">
                {product.numOfReviews} reviews
                </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-emerald-400">
                ₹{product.price / 100}
            </div>

            {/* Stock Status */}
            <p className={`text-sm font-medium ${
            product.stock > 10 ? "text-green-400" :
            product.stock > 0 ? "text-yellow-400" :
            "text-red-500"
            }`}>
            {product.stock > 10 && "✔ In Stock"}
            {product.stock > 0 && product.stock <= 10 && "⚠ Only few left"}
            {product.stock === 0 && "✖ Out of Stock"}
            </p>

            {/* SIZE SELECTION */}
            {isClothing && (
            <div>
                <h2 className="text-lg font-semibold mb-2">Select Size</h2>

                <div className="flex gap-3 flex-wrap">
                {["S", "M", "L", "XL"].map((size) => (
                    <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border transition 
                    ${
                        selectedSize === size
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "border-gray-300 text-gray-700 hover:border-gray-500"
                    }
                    `}
                    >
                    {size}
                    </button>
                ))}
                </div>
            </div>
            )}

            {/* COLOR SELECTION */}
            <div>
            <h2 className="text-lg font-semibold mb-2">Select Color</h2>

            <div className="flex gap-3 items-center">
                {[
                { name: "Red", value: "#ef4444" },
                { name: "Blue", value: "#3b82f6" },
                { name: "Black", value: "#000000" },
                { name: "Green", value: "#22c55e" },
                ].map((color) => (
                <div
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 transition 
                    ${
                    selectedColor === color.name
                        ? "border-gray-800 scale-110"
                        : "border-gray-300"
                    }
                    `}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                ></div>
                ))}
            </div>

            {/* Selected Color Label */}
            {selectedColor && (
                <p className="text-sm text-gray-500 mt-2">
                Selected: {selectedColor}
                </p>
            )}
            </div>


            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Description */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Product Description</h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                {product.description || 
                "This product is crafted with premium materials to ensure durability, comfort, and style. Designed to meet modern needs, it offers excellent performance and long-lasting reliability."}
                </p>
            </div>

            {/* Highlights (AUTO GENERATED if not present) */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Highlights</h2>
                <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                {(product.features?.length > 0 
                    ? product.features 
                    : [
                        "Premium quality material",
                        "Modern stylish design",
                        "Highly durable build",
                        "Lightweight & comfortable",
                        "Perfect for daily use",
                        "Value for money",
                    ]
                ).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400">✔</span> {f}
                    </li>
                ))}
                </ul>
            </div>

            {/* Extra Info */}
            <div className="bg-white p-4 rounded-xl text-sm text-gray-600 shadow">
                <p><span className="text-gray-800 font-medium">Delivery:</span> Free delivery within 3-5 days</p>
                <p><span className="text-gray-800 font-medium">Return:</span> 7 days replacement available</p>
                <p><span className="text-gray-800 font-medium">Warranty:</span> 1 year warranty</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
                <button
                onClick={handleAddToCart}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 transition py-3 rounded-xl font-semibold shadow-lg"
                >
                Add to Cart
                </button>
                
            </div>

            </div>
        </div>
        <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-8 text-gray-800">Customer Reviews</h2>

        <div className="grid md:grid-cols-3 gap-8">

            {/* LEFT: SUMMARY */}
            <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-4">

            <div className="text-4xl font-bold text-gray-800">
                {product.ratings?.toFixed(1) || "0.0"}
            </div>

            <StarRating rating={product.ratings} />

            <p className="text-gray-500 text-sm">
                Based on {product.numOfReviews} reviews
            </p>

            {/* Rating Breakdown */}
            {[5,4,3,2,1].map((star) => {
                const count =
                product.reviews?.filter(r => Math.round(r.rating) === star).length || 0;

                const percent =
                product.numOfReviews > 0
                    ? (count / product.numOfReviews) * 100
                    : 0;

                return (
                <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-6">{star}★</span>

                    <div className="flex-1 bg-gray-200 h-2 rounded">
                    <div
                        className="bg-emerald-400 h-2 rounded"
                        style={{ width: `${percent}%` }}
                    ></div>
                    </div>

                    <span className="w-8 text-right text-gray-500">
                    {count}
                    </span>
                </div>
                );
            })}
            </div>

            {/* RIGHT: REVIEWS LIST */}
            <div className="md:col-span-2 flex flex-col gap-6">

            {product.reviews?.length > 0 ? (
                product.reviews.map((rev, i) => (
                <div
                    key={i}
                    className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
                >

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-3">

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold">
                        {rev.name?.charAt(0) || "U"}
                    </div>

                    {/* Name + Rating */}
                    <div>
                        <p className="font-semibold text-gray-800">
                        {rev.name || "User"}
                        </p>
                        <StarRating rating={rev.rating} />
                    </div>

                    </div>

                    {/* Comment */}
                    <p className="text-gray-600 text-sm leading-relaxed">
                    {rev.comment}
                    </p>

                </div>
                ))
            ) : (
                <p className="text-gray-500">No reviews yet.</p>
            )}

            </div>
        </div>
        </div>
    </div>
  );
};

export default ProductDetails;
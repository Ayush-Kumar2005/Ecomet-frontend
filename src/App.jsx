import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Header from "./Componentts/Header";
import Home from "./Componentts/Home";
import ViewAllCategories from "./Componentts/ViewAllCategories";
import ViewAllFashionDeals from "./Componentts/ViewAllFashionDeals";
import SubCategories from "./Componentts/SubCategories";
import Product from "./Componentts/Product";
import ProductDetails from "./Componentts/ProductDetails";
import BuyNow from "./Componentts/BuyNow";
import Cart from "./Componentts/Cart";
import Login from "./Componentts/Login";
import Signup from "./Componentts/SignUp";
import ProtectedRoute from "./Componentts/ProtectedRoute";
import AdminRoute from "./Componentts/AdminRoute";
import AdminDashboard from "./Componentts/AdminDashboard";
import Checkout from "./Componentts/Checkout";
import Payment from "./Componentts/Payment";
import OrderSuccess from "./Componentts/OrderSuccess";
import Wishlist from "./Componentts/Wishlist";
import SearchPage from "./Componentts/SearchPage";

const App = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020617]">
      {!isAdminPage && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ViewAllCategories" element={<ViewAllCategories />} />
        <Route path="/ViewAllFashionDeals" element={<ViewAllFashionDeals />} />
        <Route path="/category/:id" element={<SubCategories />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/productDetails/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<SearchPage />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/:orderId"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success/:orderId"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;

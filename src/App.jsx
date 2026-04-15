import React from "react";
import { Routes, Route } from "react-router-dom";
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


const App = () => {
  return (
    <div>
      <Header />

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


        <Route
          path="/buy-now"
          element={
            <ProtectedRoute>
              <BuyNow />
            </ProtectedRoute>
          }
        />

      </Routes>

    </div>
  );
};

export default App;
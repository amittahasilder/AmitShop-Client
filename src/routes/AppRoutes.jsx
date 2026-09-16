import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Hero from "../components/Hero/Hero";
import FeaturedProducts from "../components/Home/FeaturedProducts";

// =========================================================
// PRODUCTS
// =========================================================

import Products from "../pages/Products/Products";
import ProductDetails from "../pages/Products/ProductDetails";
import ProductManagement from "../pages/Products/ProductManagement";

// =========================================================
// SELLER
// =========================================================

import AddProduct from "../pages/Seller/AddProduct";
import EditProduct from "../pages/Seller/EditProduct";
import SellerDashboard from "../pages/Seller/SellerDashboard";

// =========================================================
// CART
// =========================================================

import Cart from "../pages/Cart/Cart";

// =========================================================
// CHECKOUT
// =========================================================

import Checkout from "../pages/Checkout/Checkout";

// =========================================================
// ORDERS
// =========================================================

import MyOrders from "../pages/Orders/MyOrders";
import OrderDetails from "../pages/Orders/OrderDetails";

// =========================================================
// WISHLIST
// =========================================================

import Wishlist from "../pages/Wishlist/Wishlist";

// =========================================================
// AUTH
// =========================================================

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// =========================================================
// PROFILE
// =========================================================

import Profile from "../pages/Profile/Profile";

// =========================================================
// PROTECTED ROUTE
// =========================================================

import ProtectedRoute from "./ProtectedRoute";

/* =========================================================
   HOME PAGE
========================================================= */

const Home = () => {
  return (
    <>
      {/* PREMIUM 3D HERO */}
      <Hero />

      {/* FEATURED PRODUCTS */}
      <FeaturedProducts />

      {/* NEXT HOME SECTIONS */}
      <section className="min-h-[200px] bg-[#05020b]" />
    </>
  );
};

/* =========================================================
   PLACEHOLDER PAGE
========================================================= */

const Placeholder = ({ title }) => {
  return (
    <main className="min-h-screen bg-[#05020b] px-5 pb-20 pt-36 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-violet-400/10 bg-white/[0.025] p-10 shadow-[0_20px_80px_rgba(124,58,237,0.08)] backdrop-blur-xl">

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-violet-400/60">
            AmitShop
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-white/35">
            This page is part of the AmitShop premium shopping
            experience. More features are coming soon.
          </p>

        </div>
      </div>
    </main>
  );
};

/* =========================================================
   APP ROUTES
========================================================= */

const AppRoutes = () => {
  return (
    <BrowserRouter>

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          ROUTES
      ================================================= */}

      <Routes>

        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* =================================================
            PRODUCTS LIST
        ================================================= */}

        <Route
          path="/products"
          element={<Products />}
        />

        {/* =================================================
            PRODUCT DETAILS
        ================================================= */}

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        {/* =================================================
            DEALS
        ================================================= */}

        <Route
          path="/deals"
          element={
            <Placeholder title="Deals" />
          }
        />

        {/* =================================================
            CATEGORIES
        ================================================= */}

        <Route
          path="/categories"
          element={
            <Placeholder title="Categories" />
          }
        />

        {/* =================================================
            ABOUT
        ================================================= */}

        <Route
          path="/about"
          element={
            <Placeholder title="About AmitShop" />
          }
        />

        {/* =================================================
            CONTACT
        ================================================= */}

        <Route
          path="/contact"
          element={
            <Placeholder title="Contact" />
          }
        />

        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =================================================
            REGISTER
        ================================================= */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =================================================
            PROTECTED USER ROUTES
        ================================================= */}

        <Route element={<ProtectedRoute />}>

          {/* =================================================
              PROFILE
          ================================================= */}

          <Route
            path="/profile"
            element={<Profile />}
          />

          {/* =================================================
              MY ORDERS
              F19
          ================================================= */}

          <Route
            path="/orders"
            element={<MyOrders />}
          />

          {/* =================================================
              ORDER DETAILS
              F20
          ================================================= */}

          <Route
            path="/orders/:orderId"
            element={<OrderDetails />}
          />

          {/* =================================================
              WISHLIST
          ================================================= */}

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          {/* =================================================
              CART
          ================================================= */}

          <Route
            path="/cart"
            element={<Cart />}
          />

          {/* =================================================
              CHECKOUT
          ================================================= */}

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          {/* =================================================
              SELLER DASHBOARD
              F23.2
          ================================================= */}

          <Route
            path="/seller/dashboard"
            element={<SellerDashboard />}
          />

          {/* =================================================
              SELLER / ADMIN
              ADD PRODUCT
          ================================================= */}

          <Route
            path="/products/add"
            element={<AddProduct />}
          />

          {/* =================================================
              SELLER / ADMIN
              OLD ADD PRODUCT ROUTE
          ================================================= */}

          <Route
            path="/seller/products/new"
            element={<AddProduct />}
          />

          {/* =================================================
              SELLER / ADMIN
              PRODUCT MANAGEMENT
          ================================================= */}

          <Route
            path="/products/manage"
            element={<ProductManagement />}
          />

          {/* =================================================
              SELLER / ADMIN
              EDIT PRODUCT
          ================================================= */}

          <Route
            path="/products/edit/:id"
            element={<EditProduct />}
          />

        </Route>

        {/* =================================================
            404 FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Placeholder title="Page Not Found" />
          }
        />

      </Routes>

      {/* =================================================
          PREMIUM FOOTER
      ================================================= */}

      <Footer />

    </BrowserRouter>
  );
};

export default AppRoutes;
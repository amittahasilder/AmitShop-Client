import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Hero from "../components/Hero/Hero";
import FeaturedProducts from "../components/Home/FeaturedProducts";

import Products from "../pages/Products/Products";
import ProductDetails from "../pages/Products/ProductDetails";

import AddProduct from "../pages/Seller/AddProduct";

// =========================================================
// CART
// =========================================================

import Cart from "../pages/Cart/Cart";

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
// PROTECTED ROUTE
// =========================================================

import ProtectedRoute from "./ProtectedRoute";

/* =========================================================
   HOME PAGE
========================================================= */

const Home = () => {
  return (
    <>
      {/* =================================================
          PREMIUM 3D HERO
      ================================================= */}

      <Hero />

      {/* =================================================
          FEATURED PRODUCTS
      ================================================= */}

      <FeaturedProducts />

      {/* =================================================
          NEXT HOME SECTIONS
          Categories, Deals, Top Rated etc.
          পরে আসবে
      ================================================= */}

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
            REGISTER / CREATE ACCOUNT
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
              SELLER / ADMIN
              ADD PRODUCT
          ================================================= */}

          <Route
            path="/seller/products/new"
            element={<AddProduct />}
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
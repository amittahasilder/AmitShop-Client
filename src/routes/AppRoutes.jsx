import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Hero from "../components/Hero/Hero";
import FeaturedProducts from "../components/Home/FeaturedProducts";
import AddProduct from "../pages/Seller/AddProduct";

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
          Categories, Deals, Top Rated etc. পরে আসবে
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
            PRODUCTS
        ================================================= */}

        <Route
          path="/products"
          element={
            <Placeholder title="Products" />
          }
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
            WISHLIST
        ================================================= */}

        <Route
          path="/wishlist"
          element={
            <Placeholder title="Wishlist" />
          }
        />

        {/* =================================================
            CART
        ================================================= */}

        <Route
          path="/cart"
          element={
            <Placeholder title="Shopping Cart" />
          }
        />

        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={
            <Placeholder title="Login" />
          }
        />

        {/* =================================================
            SELLER / ADMIN
            ADD PRODUCT
        ================================================= */}

        <Route
          path="/seller/products/new"
          element={<AddProduct />}
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
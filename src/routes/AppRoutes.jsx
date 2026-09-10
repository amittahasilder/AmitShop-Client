import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const Home = () => {
  return (
    <main className="min-h-screen bg-[#05020b] px-5 pb-20 pt-36 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="max-w-3xl">

          <div className="mb-5 inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-300 backdrop-blur-xl">
            ✦ Welcome to AmitShop
          </div>

          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Premium Products

            <br />

            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Better Life.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
            Discover amazing products with premium quality,
            unbeatable prices and a powerful shopping experience.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">

            <Link
              to="/products"
              className="
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                via-purple-600
                to-fuchsia-600
                px-6 py-3.5
                text-sm font-bold text-white
                shadow-[0_10px_35px_rgba(124,58,237,0.35)]
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-[0_15px_45px_rgba(168,85,247,0.5)]
              "
            >
              Shop Now →
            </Link>

            <Link
              to="/deals"
              className="
                rounded-xl
                border border-violet-400/20
                bg-white/[0.03]
                px-6 py-3.5
                text-sm font-semibold text-white/80
                backdrop-blur-xl
                transition-all duration-300
                hover:-translate-y-1
                hover:border-violet-400/40
                hover:bg-violet-500/10
                hover:text-white
              "
            >
              Explore Deals
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
};

const Placeholder = ({ title }) => {
  return (
    <main className="min-h-screen bg-[#05020b] px-5 pb-20 pt-36 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black">
          {title}
        </h1>
      </div>
    </main>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Placeholder title="Products" />}
        />

        <Route
          path="/deals"
          element={<Placeholder title="Deals" />}
        />

        <Route
          path="/categories"
          element={<Placeholder title="Categories" />}
        />

        <Route
          path="/about"
          element={<Placeholder title="About AmitShop" />}
        />

        <Route
          path="/contact"
          element={<Placeholder title="Contact" />}
        />

        <Route
          path="/wishlist"
          element={<Placeholder title="Wishlist" />}
        />

        <Route
          path="/cart"
          element={<Placeholder title="Shopping Cart" />}
        />

        <Route
          path="/login"
          element={<Placeholder title="Login" />}
        />

      </Routes>

      {/* PREMIUM FOOTER */}
      <Footer />

    </BrowserRouter>
  );
};

export default AppRoutes;
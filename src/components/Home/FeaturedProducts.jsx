import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);

        const response = await api.get("/products");

        if (response.data.success) {
          const productData =
            response.data.products ||
            response.data.data ||
            [];

          setProducts(productData.slice(0, 4));
        }
      } catch (error) {
        console.error(
          "Featured Products Error:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const getProductImage = (product) => {
    if (!product.images || product.images.length === 0) {
      return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=90";
    }

    const firstImage = product.images[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    return (
      firstImage.url ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=90"
    );
  };

  const getDiscount = (product) => {
    if (
      product.price &&
      product.discountPrice &&
      product.discountPrice < product.price
    ) {
      return Math.round(
        ((product.price - product.discountPrice) /
          product.price) *
          100
      );
    }

    return 0;
  };

  return (
    <section className="relative overflow-hidden bg-[#05020b] px-5 py-24 text-white sm:px-8 lg:px-12">

      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">

          <div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">

              <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />

              Handpicked Collection
            </div>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Featured{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                Products
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
              Discover our most popular products, carefully
              selected for quality, style and performance.
            </p>

          </div>

          <Link
            to="/products"
            className="group rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white/80 backdrop-blur-xl transition-all duration-300 hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
          >
            View All Products

            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

        </div>

        {/* ================= LOADING ================= */}

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.035]"
              >
                <div className="h-72 bg-white/[0.05]" />

                <div className="space-y-4 p-5">
                  <div className="h-3 w-24 rounded-full bg-white/[0.08]" />
                  <div className="h-5 w-40 rounded-full bg-white/[0.08]" />
                  <div className="h-4 w-28 rounded-full bg-white/[0.08]" />
                  <div className="h-7 w-24 rounded-full bg-white/[0.08]" />
                </div>
              </div>
            ))}

          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!isLoading && products.length === 0 && (
          <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] px-6 py-16 text-center backdrop-blur-xl">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-2xl text-violet-300">
              ✦
            </div>

            <h3 className="mt-5 text-xl font-black">
              No Products Available
            </h3>

            <p className="mt-2 text-sm text-white/40">
              Featured products will appear here once
              products are added to AmitShop.
            </p>

          </div>
        )}

        {/* ================= PRODUCT GRID ================= */}

        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {products.map((product) => {

              const isWishlisted =
                wishlist.includes(product._id);

              const discount = getDiscount(product);

              const image =
                getProductImage(product);

              const finalPrice =
                product.discountPrice &&
                product.discountPrice < product.price
                  ? product.discountPrice
                  : product.price;

              return (
                <article
                  key={product._id}
                  className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.035] shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-violet-400/30 hover:bg-white/[0.055]"
                >

                  {/* Card Glow */}

                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-600/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                  {/* ================= IMAGE ================= */}

                  <div className="relative h-72 overflow-hidden bg-gradient-to-br from-white/[0.04] to-violet-950/20">

                    {/* Discount */}

                    {discount > 0 && (
                      <div className="absolute left-4 top-4 z-10 rounded-full border border-violet-300/20 bg-violet-600/90 px-3 py-1.5 text-[10px] font-black tracking-wider text-white shadow-lg shadow-violet-900/30">
                        {discount}% OFF
                      </div>
                    )}

                    {/* Wishlist */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleWishlist(product._id)
                      }
                      className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-300 ${
                        isWishlisted
                          ? "border-pink-400/30 bg-pink-500/20 text-pink-400"
                          : "border-white/10 bg-black/20 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
                      }`}
                      aria-label="Toggle wishlist"
                    >
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill={
                          isWishlisted
                            ? "currentColor"
                            : "none"
                        }
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
                      </svg>
                    </button>

                    {/* Product Image */}

                    <img
                      src={image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* Bottom Gradient */}

                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080510] to-transparent" />

                    {/* Cart */}

                    <button
                      type="button"
                      className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-4 items-center justify-center rounded-full border border-violet-300/20 bg-violet-600 text-white opacity-0 shadow-lg shadow-violet-900/40 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110 hover:bg-violet-500"
                      aria-label="Add to cart"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" />
                        <circle cx="10" cy="21" r="1" />
                        <circle cx="18" cy="21" r="1" />
                      </svg>
                    </button>

                  </div>

                  {/* ================= CONTENT ================= */}

                  <div className="p-5">

                    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-400/80">
                      {product.category}
                    </p>

                    <h3 className="truncate text-lg font-extrabold text-white transition-colors duration-300 group-hover:text-violet-300">
                      {product.name}
                    </h3>

                    {/* Rating */}

                    <div className="mt-3 flex items-center gap-2">

                      <div className="flex items-center gap-0.5 text-yellow-400">
                        {Array.from({ length: 5 }).map(
                          (_, index) => (
                            <span key={index}>★</span>
                          )
                        )}
                      </div>

                      <span className="text-xs font-semibold text-white/40">
                        {product.ratings || 0}
                      </span>

                      <span className="text-xs text-white/25">
                        ({product.numReviews || 0})
                      </span>

                    </div>

                    {/* Price */}

                    <div className="mt-5 flex items-end justify-between gap-3">

                      <div className="flex items-center gap-2">

                        <span className="text-2xl font-black text-white">
                          ${finalPrice}
                        </span>

                        {product.discountPrice &&
                          product.discountPrice <
                            product.price && (
                            <span className="text-sm text-white/30 line-through">
                              ${product.price}
                            </span>
                          )}

                      </div>

                      <Link
                        to={`/products/${product._id}`}
                        className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-white/60 transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white"
                      >
                        Quick View
                      </Link>

                    </div>

                  </div>

                  {/* Bottom Line */}

                  <div className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-500 to-transparent transition-all duration-500 group-hover:w-2/3" />

                </article>
              );
            })}

          </div>
        )}

        {/* ================= TRUST ================= */}

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {[
            {
              icon: "✦",
              title: "Premium Quality",
              text: "Carefully selected products",
            },
            {
              icon: "⚡",
              title: "Fast Delivery",
              text: "Quick & reliable shipping",
            },
            {
              icon: "✓",
              title: "Secure Shopping",
              text: "Safe & trusted checkout",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-5 py-4 backdrop-blur-xl"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                {item.icon}
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-white/35">
                  {item.text}
                </p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;
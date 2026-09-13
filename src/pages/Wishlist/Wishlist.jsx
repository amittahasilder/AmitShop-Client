import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const Wishlist = () => {
  const navigate = useNavigate();

  const {
    accessToken,
    isAuthenticated,
  } = useAuthStore();

  const [wishlist, setWishlist] = useState({
    items: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [removingProduct, setRemovingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // AUTH CONFIG
  // ==========================================

  const getAuthConfig = () => {
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  };

  // ==========================================
  // PRODUCT IMAGE
  // ==========================================

  const getProductImage = (product) => {
    if (!product?.images || product.images.length === 0) {
      return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=90";
    }

    const image = product.images[0];

    if (typeof image === "string") {
      return image;
    }

    return (
      image?.url ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=90"
    );
  };

  // ==========================================
  // PRODUCT PRICE
  // ==========================================

  const getProductPrice = (product) => {
    if (
      product?.discountPrice !== undefined &&
      product?.discountPrice !== null &&
      product.discountPrice < product.price
    ) {
      return product.discountPrice;
    }

    return product?.price || 0;
  };

  // ==========================================
  // FORMAT PRICE
  // ==========================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(price || 0);
  };

  // ==========================================
  // FETCH WISHLIST
  // ==========================================

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!isAuthenticated || !accessToken) {
        navigate("/login");
        return;
      }

      const response = await api.get(
        "/wishlist",
        getAuthConfig()
      );

      if (response.data.success) {
        setWishlist(
          response.data.wishlist || {
            items: [],
          }
        );
      } else {
        setError(
          response.data.message ||
            "Unable to load your wishlist."
        );
      }
    } catch (err) {
      console.error(
        "Fetch Wishlist Error:",
        err
      );

      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Something went wrong while loading your wishlist."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated, accessToken]);

  // ==========================================
  // REMOVE FROM WISHLIST
  // ==========================================

  const removeFromWishlist = async (
    productId
  ) => {
    try {
      setRemovingProduct(productId);
      setError("");
      setSuccess("");

      const response = await api.delete(
        `/wishlist/${productId}`,
        getAuthConfig()
      );

      if (response.data.success) {
        setWishlist(response.data.wishlist);

        setSuccess(
          "Product removed from wishlist."
        );

        setTimeout(() => {
          setSuccess("");
        }, 2500);
      } else {
        setError(
          response.data.message ||
            "Unable to remove product."
        );
      }
    } catch (err) {
      console.error(
        "Remove Wishlist Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Something went wrong while removing product."
      );
    } finally {
      setRemovingProduct(null);
    }
  };

  // ==========================================
  // CLEAR WISHLIST
  // ==========================================

  const clearWishlist = async () => {
    if (!wishlist.items?.length) return;

    try {
      setIsClearing(true);
      setError("");
      setSuccess("");

      const response = await api.delete(
        "/wishlist",
        getAuthConfig()
      );

      if (response.data.success) {
        setWishlist(response.data.wishlist);

        setSuccess(
          "Wishlist cleared successfully."
        );

        setTimeout(() => {
          setSuccess("");
        }, 2500);
      } else {
        setError(
          response.data.message ||
            "Unable to clear wishlist."
        );
      }
    } catch (err) {
      console.error(
        "Clear Wishlist Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Something went wrong while clearing wishlist."
      );
    } finally {
      setIsClearing(false);
    }
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = async (productId) => {
    try {
      setAddingProduct(productId);
      setError("");
      setSuccess("");

      const response = await api.post(
        "/cart",
        {
          productId,
          quantity: 1,
        },
        getAuthConfig()
      );

      if (response.data.success) {
        setSuccess(
          "Product added to cart successfully."
        );

        setTimeout(() => {
          setSuccess("");
        }, 2500);
      } else {
        setError(
          response.data.message ||
            "Unable to add product to cart."
        );
      }
    } catch (err) {
      console.error(
        "Add To Cart Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Something went wrong while adding product to cart."
      );
    } finally {
      setAddingProduct(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#05020b] px-5 pb-24 pt-36 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />

            <div className="mt-5 h-12 w-80 animate-pulse rounded-2xl bg-white/10" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[430px] animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // EMPTY WISHLIST
  // ==========================================

  if (
    !wishlist.items ||
    wishlist.items.length === 0
  ) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#05020b] px-5 pb-24 pt-36 text-white sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute left-1/2 top-40 h-96 w-96 -translate-x-1/2 rounded-full bg-fuchsia-600/10 blur-[140px]" />

        <div className="relative mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-violet-400/10 bg-white/[0.025] p-10 text-center shadow-[0_30px_100px_rgba(124,58,237,0.1)] backdrop-blur-2xl sm:p-16">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-300 shadow-[0_0_50px_rgba(217,70,239,0.15)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-11 w-11"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.8 8.6c0 5.2-8.8 10.3-8.8 10.3S3.2 13.8 3.2 8.6A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.4Z"
                />
              </svg>
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-fuchsia-300/70">
              Saved For Later
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Your wishlist is{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                empty
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/45">
              Save products you love and keep them
              here for later. Your next favorite
              product might be waiting.
            </p>

            <Link
              to="/products"
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-sm font-black shadow-[0_15px_40px_rgba(139,92,246,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)]"
            >
              Explore Products

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // MAIN WISHLIST
  // ==========================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05020b] px-5 pb-24 pt-36 text-white sm:px-8 lg:px-12">
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-violet-700/10 blur-[140px]" />

      <div className="pointer-events-none absolute -right-40 top-[30%] h-96 w-96 rounded-full bg-fuchsia-700/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-fuchsia-400" />

              Saved Collection
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              My{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                Wishlist
              </span>
            </h1>

            <p className="mt-3 text-sm text-white/45">
              {wishlist.items.length}{" "}
              {wishlist.items.length === 1
                ? "product"
                : "products"}{" "}
              saved for later.
            </p>
          </div>

          {/* CLEAR */}

          <button
            type="button"
            onClick={clearWishlist}
            disabled={isClearing}
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-red-400/10 bg-red-500/[0.04] px-5 py-3 text-sm font-bold text-red-300/80 transition-all duration-300 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3"
              />
            </svg>

            {isClearing
              ? "Clearing..."
              : "Clear Wishlist"}
          </button>
        </div>

        {/* MESSAGES */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/[0.07] px-5 py-4 text-sm text-red-200">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 h-5 w-5 shrink-0"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="9" />
              <path
                strokeLinecap="round"
                d="M12 8v5"
              />
              <path
                strokeLinecap="round"
                d="M12 16.5h.01"
              />
            </svg>

            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.07] px-5 py-4 text-sm text-emerald-200">
            <span className="text-lg">
              ✓
            </span>

            <span>{success}</span>
          </div>
        )}

        {/* PRODUCTS */}

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.items.map((item) => {
            const product = item.product;

            if (!product) return null;

            const productId = product._id;

            const price = getProductPrice(product);

            const originalPrice =
              product.price || price;

            const hasDiscount =
              originalPrice > price;

            const isRemoving =
              removingProduct === productId;

            const isAdding =
              addingProduct === productId;

            return (
              <article
                key={productId}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] shadow-[0_20px_70px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-400/25 hover:bg-white/[0.04] hover:shadow-[0_30px_90px_rgba(124,58,237,0.15)]"
              >
                {/* IMAGE */}

                <div className="relative aspect-square overflow-hidden bg-black/20">
                  <Link
                    to={`/products/${productId}`}
                    className="block h-full w-full"
                  >
                    <img
                      src={getProductImage(product)}
                      alt={
                        product.name ||
                        "Product"
                      }
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </Link>

                  {/* SALE */}

                  {hasDiscount && (
                    <span className="absolute left-4 top-4 rounded-full bg-violet-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-lg">
                      Sale
                    </span>
                  )}

                  {/* HEART */}

                  <button
                    type="button"
                    onClick={() =>
                      removeFromWishlist(
                        productId
                      )
                    }
                    disabled={
                      isRemoving ||
                      isAdding
                    }
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-fuchsia-300 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:bg-red-500/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Remove from wishlist"
                  >
                    {isRemoving ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-fuchsia-300" />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M12 21s-7.5-4.6-9.5-9.1C.7 8.4 2.7 5 6.2 5c2 0 3.4 1.1 4.3 2.5C11.4 6.1 12.8 5 14.8 5c3.5 0 5.5 3.4 3.7 6.9C19.5 16.4 12 21 12 21Z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* CONTENT */}

                <div className="p-5">
                  {product.brand && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                      {product.brand}
                    </p>
                  )}

                  <Link
                    to={`/products/${productId}`}
                    className="mt-2 block line-clamp-2 min-h-[3.5rem] text-lg font-black leading-7 text-white transition-colors hover:text-violet-300"
                  >
                    {product.name}
                  </Link>

                  {/* RATING */}

                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-sm text-amber-300">
                      ★★★★★
                    </div>

                    <span className="text-xs text-white/30">
                      {product.ratings
                        ? Number(
                            product.ratings
                          ).toFixed(1)
                        : "New"}
                    </span>
                  </div>

                  {/* PRICE */}

                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-xl font-black">
                      {formatPrice(price)}
                    </span>

                    {hasDiscount && (
                      <span className="pb-0.5 text-xs text-white/30 line-through">
                        {formatPrice(
                          originalPrice
                        )}
                      </span>
                    )}
                  </div>

                  {/* ACTIONS */}

                  <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        addToCart(productId)
                      }
                      disabled={
                        isAdding ||
                        isRemoving ||
                        !product.stock ||
                        product.stock < 1
                      }
                      className="group/btn flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-xs font-black shadow-[0_10px_30px_rgba(124,58,237,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(124,58,237,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isAdding ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      ) : (
                        <>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-4 w-4"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6"
                            />
                            <path
                              strokeLinecap="round"
                              d="M10 20h.01M18 20h.01"
                            />
                          </svg>

                          {product.stock
                            ? "Add to Cart"
                            : "Out of Stock"}
                        </>
                      )}
                    </button>

                    <Link
                      to={`/products/${productId}`}
                      className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs font-bold text-white/50 transition-all duration-300 hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-white"
                    >
                      View
                    </Link>
                  </div>

                  {/* STOCK */}

                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        product.stock > 5
                          ? "bg-emerald-400"
                          : product.stock > 0
                          ? "bg-amber-400"
                          : "bg-red-400"
                      }`}
                    />

                    <span className="text-[11px] text-white/30">
                      {product.stock > 5
                        ? "In stock"
                        : product.stock > 0
                        ? `Only ${product.stock} left`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* BOTTOM INFO */}

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: "♡",
              title: "Save Favorites",
              text: "Keep products you love in one place.",
            },
            {
              icon: "🛒",
              title: "Shop Anytime",
              text: "Move saved products to your cart whenever you're ready.",
            },
            {
              icon: "🔒",
              title: "Secure Shopping",
              text: "Your wishlist is private to your account.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/5 bg-white/[0.02] p-5 text-center"
            >
              <div className="text-2xl text-violet-300">
                {item.icon}
              </div>

              <h3 className="mt-3 text-sm font-black">
                {item.title}
              </h3>

              <p className="mt-2 text-xs leading-5 text-white/25">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Wishlist;
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const Cart = () => {
  const navigate = useNavigate();

  const {
    accessToken,
    isAuthenticated,
  } = useAuthStore();

  const [cart, setCart] = useState({
    items: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [updatingProduct, setUpdatingProduct] = useState(null);
  const [removingProduct, setRemovingProduct] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // GET PRODUCT IMAGE
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
  // GET PRODUCT PRICE
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
  // FORMAT MONEY
  // ==========================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(price || 0);
  };

  // ==========================================
  // AUTH HEADERS
  // ==========================================

  const getAuthConfig = () => {
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  };

  // ==========================================
  // FETCH CART
  // ==========================================

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!isAuthenticated || !accessToken) {
        navigate("/login");
        return;
      }

      const response = await api.get(
        "/cart",
        getAuthConfig()
      );

      if (response.data.success) {
        setCart(
          response.data.cart || {
            items: [],
          }
        );
      } else {
        setError(
          response.data.message ||
            "Unable to load your cart."
        );
      }
    } catch (err) {
      console.error("Fetch Cart Error:", err);

      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Something went wrong while loading your cart."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, accessToken]);

  // ==========================================
  // UPDATE QUANTITY
  // ==========================================

  const updateQuantity = async (
    productId,
    currentQuantity,
    newQuantity
  ) => {
    if (newQuantity < 1) return;

    const item = cart.items.find(
      (cartItem) =>
        cartItem.product?._id === productId
    );

    if (!item) return;

    const stock = item.product?.stock ?? Infinity;

    if (newQuantity > stock) {
      setError(
        `Only ${stock} item(s) available in stock.`
      );
      return;
    }

    try {
      setUpdatingProduct(productId);
      setError("");

      const response = await api.put(
        `/cart/${productId}`,
        {
          quantity: newQuantity,
        },
        getAuthConfig()
      );

      if (response.data.success) {
        setCart(response.data.cart);
      } else {
        setError(
          response.data.message ||
            "Unable to update cart."
        );
      }
    } catch (err) {
      console.error("Update Cart Error:", err);

      setError(
        err.response?.data?.message ||
          "Something went wrong while updating quantity."
      );
    } finally {
      setUpdatingProduct(null);
    }
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const removeItem = async (productId) => {
    try {
      setRemovingProduct(productId);
      setError("");

      const response = await api.delete(
        `/cart/${productId}`,
        getAuthConfig()
      );

      if (response.data.success) {
        setCart(response.data.cart);
      } else {
        setError(
          response.data.message ||
            "Unable to remove product."
        );
      }
    } catch (err) {
      console.error("Remove Cart Item Error:", err);

      setError(
        err.response?.data?.message ||
          "Something went wrong while removing product."
      );
    } finally {
      setRemovingProduct(null);
    }
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = async () => {
    if (!cart.items?.length) return;

    try {
      setIsClearing(true);
      setError("");

      const response = await api.delete(
        "/cart",
        getAuthConfig()
      );

      if (response.data.success) {
        setCart(response.data.cart);
      } else {
        setError(
          response.data.message ||
            "Unable to clear cart."
        );
      }
    } catch (err) {
      console.error("Clear Cart Error:", err);

      setError(
        err.response?.data?.message ||
          "Something went wrong while clearing cart."
      );
    } finally {
      setIsClearing(false);
    }
  };

  // ==========================================
  // CALCULATIONS
  // ==========================================

  const totals = useMemo(() => {
    const items = cart.items || [];

    const subtotal = items.reduce((total, item) => {
      const price = getProductPrice(item.product);

      return total + price * item.quantity;
    }, 0);

    const originalTotal = items.reduce(
      (total, item) => {
        return (
          total +
          (item.product?.price || 0) *
            item.quantity
        );
      },
      0
    );

    const discount = Math.max(
      originalTotal - subtotal,
      0
    );

    const shipping =
      subtotal === 0
        ? 0
        : subtotal >= 100
        ? 0
        : 9.99;

    const tax = subtotal * 0.05;

    const total = subtotal + shipping + tax;

    const itemCount = items.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );

    return {
      subtotal,
      originalTotal,
      discount,
      shipping,
      tax,
      total,
      itemCount,
    };
  }, [cart]);

  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#05020b] px-5 pb-24 pt-36 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />

            <div className="mt-5 h-12 w-72 animate-pulse rounded-2xl bg-white/10" />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-44 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]"
                />
              ))}
            </div>

            <div className="h-[420px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (!cart.items || cart.items.length === 0) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#05020b] px-5 pb-24 pt-36 text-white sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute left-1/2 top-40 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="relative mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-violet-400/10 bg-white/[0.025] p-10 text-center shadow-[0_30px_100px_rgba(124,58,237,0.1)] backdrop-blur-2xl sm:p-16">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-violet-400/20 bg-violet-500/10 text-violet-300 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
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
                  d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6"
                />
                <circle
                  cx="10"
                  cy="20"
                  r="1.2"
                />
                <circle
                  cx="18"
                  cy="20"
                  r="1.2"
                />
              </svg>
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-violet-300/70">
              Your Shopping Bag
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Your cart is{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                empty
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/45">
              Looks like you haven't added anything
              to your cart yet. Explore our collection
              and discover something you'll love.
            </p>

            <Link
              to="/products"
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-sm font-black shadow-[0_15px_40px_rgba(139,92,246,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)]"
            >
              Start Shopping
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
  // MAIN CART
  // ==========================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05020b] px-5 pb-24 pt-36 text-white sm:px-8 lg:px-12">
      {/* BACKGROUND GLOWS */}

      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-violet-700/10 blur-[140px]" />

      <div className="pointer-events-none absolute -right-40 top-[35%] h-96 w-96 rounded-full bg-fuchsia-700/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
              Shopping Bag
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              Your{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                Cart
              </span>
            </h1>

            <p className="mt-3 text-sm text-white/45">
              {totals.itemCount}{" "}
              {totals.itemCount === 1
                ? "item"
                : "items"}{" "}
              ready for checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
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
              : "Clear Cart"}
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-7 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/[0.07] px-5 py-4 text-sm text-red-200">
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

        {/* CONTENT */}

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_390px]">
          {/* CART ITEMS */}

          <section className="space-y-4">
            {cart.items.map((item) => {
              const product = item.product;

              if (!product) return null;

              const productId = product._id;

              const price = getProductPrice(product);

              const originalPrice =
                product.price || price;

              const hasDiscount =
                originalPrice > price;

              const isUpdating =
                updatingProduct === productId;

              const isRemoving =
                removingProduct === productId;

              return (
                <article
                  key={productId}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition-all duration-300 hover:border-violet-400/20 hover:bg-white/[0.04] sm:p-5"
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* IMAGE */}

                    <Link
                      to={`/products/${productId}`}
                      className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 sm:h-36 sm:w-36"
                    >
                      <img
                        src={getProductImage(product)}
                        alt={
                          product.name ||
                          "Product"
                        }
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                      {hasDiscount && (
                        <span className="absolute left-2 top-2 rounded-full bg-violet-600 px-2 py-1 text-[10px] font-black">
                          SALE
                        </span>
                      )}
                    </Link>

                    {/* INFO */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to={`/products/${productId}`}
                            className="line-clamp-2 text-base font-black leading-6 text-white transition-colors hover:text-violet-300 sm:text-lg"
                          >
                            {product.name}
                          </Link>

                          {product.brand && (
                            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/30">
                              {product.brand}
                            </p>
                          )}
                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(productId)
                          }
                          disabled={
                            isRemoving ||
                            isUpdating
                          }
                          className="shrink-0 rounded-xl p-2 text-white/30 transition-all duration-300 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Remove product"
                        >
                          {isRemoving ? (
                            <span className="block h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-red-300" />
                          ) : (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="h-5 w-5"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path
                                strokeLinecap="round"
                                d="M4 7h16"
                              />
                              <path
                                strokeLinecap="round"
                                d="M10 11v6m4-6v6"
                              />
                              <path
                                strokeLinecap="round"
                                d="M6 7l1 13h10l1-13"
                              />
                              <path
                                strokeLinecap="round"
                                d="M9 7V4h6v3"
                              />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* PRICE */}

                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-lg font-black text-white">
                          {formatPrice(price)}
                        </span>

                        {hasDiscount && (
                          <span className="text-xs text-white/30 line-through">
                            {formatPrice(
                              originalPrice
                            )}
                          </span>
                        )}
                      </div>

                      {/* BOTTOM */}

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        {/* QUANTITY */}

                        <div className="flex items-center rounded-2xl border border-white/10 bg-black/20 p-1">
                          <button
                            type="button"
                            disabled={
                              item.quantity <= 1 ||
                              isUpdating ||
                              isRemoving
                            }
                            onClick={() =>
                              updateQuantity(
                                productId,
                                item.quantity,
                                item.quantity - 1
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/60 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                          >
                            −
                          </button>

                          <div className="flex min-w-10 items-center justify-center px-1 text-sm font-black">
                            {isUpdating ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                            ) : (
                              item.quantity
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={
                              isUpdating ||
                              isRemoving ||
                              item.quantity >=
                                product.stock
                            }
                            onClick={() =>
                              updateQuantity(
                                productId,
                                item.quantity,
                                item.quantity + 1
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/60 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                          >
                            +
                          </button>
                        </div>

                        {/* ITEM TOTAL */}

                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wider text-white/25">
                            Item Total
                          </p>

                          <p className="mt-1 text-base font-black text-violet-300">
                            {formatPrice(
                              price *
                                item.quantity
                            )}
                          </p>
                        </div>
                      </div>

                      {/* STOCK */}

                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            product.stock > 5
                              ? "bg-emerald-400"
                              : product.stock > 0
                              ? "bg-amber-400"
                              : "bg-red-400"
                          }`}
                        />

                        <span className="text-white/30">
                          {product.stock > 5
                            ? "In stock"
                            : product.stock > 0
                            ? `Only ${product.stock} left`
                            : "Out of stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* SUMMARY */}

          <aside className="lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-[2rem] border border-violet-400/15 bg-white/[0.035] p-6 shadow-[0_30px_100px_rgba(124,58,237,0.12)] backdrop-blur-2xl sm:p-7">
              {/* GLOW */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-600/15 blur-[80px]" />

              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300/60">
                  Order Summary
                </p>

                <h2 className="mt-3 text-2xl font-black">
                  Checkout{" "}
                  <span className="text-white/30">
                    Preview
                  </span>
                </h2>

                {/* LINES */}

                <div className="mt-7 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/45">
                      Subtotal
                    </span>

                    <span className="font-bold text-white/80">
                      {formatPrice(
                        totals.subtotal
                      )}
                    </span>
                  </div>

                  {totals.discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-300/70">
                        Product Discount
                      </span>

                      <span className="font-bold text-emerald-300">
                        -{formatPrice(
                          totals.discount
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/45">
                      Shipping
                    </span>

                    <span className="font-bold text-white/80">
                      {totals.shipping === 0
                        ? "FREE"
                        : formatPrice(
                            totals.shipping
                          )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/45">
                      Estimated Tax
                    </span>

                    <span className="font-bold text-white/80">
                      {formatPrice(totals.tax)}
                    </span>
                  </div>
                </div>

                <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* TOTAL */}

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/30">
                      Total
                    </p>

                    <p className="mt-2 text-3xl font-black tracking-tight">
                      {formatPrice(totals.total)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 px-3 py-2 text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-violet-300/60">
                      Items
                    </p>

                    <p className="mt-0.5 text-sm font-black text-violet-200">
                      {totals.itemCount}
                    </p>
                  </div>
                </div>

                {/* CHECKOUT */}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/checkout")
                  }
                  className="group mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-6 py-4 text-sm font-black shadow-[0_15px_40px_rgba(124,58,237,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(124,58,237,0.4)]"
                >
                  Proceed to Checkout
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>

                {/* CONTINUE SHOPPING */}

                <Link
                  to="/products"
                  className="mt-3 flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-3.5 text-sm font-bold text-white/60 transition-all duration-300 hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-white"
                >
                  ← Continue Shopping
                </Link>

                {/* FREE SHIPPING */}

                {totals.subtotal > 0 &&
                  totals.subtotal < 100 && (
                    <div className="mt-5 rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.04] p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-emerald-300">
                          ✓
                        </div>

                        <div>
                          <p className="text-xs font-bold text-emerald-300">
                            Free shipping unlocked at
                            $100
                          </p>

                          <p className="mt-1 text-xs leading-5 text-white/30">
                            Add{" "}
                            {formatPrice(
                              100 -
                                totals.subtotal
                            )}{" "}
                            more to get free
                            shipping.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {totals.shipping === 0 &&
                  totals.subtotal > 0 && (
                    <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.04] p-4">
                      <span className="text-emerald-300">
                        ✓
                      </span>

                      <span className="text-xs font-bold text-emerald-300">
                        You've unlocked FREE
                        shipping.
                      </span>
                    </div>
                  )}
              </div>
            </div>

            {/* TRUST */}

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                ["🔒", "Secure"],
                ["↩", "Easy Returns"],
                ["⚡", "Fast Delivery"],
              ].map(([icon, text]) => (
                <div
                  key={text}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] px-2 py-3 text-center"
                >
                  <div className="text-sm">
                    {icon}
                  </div>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/25">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;
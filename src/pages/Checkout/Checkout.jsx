import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    accessToken,
    isAuthenticated,
  } = useAuthStore();

  const [cart, setCart] = useState({
    items: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // PAYMENT METHOD
  // ==========================================

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  // ==========================================
  // SHIPPING FORM
  // ==========================================

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Bangladesh",
    note: "",
  });

  // ==========================================
  // AUTH CONFIG
  // ==========================================

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

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
  // GET PRODUCT IMAGE
  // ==========================================

  const getProductImage = (product) => {
    const fallback =
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=90";

    if (
      !product?.images ||
      product.images.length === 0
    ) {
      return fallback;
    }

    const image = product.images[0];

    if (typeof image === "string") {
      return image;
    }

    return image?.url || fallback;
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
        const nextCart =
          response.data.cart || {
            items: [],
          };

        if (
          !nextCart.items ||
          nextCart.items.length === 0
        ) {
          navigate("/cart");
          return;
        }

        setCart(nextCart);
      } else {
        setError(
          response.data.message ||
            "Unable to load cart."
        );
      }
    } catch (err) {
      console.error(
        "Checkout Cart Error:",
        err
      );

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
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // CALCULATIONS
  // ==========================================

  const totals = useMemo(() => {
    const items = cart.items || [];

    const subtotal = items.reduce(
      (total, item) => {
        const price = getProductPrice(
          item.product
        );

        return (
          total +
          price * Number(item.quantity || 0)
        );
      },
      0
    );

    const originalTotal = items.reduce(
      (total, item) => {
        return (
          total +
          (item.product?.price || 0) *
            Number(item.quantity || 0)
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
        : 10;

    const tax = Number(
      (subtotal * 0.05).toFixed(2)
    );

    const total = Number(
      (
        subtotal +
        shipping +
        tax
      ).toFixed(2)
    );

    const itemCount = items.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
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
  // VALIDATE FORM
  // ==========================================

  const validateForm = () => {
    if (!form.fullName.trim()) {
      return "Full name is required.";
    }

    if (!form.phone.trim()) {
      return "Phone number is required.";
    }

    if (!form.address.trim()) {
      return "Address is required.";
    }

    if (!form.city.trim()) {
      return "City is required.";
    }

    if (!form.postalCode.trim()) {
      return "Postal code is required.";
    }

    if (!form.country.trim()) {
      return "Country is required.";
    }

    return "";
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsPlacingOrder(true);

      // ========================================
      // CREATE ORDER
      // ========================================

      const orderResponse = await api.post(
        "/orders",
        {
          shippingAddress: {
            fullName:
              form.fullName.trim(),

            phone:
              form.phone.trim(),

            address:
              form.address.trim(),

            city:
              form.city.trim(),

            state:
              form.state.trim(),

            postalCode:
              form.postalCode.trim(),

            country:
              form.country.trim(),
          },

          paymentMethod,

          note:
            form.note.trim(),
        },
        getAuthConfig()
      );

      if (!orderResponse.data.success) {
        setError(
          orderResponse.data.message ||
            "Unable to create order."
        );

        return;
      }

      const order =
        orderResponse.data.order;

      // ========================================
      // STRIPE PAYMENT
      // ========================================

      if (paymentMethod === "STRIPE") {
        const stripeResponse =
          await api.post(
            "/payments/create-checkout-session",
            {
              orderId: order._id,
            },
            getAuthConfig()
          );

        if (
          stripeResponse.data.success &&
          stripeResponse.data.url
        ) {
          window.location.href =
            stripeResponse.data.url;

          return;
        }

        setError(
          stripeResponse.data.message ||
            "Unable to start Stripe checkout."
        );

        return;
      }

      // ========================================
      // COD SUCCESS
      // ========================================

      setSuccess(
        `Order placed successfully! Order ID: ${order?._id}`
      );

      setCart({
        items: [],
      });
    } catch (err) {
      console.error(
        "Place Order Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#05020b] px-5 pb-24 pt-36 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="h-5 w-32 animate-pulse rounded-full bg-white/10" />

          <div className="mt-6 h-12 w-72 animate-pulse rounded-2xl bg-white/10" />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_390px]">
            <div className="h-[650px] animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.03]" />

            <div className="h-[500px] animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.03]" />
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // ORDER SUCCESS
  // ==========================================

  if (success) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#05020b] px-5 pb-24 pt-36 text-white sm:px-8">
        <div className="pointer-events-none absolute left-1/2 top-40 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[140px]" />

        <div className="relative mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-emerald-400/15 bg-white/[0.035] p-10 text-center shadow-[0_30px_100px_rgba(16,185,129,0.08)] backdrop-blur-2xl sm:p-16">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-12 w-12"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 12 4 4L19 6"
                />
              </svg>
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300/70">
              Order Confirmed
            </p>

            <h1 className="mt-4 text-4xl font-black sm:text-5xl">
              Thank you for{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                your order
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/45">
              Your order has been successfully
              placed. We will process it and
              keep you updated about its status.
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-wider text-white/30">
                Order Information
              </p>

              <p className="mt-2 break-all text-sm font-bold text-violet-300">
                {success.replace(
                  "Order placed successfully! Order ID: ",
                  ""
                )}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/products"
                className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-4 text-sm font-black transition-all hover:-translate-y-1"
              >
                Continue Shopping
              </Link>

              <Link
                to="/orders"
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-7 py-4 text-sm font-bold text-white/70 transition-all hover:border-violet-400/20 hover:text-white"
              >
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // CHECKOUT PAGE
  // ==========================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05020b] px-5 pb-24 pt-36 text-white sm:px-8 lg:px-12">

      {/* BACKGROUND GLOWS */}

      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-violet-700/10 blur-[140px]" />

      <div className="pointer-events-none absolute -right-40 top-[40%] h-96 w-96 rounded-full bg-fuchsia-700/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-10">
          <Link
            to="/cart"
            className="text-sm font-bold text-white/40 transition-colors hover:text-violet-300"
          >
            ← Back to Cart
          </Link>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
            Secure Checkout
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            Complete Your{" "}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
              Order
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            Enter your shipping information and
            review your order before placing it.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-7 rounded-2xl border border-red-400/20 bg-red-500/[0.07] px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <form
          onSubmit={handlePlaceOrder}
          className="grid items-start gap-8 lg:grid-cols-[1fr_390px]"
        >

          {/* LEFT */}

          <section className="space-y-6">

            {/* SHIPPING */}

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 backdrop-blur-2xl sm:p-8">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300/60">
                  Step 01
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Shipping Information
                </h2>

                <p className="mt-2 text-sm text-white/35">
                  Where should we deliver your order?
                </p>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">

                {/* FULL NAME */}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/40 focus:bg-violet-500/[0.04]"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+880 1XXXXXXXXX"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/40 focus:bg-violet-500/[0.04]"
                  />
                </div>

                {/* COUNTRY */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition-all focus:border-violet-400/40 focus:bg-violet-500/[0.04]"
                  />
                </div>

                {/* ADDRESS */}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                    Street Address
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="House, road, area..."
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/40 focus:bg-violet-500/[0.04]"
                  />
                </div>

                {/* CITY */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Dhaka"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/40 focus:bg-violet-500/[0.04]"
                  />
                </div>

                {/* STATE */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                    State / Division
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Division"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/40 focus:bg-violet-500/[0.04]"
                  />
                </div>

                {/* POSTAL CODE */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                    Postal Code
                  </label>

                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="1200"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/40 focus:bg-violet-500/[0.04]"
                  />
                </div>

                {/* NOTE */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                    Order Note
                  </label>

                  <input
                    type="text"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Optional note"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/40 focus:bg-violet-500/[0.04]"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT */}

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 backdrop-blur-2xl sm:p-8">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300/60">
                Step 02
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Payment Method
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                {/* COD */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("COD")
                  }
                  className={`rounded-2xl border p-5 text-left transition-all ${
                    paymentMethod === "COD"
                      ? "border-violet-400/40 bg-violet-500/[0.10] shadow-[0_10px_35px_rgba(124,58,237,0.10)]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                      💵
                    </div>

                    <div>
                      <p className="text-sm font-black">
                        Cash on Delivery
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/35">
                        Pay when your order arrives.
                      </p>
                    </div>

                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`h-4 w-4 rounded-full border ${
                        paymentMethod === "COD"
                          ? "border-violet-400 bg-violet-500"
                          : "border-white/20"
                      }`}
                    />

                    <span className="text-[11px] text-white/30">
                      {paymentMethod === "COD"
                        ? "Selected"
                        : "Select COD"}
                    </span>
                  </div>
                </button>

                {/* STRIPE */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("STRIPE")
                  }
                  className={`rounded-2xl border p-5 text-left transition-all ${
                    paymentMethod === "STRIPE"
                      ? "border-fuchsia-400/40 bg-fuchsia-500/[0.10] shadow-[0_10px_35px_rgba(217,70,239,0.10)]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-300">
                      💳
                    </div>

                    <div>
                      <p className="text-sm font-black">
                        Stripe Payment
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/35">
                        Pay securely using your card.
                      </p>
                    </div>

                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`h-4 w-4 rounded-full border ${
                        paymentMethod === "STRIPE"
                          ? "border-fuchsia-400 bg-fuchsia-500"
                          : "border-white/20"
                      }`}
                    />

                    <span className="text-[11px] text-white/30">
                      {paymentMethod === "STRIPE"
                        ? "Selected"
                        : "Select Stripe"}
                    </span>
                  </div>
                </button>

              </div>

              <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs leading-5 text-white/25">
                {paymentMethod === "STRIPE"
                  ? "You will be redirected to Stripe's secure checkout page to complete your payment."
                  : "Pay the order amount when your order is delivered."}
              </div>
            </div>
          </section>

          {/* RIGHT - SUMMARY */}

          <aside className="lg:sticky lg:top-28">

            <div className="relative overflow-hidden rounded-[2rem] border border-violet-400/15 bg-white/[0.035] p-6 shadow-[0_30px_100px_rgba(124,58,237,0.12)] backdrop-blur-2xl sm:p-7">

              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-600/15 blur-[80px]" />

              <div className="relative">

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300/60">
                  Step 03
                </p>

                <h2 className="mt-3 text-2xl font-black">
                  Order Summary
                </h2>

                {/* ITEMS */}

                <div className="mt-6 space-y-4">
                  {cart.items.map((item) => {
                    const product =
                      item.product;

                    if (!product) return null;

                    const price =
                      getProductPrice(product);

                    return (
                      <div
                        key={product._id}
                        className="flex gap-3"
                      >
                        <img
                          src={getProductImage(
                            product
                          )}
                          alt={
                            product.name ||
                            "Product"
                          }
                          className="h-16 w-16 rounded-xl border border-white/10 object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-xs font-bold text-white/80">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-white/30">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <p className="text-xs font-black text-violet-300">
                          {formatPrice(
                            price *
                              item.quantity
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* TOTAL LINES */}

                <div className="space-y-4">

                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">
                      Subtotal
                    </span>

                    <span className="font-bold">
                      {formatPrice(
                        totals.subtotal
                      )}
                    </span>
                  </div>

                  {totals.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-300/70">
                        Discount
                      </span>

                      <span className="font-bold text-emerald-300">
                        -{formatPrice(
                          totals.discount
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">
                      Shipping
                    </span>

                    <span className="font-bold">
                      {totals.shipping === 0
                        ? "FREE"
                        : formatPrice(
                            totals.shipping
                          )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">
                      Tax
                    </span>

                    <span className="font-bold">
                      {formatPrice(
                        totals.tax
                      )}
                    </span>
                  </div>
                </div>

                <div className="my-6 h-px bg-white/10" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/25">
                      Total
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      {formatPrice(
                        totals.total
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl border border-violet-400/20 bg-violet-500/10 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-violet-300/60">
                      Items
                    </p>

                    <p className="text-sm font-black text-violet-200">
                      {totals.itemCount}
                    </p>
                  </div>
                </div>

                {/* PLACE ORDER */}

                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className="group mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-6 py-4 text-sm font-black shadow-[0_15px_40px_rgba(124,58,237,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(124,58,237,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPlacingOrder ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      {paymentMethod === "STRIPE"
                        ? "Opening Stripe..."
                        : "Placing Order..."}
                    </>
                  ) : (
                    <>
                      {paymentMethod === "STRIPE"
                        ? "Pay with Stripe"
                        : "Place Order"}

                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-[10px] leading-5 text-white/20">
                  By placing your order, you agree
                  to our terms and conditions.
                </p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
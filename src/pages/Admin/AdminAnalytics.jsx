
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const RANGE_OPTIONS = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
  { label: "180 Days", value: 180 },
  { label: "365 Days", value: 365 },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

const AdminAnalytics = () => {
  const { user, accessToken, isAuthenticated } = useAuthStore();

  const [range, setRange] = useState(30);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  /* =======================================================
     FETCH ANALYTICS
  ======================================================= */

  const fetchAnalytics = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/admin/analytics", {
        params: {
          days: range,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setAnalytics(response.data?.data || response.data);
    } catch (err) {
      console.error("Admin analytics error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load admin analytics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchAnalytics();
    }
  }, [range, accessToken, isAuthenticated]);

  /* =======================================================
     NORMALIZED DATA
  ======================================================= */

  const stats = useMemo(() => {
    if (!analytics) {
      return {
        totalSales: 0,
        totalOrders: 0,
        customers: 0,
        productsSold: 0,
      };
    }

    return {
      totalSales:
        analytics.totalSales ??
        analytics.sales ??
        analytics.revenue ??
        0,

      totalOrders:
        analytics.totalOrders ??
        analytics.orders ??
        0,

      customers:
        analytics.customers ??
        analytics.totalCustomers ??
        0,

      productsSold:
        analytics.productsSold ??
        analytics.totalProductsSold ??
        0,
    };
  }, [analytics]);

  const dailySales =
    analytics?.dailySales ||
    analytics?.salesOverview ||
    analytics?.salesByDay ||
    [];

  const paymentMethods =
    analytics?.paymentMethods ||
    analytics?.paymentsByMethod ||
    [];

  const orderStatuses =
    analytics?.orderStatuses ||
    analytics?.ordersByStatus ||
    [];

  const topProducts = analytics?.topProducts || [];

  const topSellers = analytics?.topSellers || [];

  /* =======================================================
     HELPERS
  ======================================================= */

  const formatCurrency = (value) => {
    return `$${Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-US");
  };

  const getPercentage = (value, total) => {
    if (!total) return 0;

    return Math.round(
      (Number(value || 0) / Number(total)) * 100
    );
  };

  const getSaleValue = (item) => {
    return Number(
      item?.sales ??
        item?.total ??
        item?.amount ??
        item?.revenue ??
        0
    );
  };

  const maxDailySale = Math.max(
    ...dailySales.map(getSaleValue),
    1
  );

  const maxProductValue = Math.max(
    ...topProducts.map(getSaleValue),
    1
  );

  /* =======================================================
     ACCESS
  ======================================================= */

  if (!isAuthenticated) {
    return (
      <PageCenter>
        <div className="text-center">
          <div className="text-5xl mb-5">🔐</div>

          <h2 className="text-2xl font-black">
            Authentication Required
          </h2>

          <p className="text-gray-500 mt-2 mb-6">
            Please login to access admin analytics.
          </p>

          <Link
            to="/login"
            className="inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500"
          >
            Login
          </Link>
        </div>
      </PageCenter>
    );
  }

  if (user?.role !== "admin") {
    return (
      <PageCenter>
        <div className="text-center">
          <div className="text-6xl mb-5">🚫</div>

          <h2 className="text-3xl font-black">
            Access Denied
          </h2>

          <p className="text-gray-500 mt-2 mb-6">
            Only administrators can access analytics.
          </p>

          <Link
            to="/"
            className="inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500"
          >
            Back to Home
          </Link>
        </div>
      </PageCenter>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06030d] px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">

      {/* ===================================================
          BACKGROUND GLOW
      =================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-purple-700/10 blur-[120px] animate-pulse" />

        <div
          className="absolute right-[-120px] top-40 h-[450px] w-[450px] rounded-full bg-fuchsia-600/10 blur-[130px] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />

        <div
          className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-violet-600/10 blur-[120px] animate-pulse"
          style={{ animationDelay: "3s" }}
        />

      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="mb-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5">

                <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
                  Live Analytics
                </span>

              </div>

              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-purple-400/70">
                AmitShop Admin
              </p>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Analytics
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
                Track your store performance, revenue, orders,
                customers and product growth from one powerful dashboard.
              </p>

            </div>

            {/* RANGE + REFRESH */}

            <div className="flex flex-col gap-3">

              <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-2 backdrop-blur-xl">

                {RANGE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRange(option.value)}
                    className={`relative overflow-hidden rounded-xl px-3 py-2 text-xs font-bold transition-all duration-300 sm:px-4 sm:text-sm ${
                      range === option.value
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                        : "text-gray-500 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {range === option.value && (
                      <span className="absolute inset-0 animate-pulse bg-purple-400/10" />
                    )}

                    <span className="relative">
                      {option.label}
                    </span>
                  </button>
                ))}

              </div>

              <button
                type="button"
                onClick={() => fetchAnalytics(true)}
                disabled={refreshing}
                className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-semibold text-gray-400 transition hover:border-purple-500/30 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span
                  className={
                    refreshing
                      ? "animate-spin"
                      : "transition-transform duration-500 group-hover:rotate-180"
                  }
                >
                  ↻
                </span>

                {refreshing ? "Refreshing..." : "Refresh Analytics"}
              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 animate-[fadeIn_0.4s_ease-out] rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <AnalyticsSkeleton />
        ) : (
          <>

            {/* =============================================
                KPI CARDS
            ============================================= */}

            <section className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

              <MetricCard
                icon="💰"
                label="Total Sales"
                value={formatCurrency(stats.totalSales)}
                subtitle={`Last ${range} days`}
                accent="Revenue"
                delay="0ms"
              />

              <MetricCard
                icon="🛒"
                label="Total Orders"
                value={formatNumber(stats.totalOrders)}
                subtitle={`Last ${range} days`}
                accent="Orders"
                delay="100ms"
              />

              <MetricCard
                icon="👥"
                label="Customers"
                value={formatNumber(stats.customers)}
                subtitle="Registered customers"
                accent="Users"
                delay="200ms"
              />

              <MetricCard
                icon="📦"
                label="Products Sold"
                value={formatNumber(stats.productsSold)}
                subtitle={`Last ${range} days`}
                accent="Units"
                delay="300ms"
              />

            </section>

            {/* =============================================
                SALES + PAYMENT
            ============================================= */}

            <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

              {/* SALES CHART */}

              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition duration-500 hover:border-purple-500/20 sm:p-6 xl:col-span-2">

                <Glow />

                <div className="relative mb-8 flex items-start justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400/70">
                      Performance
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      Sales Overview
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                      Daily revenue performance
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-2xl">
                    📈
                  </div>

                </div>

                {dailySales.length === 0 ? (
                  <EmptyState text="No sales data available." />
                ) : (
                  <div className="relative">

                    {/* Chart grid */}

                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-10 opacity-30">

                      {[1, 2, 3, 4].map((line) => (
                        <div
                          key={line}
                          className="border-t border-dashed border-white/10"
                        />
                      ))}

                    </div>

                    <div className="relative flex h-80 items-end gap-2 overflow-x-auto pb-8 pt-4 sm:gap-3">

                      {dailySales.map((item, index) => {

                        const value = getSaleValue(item);

                        const height = Math.max(
                          (value / maxDailySale) * 100,
                          4
                        );

                        return (
                          <div
                            key={item._id || item.date || index}
                            className="group/bar flex h-full min-w-[25px] flex-1 flex-col items-center justify-end"
                          >

                            <div className="relative flex h-full w-full items-end justify-center">

                              {/* Tooltip */}

                              <div className="pointer-events-none absolute bottom-[calc(100%-var(--bar-height))] mb-2 hidden -translate-y-2 rounded-lg border border-white/10 bg-[#100b1d] px-2 py-1 text-xs font-semibold text-white shadow-xl group-hover/bar:block">
                                {formatCurrency(value)}
                              </div>

                              {/* Bar */}

                              <div
                                className="w-full max-w-[34px] origin-bottom rounded-t-xl bg-gradient-to-t from-purple-800 via-purple-600 to-fuchsia-400 shadow-lg shadow-purple-900/20 transition-all duration-700 ease-out hover:brightness-125"
                                style={{
                                  height: `${height}%`,
                                  minHeight: "7px",
                                  animation:
                                    "growBar 0.8s ease-out both",
                                  animationDelay: `${index * 35}ms`,
                                }}
                              />

                            </div>

                            <span className="mt-2 whitespace-nowrap text-[9px] text-gray-600 sm:text-[10px]">
                              {item.date
                                ? new Date(
                                    item.date
                                  ).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )
                                : `D${index + 1}`}
                            </span>

                          </div>
                        );
                      })}

                    </div>

                  </div>
                )}

              </div>

              {/* PAYMENT */}

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-6">

                <Glow />

                <div className="relative mb-7 flex items-start justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-400/70">
                      Payments
                    </p>

                    <h2 className="mt-1 text-xl font-black">
                      Payment Methods
                    </h2>
                  </div>

                  <div className="text-2xl">
                    💳
                  </div>

                </div>

                {paymentMethods.length === 0 ? (
                  <EmptyState text="No payment data available." />
                ) : (
                  <div className="space-y-6">

                    {paymentMethods.map((item, index) => {

                      const value = Number(
                        item.count ??
                          item.orders ??
                          item.total ??
                          0
                      );

                      const total = paymentMethods.reduce(
                        (sum, payment) =>
                          sum +
                          Number(
                            payment.count ??
                              payment.orders ??
                              payment.total ??
                              0
                          ),
                        0
                      );

                      const percentage = getPercentage(
                        value,
                        total
                      );

                      const name =
                        item.method ||
                        item.paymentMethod ||
                        item._id ||
                        "Unknown";

                      return (
                        <div
                          key={item._id || index}
                          className="group"
                        >

                          <div className="mb-2 flex items-center justify-between">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm">
                                {name
                                  .toLowerCase()
                                  .includes("card")
                                  ? "💳"
                                  : name
                                      .toLowerCase()
                                      .includes("cash")
                                  ? "💵"
                                  : "💰"}
                              </div>

                              <span className="text-sm font-semibold capitalize text-gray-300">
                                {name}
                              </span>

                            </div>

                            <span className="text-sm font-bold text-purple-300">
                              {percentage}%
                            </span>

                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-white/5">

                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-700 via-purple-500 to-fuchsia-400 transition-all duration-1000 ease-out"
                              style={{
                                width: `${percentage}%`,
                                animation:
                                  "growWidth 1s ease-out",
                              }}
                            />

                          </div>

                        </div>
                      );
                    })}

                  </div>
                )}

              </div>

            </section>

            {/* =============================================
                ORDER STATUS
            ============================================= */}

            <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-6">

              <Glow />

              <div className="relative mb-7 flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400/70">
                    Orders
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Order Status
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Current order distribution
                  </p>
                </div>

                <div className="text-3xl">
                  📦
                </div>

              </div>

              {orderStatuses.length === 0 ? (
                <EmptyState text="No order status data available." />
              ) : (
                <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

                  {orderStatuses.map((item, index) => {

                    const count = Number(
                      item.count ??
                        item.orders ??
                        item.total ??
                        0
                    );

                    const status =
                      item.status ||
                      item._id ||
                      "Unknown";

                    return (
                      <div
                        key={item._id || index}
                        className="group rounded-2xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-purple-500/5"
                        style={{
                          animation:
                            "fadeUp 0.5s ease-out both",
                          animationDelay: `${index * 70}ms`,
                        }}
                      >

                        <div className="mb-4 flex items-center justify-between">

                          <span className="text-xl">
                            {getStatusIcon(status)}
                          </span>

                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-700">
                            #{index + 1}
                          </span>

                        </div>

                        <p className="truncate text-xs font-bold uppercase tracking-wider text-gray-500">
                          {status}
                        </p>

                        <p className="mt-1 text-2xl font-black">
                          {formatNumber(count)}
                        </p>

                      </div>
                    );
                  })}

                </div>
              )}

            </section>

            {/* =============================================
                TOP PRODUCTS + SELLERS
            ============================================= */}

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

              {/* TOP PRODUCTS */}

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-6">

                <Glow />

                <div className="relative mb-7 flex items-center justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400/70">
                      Products
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      Top Products
                    </h2>
                  </div>

                  <span className="text-3xl">
                    🏆
                  </span>

                </div>

                {topProducts.length === 0 ? (
                  <EmptyState text="No product data available." />
                ) : (
                  <div className="space-y-4">

                    {topProducts.slice(0, 5).map(
                      (item, index) => {

                        const value =
                          getSaleValue(item);

                        const name =
                          item.name ||
                          item.productName ||
                          item.product?.name ||
                          "Unknown Product";

                        const percent =
                          (value /
                            maxProductValue) *
                          100;

                        return (
                          <div
                            key={item._id || index}
                            className="group flex items-center gap-4 rounded-2xl border border-transparent p-2 transition-all duration-300 hover:border-white/10 hover:bg-white/5"
                          >

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 font-black text-purple-300">
                              {index + 1}
                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="mb-2 flex items-center justify-between gap-3">

                                <p className="truncate text-sm font-bold text-gray-300">
                                  {name}
                                </p>

                                <span className="whitespace-nowrap text-sm font-black text-purple-300">
                                  {formatCurrency(value)}
                                </span>

                              </div>

                              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">

                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-purple-700 to-fuchsia-400 transition-all duration-1000"
                                  style={{
                                    width: `${percent}%`,
                                  }}
                                />

                              </div>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

              </div>

              {/* TOP SELLERS */}

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-6">

                <Glow />

                <div className="relative mb-7 flex items-center justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-400/70">
                      Sellers
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      Top Sellers
                    </h2>
                  </div>

                  <span className="text-3xl">
                    🏪
                  </span>

                </div>

                {topSellers.length === 0 ? (
                  <EmptyState text="No seller data available." />
                ) : (
                  <div className="space-y-3">

                    {topSellers.slice(0, 5).map(
                      (item, index) => {

                        const sellerName =
                          item.name ||
                          item.sellerName ||
                          item.seller?.name ||
                          "Unknown Seller";

                        const revenue =
                          getSaleValue(item);

                        return (
                          <div
                            key={item._id || index}
                            className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-black/20 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/20 hover:bg-white/5"
                          >

                            <div className="relative">

                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-700 to-fuchsia-500 font-black shadow-lg shadow-purple-900/20">
                                {sellerName
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#06030d] bg-purple-600 text-[9px] font-black">
                                {index + 1}
                              </span>

                            </div>

                            <div className="min-w-0 flex-1">

                              <p className="truncate font-bold text-gray-200">
                                {sellerName}
                              </p>

                              <p className="mt-1 text-xs text-gray-600">
                                Top performing seller
                              </p>

                            </div>

                            <div className="text-right">

                              <p className="text-sm font-black text-purple-300">
                                {formatCurrency(revenue)}
                              </p>

                              <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-700">
                                Revenue
                              </p>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

              </div>

            </section>

          </>
        )}

      </div>

      {/* ===================================================
          ANIMATIONS
      =================================================== */}

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes growBar {
          from {
            transform: scaleY(0);
            opacity: 0;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes growWidth {
          from {
            width: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

    </main>
  );
};

/* =========================================================
   METRIC CARD
========================================================= */

const MetricCard = ({
  icon,
  label,
  value,
  subtitle,
  accent,
  delay,
}) => {
  return (
    <div
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/[0.055] sm:p-6"
      style={{
        animation: "fadeUp 0.6s ease-out both",
        animationDelay: delay,
      }}
    >

      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-600/10 blur-3xl transition duration-500 group-hover:bg-purple-500/20" />

      <div className="relative">

        <div className="mb-6 flex items-center justify-between">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-2xl transition duration-500 group-hover:scale-110 group-hover:rotate-3">
            {icon}
          </div>

          <span className="rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-gray-600">
            {accent}
          </span>

        </div>

        <p className="text-sm font-semibold text-gray-500">
          {label}
        </p>

        <p className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
          {value}
        </p>

        <div className="mt-4 flex items-center gap-2">

          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10 text-xs text-green-400">
            ↑
          </span>

          <span className="text-xs text-gray-600">
            {subtitle}
          </span>

        </div>

      </div>
    </div>
  );
};

/* =========================================================
   GLOW
========================================================= */

const Glow = () => {
  return (
    <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-purple-600/5 blur-3xl" />
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({ text }) => {
  return (
    <div className="flex h-44 items-center justify-center text-center">

      <div>

        <div className="mb-3 text-4xl opacity-30">
          📊
        </div>

        <p className="text-sm text-gray-600">
          {text}
        </p>

      </div>

    </div>
  );
};

/* =========================================================
   SKELETON
========================================================= */

const AnalyticsSkeleton = () => {
  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-44 animate-pulse rounded-3xl border border-white/10 bg-white/[0.035]"
          />
        ))}

      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        <div className="h-[430px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.035] xl:col-span-2" />

        <div className="h-[430px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.035]" />

      </div>

      <div className="h-56 animate-pulse rounded-3xl border border-white/10 bg-white/[0.035]" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/[0.035]" />

        <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/[0.035]" />

      </div>

    </div>
  );
};

/* =========================================================
   STATUS ICON
========================================================= */

const getStatusIcon = (status) => {
  const value = String(status).toLowerCase();

  if (value.includes("pending")) return "⏳";
  if (value.includes("processing")) return "⚙️";
  if (value.includes("confirmed")) return "✅";
  if (value.includes("shipped")) return "🚚";
  if (value.includes("delivered")) return "📦";
  if (value.includes("cancel")) return "❌";
  if (value.includes("refund")) return "↩️";

  return "📋";
};

/* =========================================================
   CENTER PAGE
========================================================= */

const PageCenter = ({ children }) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06030d] px-4 text-white">
      {children}
    </main>
  );
};

export default AdminAnalytics;


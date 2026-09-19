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

const AdminAnalytics = () => {
  const { user, accessToken, isAuthenticated } = useAuthStore();

  const [range, setRange] = useState(30);
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
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
    }
  };

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchAnalytics();
    }
  }, [range, accessToken, isAuthenticated]);

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

  const topProducts =
    analytics?.topProducts ||
    [];

  const topSellers =
    analytics?.topSellers ||
    [];

  const maxDailySale = Math.max(
    ...dailySales.map((item) =>
      Number(item.sales ?? item.total ?? item.amount ?? 0)
    ),
    1
  );

  const maxProductValue = Math.max(
    ...topProducts.map((item) =>
      Number(
        item.sales ??
          item.revenue ??
          item.total ??
          item.amount ??
          0
      )
    ),
    1
  );

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

    return Math.round((Number(value || 0) / Number(total)) * 100);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080612] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">
            Authentication Required
          </h2>

          <Link
            to="/login"
            className="inline-flex px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#080612] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-5">🔒</div>

          <h2 className="text-2xl font-bold mb-3">
            Access Denied
          </h2>

          <p className="text-gray-400 mb-6">
            Only administrators can access analytics.
          </p>

          <Link
            to="/"
            className="inline-flex px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080612] text-white px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>
            <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-2">
              AmitShop Admin
            </p>

            <h1 className="text-3xl sm:text-4xl font-black">
              Analytics Dashboard
            </h1>

            <p className="text-gray-400 mt-2">
              Monitor sales, orders, customers and store performance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setRange(option.value)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  range === option.value
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading ? (
          <div className="space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-36 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                />
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 h-96 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
              <div className="h-96 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            </div>

          </div>
        ) : (
          <>
            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

              <StatCard
                icon="💰"
                title="Total Sales"
                value={formatCurrency(stats.totalSales)}
                subtitle={`Last ${range} days`}
              />

              <StatCard
                icon="🛒"
                title="Total Orders"
                value={formatNumber(stats.totalOrders)}
                subtitle={`Last ${range} days`}
              />

              <StatCard
                icon="👥"
                title="Customers"
                value={formatNumber(stats.customers)}
                subtitle="Registered customers"
              />

              <StatCard
                icon="📦"
                title="Products Sold"
                value={formatNumber(stats.productsSold)}
                subtitle={`Last ${range} days`}
              />

            </div>

            {/* =================================================
                DAILY SALES + PAYMENT
            ================================================= */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

              {/* DAILY SALES */}

              <section className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 sm:p-6">

                <div className="flex items-center justify-between mb-7">
                  <div>
                    <h2 className="text-xl font-bold">
                      Sales Overview
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Daily sales performance
                    </p>
                  </div>

                  <div className="text-purple-400 text-2xl">
                    📈
                  </div>
                </div>

                {dailySales.length === 0 ? (
                  <EmptyState text="No sales data available." />
                ) : (
                  <div className="h-72 flex items-end gap-2 sm:gap-3 overflow-x-auto pb-8">

                    {dailySales.map((item, index) => {
                      const value = Number(
                        item.sales ??
                          item.total ??
                          item.amount ??
                          0
                      );

                      const height = Math.max(
                        (value / maxDailySale) * 100,
                        3
                      );

                      return (
                        <div
                          key={item._id || item.date || index}
                          className="min-w-[28px] flex-1 h-full flex flex-col justify-end items-center group"
                        >

                          <div className="relative w-full flex justify-center">

                            <div
                              className="w-full max-w-[38px] rounded-t-xl bg-gradient-to-t from-purple-700 to-fuchsia-400 transition-all duration-500 group-hover:from-purple-500 group-hover:to-pink-400"
                              style={{
                                height: `${height}%`,
                                minHeight: "6px",
                              }}
                            />

                            <div className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-black border border-white/10 rounded-lg px-2 py-1 text-xs text-white z-10">
                              {formatCurrency(value)}
                            </div>

                          </div>

                          <span className="text-[10px] text-gray-600 mt-2 whitespace-nowrap">
                            {item.date
                              ? new Date(item.date).toLocaleDateString(
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
                )}

              </section>

              {/* PAYMENT METHODS */}

              <section className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 sm:p-6">

                <div className="flex items-center justify-between mb-7">
                  <div>
                    <h2 className="text-xl font-bold">
                      Payment Methods
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Payment distribution
                    </p>
                  </div>

                  <div className="text-2xl">
                    💳
                  </div>
                </div>

                {paymentMethods.length === 0 ? (
                  <EmptyState text="No payment data available." />
                ) : (
                  <div className="space-y-5">
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
                        <div key={item._id || index}>

                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-300 capitalize">
                              {name}
                            </span>

                            <span className="text-sm text-gray-400">
                              {percentage}%
                            </span>
                          </div>

                          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-400 transition-all duration-700"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

              </section>

            </div>

            {/* =================================================
                ORDER STATUS
            ================================================= */}

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 sm:p-6 mb-6">

              <div className="flex items-center justify-between mb-7">
                <div>
                  <h2 className="text-xl font-bold">
                    Order Status
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Current order distribution
                  </p>
                </div>

                <div className="text-2xl">
                  📦
                </div>
              </div>

              {orderStatuses.length === 0 ? (
                <EmptyState text="No order status data available." />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

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
                        className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/5 transition"
                      >
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                          {status}
                        </p>

                        <p className="text-2xl font-black">
                          {formatNumber(count)}
                        </p>
                      </div>
                    );
                  })}

                </div>
              )}

            </section>

            {/* =================================================
                TOP PRODUCTS + TOP SELLERS
            ================================================= */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              {/* TOP PRODUCTS */}

              <section className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 sm:p-6">

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">
                      Top Products
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Best performing products
                    </p>
                  </div>

                  <span className="text-2xl">
                    🏆
                  </span>
                </div>

                {topProducts.length === 0 ? (
                  <EmptyState text="No product data available." />
                ) : (
                  <div className="space-y-4">

                    {topProducts.slice(0, 5).map((item, index) => {

                      const value = Number(
                        item.sales ??
                          item.revenue ??
                          item.total ??
                          item.amount ??
                          0
                      );

                      const name =
                        item.name ||
                        item.productName ||
                        item.product?.name ||
                        "Unknown Product";

                      const percent =
                        (value / maxProductValue) * 100;

                      return (
                        <div
                          key={item._id || index}
                          className="group"
                        >

                          <div className="flex items-center gap-4">

                            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-300">
                              {index + 1}
                            </div>

                            <div className="flex-1 min-w-0">

                              <div className="flex justify-between gap-3 mb-2">

                                <p className="truncate text-sm font-semibold text-gray-200">
                                  {name}
                                </p>

                                <span className="text-sm text-purple-300 whitespace-nowrap">
                                  {formatCurrency(value)}
                                </span>

                              </div>

                              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-400 rounded-full transition-all duration-700"
                                  style={{
                                    width: `${percent}%`,
                                  }}
                                />
                              </div>

                            </div>

                          </div>

                        </div>
                      );
                    })}

                  </div>
                )}

              </section>

              {/* TOP SELLERS */}

              <section className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 sm:p-6">

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">
                      Top Sellers
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Highest performing sellers
                    </p>
                  </div>

                  <span className="text-2xl">
                    🏪
                  </span>
                </div>

                {topSellers.length === 0 ? (
                  <EmptyState text="No seller data available." />
                ) : (
                  <div className="space-y-3">

                    {topSellers.slice(0, 5).map((item, index) => {

                      const sellerName =
                        item.name ||
                        item.sellerName ||
                        item.seller?.name ||
                        "Unknown Seller";

                      const revenue = Number(
                        item.sales ??
                          item.revenue ??
                          item.total ??
                          item.amount ??
                          0
                      );

                      return (
                        <div
                          key={item._id || index}
                          className="flex items-center gap-4 rounded-2xl border border-white/5 bg-black/20 p-4 hover:bg-white/5 transition"
                        >

                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center font-bold">
                            {sellerName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                              {sellerName}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              Seller #{index + 1}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-bold text-purple-300">
                              {formatCurrency(revenue)}
                            </p>

                            <p className="text-xs text-gray-600">
                              Revenue
                            </p>
                          </div>

                        </div>
                      );
                    })}

                  </div>
                )}

              </section>

            </div>

          </>
        )}
      </div>
    </div>
  );
};

/* =============================================================
   STAT CARD
============================================================= */

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/[0.055]">

      <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-purple-600/10 blur-2xl group-hover:bg-purple-500/20 transition" />

      <div className="relative">

        <div className="flex items-center justify-between mb-5">

          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
            {icon}
          </div>

          <span className="text-xs text-gray-600">
            AmitShop
          </span>

        </div>

        <p className="text-sm text-gray-500">
          {title}
        </p>

        <p className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">
          {value}
        </p>

        <p className="text-xs text-gray-600 mt-2">
          {subtitle}
        </p>

      </div>
    </div>
  );
};

/* =============================================================
   EMPTY STATE
============================================================= */

const EmptyState = ({ text }) => {
  return (
    <div className="h-40 flex items-center justify-center text-center">
      <div>
        <div className="text-3xl mb-2 opacity-50">
          📊
        </div>

        <p className="text-sm text-gray-500">
          {text}
        </p>
      </div>
    </div>
  );
};

export default AdminAnalytics;
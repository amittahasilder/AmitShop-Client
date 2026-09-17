import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const SellerDashboard = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
  } = useAuthStore();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/seller/dashboard",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.success) {
        setDashboard(response.data.dashboard);
      } else {
        setError(
          response.data?.message ||
            "Failed to load dashboard"
        );
      }
    } catch (err) {
      console.error(
        "Seller Dashboard Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load seller dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchDashboard();
    }
  }, [isAuthenticated, accessToken]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05020d] flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[140px] animate-pulse" />

        <div className="absolute w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[120px] -bottom-40 -right-40" />

        <div className="relative text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20" />

            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-r-fuchsia-500 animate-spin" />

            <div className="absolute inset-3 rounded-full bg-purple-500/10 backdrop-blur-xl flex items-center justify-center">
              <span className="text-2xl">
                ✦
              </span>
            </div>
          </div>

          <p className="mt-6 text-slate-300 font-medium tracking-wide">
            Loading Seller Center...
          </p>

          <p className="mt-2 text-xs text-slate-600">
            Preparing your dashboard
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#05020d] flex items-center justify-center px-4">
        <div className="relative max-w-lg w-full overflow-hidden rounded-[32px] border border-red-500/20 bg-white/[0.04] backdrop-blur-2xl p-10 text-center shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-purple-500/10 pointer-events-none" />

          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-4xl">
              ⚠️
            </div>

            <h2 className="mt-6 text-2xl font-black text-white">
              Dashboard Error
            </h2>

            <p className="mt-3 text-red-300">
              {error}
            </p>

            <button
              onClick={fetchDashboard}
              className="mt-7 px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold transition-all duration-300 hover:scale-105 shadow-xl shadow-purple-900/30"
            >
              Try Again ↻
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // DATA
  // ==========================================

  const products =
    dashboard?.totalProducts || 0;

  const activeProducts =
    dashboard?.activeProducts || 0;

  const inactiveProducts =
    dashboard?.inactiveProducts ??
    Math.max(
      products - activeProducts,
      0
    );

  const lowStock =
    dashboard?.lowStockProducts || 0;

  const outOfStock =
    dashboard?.outOfStockProducts || 0;

  const orders =
    dashboard?.totalOrders || 0;

  const pending =
    dashboard?.pendingOrders || 0;

  const processing =
    dashboard?.processingOrders || 0;

  const shipped =
    dashboard?.shippedOrders || 0;

  const delivered =
    dashboard?.deliveredOrders || 0;

  const cancelled =
    dashboard?.cancelledOrders || 0;

  const revenue =
    dashboard?.totalRevenue || 0;

  const averageOrderValue =
    dashboard?.averageOrderValue || 0;

  // ==========================================
  // STAT CARD
  // ==========================================

  const StatCard = ({
    icon,
    title,
    value,
    subtitle,
    badge,
  }) => {
    return (
      <div className="group relative">
        {/* Glow */}
        <div className="absolute -inset-[1px] rounded-[28px] bg-gradient-to-r from-purple-600/30 via-fuchsia-500/20 to-purple-600/30 opacity-0 group-hover:opacity-100 blur-sm transition duration-500" />

        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl p-6 shadow-2xl shadow-black/20 transition-all duration-500 group-hover:-translate-y-2 group-hover:border-purple-500/30 group-hover:bg-white/[0.07]">
          {/* Shine */}
          <div className="absolute -top-32 -right-20 w-48 h-48 rounded-full bg-purple-600/10 blur-3xl group-hover:bg-purple-500/20 transition-all duration-500" />

          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 border border-purple-400/20 flex items-center justify-center text-2xl shadow-lg shadow-purple-900/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                {icon}
              </div>

              {badge && (
                <span className="text-[10px] uppercase tracking-widest font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full">
                  {badge}
                </span>
              )}
            </div>

            <p className="mt-6 text-sm text-slate-400">
              {title}
            </p>

            <h3 className="mt-1 text-3xl font-black tracking-tight text-white">
              {value}
            </h3>

            {subtitle && (
              <p className="mt-2 text-xs text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // STATUS BAR
  // ==========================================

  const StatusBar = ({
    label,
    count,
    total,
    icon,
  }) => {
    const percentage =
      total > 0
        ? Math.min(
            (count / total) * 100,
            100
          )
        : 0;

    return (
      <div className="group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {icon}
            </span>

            <span className="text-sm text-slate-300 group-hover:text-white transition">
              {label}
            </span>
          </div>

          <span className="text-sm font-bold text-white">
            {count}
          </span>
        </div>

        <div className="h-2.5 rounded-full bg-white/[0.05] overflow-hidden border border-white/[0.04]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-400 transition-all duration-1000 ease-out relative overflow-hidden"
            style={{
              width: `${percentage}%`,
            }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // MINI CARD
  // ==========================================

  const MiniCard = ({
    title,
    value,
    icon,
    type = "normal",
  }) => {
    const styles =
      type === "warning"
        ? "border-amber-500/20 bg-amber-500/[0.05]"
        : type === "danger"
        ? "border-red-500/20 bg-red-500/[0.05]"
        : "border-white/10 bg-white/[0.025]";

    return (
      <div
        className={`group rounded-2xl border ${styles} p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              {title}
            </p>

            <p className="mt-2 text-3xl font-black text-white">
              {value}
            </p>
          </div>

          <div className="text-2xl opacity-70 group-hover:scale-110 transition-transform">
            {icon}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05020d] text-white">

      {/* ======================================
          BACKGROUND
      ====================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize:
              "60px 60px",
          }}
        />

        {/* Purple Orb */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-700/20 blur-[140px] animate-pulse" />

        {/* Fuchsia Orb */}
        <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full bg-fuchsia-700/10 blur-[140px] animate-pulse" />

        {/* Bottom Orb */}
        <div className="absolute -bottom-60 left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-700/10 blur-[150px]" />
      </div>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ====================================
            HEADER
        ==================================== */}

        <div className="relative mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />

                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">
                  Seller Center
                </span>
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                Welcome back,

                <span className="block bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
                  {user?.name || "Seller"}
                </span>
              </h1>

              <p className="mt-4 text-slate-400 max-w-2xl leading-relaxed">
                Manage your products, orders, revenue and
                store performance from your premium seller
                dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <Link
                to="/products/add"
                className="group relative overflow-hidden px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 font-bold transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-purple-900/30"
              >
                <span className="relative z-10">
                  + Add Product
                </span>

                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
              </Link>

              <Link
                to="/products/manage"
                className="px-6 py-3.5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-purple-500/30 backdrop-blur-xl font-bold transition-all duration-300 hover:-translate-y-1"
              >
                Manage Products
              </Link>

            </div>
          </div>
        </div>

        {/* ====================================
            TOP STATS
        ==================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          <StatCard
            icon="📦"
            title="Total Products"
            value={products}
            subtitle={`${activeProducts} active products`}
            badge="Store"
          />

          <StatCard
            icon="🛒"
            title="Total Orders"
            value={orders}
            subtitle={`${pending} pending orders`}
            badge="Sales"
          />

          <StatCard
            icon="💎"
            title="Total Revenue"
            value={`$${Number(revenue).toFixed(2)}`}
            subtitle={`Avg. order $${Number(
              averageOrderValue
            ).toFixed(2)}`}
            badge="Revenue"
          />

          <StatCard
            icon="⚡"
            title="Low Stock"
            value={lowStock}
            subtitle={`${outOfStock} out of stock`}
            badge="Inventory"
          />

        </div>

        {/* ====================================
            MAIN GRID
        ==================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          {/* ==================================
              ORDER OVERVIEW
          ================================== */}

          <section className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-2xl shadow-black/20">

            <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-purple-600/10 blur-3xl group-hover:bg-purple-600/20 transition duration-700" />

            <div className="relative">

              <div className="flex items-center justify-between mb-8">

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      📊
                    </span>

                    <h2 className="text-xl font-black">
                      Order Overview
                    </h2>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Current order performance
                  </p>
                </div>

                <span className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300">
                  {orders} Orders
                </span>

              </div>

              <div className="space-y-6">

                <StatusBar
                  icon="⏳"
                  label="Pending"
                  count={pending}
                  total={orders}
                />

                <StatusBar
                  icon="⚙️"
                  label="Processing"
                  count={processing}
                  total={orders}
                />

                <StatusBar
                  icon="🚚"
                  label="Shipped"
                  count={shipped}
                  total={orders}
                />

                <StatusBar
                  icon="✅"
                  label="Delivered"
                  count={delivered}
                  total={orders}
                />

                <StatusBar
                  icon="✕"
                  label="Cancelled"
                  count={cancelled}
                  total={orders}
                />

              </div>
            </div>
          </section>

          {/* ==================================
              STORE OVERVIEW
          ================================== */}

          <section className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-2xl shadow-black/20">

            <div className="absolute -bottom-24 -left-24 w-56 h-56 rounded-full bg-fuchsia-600/10 blur-3xl group-hover:bg-fuchsia-600/20 transition duration-700" />

            <div className="relative">

              <div className="mb-8">

                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    🏪
                  </span>

                  <h2 className="text-xl font-black">
                    Store Overview
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Product inventory health
                </p>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <MiniCard
                  title="Active"
                  value={activeProducts}
                  icon="🟢"
                />

                <MiniCard
                  title="Inactive"
                  value={inactiveProducts}
                  icon="⚪"
                />

                <MiniCard
                  title="Low Stock"
                  value={lowStock}
                  icon="🟡"
                  type="warning"
                />

                <MiniCard
                  title="Out of Stock"
                  value={outOfStock}
                  icon="🔴"
                  type="danger"
                />

              </div>

              <Link
                to="/products/manage"
                className="group/link mt-6 flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-purple-500/10 hover:border-purple-500/30 font-semibold text-slate-300 hover:text-white transition-all duration-300"
              >
                View All Products

                <span className="group-hover/link:translate-x-1 transition-transform">
                  →
                </span>
              </Link>

            </div>
          </section>

        </div>

        {/* ====================================
            QUICK ACTIONS
        ==================================== */}

        <section className="relative overflow-hidden mt-6 rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-2xl shadow-black/20">

          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-purple-600/10 blur-[100px]" />

          <div className="relative">

            <div className="mb-7">

              <div className="flex items-center gap-2">

                <span className="text-xl">
                  ⚡
                </span>

                <h2 className="text-xl font-black">
                  Quick Actions
                </h2>

              </div>

              <p className="mt-2 text-sm text-slate-500">
                Everything you need to manage your store
              </p>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Add Product */}

              <Link
                to="/products/add"
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/10 p-6 hover:border-purple-500/30 hover:bg-purple-500/[0.06] transition-all duration-400 hover:-translate-y-1"
              >
                <div className="text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  ➕
                </div>

                <h3 className="mt-5 font-black">
                  Add Product
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new product
                </p>

                <div className="mt-5 text-purple-400 text-sm font-bold">
                  Create →
                </div>
              </Link>

              {/* Manage Products */}

              <Link
                to="/products/manage"
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/10 p-6 hover:border-purple-500/30 hover:bg-purple-500/[0.06] transition-all duration-400 hover:-translate-y-1"
              >
                <div className="text-3xl transition-transform duration-300 group-hover:scale-110">
                  📦
                </div>

                <h3 className="mt-5 font-black">
                  Manage Products
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Edit or delete products
                </p>

                <div className="mt-5 text-purple-400 text-sm font-bold">
                  Manage →
                </div>
              </Link>

              {/* Seller Orders */}

              <Link
                to="/seller/orders"
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/10 p-6 hover:border-purple-500/30 hover:bg-purple-500/[0.06] transition-all duration-400 hover:-translate-y-1"
              >
                <div className="text-3xl transition-transform duration-300 group-hover:scale-110">
                  🛍️
                </div>

                <h3 className="mt-5 font-black">
                  Seller Orders
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Manage customer orders
                </p>

                <div className="mt-5 text-purple-400 text-sm font-bold">
                  Manage →
                </div>
              </Link>

              {/* Profile */}

              <Link
                to="/profile"
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/10 p-6 hover:border-purple-500/30 hover:bg-purple-500/[0.06] transition-all duration-400 hover:-translate-y-1"
              >
                <div className="text-3xl transition-transform duration-300 group-hover:scale-110">
                  👤
                </div>

                <h3 className="mt-5 font-black">
                  Profile
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Manage seller profile
                </p>

                <div className="mt-5 text-purple-400 text-sm font-bold">
                  Profile →
                </div>
              </Link>

            </div>
          </div>
        </section>

        {/* ====================================
            BOTTOM SUMMARY
        ==================================== */}

        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Active Products */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">

            <p className="text-xs uppercase tracking-widest text-slate-600">
              Active Products
            </p>

            <div className="flex items-end justify-between mt-3">

              <p className="text-3xl font-black text-white">
                {activeProducts}
              </p>

              <span className="text-xs text-purple-400">
                / {products}
              </span>

            </div>
          </div>

          {/* Delivered Orders */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">

            <p className="text-xs uppercase tracking-widest text-slate-600">
              Delivered Orders
            </p>

            <div className="flex items-end justify-between mt-3">

              <p className="text-3xl font-black text-white">
                {delivered}
              </p>

              <span className="text-xs text-emerald-400">
                Completed
              </span>

            </div>
          </div>

          {/* Average Order */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">

            <p className="text-xs uppercase tracking-widest text-slate-600">
              Average Order
            </p>

            <div className="flex items-end justify-between mt-3">

              <p className="text-3xl font-black text-white">
                ${Number(
                  averageOrderValue
                ).toFixed(2)}
              </p>

              <span className="text-xs text-purple-400">
                Average
              </span>

            </div>
          </div>

        </section>

        {/* ====================================
            FOOTER
        ==================================== */}

        <div className="mt-10 pb-4 text-center">

          <div className="inline-flex items-center gap-2 text-xs text-slate-600">

            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />

            AmitShop Seller Center

            <span>•</span>

            Dashboard

          </div>

        </div>

      </main>
    </div>
  );
};

export default SellerDashboard;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  // ==========================================
  // FETCH SELLER ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", 10);

      if (status) {
        params.append("status", status);
      }

      const response = await api.get(
        `/seller/orders?${params.toString()}`
      );

      if (response.data?.success) {
        setOrders(response.data.orders || []);

        setPagination(
          response.data.pagination || {
            page: page,
            pages: 1,
            total: 0,
          }
        );
      } else {
        setError(
          response.data?.message ||
            "Failed to load seller orders"
        );
      }
    } catch (err) {
      console.error(
        "Seller Orders Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load seller orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  useEffect(() => {
    fetchOrders();
  }, [page, status]);

  // ==========================================
  // STATUS CHANGE
  // ==========================================

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (orderStatus) => {
    switch (orderStatus) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-300 border-yellow-500/20";

      case "confirmed":
        return "bg-blue-500/10 text-blue-300 border-blue-500/20";

      case "processing":
        return "bg-purple-500/10 text-purple-300 border-purple-500/20";

      case "shipped":
        return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";

      case "delivered":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";

      case "cancelled":
        return "bg-red-500/10 text-red-300 border-red-500/20";

      default:
        return "bg-white/5 text-slate-300 border-white/10";
    }
  };

  // ==========================================
  // FORMAT STATUS
  // ==========================================

  const formatStatus = (value) => {
    if (!value) return "Unknown";

    return value
      .charAt(0)
      .toUpperCase() + value.slice(1);
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05020d] flex items-center justify-center relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-700/20 blur-[140px] animate-pulse" />

        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-fuchsia-700/10 blur-[140px] animate-pulse" />

        <div className="relative text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20" />

            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-r-fuchsia-500 animate-spin" />

            <div className="absolute inset-3 rounded-full bg-purple-500/10 backdrop-blur-xl flex items-center justify-center">
              <span className="text-2xl">
                🛍️
              </span>
            </div>
          </div>

          <p className="mt-6 text-slate-300 font-medium">
            Loading seller orders...
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
      <div className="min-h-screen bg-[#05020d] px-4 py-12 flex items-center justify-center">
        <div className="relative max-w-lg w-full rounded-[30px] border border-red-500/20 bg-white/[0.04] backdrop-blur-2xl p-10 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-purple-500/10 rounded-[30px]" />

          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-4xl">
              ⚠️
            </div>

            <h2 className="mt-6 text-2xl font-black text-white">
              Orders Error
            </h2>

            <p className="mt-3 text-red-300">
              {error}
            </p>

            <button
              onClick={fetchOrders}
              className="mt-7 px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold transition hover:-translate-y-1"
            >
              Try Again ↻
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05020d] text-white">

      {/* ======================================
          BACKGROUND
      ====================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-700/20 blur-[140px] animate-pulse" />

        <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full bg-fuchsia-700/10 blur-[140px] animate-pulse" />
      </div>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ====================================
            HEADER
        ==================================== */}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />

              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">
                Seller Center
              </span>
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight">
              Seller
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
                {" "}Orders
              </span>
            </h1>

            <p className="mt-3 text-slate-400">
              Manage orders containing your products.
            </p>
          </div>

          <Link
            to="/seller/dashboard"
            className="inline-flex items-center justify-center px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-purple-500/30 transition font-semibold"
          >
            ← Dashboard
          </Link>
        </div>

        {/* ====================================
            FILTER BAR
        ==================================== */}

        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 mb-6">

          <div className="absolute -top-20 right-0 w-56 h-56 bg-purple-600/10 blur-3xl rounded-full" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Order Filter
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Filter orders by current status
              </p>
            </div>

            <select
              value={status}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value
                )
              }
              className="w-full sm:w-56 px-4 py-3 rounded-xl border border-white/10 bg-slate-900/80 text-white outline-none focus:border-purple-500/50 transition"
            >
              <option value="">
                All Orders
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="processing">
                Processing
              </option>

              <option value="shipped">
                Shipped
              </option>

              <option value="delivered">
                Delivered
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>
          </div>
        </section>

        {/* ====================================
            ORDER COUNT
        ==================================== */}

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-slate-400">
              Total matching orders
            </p>

            <p className="text-2xl font-black text-white">
              {pagination.total || 0}
            </p>
          </div>

          <div className="text-sm text-slate-500">
            Page {pagination.page || page} of{" "}
            {pagination.pages || 1}
          </div>
        </div>

        {/* ====================================
            EMPTY
        ==================================== */}

        {orders.length === 0 ? (
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-14 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.05] via-transparent to-fuchsia-500/[0.05]" />

            <div className="relative">
              <div className="text-6xl">
                📦
              </div>

              <h2 className="mt-5 text-2xl font-black">
                No Orders Found
              </h2>

              <p className="mt-2 text-slate-500">
                There are no orders matching this filter.
              </p>

              {status && (
                <button
                  onClick={() =>
                    handleStatusChange("")
                  }
                  className="mt-6 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold transition"
                >
                  Show All Orders
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 transition-all duration-400 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/[0.055] shadow-xl shadow-black/10"
              >
                {/* Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-purple-600/10 blur-3xl opacity-0 group-hover:opacity-100 transition duration-500" />

                <div className="relative">

                  {/* Order Header */}

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div>
                      <div className="flex flex-wrap items-center gap-3">

                        <span className="text-xs uppercase tracking-widest text-slate-500">
                          Order
                        </span>

                        <span className="font-mono text-sm text-purple-300">
                          #{order._id?.slice(-8)}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusStyle(
                            order.orderStatus
                          )}`}
                        >
                          {formatStatus(
                            order.orderStatus
                          )}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {formatDate(
                          order.createdAt
                        )}
                      </p>
                    </div>

                    <div className="text-left lg:text-right">
                      <p className="text-xs uppercase tracking-widest text-slate-500">
                        Seller Amount
                      </p>

                      <p className="mt-1 text-2xl font-black bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                        $
                        {Number(
                          order.sellerItemsPrice || 0
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Customer */}

                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-600">
                          Customer
                        </p>

                        <p className="mt-1 font-semibold text-white">
                          {order.user?.name ||
                            "Customer"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-600">
                          Email
                        </p>

                        <p className="mt-1 text-sm text-slate-300">
                          {order.user?.email ||
                            "N/A"}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Seller Products */}

                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-widest text-slate-600 mb-3">
                      Your Products
                    </p>

                    <div className="space-y-3">
                      {(order.sellerItems || []).map(
                        (item, index) => (
                          <div
                            key={
                              item.product?._id ||
                              index
                            }
                            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                          >
                            {/* Image */}

                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                  📦
                                </div>
                              )}
                            </div>

                            {/* Info */}

                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-white truncate">
                                {item.name ||
                                  "Product"}
                              </h3>

                              <p className="mt-1 text-sm text-slate-500">
                                Qty:{" "}
                                {item.quantity || 0}
                              </p>
                            </div>

                            {/* Price */}

                            <div className="text-right">
                              <p className="font-bold text-white">
                                $
                                {Number(
                                  item.price || 0
                                ).toFixed(2)}
                              </p>

                              <p className="mt-1 text-xs text-slate-600">
                                $
                                {(
                                  Number(
                                    item.price || 0
                                  ) *
                                  Number(
                                    item.quantity || 0
                                  )
                                ).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* ====================================
            PAGINATION
        ==================================== */}

        {orders.length > 0 &&
          (pagination.pages || 1) > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">

              <button
                disabled={page <= 1}
                onClick={() =>
                  setPage((prev) =>
                    Math.max(prev - 1, 1)
                  )
                }
                className="px-5 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition font-semibold"
              >
                ← Previous
              </button>

              <div className="px-5 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold">
                {page}
              </div>

              <button
                disabled={
                  page >=
                  (pagination.pages || 1)
                }
                onClick={() =>
                  setPage((prev) =>
                    Math.min(
                      prev + 1,
                      pagination.pages || 1
                    )
                  )
                }
                className="px-5 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition font-semibold"
              >
                Next →
              </button>

            </div>
          )}

        {/* ====================================
            FOOTER
        ==================================== */}

        <div className="mt-10 pb-5 text-center text-xs text-slate-600">
          AmitShop Seller Center • Seller Orders
        </div>
      </main>
    </div>
  );
};

export default SellerOrders;
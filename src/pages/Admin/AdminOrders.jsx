import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

const PAYMENT_METHODS = ["COD", "STRIPE"];

const formatStatus = (status = "") => {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatCurrency = (amount = 0) => {
  return `৳${Number(amount || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getStatusClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500/15 text-yellow-300 border-yellow-400/20";

    case "confirmed":
      return "bg-blue-500/15 text-blue-300 border-blue-400/20";

    case "processing":
      return "bg-purple-500/15 text-purple-300 border-purple-400/20";

    case "shipped":
      return "bg-cyan-500/15 text-cyan-300 border-cyan-400/20";

    case "delivered":
      return "bg-green-500/15 text-green-300 border-green-400/20";

    case "cancelled":
      return "bg-red-500/15 text-red-300 border-red-400/20";

    default:
      return "bg-white/10 text-white/70 border-white/10";
  }
};

const getPaymentClass = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-500/15 text-green-300 border-green-400/20";

    case "pending":
      return "bg-yellow-500/15 text-yellow-300 border-yellow-400/20";

    case "failed":
      return "bg-red-500/15 text-red-300 border-red-400/20";

    case "refunded":
      return "bg-orange-500/15 text-orange-300 border-orange-400/20";

    default:
      return "bg-white/10 text-white/70 border-white/10";
  }
};

const AdminOrders = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
  } = useAuthStore();

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [statusNote, setStatusNote] = useState("");

  const [page, setPage] = useState(1);

  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const isAdmin = user?.role === "admin";

  const fetchOrders = useCallback(
    async (requestedPage = page) => {
      if (!isAuthenticated || !accessToken || !isAdmin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        params.set("page", requestedPage);
        params.set("limit", "10");

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (status) {
          params.set("status", status);
        }

        if (paymentStatus) {
          params.set("paymentStatus", paymentStatus);
        }

        if (paymentMethod) {
          params.set("paymentMethod", paymentMethod);
        }

        const response = await api.get(
          `/admin/orders?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const responseData =
          response.data?.data || response.data || {};

        const fetchedOrders =
          responseData.orders ||
          response.data?.orders ||
          [];

        const fetchedPagination =
          responseData.pagination ||
          response.data?.pagination ||
          {};

        setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);

        setPagination({
          page:
            Number(fetchedPagination.page) ||
            requestedPage,

          pages:
            Number(fetchedPagination.pages) ||
            Number(fetchedPagination.totalPages) ||
            1,

          total:
            Number(fetchedPagination.total) ||
            fetchedOrders.length,

          limit:
            Number(fetchedPagination.limit) ||
            10,
        });
      } catch (err) {
        console.error("Admin orders fetch error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load orders."
        );

        setOrders([]);
      } finally {
        setLoading(false);
      }
    },
    [
      accessToken,
      isAdmin,
      isAuthenticated,
      page,
      paymentMethod,
      paymentStatus,
      search,
      status,
    ]
  );

  useEffect(() => {
    fetchOrders(page);
  }, [fetchOrders, page]);

  const handleSearch = (event) => {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setPaymentStatus("");
    setPaymentMethod("");
    setPage(1);
  };

  const openOrderDetails = async (orderId) => {
    if (!orderId) return;

    try {
      setDetailsLoading(true);
      setError("");

      const response = await api.get(
        `/admin/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const responseData =
        response.data?.data || response.data || {};

      const order =
        responseData.order ||
        response.data?.order ||
        responseData;

      setSelectedOrder(order);
      setStatusNote("");
    } catch (err) {
      console.error("Order details error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load order details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeOrderDetails = () => {
    if (actionLoading) return;

    setSelectedOrder(null);
    setStatusNote("");
  };

  const updateOrderStatus = async (orderId, nextStatus) => {
    if (!orderId || !nextStatus) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/admin/orders/${orderId}/status`,
        {
          status: nextStatus,
          note: statusNote.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const responseData =
        response.data?.data || response.data || {};

      const updatedOrder =
        responseData.order ||
        response.data?.order ||
        null;

      if (updatedOrder) {
        setSelectedOrder(updatedOrder);

        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order._id === updatedOrder._id
              ? updatedOrder
              : order
          )
        );
      } else {
        await fetchOrders(page);

        if (selectedOrder?._id) {
          await openOrderDetails(selectedOrder._id);
        }
      }

      setStatusNote("");

      setSuccess(
        `Order status changed to ${formatStatus(nextStatus)}.`
      );
    } catch (err) {
      console.error("Update order status error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const updatePaymentStatus = async (
    orderId,
    nextPaymentStatus
  ) => {
    if (!orderId || !nextPaymentStatus) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/admin/orders/${orderId}/payment-status`,
        {
          paymentStatus: nextPaymentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const responseData =
        response.data?.data || response.data || {};

      const updatedOrder =
        responseData.order ||
        response.data?.order ||
        null;

      if (updatedOrder) {
        setSelectedOrder(updatedOrder);

        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order._id === updatedOrder._id
              ? updatedOrder
              : order
          )
        );
      } else {
        await fetchOrders(page);

        if (selectedOrder?._id) {
          await openOrderDetails(selectedOrder._id);
        }
      }

      setSuccess(
        `Payment status changed to ${formatStatus(
          nextPaymentStatus
        )}.`
      );
    } catch (err) {
      console.error("Update payment status error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update payment status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOrder = async (order) => {
    if (!order?._id) return;

    const confirmed = window.confirm(
      `Delete order #${order._id.slice(-8).toUpperCase()}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleteLoadingId(order._id);
      setError("");
      setSuccess("");

      await api.delete(
        `/admin/orders/${order._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setOrders((currentOrders) =>
        currentOrders.filter(
          (item) => item._id !== order._id
        )
      );

      if (selectedOrder?._id === order._id) {
        setSelectedOrder(null);
      }

      setSuccess("Order deleted successfully.");

      await fetchOrders(page);
    } catch (err) {
      console.error("Delete order error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete order."
      );
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const stats = useMemo(() => {
    const total = orders.length;

    const pending = orders.filter(
      (order) => order.orderStatus === "pending"
    ).length;

    const processing = orders.filter(
      (order) =>
        order.orderStatus === "processing" ||
        order.orderStatus === "confirmed"
    ).length;

    const delivered = orders.filter(
      (order) => order.orderStatus === "delivered"
    ).length;

    const cancelled = orders.filter(
      (order) => order.orderStatus === "cancelled"
    ).length;

    const paid = orders.filter(
      (order) => order.paymentStatus === "paid"
    ).length;

    return {
      total,
      pending,
      processing,
      delivered,
      cancelled,
      paid,
    };
  }, [orders]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080510] flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
          <div className="text-5xl mb-5">🔐</div>

          <h1 className="text-2xl font-bold text-white">
            Authentication Required
          </h1>

          <p className="text-white/50 mt-3">
            Please login to access admin orders.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#080510] flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-3xl border border-red-400/20 bg-red-500/[0.04] p-8 text-center shadow-2xl">
          <div className="text-5xl mb-5">⛔</div>

          <h1 className="text-2xl font-bold text-white">
            Access Denied
          </h1>

          <p className="text-white/50 mt-3">
            Only administrators can manage orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080510] text-white px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-400/20 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              Admin Control Center
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Order Management
            </h1>

            <p className="text-white/50 mt-2 max-w-2xl">
              Monitor, update and manage every customer order
              across the AmitShop platform.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchOrders(page)}
            disabled={loading}
            className="self-start lg:self-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-purple-400/20 bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 transition-all duration-300 disabled:opacity-50"
          >
            <span
              className={
                loading ? "animate-spin inline-block" : ""
              }
            >
              ↻
            </span>

            Refresh
          </button>
        </div>

        {/* ===================================================== */}
        {/* ALERTS */}
        {/* ===================================================== */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-red-200 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="text-sm text-red-200/70 mt-1">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-200/60 hover:text-red-100"
            >
              ✕
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-green-400/20 bg-green-500/10 px-5 py-4 text-green-200 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">
                Success
              </p>

              <p className="text-sm text-green-200/70 mt-1">
                {success}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSuccess("")}
              className="text-green-200/60 hover:text-green-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* ===================================================== */}
        {/* STATS */}
        {/* ===================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">

          <StatCard
            icon="📦"
            label="Loaded Orders"
            value={stats.total}
          />

          <StatCard
            icon="⏳"
            label="Pending"
            value={stats.pending}
          />

          <StatCard
            icon="⚙️"
            label="Processing"
            value={stats.processing}
          />

          <StatCard
            icon="🚚"
            label="Delivered"
            value={stats.delivered}
          />

          <StatCard
            icon="❌"
            label="Cancelled"
            value={stats.cancelled}
          />

          <StatCard
            icon="💳"
            label="Paid"
            value={stats.paid}
          />

        </div>

        {/* ===================================================== */}
        {/* FILTER PANEL */}
        {/* ===================================================== */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 sm:p-6 shadow-2xl mb-6">

          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-bold">
                Order Filters
              </h2>

              <p className="text-sm text-white/40 mt-1">
                Search and filter platform orders.
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
            >
              Clear filters
            </button>
          </div>

          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3"
          >

            {/* SEARCH */}

            <div className="xl:col-span-2">
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Search
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  🔎
                </span>

                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(event.target.value)
                  }
                  placeholder="Order ID, customer, email, payment ID..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/20 border border-white/10 text-white placeholder:text-white/25 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/10 transition-all"
                />
              </div>
            </div>

            {/* ORDER STATUS */}

            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Order Status
              </label>

              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 rounded-2xl bg-[#120d1d] border border-white/10 text-white outline-none focus:border-purple-400/40 transition-all"
              >
                <option value="">
                  All statuses
                </option>

                {ORDER_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {formatStatus(item)}
                  </option>
                ))}
              </select>
            </div>

            {/* PAYMENT STATUS */}

            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Payment
              </label>

              <select
                value={paymentStatus}
                onChange={(event) => {
                  setPaymentStatus(event.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 rounded-2xl bg-[#120d1d] border border-white/10 text-white outline-none focus:border-purple-400/40 transition-all"
              >
                <option value="">
                  All payments
                </option>

                {PAYMENT_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {formatStatus(item)}
                  </option>
                ))}
              </select>
            </div>

            {/* PAYMENT METHOD */}

            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Method
              </label>

              <select
                value={paymentMethod}
                onChange={(event) => {
                  setPaymentMethod(event.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 rounded-2xl bg-[#120d1d] border border-white/10 text-white outline-none focus:border-purple-400/40 transition-all"
              >
                <option value="">
                  All methods
                </option>

                {PAYMENT_METHODS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* SEARCH BUTTON */}

            <div className="md:col-span-2 xl:col-span-5 flex justify-end pt-1">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 font-semibold shadow-lg shadow-purple-900/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                Search Orders
              </button>
            </div>

          </form>
        </div>

        {/* ===================================================== */}
        {/* ORDER TABLE */}
        {/* ===================================================== */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl overflow-hidden shadow-2xl">

          <div className="px-5 sm:px-6 py-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">
                All Orders
              </h2>

              <p className="text-sm text-white/40 mt-1">
                {pagination.total} total orders found
              </p>
            </div>

            <div className="text-xs text-white/30">
              Page {pagination.page} of{" "}
              {pagination.pages}
            </div>
          </div>

          {loading ? (
            <OrdersSkeleton />
          ) : orders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <>
              {/* DESKTOP */}

              <div className="hidden xl:block overflow-x-auto">

                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/30">
                        Order
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/30">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/30">
                        Amount
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/30">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/30">
                        Payment
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/30">
                        Date
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/30 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <OrderTableRow
                        key={order._id}
                        order={order}
                        onView={openOrderDetails}
                        onDelete={handleDeleteOrder}
                        deleteLoadingId={deleteLoadingId}
                      />
                    ))}
                  </tbody>
                </table>

              </div>

              {/* MOBILE / TABLET */}

              <div className="xl:hidden divide-y divide-white/10">
                {orders.map((order) => (
                  <OrderMobileCard
                    key={order._id}
                    order={order}
                    onView={openOrderDetails}
                    onDelete={handleDeleteOrder}
                    deleteLoadingId={deleteLoadingId}
                  />
                ))}
              </div>
            </>
          )}

          {/* PAGINATION */}

          {!loading && orders.length > 0 && (
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              onChange={setPage}
            />
          )}

        </div>
      </div>

      {/* ======================================================= */}
      {/* ORDER DETAILS MODAL */}
      {/* ======================================================= */}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          loading={detailsLoading}
          actionLoading={actionLoading}
          statusNote={statusNote}
          setStatusNote={setStatusNote}
          onClose={closeOrderDetails}
          onStatusChange={updateOrderStatus}
          onPaymentStatusChange={updatePaymentStatus}
          onDelete={handleDeleteOrder}
          deleteLoadingId={deleteLoadingId}
        />
      )}

      {/* ======================================================= */}
      {/* DETAILS LOADING MODAL */}
      {/* ======================================================= */}

      {detailsLoading && !selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="rounded-3xl border border-white/10 bg-[#100b18] px-8 py-7 text-center shadow-2xl">
            <div className="w-10 h-10 border-2 border-purple-400/20 border-t-purple-400 rounded-full animate-spin mx-auto" />

            <p className="mt-4 text-white/60">
              Loading order details...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================= */
/* STAT CARD */
/* ============================================================= */

const StatCard = ({ icon, label, value }) => {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-4 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="text-2xl">
          {icon}
        </div>

        <div className="text-2xl font-black text-white">
          {value}
        </div>
      </div>

      <p className="text-xs text-white/40 mt-3">
        {label}
      </p>
    </div>
  );
};

/* ============================================================= */
/* DESKTOP TABLE ROW */
/* ============================================================= */

const OrderTableRow = ({
  order,
  onView,
  onDelete,
  deleteLoadingId,
}) => {
  const customer = order.user || {};

  return (
    <tr className="border-b border-white/[0.06] hover:bg-white/[0.025] transition-colors">

      {/* ORDER */}

      <td className="px-6 py-5">
        <div>
          <p className="font-bold text-white">
            #{order._id?.slice(-8)?.toUpperCase()}
          </p>

          <p className="text-xs text-white/30 mt-1">
            {order.items?.length || 0} item
            {order.items?.length === 1 ? "" : "s"}
          </p>
        </div>
      </td>

      {/* CUSTOMER */}

      <td className="px-6 py-5">
        <div>
          <p className="font-semibold text-white/90">
            {customer.name ||
              order.shippingAddress?.fullName ||
              "Unknown Customer"}
          </p>

          <p className="text-xs text-white/35 mt-1 max-w-[180px] truncate">
            {customer.email ||
              order.shippingAddress?.phone ||
              "—"}
          </p>
        </div>
      </td>

      {/* AMOUNT */}

      <td className="px-6 py-5">
        <p className="font-bold text-purple-300">
          {formatCurrency(order.totalPrice)}
        </p>

        <p className="text-xs text-white/30 mt-1">
          {order.paymentMethod || "—"}
        </p>
      </td>

      {/* STATUS */}

      <td className="px-6 py-5">
        <StatusBadge status={order.orderStatus} />
      </td>

      {/* PAYMENT */}

      <td className="px-6 py-5">
        <StatusBadge
          status={order.paymentStatus}
          payment
        />
      </td>

      {/* DATE */}

      <td className="px-6 py-5">
        <p className="text-sm text-white/60">
          {formatDate(order.createdAt)}
        </p>
      </td>

      {/* ACTIONS */}

      <td className="px-6 py-5">
        <div className="flex items-center justify-end gap-2">

          <button
            type="button"
            onClick={() => onView(order._id)}
            className="px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-300 hover:bg-purple-500/20 transition-all"
          >
            View
          </button>

          <button
            type="button"
            onClick={() => onDelete(order)}
            disabled={deleteLoadingId === order._id}
            className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 hover:bg-red-500/20 transition-all disabled:opacity-40"
          >
            {deleteLoadingId === order._id
              ? "..."
              : "Delete"}
          </button>

        </div>
      </td>

    </tr>
  );
};

/* ============================================================= */
/* MOBILE CARD */
/* ============================================================= */

const OrderMobileCard = ({
  order,
  onView,
  onDelete,
  deleteLoadingId,
}) => {
  const customer = order.user || {};

  return (
    <div className="p-5 sm:p-6 hover:bg-white/[0.02] transition-colors">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="font-bold text-white">
            #{order._id?.slice(-8)?.toUpperCase()}
          </p>

          <p className="text-xs text-white/35 mt-1">
            {formatDate(order.createdAt)}
          </p>
        </div>

        <p className="text-lg font-black text-purple-300">
          {formatCurrency(order.totalPrice)}
        </p>

      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">

        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/30">
            Customer
          </p>

          <p className="text-sm text-white/80 mt-1 truncate">
            {customer.name ||
              order.shippingAddress?.fullName ||
              "Unknown"}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/30">
            Payment
          </p>

          <div className="mt-1">
            <StatusBadge
              status={order.paymentStatus}
              payment
            />
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/30">
            Order Status
          </p>

          <div className="mt-1">
            <StatusBadge status={order.orderStatus} />
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/30">
            Method
          </p>

          <p className="text-sm text-white/60 mt-1">
            {order.paymentMethod || "—"}
          </p>
        </div>

      </div>

      <div className="flex gap-2 mt-5">

        <button
          type="button"
          onClick={() => onView(order._id)}
          className="flex-1 px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-300 hover:bg-purple-500/20 transition-all font-semibold"
        >
          View Details
        </button>

        <button
          type="button"
          onClick={() => onDelete(order)}
          disabled={deleteLoadingId === order._id}
          className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 hover:bg-red-500/20 transition-all disabled:opacity-40"
        >
          {deleteLoadingId === order._id
            ? "..."
            : "Delete"}
        </button>

      </div>

    </div>
  );
};

/* ============================================================= */
/* STATUS BADGE */
/* ============================================================= */

const StatusBadge = ({
  status,
  payment = false,
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-semibold whitespace-nowrap ${
        payment
          ? getPaymentClass(status)
          : getStatusClass(status)
      }`}
    >
      {formatStatus(status || "unknown")}
    </span>
  );
};

/* ============================================================= */
/* PAGINATION */
/* ============================================================= */

const Pagination = ({
  page,
  pages,
  onChange,
}) => {
  if (pages <= 1) return null;

  const getPages = () => {
    const result = [];

    if (pages <= 7) {
      for (let i = 1; i <= pages; i += 1) {
        result.push(i);
      }

      return result;
    }

    result.push(1);

    if (page > 3) {
      result.push("...");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(pages - 1, page + 1);

    for (let i = start; i <= end; i += 1) {
      result.push(i);
    }

    if (page < pages - 2) {
      result.push("...");
    }

    result.push(pages);

    return result;
  };

  return (
    <div className="px-5 sm:px-6 py-5 border-t border-white/10 flex flex-wrap items-center justify-center gap-2">

      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.07] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        ←
      </button>

      {getPages().map((item, index) => {
        if (item === "...") {
          return (
            <span
              key={`dots-${index}`}
              className="px-2 text-white/30"
            >
              ...
            </span>
          );
        }

        return (
          <button
            type="button"
            key={item}
            onClick={() => onChange(item)}
            className={`min-w-10 px-3 py-2 rounded-xl border transition-all ${
              item === page
                ? "bg-purple-600 border-purple-400/40 text-white shadow-lg shadow-purple-900/20"
                : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.07]"
            }`}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.07] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        →
      </button>

    </div>
  );
};

/* ============================================================= */
/* EMPTY ORDERS */
/* ============================================================= */

const EmptyOrders = () => {
  return (
    <div className="px-6 py-20 text-center">

      <div className="text-5xl mb-5">
        📦
      </div>

      <h3 className="text-xl font-bold text-white">
        No Orders Found
      </h3>

      <p className="text-white/40 mt-2">
        Try changing your search or filters.
      </p>

    </div>
  );
};

/* ============================================================= */
/* SKELETON */
/* ============================================================= */

const OrdersSkeleton = () => {
  return (
    <div className="divide-y divide-white/10 animate-pulse">

      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="p-6 flex items-center gap-6"
        >
          <div className="w-32 h-5 bg-white/10 rounded-lg" />

          <div className="flex-1">
            <div className="w-40 h-4 bg-white/10 rounded mb-2" />
            <div className="w-24 h-3 bg-white/5 rounded" />
          </div>

          <div className="w-24 h-5 bg-white/10 rounded-lg" />

          <div className="w-24 h-7 bg-white/10 rounded-full" />

          <div className="w-20 h-7 bg-white/10 rounded-full" />
        </div>
      ))}

    </div>
  );
};

/* ============================================================= */
/* ORDER DETAILS MODAL */
/* ============================================================= */

const OrderDetailsModal = ({
  order,
  actionLoading,
  statusNote,
  setStatusNote,
  onClose,
  onStatusChange,
  onPaymentStatusChange,
  onDelete,
  deleteLoadingId,
}) => {
  const customer = order.user || {};
  const address = order.shippingAddress || {};

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md overflow-y-auto p-4 sm:p-6">

      <div className="min-h-full flex items-start sm:items-center justify-center">

        <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-[#100b18] shadow-2xl overflow-hidden">

          {/* HEADER */}

          <div className="px-5 sm:px-7 py-5 border-b border-white/10 flex items-start justify-between gap-5">

            <div>
              <div className="flex flex-wrap items-center gap-3">

                <h2 className="text-xl sm:text-2xl font-black">
                  Order #
                  {order._id?.slice(-8)?.toUpperCase()}
                </h2>

                <StatusBadge
                  status={order.orderStatus}
                />

              </div>

              <p className="text-sm text-white/40 mt-2">
                Created {formatDate(order.createdAt)}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.08] transition-all disabled:opacity-40"
            >
              ✕
            </button>

          </div>

          <div className="p-5 sm:p-7 space-y-6">

            {/* TOP STATS */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

              <InfoBox
                label="Total Amount"
                value={formatCurrency(order.totalPrice)}
                highlight
              />

              <InfoBox
                label="Payment Method"
                value={order.paymentMethod || "—"}
              />

              <InfoBox
                label="Payment Status"
                value={
                  <StatusBadge
                    status={order.paymentStatus}
                    payment
                  />
                }
              />

              <InfoBox
                label="Items"
                value={order.items?.length || 0}
              />

            </div>

            {/* CUSTOMER + SHIPPING */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* CUSTOMER */}

              <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
                    👤
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Customer
                    </h3>

                    <p className="text-xs text-white/35">
                      Customer information
                    </p>
                  </div>
                </div>

                <div className="space-y-3">

                  <DetailRow
                    label="Name"
                    value={
                      customer.name ||
                      address.fullName ||
                      "—"
                    }
                  />

                  <DetailRow
                    label="Email"
                    value={customer.email || "—"}
                  />

                  <DetailRow
                    label="Phone"
                    value={
                      address.phone ||
                      customer.phone ||
                      "—"
                    }
                  />

                  <DetailRow
                    label="Customer ID"
                    value={
                      customer._id
                        ? customer._id.slice(-10)
                        : "—"
                    }
                  />

                </div>

              </section>

              {/* SHIPPING */}

              <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                    📍
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Shipping Address
                    </h3>

                    <p className="text-xs text-white/35">
                      Delivery information
                    </p>
                  </div>
                </div>

                <div className="text-sm text-white/65 leading-7">

                  <p className="font-semibold text-white/90">
                    {address.fullName || "—"}
                  </p>

                  <p>
                    {address.phone || "—"}
                  </p>

                  <p>
                    {address.address || "—"}
                  </p>

                  <p>
                    {[
                      address.city,
                      address.state,
                      address.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>

                  <p>
                    {address.country || "—"}
                  </p>

                </div>

              </section>

            </div>

            {/* ORDER ITEMS */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.025] overflow-hidden">

              <div className="px-5 py-4 border-b border-white/10">
                <h3 className="font-bold">
                  Order Items
                </h3>

                <p className="text-xs text-white/35 mt-1">
                  {order.items?.length || 0} product
                  {order.items?.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="divide-y divide-white/[0.06]">

                {(order.items || []).map(
                  (item, index) => (
                    <OrderItem
                      key={
                        item._id ||
                        item.product?._id ||
                        index
                      }
                      item={item}
                    />
                  )
                )}

              </div>

              {/* TOTALS */}

              <div className="border-t border-white/10 p-5">

                <div className="max-w-sm ml-auto space-y-2">

                  <PriceRow
                    label="Items Price"
                    value={order.itemsPrice}
                  />

                  <PriceRow
                    label="Shipping"
                    value={order.shippingPrice}
                  />

                  <PriceRow
                    label="Tax"
                    value={order.taxPrice}
                  />

                  <PriceRow
                    label="Discount"
                    value={
                      order.discountPrice
                        ? -Number(order.discountPrice)
                        : 0
                    }
                  />

                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="font-bold">
                      Total
                    </span>

                    <span className="text-xl font-black text-purple-300">
                      {formatCurrency(
                        order.totalPrice
                      )}
                    </span>
                  </div>

                </div>

              </div>

            </section>

            {/* STATUS CONTROL */}

            <section className="rounded-2xl border border-purple-400/15 bg-purple-500/[0.04] p-5">

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                <div>
                  <h3 className="font-bold">
                    Order Status
                  </h3>

                  <p className="text-xs text-white/35 mt-1">
                    Change the current order status.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    status={order.orderStatus}
                  />
                </div>

              </div>

              <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-3">

                <select
                  value={order.orderStatus || ""}
                  onChange={(event) =>
                    onStatusChange(
                      order._id,
                      event.target.value
                    )
                  }
                  disabled={actionLoading}
                  className="px-4 py-3 rounded-xl bg-[#0d0914] border border-white/10 text-white outline-none focus:border-purple-400/40 disabled:opacity-50"
                >
                  {ORDER_STATUSES.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {formatStatus(item)}
                      </option>
                    )
                  )}
                </select>

                <input
                  type="text"
                  value={statusNote}
                  onChange={(event) =>
                    setStatusNote(
                      event.target.value
                    )
                  }
                  maxLength={300}
                  placeholder="Optional status note..."
                  disabled={actionLoading}
                  className="px-4 py-3 rounded-xl bg-[#0d0914] border border-white/10 text-white placeholder:text-white/25 outline-none focus:border-purple-400/40 disabled:opacity-50"
                />

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() =>
                    onStatusChange(
                      order._id,
                      order.orderStatus
                    )
                  }
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 font-semibold disabled:opacity-40 transition-all"
                >
                  {actionLoading
                    ? "Updating..."
                    : "Update"}
                </button>

              </div>

              <p className="text-[11px] text-white/25 mt-2">
                Changing the status will create a
                status history entry.
              </p>

            </section>

            {/* PAYMENT CONTROL */}

            <section className="rounded-2xl border border-green-400/10 bg-green-500/[0.025] p-5">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <h3 className="font-bold">
                    Payment Status
                  </h3>

                  <p className="text-xs text-white/35 mt-1">
                    Manage payment state for this
                    order.
                  </p>
                </div>

                <select
                  value={order.paymentStatus || ""}
                  onChange={(event) =>
                    onPaymentStatusChange(
                      order._id,
                      event.target.value
                    )
                  }
                  disabled={actionLoading}
                  className="w-full sm:w-auto min-w-[180px] px-4 py-3 rounded-xl bg-[#0d0914] border border-white/10 text-white outline-none focus:border-green-400/30 disabled:opacity-50"
                >
                  {PAYMENT_STATUSES.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {formatStatus(item)}
                      </option>
                    )
                  )}
                </select>

              </div>

            </section>

            {/* STATUS HISTORY */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

              <div className="mb-5">
                <h3 className="font-bold">
                  Status History
                </h3>

                <p className="text-xs text-white/35 mt-1">
                  Order status timeline.
                </p>
              </div>

              {order.statusHistory?.length ? (
                <div className="space-y-4">

                  {[...order.statusHistory]
                    .reverse()
                    .map((history, index) => (
                      <div
                        key={`${history.createdAt || index}-${index}`}
                        className="flex gap-4"
                      >

                        <div className="flex flex-col items-center">

                          <div className="w-3 h-3 rounded-full bg-purple-400 shadow-lg shadow-purple-500/30 mt-1.5" />

                          {index !==
                            order.statusHistory
                              .length -
                              1 && (
                            <div className="w-px flex-1 bg-white/10 mt-2" />
                          )}

                        </div>

                        <div className="pb-3">

                          <div className="flex flex-wrap items-center gap-2">

                            <StatusBadge
                              status={
                                history.status
                              }
                            />

                            <span className="text-xs text-white/30">
                              {formatDate(
                                history.createdAt
                              )}
                            </span>

                          </div>

                          {history.note && (
                            <p className="text-sm text-white/50 mt-2">
                              {history.note}
                            </p>
                          )}

                        </div>

                      </div>
                    ))}

                </div>
              ) : (
                <p className="text-sm text-white/35">
                  No status history available.
                </p>
              )}

            </section>

            {/* ORDER NOTE */}

            {order.note && (
              <section className="rounded-2xl border border-yellow-400/10 bg-yellow-500/[0.03] p-5">

                <p className="text-xs uppercase tracking-wider text-yellow-300/50 font-semibold">
                  Order Note
                </p>

                <p className="text-sm text-white/60 mt-2 leading-6">
                  {order.note}
                </p>

              </section>
            )}

            {/* FOOTER ACTIONS */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">

              <button
                type="button"
                onClick={() => onDelete(order)}
                disabled={
                  deleteLoadingId === order._id ||
                  actionLoading
                }
                className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 hover:bg-red-500/20 transition-all disabled:opacity-40"
              >
                {deleteLoadingId === order._id
                  ? "Deleting..."
                  : "Delete Order"}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={actionLoading}
                className="px-5 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white/70 hover:bg-white/[0.08] hover:text-white transition-all disabled:opacity-40"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================= */
/* INFO BOX */
/* ============================================================= */

const InfoBox = ({
  label,
  value,
  highlight = false,
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">

      <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">
        {label}
      </p>

      <div
        className={`mt-2 font-bold ${
          highlight
            ? "text-lg text-purple-300"
            : "text-white/80"
        }`}
      >
        {value}
      </div>

    </div>
  );
};

/* ============================================================= */
/* DETAIL ROW */
/* ============================================================= */

const DetailRow = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">

      <span className="text-white/30">
        {label}
      </span>

      <span className="text-white/70 text-right break-all">
        {value}
      </span>

    </div>
  );
};

/* ============================================================= */
/* ORDER ITEM */
/* ============================================================= */

const OrderItem = ({ item }) => {
  const image =
    item.image ||
    item.product?.images?.[0]?.url ||
    item.product?.image ||
    "";

  return (
    <div className="p-4 sm:p-5 flex items-center gap-4">

      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-white/10 bg-black/20 flex-shrink-0">

        {image ? (
          <img
            src={image}
            alt={item.name || "Product"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">
            📦
          </div>
        )}

      </div>

      <div className="flex-1 min-w-0">

        <h4 className="font-semibold text-white truncate">
          {item.name ||
            item.product?.name ||
            "Product"}
        </h4>

        <p className="text-xs text-white/35 mt-1">
          Qty: {item.quantity || 0}
        </p>

        <p className="text-xs text-white/35 mt-1">
          Unit Price:{" "}
          {formatCurrency(item.price)}
        </p>

      </div>

      <div className="text-right">

        <p className="font-bold text-purple-300">
          {formatCurrency(
            Number(item.price || 0) *
              Number(item.quantity || 0)
          )}
        </p>

      </div>

    </div>
  );
};

/* ============================================================= */
/* PRICE ROW */
/* ============================================================= */

const PriceRow = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between text-sm">

      <span className="text-white/40">
        {label}
      </span>

      <span
        className={
          Number(value || 0) < 0
            ? "text-red-300"
            : "text-white/70"
        }
      >
        {formatCurrency(value)}
      </span>

    </div>
  );
};

export default AdminOrders;
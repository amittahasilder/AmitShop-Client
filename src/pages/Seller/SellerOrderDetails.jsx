import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const SellerOrderDetails = () => {
  const { orderId } = useParams();

  const { accessToken } = useAuthStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // UPDATE STATUS STATES
  // ==========================================

  const [selectedStatus, setSelectedStatus] =
    useState("");

  const [statusNote, setStatusNote] =
    useState("");

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  const [statusMessage, setStatusMessage] =
    useState("");

  const [statusError, setStatusError] =
    useState("");

  // ==========================================
  // FETCH SELLER ORDER DETAILS
  // ==========================================

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/orders/seller/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.success) {
        const fetchedOrder =
          response.data.order;

        setOrder(fetchedOrder);

        setSelectedStatus(
          fetchedOrder.orderStatus || ""
        );
      } else {
        setError(
          response.data?.message ||
            "Failed to load order details"
        );
      }
    } catch (err) {
      console.error(
        "Seller Order Details Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load order details"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ORDER
  // ==========================================

  useEffect(() => {
    if (orderId && accessToken) {
      fetchOrder();
    }
  }, [orderId, accessToken]);

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const handleUpdateStatus = async () => {
    try {
      setStatusMessage("");
      setStatusError("");

      if (!selectedStatus) {
        setStatusError(
          "Please select an order status"
        );
        return;
      }

      if (
        selectedStatus === order.orderStatus
      ) {
        setStatusError(
          `Order is already ${formatStatus(
            order.orderStatus
          )}`
        );
        return;
      }

      setUpdatingStatus(true);

      const response = await api.put(
        `/orders/seller/${orderId}/status`,
        {
          orderStatus: selectedStatus,
          statusNote: statusNote.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.success) {
        setStatusMessage(
          response.data?.message ||
            "Order status updated successfully"
        );

        setStatusNote("");

        // Refresh complete order details
        await fetchOrder();
      } else {
        setStatusError(
          response.data?.message ||
            "Failed to update order status"
        );
      }
    } catch (err) {
      console.error(
        "Update Seller Order Status Error:",
        err
      );

      setStatusError(
        err.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
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

    return (
      value.charAt(0).toUpperCase() +
      value.slice(1)
    );
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
  // FORMAT DATE + TIME
  // ==========================================

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
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
                📦
              </span>
            </div>
          </div>

          <p className="mt-6 text-slate-300 font-medium">
            Loading order details...
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
              Order Error
            </h2>

            <p className="mt-3 text-red-300">
              {error}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={fetchOrder}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold transition"
              >
                Try Again ↻
              </button>

              <Link
                to="/seller/orders"
                className="px-6 py-3 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold transition"
              >
                ← Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // NO ORDER
  // ==========================================

  if (!order) {
    return (
      <div className="min-h-screen bg-[#05020d] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl">
            📦
          </div>

          <h2 className="mt-5 text-2xl font-black text-white">
            Order Not Found
          </h2>

          <Link
            to="/seller/orders"
            className="inline-flex mt-6 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition"
          >
            ← Back to Orders
          </Link>
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

        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-700/10 blur-[140px]" />
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
            <Link
              to="/seller/orders"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-purple-300 transition"
            >
              ← Back to Seller Orders
            </Link>

            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />

              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">
                Seller Order Details
              </span>
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight">
              Order
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
                {" "}Details
              </span>
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
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
          </div>

          <div className="text-left lg:text-right">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Order Date
            </p>

            <p className="mt-2 text-slate-200 font-semibold">
              {formatDateTime(
                order.createdAt
              )}
            </p>
          </div>
        </div>

        {/* ====================================
            TOP STATS
        ==================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

          {/* Seller Total */}

          <div className="relative overflow-hidden rounded-[24px] border border-purple-500/20 bg-purple-500/[0.06] backdrop-blur-2xl p-6">
            <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative">
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Your Total
              </p>

              <p className="mt-2 text-3xl font-black bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                $
                {Number(
                  order.sellerTotal || 0
                ).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Seller Items */}

          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Your Items
            </p>

            <p className="mt-2 text-3xl font-black text-white">
              {order.sellerItemCount || 0}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Total quantity
            </p>
          </div>

          {/* Payment */}

          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Payment
            </p>

            <p className="mt-2 text-xl font-black text-white">
              {formatStatus(
                order.paymentStatus
              )}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {formatStatus(
                order.paymentMethod
              )}
            </p>
          </div>
        </div>

        {/* ====================================
            CUSTOMER + SHIPPING
        ==================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Customer */}

          <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">

            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-purple-600/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
                  👤
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    Customer
                  </p>

                  <h2 className="text-lg font-black text-white">
                    Customer Information
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-600">
                    Name
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {order.user?.name ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-600">
                    Email
                  </p>

                  <p className="mt-1 text-slate-300 break-all">
                    {order.user?.email ||
                      "N/A"}
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* Shipping */}

          <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">

            <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-fuchsia-600/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-xl">
                  🚚
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    Delivery
                  </p>

                  <h2 className="text-lg font-black text-white">
                    Shipping Address
                  </h2>
                </div>
              </div>

              <div className="mt-6 text-sm text-slate-300 space-y-2">
                <p>
                  <span className="text-slate-600">
                    Name:
                  </span>{" "}
                  {order.shippingAddress
                    ?.fullName ||
                    order.shippingAddress
                      ?.name ||
                    "N/A"}
                </p>

                <p>
                  <span className="text-slate-600">
                    Address:
                  </span>{" "}
                  {order.shippingAddress
                    ?.address ||
                    "N/A"}
                </p>

                <p>
                  <span className="text-slate-600">
                    City:
                  </span>{" "}
                  {order.shippingAddress
                    ?.city ||
                    "N/A"}
                </p>

                <p>
                  <span className="text-slate-600">
                    State:
                  </span>{" "}
                  {order.shippingAddress
                    ?.state ||
                    "N/A"}
                </p>

                <p>
                  <span className="text-slate-600">
                    Postal Code:
                  </span>{" "}
                  {order.shippingAddress
                    ?.postalCode ||
                    "N/A"}
                </p>

                <p>
                  <span className="text-slate-600">
                    Country:
                  </span>{" "}
                  {order.shippingAddress
                    ?.country ||
                    "N/A"}
                </p>

                <p>
                  <span className="text-slate-600">
                    Phone:
                  </span>{" "}
                  {order.shippingAddress
                    ?.phone ||
                    "N/A"}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ====================================
            SELLER PRODUCTS
        ==================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 mb-6">

          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl" />

          <div className="relative">

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Inventory
                </p>

                <h2 className="mt-1 text-2xl font-black text-white">
                  Your Products
                </h2>
              </div>

              <p className="text-sm text-slate-500">
                {order.sellerItemCount || 0}{" "}
                items
              </p>
            </div>

            <div className="space-y-4">

              {(order.items || []).map(
                (item, index) => {
                  const quantity =
                    Number(
                      item.quantity || 0
                    );

                  const price =
                    Number(
                      item.price || 0
                    );

                  const subtotal =
                    price * quantity;

                  return (
                    <div
                      key={
                        item.product?._id ||
                        index
                      }
                      className="group flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 hover:border-purple-500/20 transition"
                    >
                      {/* Image */}

                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={
                              item.name ||
                              "Product"
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            📦
                          </div>
                        )}
                      </div>

                      {/* Product */}

                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-widest text-slate-600">
                          Product
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-white truncate">
                          {item.name ||
                            "Product"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Quantity:{" "}
                          {quantity}
                        </p>
                      </div>

                      {/* Unit Price */}

                      <div className="sm:text-right">
                        <p className="text-xs uppercase tracking-widest text-slate-600">
                          Unit Price
                        </p>

                        <p className="mt-1 font-bold text-white">
                          $
                          {price.toFixed(
                            2
                          )}
                        </p>
                      </div>

                      {/* Subtotal */}

                      <div className="sm:text-right sm:min-w-[110px]">
                        <p className="text-xs uppercase tracking-widest text-slate-600">
                          Subtotal
                        </p>

                        <p className="mt-1 font-black text-purple-300">
                          $
                          {subtotal.toFixed(
                            2
                          )}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* Total */}

            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-slate-400 font-semibold">
                Your Order Total
              </span>

              <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                $
                {Number(
                  order.sellerTotal || 0
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        {/* ====================================
            ORDER STATUS
        ==================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 mb-6">

          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl" />

          <div className="relative">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Current Status
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  Order Status
                </h2>
              </div>

              <span
                className={`inline-flex w-fit px-4 py-2 rounded-full border text-sm font-bold ${getStatusStyle(
                  order.orderStatus
                )}`}
              >
                {formatStatus(
                  order.orderStatus
                )}
              </span>
            </div>

            {/* ==================================
                UPDATE STATUS
            ================================== */}

            <div className="mt-8 rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] p-5">

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  🔄
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    Seller Action
                  </p>

                  <h3 className="text-lg font-black text-white">
                    Update Order Status
                  </h3>
                </div>
              </div>

              {/* Success Message */}

              {statusMessage && (
                <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  ✅ {statusMessage}
                </div>
              )}

              {/* Error Message */}

              {statusError && (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  ⚠️ {statusError}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Status */}

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    New Status
                  </label>

                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(
                        e.target.value
                      );
                      setStatusMessage("");
                      setStatusError("");
                    }}
                    disabled={
                      updatingStatus ||
                      order.orderStatus ===
                        "delivered" ||
                      order.orderStatus ===
                        "cancelled"
                    }
                    className="w-full rounded-2xl border border-white/10 bg-[#10091c] px-4 py-3.5 text-white outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition disabled:opacity-50"
                  >
                    <option value="">
                      Select status
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
                  </select>
                </div>

                {/* Note */}

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Status Note
                    <span className="ml-2 text-xs text-slate-600">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => {
                      setStatusNote(
                        e.target.value
                      );
                      setStatusMessage("");
                      setStatusError("");
                    }}
                    maxLength={300}
                    disabled={
                      updatingStatus ||
                      order.orderStatus ===
                        "delivered" ||
                      order.orderStatus ===
                        "cancelled"
                    }
                    placeholder="Example: Package handed to courier"
                    className="w-full rounded-2xl border border-white/10 bg-[#10091c] px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition disabled:opacity-50"
                  />

                  <div className="mt-2 text-right text-xs text-slate-600">
                    {statusNote.length}/300
                  </div>
                </div>
              </div>

              {/* Update Button */}

              <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <p className="text-xs text-slate-600">
                  Current status:{" "}
                  <span className="text-slate-400 font-semibold">
                    {formatStatus(
                      order.orderStatus
                    )}
                  </span>
                </p>

                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={
                    updatingStatus ||
                    !selectedStatus ||
                    selectedStatus ===
                      order.orderStatus ||
                    order.orderStatus ===
                      "delivered" ||
                    order.orderStatus ===
                      "cancelled"
                  }
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {updatingStatus ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      Update Status
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>

              {(order.orderStatus ===
                "delivered" ||
                order.orderStatus ===
                  "cancelled") && (
                <p className="mt-4 text-xs text-slate-600">
                  This order can no longer be
                  updated.
                </p>
              )}
            </div>

            {/* ==================================
                STATUS HISTORY
            ================================== */}

            <div className="mt-8">

              <p className="text-xs uppercase tracking-widest text-slate-500 mb-5">
                Status History
              </p>

              {(order.statusHistory || [])
                .length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/10 p-5 text-sm text-slate-500">
                  No status history available.
                </div>
              ) : (
                <div className="space-y-4">
                  {order.statusHistory.map(
                    (history, index) => (
                      <div
                        key={
                          history._id ||
                          index
                        }
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-purple-500 ring-4 ring-purple-500/10 mt-1" />

                          {index <
                            order
                              .statusHistory
                              .length -
                              1 && (
                            <div className="w-px flex-1 bg-white/10 mt-2" />
                          )}
                        </div>

                        <div className="pb-5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusStyle(
                                history.status
                              )}`}
                            >
                              {formatStatus(
                                history.status
                              )}
                            </span>

                            <span className="text-xs text-slate-600">
                              {formatDateTime(
                                history.createdAt ||
                                  history.updatedAt
                              )}
                            </span>
                          </div>

                          {history.note && (
                            <p className="mt-2 text-sm text-slate-400">
                              {history.note}
                            </p>
                          )}

                          {history.updatedBy && (
                            <p className="mt-1 text-xs text-slate-600">
                              Updated by{" "}
                              {history.updatedBy
                                .name ||
                                "System"}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ====================================
            ORDER NOTE
        ==================================== */}

        {order.note && (
          <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 mb-6">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Order Note
            </p>

            <p className="mt-3 text-slate-300 leading-7">
              {order.note}
            </p>
          </section>
        )}

        {/* ====================================
            FOOTER
        ==================================== */}

        <div className="mt-10 pb-5 text-center text-xs text-slate-600">
          AmitShop Seller Center • Order Details
        </div>
      </main>
    </div>
  );
};

export default SellerOrderDetails;
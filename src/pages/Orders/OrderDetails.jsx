import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get(`/orders/${orderId}`);

      const orderData =
        response?.data?.order ||
        response?.data?.data ||
        response?.data;

      if (!orderData || !orderData._id) {
        throw new Error("Order not found.");
      }

      setOrder(orderData);
    } catch (error) {
      console.error("Order Details Error:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load order details."
      );
    } finally {
      setIsLoading(false);
    }
  }, [orderId, navigate]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

      case "shipped":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "processing":
        return "bg-violet-500/10 text-violet-400 border-violet-500/20";

      case "confirmed":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";

      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }
  };

  const getProductImage = (item) => {
    return (
      item?.image ||
      item?.product?.images?.[0] ||
      "https://placehold.co/200x200/10051c/ffffff?text=Product"
    );
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#05020b] px-5 pb-20 pt-36 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-5 w-32 rounded bg-white/10" />

            <div className="mt-6 h-12 w-72 rounded bg-white/10" />

            <div className="mt-8 h-40 rounded-3xl bg-white/[0.04]" />

            <div className="mt-6 h-80 rounded-3xl bg-white/[0.04]" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#05020b] px-5 pb-20 pt-36 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-2xl">
              !
            </div>

            <h1 className="mt-5 text-2xl font-black">
              Unable to Load Order
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm text-white/45">
              {error}
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={fetchOrder}
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-500"
              >
                Try Again
              </button>

              <Link
                to="/orders"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <main className="min-h-screen bg-[#05020b] px-5 pb-24 pt-36 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Breadcrumb */}
        <div className="mb-7 flex items-center gap-2 text-sm text-white/35">
          <Link
            to="/orders"
            className="transition hover:text-violet-400"
          >
            My Orders
          </Link>

          <span>/</span>

          <span className="text-white/60">
            Order Details
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
              AmitShop
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Order Details
            </h1>

            <p className="mt-3 text-sm text-white/40">
              Order #{order._id}
            </p>
          </div>

          <Link
            to="/orders"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/70 transition hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-white"
          >
            ← Back to Orders
          </Link>
        </div>

        {/* Order Summary */}
        <section className="mt-8 rounded-3xl border border-violet-400/10 bg-white/[0.025] p-6 shadow-[0_20px_80px_rgba(124,58,237,0.06)] backdrop-blur-xl sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/30">
                Order Date
              </p>

              <p className="mt-2 text-sm font-semibold text-white/80">
                {formatDate(order.createdAt)}
              </p>

              <p className="mt-1 text-xs text-white/30">
                {formatTime(order.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/30">
                Order Status
              </p>

              <span
                className={`mt-3 inline-flex rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getStatusClass(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus || "pending"}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/30">
                Payment
              </p>

              <p className="mt-2 text-sm font-semibold text-white/80">
                {order.paymentMethod || "N/A"}
              </p>

              <span
                className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getPaymentStatusClass(
                  order.paymentStatus
                )}`}
              >
                {order.paymentStatus || "pending"}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/30">
                Total
              </p>

              <p className="mt-2 text-2xl font-black text-violet-300">
                ${Number(order.totalPrice || 0).toFixed(2)}
              </p>
            </div>

          </div>
        </section>

        {/* Main Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* Products */}
          <section className="rounded-3xl border border-violet-400/10 bg-white/[0.025] p-6 backdrop-blur-xl sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400/70">
                  Order Items
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Products
                </h2>
              </div>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/50">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-7 space-y-4">
              {items.map((item, index) => (
                <div
                  key={item._id || `${item.product?._id}-${index}`}
                  className="flex gap-4 rounded-2xl border border-white/5 bg-black/20 p-4"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white/[0.04]">
                    <img
                      src={getProductImage(item)}
                      alt={item.name || "Product"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold text-white">
                      {item.name || "Product"}
                    </h3>

                    <p className="mt-1 text-sm text-white/35">
                      Quantity: {item.quantity || 1}
                    </p>

                    <p className="mt-3 text-sm font-bold text-violet-300">
                      ${Number(item.price || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-white/30">
                      Item Total
                    </p>

                    <p className="mt-2 text-sm font-black text-white/80">
                      $
                      {(
                        Number(item.price || 0) *
                        Number(item.quantity || 1)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Side */}
          <div className="space-y-6">

            {/* Shipping Address */}
            <section className="rounded-3xl border border-violet-400/10 bg-white/[0.025] p-6 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400/70">
                Delivery
              </p>

              <h2 className="mt-2 text-xl font-black">
                Shipping Address
              </h2>

              <div className="mt-5 space-y-2 text-sm text-white/50">
                <p className="font-bold text-white/80">
                  {order.shippingAddress?.fullName || "N/A"}
                </p>

                <p>
                  {order.shippingAddress?.phone || "N/A"}
                </p>

                <p>
                  {order.shippingAddress?.address || "N/A"}
                </p>

                <p>
                  {order.shippingAddress?.city || "N/A"},{" "}
                  {order.shippingAddress?.postalCode || ""}
                </p>

                <p>
                  {order.shippingAddress?.country || "N/A"}
                </p>
              </div>
            </section>

            {/* Price Summary */}
            <section className="rounded-3xl border border-violet-400/10 bg-white/[0.025] p-6 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400/70">
                Summary
              </p>

              <h2 className="mt-2 text-xl font-black">
                Price Details
              </h2>

              <div className="mt-6 space-y-4 text-sm">

                <div className="flex justify-between gap-4 text-white/50">
                  <span>Items</span>

                  <span>
                    $
                    {Number(
                      order.itemsPrice || 0
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-white/50">
                  <span>Shipping</span>

                  <span>
                    $
                    {Number(
                      order.shippingPrice || 0
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-white/50">
                  <span>Tax</span>

                  <span>
                    $
                    {Number(
                      order.taxPrice || 0
                    ).toFixed(2)}
                  </span>
                </div>

                {Number(order.discount || 0) > 0 && (
                  <div className="flex justify-between gap-4 text-emerald-400">
                    <span>Discount</span>

                    <span>
                      -$
                      {Number(
                        order.discount || 0
                      ).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white/60">
                      Total
                    </span>

                    <span className="text-2xl font-black text-violet-300">
                      $
                      {Number(
                        order.totalPrice || 0
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

              </div>
            </section>

          </div>
        </div>

        {/* Status History */}
        {Array.isArray(order.statusHistory) &&
          order.statusHistory.length > 0 && (
            <section className="mt-6 rounded-3xl border border-violet-400/10 bg-white/[0.025] p-6 backdrop-blur-xl sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400/70">
                Timeline
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Order History
              </h2>

              <div className="mt-7 space-y-5">
                {order.statusHistory.map((history, index) => (
                  <div
                    key={history._id || index}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.7)]" />

                      {index !==
                        order.statusHistory.length - 1 && (
                        <div className="mt-2 h-full min-h-8 w-px bg-white/10" />
                      )}
                    </div>

                    <div className="pb-2">
                      <p className="text-sm font-bold capitalize text-white/80">
                        {history.status || "Status updated"}
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        {formatDate(history.createdAt)}{" "}
                        {formatTime(history.createdAt)}
                      </p>

                      {history.note && (
                        <p className="mt-2 text-sm text-white/40">
                          {history.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

      </div>
    </main>
  );
};

export default OrderDetails;
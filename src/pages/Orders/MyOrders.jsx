import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const MyOrders = () => {
  const navigate = useNavigate();

  const {
    isAuthenticated,
    getCurrentUser,
  } = useAuthStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH MY ORDERS
  // =========================================================

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders/my-orders");

      const orderData =
        response?.data?.orders ||
        response?.data?.data ||
        response?.data?.items ||
        [];

      setOrders(
        Array.isArray(orderData)
          ? orderData
          : []
      );
    } catch (error) {
      console.error(
        "My Orders Error:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // =========================================================
  // AUTH + ORDERS
  // =========================================================

  useEffect(() => {
    const loadOrders = async () => {
      await getCurrentUser();

      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      await fetchOrders();
    };

    loadOrders();
  }, [
    getCurrentUser,
    isAuthenticated,
    navigate,
    fetchOrders,
  ]);

  // =========================================================
  // CANCEL ORDER
  // =========================================================

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.put(
        `/orders/${orderId}/cancel`
      );

      await fetchOrders();
    } catch (error) {
      console.error(
        "Cancel Order Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to cancel this order."
      );
    }
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  // =========================================================
  // ORDER STATUS STYLE
  // =========================================================

  const getOrderStatusStyle = (status) => {
    switch (
      String(status || "").toLowerCase()
    ) {
      case "delivered":
        return {
          wrapper:
            "border-emerald-400/20 bg-emerald-500/10",
          text: "text-emerald-300",
          dot: "bg-emerald-400",
        };

      case "shipped":
        return {
          wrapper:
            "border-blue-400/20 bg-blue-500/10",
          text: "text-blue-300",
          dot: "bg-blue-400",
        };

      case "processing":
        return {
          wrapper:
            "border-purple-400/20 bg-purple-500/10",
          text: "text-purple-300",
          dot: "bg-purple-400",
        };

      case "confirmed":
        return {
          wrapper:
            "border-cyan-400/20 bg-cyan-500/10",
          text: "text-cyan-300",
          dot: "bg-cyan-400",
        };

      case "cancelled":
        return {
          wrapper:
            "border-red-400/20 bg-red-500/10",
          text: "text-red-300",
          dot: "bg-red-400",
        };

      default:
        return {
          wrapper:
            "border-amber-400/20 bg-amber-500/10",
          text: "text-amber-300",
          dot: "bg-amber-400",
        };
    }
  };

  // =========================================================
  // PAYMENT STATUS STYLE
  // =========================================================

  const getPaymentStatusStyle = (status) => {
    switch (
      String(status || "").toLowerCase()
    ) {
      case "paid":
        return {
          wrapper:
            "border-emerald-400/20 bg-emerald-500/10",
          text: "text-emerald-300",
        };

      case "failed":
        return {
          wrapper:
            "border-red-400/20 bg-red-500/10",
          text: "text-red-300",
        };

      default:
        return {
          wrapper:
            "border-amber-400/20 bg-amber-500/10",
          text: "text-amber-300",
        };
    }
  };

  // =========================================================
  // ORDER TOTAL
  // =========================================================

  const getOrderTotal = (order) => {
    return Number(
      order?.totalPrice ??
        order?.total ??
        order?.grandTotal ??
        0
    );
  };

  // =========================================================
  // ORDER NUMBER
  // =========================================================

  const getOrderNumber = (order) => {
    const id =
      order?._id ||
      order?.id ||
      "";

    if (!id) {
      return "N/A";
    }

    return `#${String(id)
      .slice(-8)
      .toUpperCase()}`;
  };

  // =========================================================
  // ORDER ITEMS
  // =========================================================

  const getOrderItems = (order) => {
    if (
      Array.isArray(order?.items)
    ) {
      return order.items;
    }

    if (
      Array.isArray(order?.orderItems)
    ) {
      return order.orderItems;
    }

    return [];
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          bg-[#05020b]
          px-4
          pb-20
          pt-32
          text-white
        "
      >
        <div className="mx-auto max-w-7xl">
          {/* Header Skeleton */}

          <div className="mb-10">
            <div className="h-10 w-52 animate-pulse rounded-xl bg-white/[0.06]" />

            <div className="mt-3 h-4 w-72 animate-pulse rounded-lg bg-white/[0.04]" />
          </div>

          {/* Cards Skeleton */}

          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  overflow-hidden
                  rounded-3xl
                  border
                  border-violet-400/10
                  bg-white/[0.025]
                  p-5
                "
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <div className="h-5 w-32 animate-pulse rounded-lg bg-white/[0.06]" />

                    <div className="h-4 w-48 animate-pulse rounded-lg bg-white/[0.04]" />

                    <div className="h-4 w-36 animate-pulse rounded-lg bg-white/[0.04]" />
                  </div>

                  <div className="h-10 w-28 animate-pulse rounded-xl bg-white/[0.06]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#05020b]
        px-4
        pb-24
        pt-32
        text-white
        sm:px-6
        lg:px-8
      "
    >
      {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-[-120px]
          top-20
          h-80
          w-80
          rounded-full
          bg-violet-700/15
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-120px]
          top-72
          h-96
          w-96
          rounded-full
          bg-fuchsia-700/10
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[500px]
          h-80
          w-80
          -translate-x-1/2
          rounded-full
          bg-purple-700/10
          blur-[120px]
        "
      />

      <div className="relative mx-auto max-w-7xl">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-violet-400/20
                bg-violet-500/10
                text-lg
                shadow-[0_0_30px_rgba(139,92,246,0.12)]
              "
            >
              ◈
            </span>

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.3em]
                text-violet-300/60
              "
            >
              AmitShop
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1
                className="
                  text-3xl
                  font-black
                  tracking-tight
                  text-white
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                My{" "}
                <span
                  className="
                    bg-gradient-to-r
                    from-violet-400
                    via-purple-400
                    to-fuchsia-400
                    bg-clip-text
                    text-transparent
                  "
                >
                  Orders
                </span>
              </h1>

              <p
                className="
                  mt-3
                  max-w-xl
                  text-sm
                  leading-6
                  text-white/40
                "
              >
                View and manage all your
                AmitShop orders in one place.
              </p>
            </div>

            <Link
              to="/products"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-violet-400/20
                bg-gradient-to-r
                from-violet-600
                via-purple-600
                to-fuchsia-600
                px-5
                py-3
                text-sm
                font-bold
                text-white
                shadow-[0_10px_35px_rgba(124,58,237,0.25)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_15px_45px_rgba(168,85,247,0.4)]
              "
            >
              <span>+</span>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (
          <div
            className="
              mb-6
              rounded-2xl
              border
              border-red-400/20
              bg-red-500/10
              p-4
              text-sm
              text-red-300
            "
          >
            <div className="flex items-center justify-between gap-4">
              <span>
                {error}
              </span>

              <button
                type="button"
                onClick={fetchOrders}
                className="
                  shrink-0
                  rounded-lg
                  border
                  border-red-400/20
                  bg-red-500/10
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-red-200
                  transition
                  hover:bg-red-500/20
                "
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* ===================================================
            EMPTY STATE
        ==================================================== */}

        {!error &&
          orders.length === 0 && (
            <div
              className="
                relative
                overflow-hidden
                rounded-[30px]
                border
                border-violet-400/10
                bg-gradient-to-br
                from-violet-500/[0.06]
                via-white/[0.02]
                to-fuchsia-500/[0.04]
                px-6
                py-20
                text-center
                shadow-[0_30px_100px_rgba(76,29,149,0.12)]
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  h-48
                  w-48
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-violet-600/10
                  blur-[80px]
                "
              />

              <div
                className="
                  relative
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-3xl
                  border
                  border-violet-400/20
                  bg-gradient-to-br
                  from-violet-500/15
                  to-fuchsia-500/10
                  text-3xl
                  shadow-[0_15px_50px_rgba(139,92,246,0.15)]
                "
              >
                🛍️
              </div>

              <h2
                className="
                  relative
                  mt-6
                  text-xl
                  font-black
                  text-white
                "
              >
                No Orders Yet
              </h2>

              <p
                className="
                  relative
                  mx-auto
                  mt-2
                  max-w-md
                  text-sm
                  leading-6
                  text-white/35
                "
              >
                You haven't placed any
                orders yet. Start shopping
                and your orders will appear
                here.
              </p>

              <Link
                to="/products"
                className="
                  relative
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  via-purple-600
                  to-fuchsia-600
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_10px_35px_rgba(124,58,237,0.3)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_15px_45px_rgba(168,85,247,0.4)]
                "
              >
                Browse Products
                <span>→</span>
              </Link>
            </div>
          )}

        {/* ===================================================
            ORDERS
        ==================================================== */}

        {orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order, index) => {
              const items =
                getOrderItems(order);

              const orderId =
                order?._id ||
                order?.id;

              const orderStatus =
                order?.orderStatus ||
                order?.status ||
                "pending";

              const paymentStatus =
                order?.paymentStatus ||
                "pending";

              const statusStyle =
                getOrderStatusStyle(
                  orderStatus
                );

              const paymentStyle =
                getPaymentStatusStyle(
                  paymentStatus
                );

              const total =
                getOrderTotal(order);

              const canCancel =
                ![
                  "delivered",
                  "cancelled",
                  "shipped",
                ].includes(
                  String(
                    orderStatus
                  ).toLowerCase()
                );

              return (
                <div
                  key={
                    orderId || index
                  }
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[26px]
                    border
                    border-violet-400/10
                    bg-gradient-to-br
                    from-[#120821]/90
                    via-[#0a0612]/95
                    to-[#14091f]/90
                    shadow-[0_20px_70px_rgba(0,0,0,0.25)]
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:border-violet-400/25
                    hover:shadow-[0_25px_90px_rgba(76,29,149,0.2)]
                  "
                >
                  {/* Top Glow */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      left-1/4
                      top-0
                      h-px
                      w-1/2
                      bg-gradient-to-r
                      from-transparent
                      via-violet-400/50
                      to-transparent
                      opacity-0
                      transition-opacity
                      duration-500
                      group-hover:opacity-100
                    "
                  />

                  {/* =================================================
                      ORDER HEADER
                  ================================================== */}

                  <div
                    className="
                      border-b
                      border-white/[0.05]
                      p-5
                      sm:p-6
                    "
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-violet-400/15
                            bg-violet-500/10
                            text-lg
                            text-violet-300
                            transition-all
                            duration-300
                            group-hover:scale-105
                            group-hover:bg-violet-500/15
                          "
                        >
                          ◈
                        </div>

                        <div>
                          <p
                            className="
                              text-[9px]
                              font-bold
                              uppercase
                              tracking-[0.25em]
                              text-white/30
                            "
                          >
                            Order
                          </p>

                          <h2
                            className="
                              mt-1
                              text-sm
                              font-black
                              tracking-wide
                              text-white
                              sm:text-base
                            "
                          >
                            {getOrderNumber(
                              order
                            )}
                          </h2>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-white/30
                            "
                          >
                            {formatDate(
                              order?.createdAt ||
                                order?.orderDate ||
                                order?.created
                            )}

                            {(
                              order?.createdAt ||
                              order?.orderDate ||
                              order?.created
                            ) && (
                              <>
                                {" "}
                                •{" "}
                                {formatTime(
                                  order?.createdAt ||
                                    order?.orderDate ||
                                    order?.created
                                )}
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Order Status */}

                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            px-3
                            py-1.5
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            ${statusStyle.wrapper}
                            ${statusStyle.text}
                          `}
                        >
                          <span
                            className={`
                              h-1.5
                              w-1.5
                              rounded-full
                              ${statusStyle.dot}
                            `}
                          />

                          {orderStatus}
                        </span>

                        {/* Payment */}

                        <span
                          className={`
                            inline-flex
                            items-center
                            rounded-full
                            border
                            px-3
                            py-1.5
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            ${paymentStyle.wrapper}
                            ${paymentStyle.text}
                          `}
                        >
                          Payment:{" "}
                          {paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      ORDER BODY
                  ================================================== */}

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      {/* Products */}

                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            mb-3
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.25em]
                            text-white/25
                          "
                        >
                          Items
                        </p>

                        {items.length > 0 ? (
                          <div className="space-y-3">
                            {items
                              .slice(0, 3)
                              .map(
                                (
                                  item,
                                  itemIndex
                                ) => {
                                  const product =
                                    item?.product ||
                                    {};

                                  const image =
                                    item?.image ||
                                    product?.images?.[0] ||
                                    product?.image ||
                                    "";

                                  const name =
                                    item?.name ||
                                    product?.name ||
                                    "Product";

                                  const quantity =
                                    Number(
                                      item?.quantity ||
                                        1
                                    );

                                  const price =
                                    Number(
                                      item?.price ||
                                        product?.discountPrice ||
                                        product?.price ||
                                        0
                                    );

                                  return (
                                    <div
                                      key={
                                        item?._id ||
                                        product?._id ||
                                        itemIndex
                                      }
                                      className="
                                        flex
                                        items-center
                                        gap-3
                                      "
                                    >
                                      <div
                                        className="
                                          flex
                                          h-14
                                          w-14
                                          shrink-0
                                          items-center
                                          justify-center
                                          overflow-hidden
                                          rounded-xl
                                          border
                                          border-white/[0.06]
                                          bg-white/[0.03]
                                        "
                                      >
                                        {image ? (
                                          <img
                                            src={
                                              image
                                            }
                                            alt={
                                              name
                                            }
                                            className="
                                              h-full
                                              w-full
                                              object-cover
                                            "
                                          />
                                        ) : (
                                          <span className="text-lg text-white/20">
                                            ◇
                                          </span>
                                        )}
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <p
                                          className="
                                            truncate
                                            text-xs
                                            font-bold
                                            text-white/75
                                          "
                                        >
                                          {name}
                                        </p>

                                        <p
                                          className="
                                            mt-1
                                            text-[10px]
                                            text-white/30
                                          "
                                        >
                                          Qty:{" "}
                                          {
                                            quantity
                                          }
                                        </p>
                                      </div>

                                      <p
                                        className="
                                          shrink-0
                                          text-xs
                                          font-bold
                                          text-white/60
                                        "
                                      >
                                        $
                                        {(
                                          price *
                                          quantity
                                        ).toFixed(
                                          2
                                        )}
                                      </p>
                                    </div>
                                  );
                                }
                              )}

                            {items.length >
                              3 && (
                              <p
                                className="
                                  pl-1
                                  text-[10px]
                                  font-semibold
                                  text-violet-300/50
                                "
                              >
                                +
                                {items.length -
                                  3}{" "}
                                more item
                                {items.length -
                                  3 >
                                1
                                  ? "s"
                                  : ""}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-white/30">
                            No item details
                            available.
                          </p>
                        )}
                      </div>

                      {/* Divider */}

                      <div
                        className="
                          hidden
                          h-24
                          w-px
                          bg-gradient-to-b
                          from-transparent
                          via-white/10
                          to-transparent
                          lg:block
                        "
                      />

                      {/* Total + Actions */}

                      <div
                        className="
                          flex
                          shrink-0
                          flex-col
                          gap-4
                          sm:flex-row
                          sm:items-center
                          lg:flex-col
                          lg:items-end
                        "
                      >
                        <div className="text-left sm:text-right">
                          <p
                            className="
                              text-[9px]
                              font-bold
                              uppercase
                              tracking-[0.25em]
                              text-white/25
                            "
                          >
                            Order Total
                          </p>

                          <p
                            className="
                              mt-1
                              text-2xl
                              font-black
                              text-white
                            "
                          >
                            $
                            {total.toFixed(
                              2
                            )}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {/* View */}

                          {orderId && (
                            <Link
                              to={`/orders/${orderId}`}
                              className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-violet-400/20
                                bg-violet-500/10
                                px-4
                                py-2.5
                                text-xs
                                font-bold
                                text-violet-200
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:bg-violet-500/20
                                hover:border-violet-400/30
                              "
                            >
                              View Details
                              <span>
                                →
                              </span>
                            </Link>
                          )}

                          {/* Cancel */}

                          {canCancel &&
                            orderId && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCancelOrder(
                                    orderId
                                  )
                                }
                                className="
                                  inline-flex
                                  items-center
                                  justify-center
                                  rounded-xl
                                  border
                                  border-red-400/15
                                  bg-red-500/5
                                  px-4
                                  py-2.5
                                  text-xs
                                  font-bold
                                  text-red-300/80
                                  transition-all
                                  duration-300
                                  hover:-translate-y-0.5
                                  hover:border-red-400/25
                                  hover:bg-red-500/10
                                  hover:text-red-200
                                "
                              >
                                Cancel
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===================================================
            BOTTOM INFO
        ==================================================== */}

        {orders.length > 0 && (
          <div
            className="
              mt-8
              flex
              flex-col
              gap-3
              rounded-2xl
              border
              border-violet-400/10
              bg-white/[0.02]
              p-4
              text-center
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:text-left
            "
          >
            <p className="text-xs text-white/30">
              Showing{" "}
              <span className="font-bold text-white/60">
                {orders.length}
              </span>{" "}
              order
              {orders.length !== 1
                ? "s"
                : ""}
            </p>

            <button
              type="button"
              onClick={fetchOrders}
              className="
                text-xs
                font-bold
                text-violet-300/70
                transition-colors
                hover:text-violet-200
              "
            >
              ↻ Refresh Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
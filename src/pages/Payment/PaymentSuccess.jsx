import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  const { accessToken, isAuthenticated } =
    useAuthStore();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Verifying your payment..."
  );
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId =
        searchParams.get("session_id");

      const urlOrderId =
        searchParams.get("orderId");

      setOrderId(urlOrderId || "");

      if (!sessionId) {
        setStatus("error");
        setMessage(
          "Stripe session ID is missing."
        );
        return;
      }

      if (!isAuthenticated || !accessToken) {
        setStatus("error");
        setMessage(
          "Please login again to verify your payment."
        );
        return;
      }

      try {
        const response = await api.get(
          `/payments/verify/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data?.success) {
          setStatus("success");

          setMessage(
            "Your payment has been verified successfully."
          );

          if (response.data.orderId) {
            setOrderId(
              response.data.orderId
            );
          }
        } else {
          setStatus("error");

          setMessage(
            response.data?.message ||
              "Payment verification failed."
          );
        }
      } catch (error) {
        console.error(
          "Payment verification error:",
          error
        );

        setStatus("error");

        setMessage(
          error.response?.data?.message ||
            "Unable to verify your payment."
        );
      }
    };

    verifyPayment();
  }, [
    accessToken,
    isAuthenticated,
    searchParams,
  ]);

  // ==========================================
  // VERIFYING UI
  // ==========================================

  if (status === "verifying") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-lg rounded-3xl border border-purple-500/20 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />

          <h1 className="text-2xl font-bold text-white">
            Verifying Payment
          </h1>

          <p className="mt-3 text-slate-400">
            Please wait while we confirm your
            Stripe payment.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // SUCCESS UI
  // ==========================================

  if (status === "success") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950 px-4 py-12">
        <div className="w-full max-w-2xl rounded-3xl border border-emerald-500/20 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-4xl">
            ✓
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Payment Successful
          </p>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Thank You For Your Order!
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            {message}
          </p>

          {orderId && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Order ID
              </p>

              <p className="mt-1 break-all text-sm font-medium text-purple-300">
                {orderId}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/orders"
              className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-500"
            >
              View My Orders
            </Link>

            <Link
              to="/products"
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR UI
  // ==========================================

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-red-500/20 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-4xl">
          !
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
          Payment Verification Failed
        </p>

        <h1 className="text-3xl font-bold text-white">
          Something Went Wrong
        </h1>

        <p className="mt-4 text-slate-400">
          {message}
        </p>

        {orderId && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Order ID
            </p>

            <p className="mt-1 break-all text-sm text-purple-300">
              {orderId}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/orders"
            className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-500"
          >
            Check My Orders
          </Link>

          <Link
            to="/"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
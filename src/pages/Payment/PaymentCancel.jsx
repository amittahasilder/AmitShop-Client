import { Link, useSearchParams } from "react-router-dom";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-amber-500/20 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">

        {/* ICON */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-4xl">
          !
        </div>

        {/* LABEL */}
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
          Payment Cancelled
        </p>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Payment Was Cancelled
        </h1>

        {/* MESSAGE */}
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Your Stripe payment was cancelled or
          you returned from the checkout page
          without completing the payment.
        </p>

        {/* ORDER ID */}
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

        {/* ACTIONS */}
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

export default PaymentCancel;
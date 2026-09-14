import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const Profile = () => {
  const navigate = useNavigate();

  const {
    user,
    logout,
    isLoading,
  } = useAuthStore();

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);

    await logout();

    navigate("/login");
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[#05020b] px-5 pb-20 pt-36 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-violet-400/10 bg-white/[0.025] p-10 text-center backdrop-blur-xl">
            <h1 className="text-3xl font-black">
              Please Login
            </h1>

            <button
              onClick={() => navigate("/login")}
              className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-bold"
            >
              Go to Login
            </button>
          </div>
        </div>
      </main>
    );
  }

  const initials =
    user.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-[#05020b] px-4 pb-20 pt-32 text-white sm:px-6 md:pt-40">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-400/60">
            AmitShop Account
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            My Profile
          </h1>

          <p className="mt-3 text-sm text-white/40">
            Manage your AmitShop account and personal information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-[30px] border border-violet-400/15 bg-gradient-to-br from-[#16082b]/90 via-[#0b0615]/95 to-[#180820]/90 shadow-[0_30px_100px_rgba(76,29,149,0.25)] backdrop-blur-3xl">

          {/* Top Gradient */}
          <div className="h-32 bg-gradient-to-r from-violet-600/30 via-purple-600/20 to-fuchsia-600/30" />

          <div className="relative px-6 pb-8 sm:px-10">

            {/* Avatar */}
            <div className="-mt-16 flex flex-col items-start sm:flex-row sm:items-end sm:justify-between">

              <div className="flex flex-col items-start sm:flex-row sm:items-end">

                <div className="flex h-28 w-28 items-center justify-center rounded-[28px] border-4 border-[#0b0615] bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 text-3xl font-black text-white shadow-[0_15px_50px_rgba(139,92,246,0.45)]">
                  {initials}
                </div>

                <div className="mt-4 sm:ml-5 sm:mt-0">
                  <h2 className="text-2xl font-black">
                    {user.name}
                  </h2>

                  <p className="mt-1 text-sm text-white/40">
                    {user.email}
                  </p>

                  <div className="mt-3 inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-300">
                    {user.role || "customer"}
                  </div>
                </div>

              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut || isLoading}
                className="mt-6 rounded-xl border border-red-400/15 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>

            </div>

            {/* Account Information */}
            <div className="mt-10">

              <h3 className="text-lg font-black">
                Account Information
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                {/* Name */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition-all duration-300 hover:border-violet-400/15 hover:bg-violet-500/[0.04]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Full Name
                  </p>

                  <p className="mt-2 text-base font-bold text-white/85">
                    {user.name || "Not available"}
                  </p>
                </div>

                {/* Email */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition-all duration-300 hover:border-violet-400/15 hover:bg-violet-500/[0.04]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Email Address
                  </p>

                  <p className="mt-2 break-all text-base font-bold text-white/85">
                    {user.email || "Not available"}
                  </p>
                </div>

                {/* Role */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition-all duration-300 hover:border-violet-400/15 hover:bg-violet-500/[0.04]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Account Role
                  </p>

                  <p className="mt-2 text-base font-bold capitalize text-white/85">
                    {user.role || "Customer"}
                  </p>
                </div>

                {/* Account Status */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition-all duration-300 hover:border-violet-400/15 hover:bg-violet-500/[0.04]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Account Status
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />

                    <span className="text-base font-bold text-emerald-300">
                      Active
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-10">

              <h3 className="text-lg font-black">
                Quick Actions
              </h3>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">

                <button
                  type="button"
                  onClick={() => navigate("/orders")}
                  className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-violet-500/[0.05]"
                >
                  <span className="text-2xl">📦</span>

                  <p className="mt-3 font-bold">
                    My Orders
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    View your orders
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/wishlist")}
                  className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-pink-400/20 hover:bg-pink-500/[0.05]"
                >
                  <span className="text-2xl">♡</span>

                  <p className="mt-3 font-bold">
                    Wishlist
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    View saved products
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-violet-500/[0.05]"
                >
                  <span className="text-2xl">🛒</span>

                  <p className="mt-3 font-bold">
                    Shopping Cart
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    Continue shopping
                  </p>
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
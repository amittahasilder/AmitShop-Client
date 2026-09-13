import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    isAuthenticated,
    isLoading,
  } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // REDIRECT IF ALREADY LOGGED IN
  // =========================================================

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message || "Login failed.");
      return;
    }

    setSuccess("Login successful! Redirecting...");

    // ---------------------------------------------------------
    // If user came from another protected page,
    // return them there.
    // Otherwise go to home.
    // ---------------------------------------------------------

    const redirectPath = location.state?.from || "/";

    setTimeout(() => {
      navigate(redirectPath, { replace: true });
    }, 700);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05020b] px-5 pb-20 pt-32 text-white">

      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />

        <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />

        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[120px]" />

      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-180px)] max-w-6xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_30px_120px_rgba(124,58,237,0.15)] backdrop-blur-2xl lg:grid-cols-2">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <section className="relative hidden min-h-[650px] overflow-hidden border-r border-white/10 lg:block">

            {/* Decorative circles */}

            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/10" />

            <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/10" />

            <div className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-2xl" />

            {/* Floating cards */}

            <div className="absolute left-12 top-16 animate-pulse rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                Premium
              </p>

              <p className="mt-1 text-sm font-bold text-white">
                Shopping Experience
              </p>
            </div>

            <div className="absolute bottom-20 right-10 rounded-2xl border border-violet-400/20 bg-violet-500/10 px-5 py-4 backdrop-blur-xl">
              <p className="text-xs text-violet-300">
                AmitShop
              </p>

              <p className="mt-1 text-sm font-bold">
                Everything you love.
              </p>
            </div>

            {/* Center content */}

            <div className="absolute inset-0 flex items-center justify-center p-12">

              <div className="relative text-center">

                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 shadow-[0_0_60px_rgba(139,92,246,0.2)]">

                  <span className="text-4xl font-black text-white">
                    A
                  </span>

                </div>

                <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-400">
                  Welcome Back
                </p>

                <h2 className="mt-4 text-4xl font-black tracking-tight xl:text-5xl">
                  Enter the
                  <br />
                  <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                    AmitShop
                  </span>
                  <br />
                  experience.
                </h2>

                <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-white/35">
                  Sign in to access your products, wishlist,
                  orders and personalized shopping experience.
                </p>

              </div>

            </div>

          </section>

          {/* =================================================
              RIGHT SIDE — LOGIN FORM
          ================================================= */}

          <section className="flex min-h-[650px] items-center justify-center p-6 sm:p-10 lg:p-14">

            <div className="w-full max-w-md">

              {/* Header */}

              <div className="mb-9">

                <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-400">
                  AmitShop
                </p>

                <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                  Sign in
                </h1>

                <p className="mt-3 text-sm leading-6 text-white/35">
                  Welcome back. Enter your account details
                  to continue.
                </p>

              </div>

              {/* Error */}

              {error && (
                <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Success */}

              {success && (
                <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  {success}
                </div>
              )}

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-white/70"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50 focus:bg-violet-500/[0.04] focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                </div>

                {/* PASSWORD */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-white/70"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-violet-400 transition hover:text-violet-300"
                    >
                      Forgot password?
                    </button>

                  </div>

                  <div className="relative">

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 pr-14 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50 focus:bg-violet-500/[0.04] focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          width="21"
                          height="21"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.7a2 2 0 102.8 2.8" />
                          <path d="M9.9 5.2A10.8 10.8 0 0112 5c5.5 0 9 7 9 7a17.4 17.4 0 01-3.2 4.1" />
                          <path d="M6.6 6.6C4.2 8.3 3 12 3 12s3.5 7 9 7c1.3 0 2.5-.3 3.5-.8" />
                        </svg>
                      ) : (
                        <svg
                          width="21"
                          height="21"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                          <circle
                            cx="12"
                            cy="12"
                            r="2.5"
                          />
                        </svg>
                      )}
                    </button>

                  </div>

                </div>

                {/* REMEMBER */}

                <label className="flex cursor-pointer items-center gap-3 text-sm text-white/40">

                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/10 bg-white/5 accent-violet-500"
                  />

                  Remember me

                </label>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative mt-2 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-5 py-4 text-sm font-bold text-white shadow-[0_15px_40px_rgba(124,58,237,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(124,58,237,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <span className="relative z-10 flex items-center justify-center gap-3">

                    {isLoading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In

                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </>
                    )}

                  </span>

                </button>

              </form>

              {/* DIVIDER */}

              <div className="my-8 flex items-center gap-4">

                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs text-white/20">
                  OR
                </span>

                <div className="h-px flex-1 bg-white/10" />

              </div>

              {/* REGISTER */}

              <p className="text-center text-sm text-white/35">

                Don't have an account?

                <Link
                  to="/register"
                  className="ml-2 font-bold text-violet-400 transition hover:text-violet-300"
                >
                  Create Account
                </Link>

              </p>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
};

export default Login;
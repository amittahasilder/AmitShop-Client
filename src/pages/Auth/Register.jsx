import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const Register = () => {
  const navigate = useNavigate();

  const {
    isAuthenticated,
    setAuth,
  } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // =========================================================
  // REDIRECT IF ALREADY LOGGED IN
  // =========================================================

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // =========================================================
  // HANDLE CHANGE
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
  // PASSWORD STRENGTH
  // =========================================================

  const getPasswordStrength = () => {
    const password = formData.password;

    if (!password) {
      return {
        label: "",
        width: "0%",
      };
    }

    if (password.length < 6) {
      return {
        label: "Weak",
        width: "25%",
      };
    }

    if (
      password.length >= 6 &&
      password.length < 8
    ) {
      return {
        label: "Medium",
        width: "60%",
      };
    }

    return {
      label: "Strong",
      width: "100%",
    };
  };

  const passwordStrength = getPasswordStrength();

  // =========================================================
  // REGISTER
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword =
      formData.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (name.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Registration failed."
        );

        setIsLoading(false);
        return;
      }

      // =====================================================
      // BACKEND RESPONSE
      // =====================================================

      const user = response.data.user;
      const accessToken =
        response.data.accessToken;

      if (user && accessToken) {
        setAuth(user, accessToken);
      }

      setSuccess(
        "Account created successfully!"
      );

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 700);

    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05020b] px-5 pb-20 pt-32 text-white">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />

        <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />

        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[120px]" />

      </div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-180px)] max-w-6xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_30px_120px_rgba(124,58,237,0.15)] backdrop-blur-2xl lg:grid-cols-2">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <section className="relative hidden min-h-[720px] overflow-hidden border-r border-white/10 lg:block">

            <div className="absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/10" />

            <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/10" />

            <div className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-2xl" />

            {/* Floating card */}

            <div className="absolute left-10 top-16 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur-xl">

              <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                New Member
              </p>

              <p className="mt-1 text-sm font-bold text-white">
                Join AmitShop
              </p>

            </div>

            <div className="absolute bottom-16 right-10 rounded-2xl border border-violet-400/20 bg-violet-500/10 px-5 py-4 backdrop-blur-xl">

              <p className="text-xs text-violet-300">
                Premium Access
              </p>

              <p className="mt-1 text-sm font-bold">
                Shop smarter.
              </p>

            </div>

            {/* Center */}

            <div className="absolute inset-0 flex items-center justify-center p-12">

              <div className="relative text-center">

                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 shadow-[0_0_60px_rgba(139,92,246,0.2)]">

                  <span className="text-4xl font-black">
                    A
                  </span>

                </div>

                <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-400">
                  Create Your Account
                </p>

                <h2 className="mt-4 text-4xl font-black tracking-tight xl:text-5xl">

                  Start your
                  <br />

                  <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                    AmitShop
                  </span>

                  <br />

                  journey.

                </h2>

                <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-white/35">

                  Create your account and unlock a
                  premium shopping experience with
                  personalized products, wishlist and orders.

                </p>

              </div>

            </div>

          </section>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <section className="flex min-h-[720px] items-center justify-center p-6 sm:p-10 lg:p-14">

            <div className="w-full max-w-md">

              {/* Header */}

              <div className="mb-8">

                <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-400">
                  AmitShop
                </p>

                <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                  Create account
                </h1>

                <p className="mt-3 text-sm leading-6 text-white/35">
                  Join AmitShop and start your premium
                  shopping experience.
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
                className="space-y-4"
              >

                {/* NAME */}

                <div>

                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-white/70"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50 focus:bg-violet-500/[0.04] focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                </div>

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

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-white/70"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 pr-14 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50 focus:bg-violet-500/[0.04] focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-white/35 hover:text-white"
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                  {/* PASSWORD STRENGTH */}

                  {formData.password && (
                    <div className="mt-3">

                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">

                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
                          style={{
                            width:
                              passwordStrength.width,
                          }}
                        />

                      </div>

                      <p className="mt-2 text-xs text-white/30">
                        Password strength:{" "}
                        <span className="text-violet-400">
                          {passwordStrength.label}
                        </span>
                      </p>

                    </div>
                  )}

                </div>

                {/* CONFIRM PASSWORD */}

                <div>

                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-white/70"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      value={
                        formData.confirmPassword
                      }
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 pr-14 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50 focus:bg-violet-500/[0.04] focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-white/35 hover:text-white"
                    >
                      {showConfirmPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                </div>

                {/* TERMS */}

                <label className="flex cursor-pointer items-start gap-3 pt-1 text-xs leading-5 text-white/30">

                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 accent-violet-500"
                  />

                  <span>
                    I agree to AmitShop's{" "}
                    <button
                      type="button"
                      className="font-semibold text-violet-400 hover:text-violet-300"
                    >
                      Terms & Conditions
                    </button>
                    .
                  </span>

                </label>

                {/* REGISTER BUTTON */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative mt-2 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-5 py-4 text-sm font-bold text-white shadow-[0_15px_40px_rgba(124,58,237,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(124,58,237,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <span className="relative z-10 flex items-center justify-center gap-3">

                    {isLoading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account

                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </>
                    )}

                  </span>

                </button>

              </form>

              {/* LOGIN LINK */}

              <p className="mt-8 text-center text-sm text-white/35">

                Already have an account?

                <Link
                  to="/login"
                  className="ml-2 font-bold text-violet-400 transition hover:text-violet-300"
                >
                  Sign In
                </Link>

              </p>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
};

export default Register;
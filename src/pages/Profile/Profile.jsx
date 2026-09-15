import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import api from "../../api/axios";

const Profile = () => {
  const navigate = useNavigate();

  const {
    user,
    logout,
    isLoading,
    getCurrentUser,
  } = useAuthStore();

  const [loggingOut, setLoggingOut] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    postalCode: user?.postalCode || "",
    country: user?.country || "",
  });

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await logout();

      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      setLoggingOut(false);
    }
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  // ==========================================
  // EDIT PROFILE
  // ==========================================

  const handleEdit = () => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      postalCode: user?.postalCode || "",
      country: user?.country || "",
    });

    setEditing(true);
    setSuccessMessage("");
    setErrorMessage("");
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      postalCode: user?.postalCode || "",
      country: user?.country || "",
    });

    setEditing(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await api.put("/users/profile", form);

      if (response.data.success) {
        setSuccessMessage(
          response.data.message || "Profile updated successfully"
        );

        setEditing(false);

        await getCurrentUser();
      }
    } catch (error) {
      console.error("Profile Update Error:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // UPLOAD PROFILE AVATAR
  // ==========================================

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // ======================================
    // CLIENT-SIDE VALIDATION
    // ======================================

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 5MB.");
      return;
    }

    setUploadingAvatar(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const formData = new FormData();

      formData.append("avatar", file);

      const response = await api.post(
        "/users/profile/avatar",
        formData
      );

      if (response.data.success) {
        setSuccessMessage(
          response.data.message ||
            "Profile picture uploaded successfully"
        );

        // Refresh user data so avatar updates everywhere
        await getCurrentUser();
      }
    } catch (error) {
      console.error("Avatar Upload Error:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to upload profile picture. Please try again."
      );
    } finally {
      setUploadingAvatar(false);

      // Allow selecting the same file again
      e.target.value = "";
    }
  };

  // ==========================================
  // LOGIN FALLBACK
  // ==========================================

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
              className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-bold transition-all hover:-translate-y-0.5"
            >
              Go to Login
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // INITIALS
  // ==========================================

  const initials =
    user.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const isSeller = user.role === "seller";

  return (
    <main className="min-h-screen bg-[#05020b] px-4 pb-20 pt-32 text-white sm:px-6 md:pt-40">
      <div className="mx-auto max-w-5xl">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-400/60">
            AmitShop Account
          </p>

          <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                My Profile
              </h1>

              <p className="mt-3 text-sm text-white/40">
                Manage your AmitShop account and personal information.
              </p>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={handleEdit}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-bold shadow-[0_10px_30px_rgba(139,92,246,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(139,92,246,0.35)]"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* =====================================
            SUCCESS MESSAGE
        ====================================== */}

        {successMessage && (
          <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-300">
            ✓ {successMessage}
          </div>
        )}

        {/* =====================================
            ERROR MESSAGE
        ====================================== */}

        {errorMessage && (
          <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-300">
            ⚠ {errorMessage}
          </div>
        )}

        {/* =====================================
            MAIN PROFILE CARD
        ====================================== */}

        <div className="overflow-hidden rounded-[30px] border border-violet-400/15 bg-gradient-to-br from-[#16082b]/90 via-[#0b0615]/95 to-[#180820]/90 shadow-[0_30px_100px_rgba(76,29,149,0.25)] backdrop-blur-3xl">

          {/* Gradient Header */}
          <div className="h-32 bg-gradient-to-r from-violet-600/30 via-purple-600/20 to-fuchsia-600/30" />

          <div className="relative px-6 pb-8 sm:px-10">

            {/* ===================================
                PROFILE HEADER
            ==================================== */}

            <div className="-mt-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">

              <div className="flex flex-col items-start sm:flex-row sm:items-end">

                {/* =================================
                    AVATAR
                ================================== */}

                <div className="relative">

                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border-4 border-[#0b0615] bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 text-3xl font-black text-white shadow-[0_15px_50px_rgba(139,92,246,0.45)]">

                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.name || "User"} profile`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}

                    {/* Upload Loading Overlay */}
                    {uploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-[24px] bg-black/70 backdrop-blur-sm">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      </div>
                    )}
                  </div>

                  {/* Camera Button */}

                  <label
                    htmlFor="avatar-upload"
                    className={`absolute -bottom-2 -right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-4 border-[#0b0615] bg-gradient-to-r from-violet-600 to-fuchsia-600 text-lg shadow-[0_8px_25px_rgba(139,92,246,0.45)] transition-all duration-300 hover:scale-110 ${
                      uploadingAvatar
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                    title="Change profile picture"
                  >
                    📷
                  </label>

                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="hidden"
                  />
                </div>

                {/* =================================
                    USER INFO
                ================================== */}

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

                  <p className="mt-3 text-xs text-white/25">
                    Click 📷 to change profile picture
                  </p>

                </div>
              </div>

              {/* =================================
                  LOGOUT
              ================================== */}

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut || isLoading}
                className="rounded-xl border border-red-400/15 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>

            </div>

            {/* =====================================
                EDIT FORM
            ====================================== */}

            {editing ? (
              <form
                onSubmit={handleSave}
                className="mt-10"
              >
                <div className="mb-5">
                  <h3 className="text-lg font-black">
                    Edit Profile
                  </h3>

                  <p className="mt-1 text-sm text-white/35">
                    Update your personal information.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/40 focus:bg-violet-500/[0.05]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="w-full cursor-not-allowed rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3.5 text-sm text-white/35 outline-none"
                    />

                    <p className="mt-2 text-[11px] text-white/20">
                      Email cannot be changed here.
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                      Phone
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/40 focus:bg-violet-500/[0.05]"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                      Country
                    </label>

                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="Enter country"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/40 focus:bg-violet-500/[0.05]"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/40 focus:bg-violet-500/[0.05]"
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                      Postal Code
                    </label>

                    <input
                      type="text"
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleChange}
                      placeholder="Enter postal code"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/40 focus:bg-violet-500/[0.05]"
                    />
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                      Address
                    </label>

                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Enter your full address"
                      rows={4}
                      className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/40 focus:bg-violet-500/[0.05]"
                    />
                  </div>

                </div>

                {/* Form Actions */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-bold text-white/70 transition-all hover:bg-white/[0.06] disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3 text-sm font-bold shadow-[0_10px_30px_rgba(139,92,246,0.25)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                </div>
              </form>
            ) : (
              <>
                {/* =================================
                    ACCOUNT INFORMATION
                ================================== */}

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

                    {/* Phone */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition-all duration-300 hover:border-violet-400/15 hover:bg-violet-500/[0.04]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                        Phone
                      </p>

                      <p className="mt-2 text-base font-bold text-white/85">
                        {user.phone || "Not added"}
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

                    {/* Address */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition-all duration-300 hover:border-violet-400/15 hover:bg-violet-500/[0.04]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                        Address
                      </p>

                      <p className="mt-2 text-base font-bold text-white/85">
                        {user.address || "Not added"}
                      </p>
                    </div>

                    {/* Location */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition-all duration-300 hover:border-violet-400/15 hover:bg-violet-500/[0.04]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                        Location
                      </p>

                      <p className="mt-2 text-base font-bold text-white/85">
                        {[user.city, user.country]
                          .filter(Boolean)
                          .join(", ") || "Not added"}
                      </p>
                    </div>

                    {/* Postal Code */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition-all duration-300 hover:border-violet-400/15 hover:bg-violet-500/[0.04]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                        Postal Code
                      </p>

                      <p className="mt-2 text-base font-bold text-white/85">
                        {user.postalCode || "Not added"}
                      </p>
                    </div>

                    {/* Status */}
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

                    {/* Seller Badge */}
                    {isSeller && (
                      <div className="rounded-2xl border border-fuchsia-400/15 bg-fuchsia-500/[0.05] p-5">

                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-fuchsia-300/50">
                          Seller Account
                        </p>

                        <p className="mt-2 text-base font-black text-fuchsia-300">
                          🏪 Seller
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                          Your seller profile and shop tools are available.
                        </p>

                      </div>
                    )}

                  </div>
                </div>

                {/* =================================
                    QUICK ACTIONS
                ================================== */}

                <div className="mt-10">

                  <h3 className="text-lg font-black">
                    Quick Actions
                  </h3>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">

                    {/* Orders */}
                    <button
                      type="button"
                      onClick={() => navigate("/orders")}
                      className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-violet-500/[0.05]"
                    >
                      <span className="text-2xl">
                        📦
                      </span>

                      <p className="mt-3 font-bold">
                        My Orders
                      </p>

                      <p className="mt-1 text-xs text-white/30">
                        View your orders
                      </p>
                    </button>

                    {/* Wishlist */}
                    <button
                      type="button"
                      onClick={() => navigate("/wishlist")}
                      className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-pink-400/20 hover:bg-pink-500/[0.05]"
                    >
                      <span className="text-2xl">
                        ♡
                      </span>

                      <p className="mt-3 font-bold">
                        Wishlist
                      </p>

                      <p className="mt-1 text-xs text-white/30">
                        View saved products
                      </p>
                    </button>

                    {/* Cart */}
                    <button
                      type="button"
                      onClick={() => navigate("/cart")}
                      className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-violet-500/[0.05]"
                    >
                      <span className="text-2xl">
                        🛒
                      </span>

                      <p className="mt-3 font-bold">
                        Shopping Cart
                      </p>

                      <p className="mt-1 text-xs text-white/30">
                        Continue shopping
                      </p>
                    </button>

                  </div>
                </div>

                {/* =================================
                    SELLER CENTER
                ================================== */}

                {isSeller && (
                  <div className="mt-10 rounded-3xl border border-fuchsia-400/15 bg-gradient-to-br from-fuchsia-500/[0.07] to-violet-500/[0.04] p-6">

                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-fuchsia-300/60">
                      Seller Center
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                      Grow your AmitShop store
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                      Manage your products and seller tools from your
                      seller dashboard.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/products/manage")}
                      className="mt-5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5"
                    >
                      Manage Products →
                    </button>

                  </div>
                )}

              </>
            )}

          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
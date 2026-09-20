import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

// =============================================================
// DEFAULT SETTINGS
// =============================================================

const DEFAULT_SETTINGS = {
  storeName: "AmitShop",
  storeEmail: "amitshop.test@gmail.com",
  storePhone: "",
  currency: "USD",
  taxRate: 0,
  freeShipping: false,
  lowStockAlert: true,
  emailNotifications: true,
  orderNotifications: true,
  maintenanceMode: false,
  allowReviews: true,
  autoApproveProducts: false,
};

// =============================================================
// ADMIN SETTINGS
// =============================================================

const AdminSettings = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
  } = useAuthStore();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD SETTINGS FROM BACKEND
  // =========================================================

  useEffect(() => {
    const fetchSettings = async () => {
      if (!isAuthenticated || user?.role !== "admin" || !accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/settings", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data?.settings) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...response.data.settings,
          });
        }
      } catch (err) {
        console.error("Fetch Admin Settings Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load admin settings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [isAuthenticated, user?.role, accessToken]);

  // =========================================================
  // INPUT HANDLER
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setSaved(false);
    setError("");
  };

  // =========================================================
  // SAVE SETTINGS TO BACKEND
  // =========================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const payload = {
        ...settings,
        taxRate: Number(settings.taxRate),
      };

      const response = await api.put(
        "/admin/settings",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.settings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...response.data.settings,
        });
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error("Update Admin Settings Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save admin settings"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // RESET SETTINGS
  // =========================================================

  const handleReset = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const response = await api.put(
        "/admin/settings",
        {
          ...DEFAULT_SETTINGS,
          taxRate: Number(DEFAULT_SETTINGS.taxRate),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.settings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...response.data.settings,
        });
      } else {
        setSettings(DEFAULT_SETTINGS);
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error("Reset Admin Settings Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to reset admin settings"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // AUTH CHECK
  // =========================================================

  if (!isAuthenticated) {
    return (
      <PageCenter>
        <div className="text-center">
          <div className="text-5xl mb-5">
            🔐
          </div>

          <h1 className="text-2xl font-bold text-white">
            Authentication Required
          </h1>

          <p className="text-gray-400 mt-2">
            Please login to access admin settings.
          </p>
        </div>
      </PageCenter>
    );
  }

  // =========================================================
  // ROLE CHECK
  // =========================================================

  if (user?.role !== "admin") {
    return (
      <PageCenter>
        <div className="text-center">
          <div className="text-5xl mb-5">
            🚫
          </div>

          <h1 className="text-2xl font-bold text-white">
            Access Denied
          </h1>

          <p className="text-gray-400 mt-2">
            Only administrators can access this page.
          </p>

          <Link
            to="/"
            className="inline-flex mt-6 px-6 py-3 rounded-xl
            bg-purple-600 hover:bg-purple-500 text-white
            font-semibold transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </PageCenter>
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <PageCenter>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />

          <p className="text-gray-400 mt-5">
            Loading admin settings...
          </p>
        </div>
      </PageCenter>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#070511] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* =====================================================
          BACKGROUND EFFECTS
      ===================================================== */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl animate-pulse" />

        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl animate-pulse" />

        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-xs font-semibold mb-4">

                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />

                ADMIN CONTROL CENTER

              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight">

                Store{" "}

                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                  Settings
                </span>

              </h1>

              <p className="text-gray-400 mt-3 max-w-2xl">
                Manage AmitShop store configuration, orders,
                notifications, products and system preferences.
              </p>

            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={handleReset}
                disabled={saving}
                className="px-5 py-3 rounded-xl border border-white/10
                bg-white/5 hover:bg-white/10 text-gray-300
                hover:text-white disabled:opacity-50
                transition-all duration-300"
              >
                Reset
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 rounded-xl
                bg-gradient-to-r from-purple-600 to-fuchsia-600
                hover:from-purple-500 hover:to-fuchsia-500
                disabled:opacity-60
                shadow-lg shadow-purple-900/30
                font-semibold transition-all duration-300"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

          {/* =================================================
              SUCCESS MESSAGE
          ================================================= */}

          {saved && (
            <div className="mt-5 px-5 py-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 flex items-center gap-3 animate-[fadeUp_.35s_ease-out]">

              <span className="text-xl">
                ✓
              </span>

              <div>

                <p className="font-semibold">
                  Settings saved successfully
                </p>

                <p className="text-sm text-emerald-400/70">
                  Your AmitShop preferences have been updated.
                </p>

              </div>

            </div>
          )}

          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (
            <div className="mt-5 px-5 py-4 rounded-2xl border border-red-400/20 bg-red-500/10 text-red-300 flex items-center gap-3">

              <span className="text-xl">
                ⚠️
              </span>

              <div>

                <p className="font-semibold">
                  Something went wrong
                </p>

                <p className="text-sm text-red-400/80">
                  {error}
                </p>

              </div>

            </div>
          )}

        </div>

        {/* =====================================================
            SETTINGS GRID
        ===================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* ===================================================
              STORE INFORMATION
          =================================================== */}

          <SettingsCard
            icon="🏪"
            title="Store Information"
            description="Basic information about your online store."
          >

            <InputField
              label="Store Name"
              name="storeName"
              value={settings.storeName}
              onChange={handleChange}
              placeholder="AmitShop"
            />

            <InputField
              label="Store Email"
              name="storeEmail"
              type="email"
              value={settings.storeEmail}
              onChange={handleChange}
              placeholder="store@example.com"
            />

            <InputField
              label="Store Phone"
              name="storePhone"
              value={settings.storePhone}
              onChange={handleChange}
              placeholder="+880 1XXXXXXXXX"
            />

          </SettingsCard>

          {/* ===================================================
              PAYMENT & TAX
          =================================================== */}

          <SettingsCard
            icon="💳"
            title="Payment & Tax"
            description="Configure currency and store tax preferences."
          >

            <SelectField
              label="Currency"
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              options={[
                {
                  value: "USD",
                  label: "USD — US Dollar",
                },
                {
                  value: "BDT",
                  label: "BDT — Bangladeshi Taka",
                },
                {
                  value: "EUR",
                  label: "EUR — Euro",
                },
                {
                  value: "GBP",
                  label: "GBP — British Pound",
                },
              ]}
            />

            <InputField
              label="Tax Rate (%)"
              name="taxRate"
              type="number"
              min="0"
              max="100"
              value={settings.taxRate}
              onChange={handleChange}
              placeholder="0"
            />

          </SettingsCard>

          {/* ===================================================
              ORDER SETTINGS
          =================================================== */}

          <SettingsCard
            icon="📦"
            title="Order Settings"
            description="Control order and shipping behaviour."
          >

            <Toggle
              label="Free Shipping"
              description="Enable free shipping for all orders."
              name="freeShipping"
              checked={settings.freeShipping}
              onChange={handleChange}
            />

            <Toggle
              label="Low Stock Alerts"
              description="Notify admins when products have low stock."
              name="lowStockAlert"
              checked={settings.lowStockAlert}
              onChange={handleChange}
            />

            <Toggle
              label="Order Notifications"
              description="Receive notifications for new orders."
              name="orderNotifications"
              checked={settings.orderNotifications}
              onChange={handleChange}
            />

          </SettingsCard>

          {/* ===================================================
              PRODUCT SETTINGS
          =================================================== */}

          <SettingsCard
            icon="🛍️"
            title="Product Settings"
            description="Manage product review and approval behaviour."
          >

            <Toggle
              label="Allow Reviews"
              description="Allow customers to review products."
              name="allowReviews"
              checked={settings.allowReviews}
              onChange={handleChange}
            />

            <Toggle
              label="Auto Approve Products"
              description="Automatically approve seller products."
              name="autoApproveProducts"
              checked={settings.autoApproveProducts}
              onChange={handleChange}
            />

          </SettingsCard>

          {/* ===================================================
              NOTIFICATIONS
          =================================================== */}

          <SettingsCard
            icon="🔔"
            title="Notifications"
            description="Control store notification preferences."
          >

            <Toggle
              label="Email Notifications"
              description="Enable store email notifications."
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
            />

            <Toggle
              label="Order Notifications"
              description="Notify the admin about incoming orders."
              name="orderNotifications"
              checked={settings.orderNotifications}
              onChange={handleChange}
            />

          </SettingsCard>

          {/* ===================================================
              SYSTEM
          =================================================== */}

          <SettingsCard
            icon="⚙️"
            title="System"
            description="Important system-level controls."
          >

            <Toggle
              label="Maintenance Mode"
              description="Temporarily disable customer access to the store."
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              danger
            />

            <div className="mt-5 p-4 rounded-xl bg-yellow-500/5 border border-yellow-400/10">

              <div className="flex gap-3">

                <span className="text-xl">
                  ⚠️
                </span>

                <div>

                  <p className="text-sm font-semibold text-yellow-300">
                    Important
                  </p>

                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Maintenance mode should only be enabled when
                    performing major store updates or maintenance.
                  </p>

                </div>

              </div>

            </div>

          </SettingsCard>

        </div>

        {/* =====================================================
            QUICK ADMIN LINKS
        ===================================================== */}

        <div className="mt-8">

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-xl font-bold">
                  Quick Admin Access
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Jump directly to important admin modules.
                </p>

              </div>

              <span className="text-2xl">
                ⚡
              </span>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

              <QuickLink
                to="/admin/dashboard"
                icon="📊"
                label="Dashboard"
              />

              <QuickLink
                to="/admin/users"
                icon="👥"
                label="Users"
              />

              <QuickLink
                to="/admin/products"
                icon="🛍️"
                label="Products"
              />

              <QuickLink
                to="/admin/orders"
                icon="📦"
                label="Orders"
              />

            </div>

          </div>

        </div>

      </div>

      {/* =======================================================
          ANIMATIONS
      ======================================================= */}

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
};

// =============================================================
// SETTINGS CARD
// =============================================================

const SettingsCard = ({
  icon,
  title,
  description,
  children,
}) => {
  return (
    <div
      className="group rounded-3xl border border-white/10
      bg-white/[0.035] backdrop-blur-xl p-6
      hover:bg-white/[0.055]
      hover:border-purple-400/20
      transition-all duration-500
      shadow-2xl shadow-black/20"
    >

      <div className="flex items-start gap-4 mb-6">

        <div
          className="w-12 h-12 rounded-2xl
          bg-gradient-to-br from-purple-600/20 to-fuchsia-600/10
          border border-purple-400/20
          flex items-center justify-center text-xl
          group-hover:scale-110
          transition-transform duration-500"
        >
          {icon}
        </div>

        <div>

          <h2 className="text-lg font-bold text-white">
            {title}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>

        </div>

      </div>

      <div className="space-y-5">
        {children}
      </div>

    </div>
  );
};

// =============================================================
// INPUT FIELD
// =============================================================

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  max,
}) => {
  return (
    <div>

      <label className="block text-sm font-semibold text-gray-300 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full px-4 py-3 rounded-xl
        bg-black/20 border border-white/10
        text-white placeholder:text-gray-600
        outline-none
        focus:border-purple-500/60
        focus:ring-2 focus:ring-purple-500/10
        transition-all duration-300"
      />

    </div>
  );
};

// =============================================================
// SELECT FIELD
// =============================================================

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
}) => {
  return (
    <div>

      <label className="block text-sm font-semibold text-gray-300 mb-2">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl
        bg-[#11101b] border border-white/10
        text-white outline-none
        focus:border-purple-500/60
        transition-all duration-300"
      >

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#11101b]"
          >
            {option.label}
          </option>
        ))}

      </select>

    </div>
  );
};

// =============================================================
// TOGGLE
// =============================================================

const Toggle = ({
  label,
  description,
  name,
  checked,
  onChange,
  danger = false,
}) => {
  return (
    <label className="flex items-center justify-between gap-5 p-4 rounded-2xl bg-white/[0.025] border border-white/5 cursor-pointer hover:bg-white/[0.045] transition-all duration-300">

      <div>

        <p
          className={`text-sm font-semibold ${
            danger
              ? "text-red-300"
              : "text-gray-200"
          }`}
        >
          {label}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          {description}
        </p>

      </div>

      <div className="relative shrink-0">

        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />

        <div
          className={`w-12 h-7 rounded-full
          bg-gray-700 peer-checked:bg-purple-600
          transition-all duration-300
          ${
            danger
              ? "peer-checked:bg-red-600"
              : ""
          }`}
        />

        <div
          className="absolute top-1 left-1 w-5 h-5
          rounded-full bg-white shadow-md
          transition-transform duration-300
          peer-checked:translate-x-5"
        />

      </div>

    </label>
  );
};

// =============================================================
// QUICK LINK
// =============================================================

const QuickLink = ({
  to,
  icon,
  label,
}) => {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 p-4 rounded-2xl
      bg-white/[0.025] border border-white/5
      hover:bg-purple-500/10
      hover:border-purple-400/20
      transition-all duration-300"
    >

      <span className="text-xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </span>

      <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
        {label}
      </span>

    </Link>
  );
};

// =============================================================
// CENTER PAGE
// =============================================================

const PageCenter = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#070511] flex items-center justify-center px-6">
      {children}
    </div>
  );
};

export default AdminSettings;
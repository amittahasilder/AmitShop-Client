import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const ROLE_OPTIONS = ["all", "customer", "seller", "admin"];
const STATUS_OPTIONS = ["all", "active", "inactive"];

const roleStyles = {
  admin: "border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-300",
  seller: "border-violet-400/20 bg-violet-500/10 text-violet-300",
  customer: "border-cyan-400/20 bg-cyan-500/10 text-cyan-300",
};

const AdminUsers = () => {
  const { user, accessToken, isAuthenticated } = useAuthStore();

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("-createdAt");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    role: "customer",
    isActive: true,
  });

  // =========================================================
  // FETCH USERS
  // =========================================================

  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated || !accessToken || user?.role !== "admin") {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("page", pagination.page);
      params.set("limit", pagination.limit);

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (role !== "all") {
        params.set("role", role);
      }

      if (status !== "all") {
        params.set("status", status);
      }

      if (sort) {
        params.set("sort", sort);
      }

      const response = await api.get(`/admin/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseData = response.data?.data || response.data;

      setUsers(responseData?.users || []);

      setPagination((prev) => ({
        ...prev,
        ...(responseData?.pagination || {}),
      }));
    } catch (err) {
      console.error("Admin users fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [
    accessToken,
    isAuthenticated,
    pagination.limit,
    pagination.page,
    role,
    search,
    sort,
    status,
    user?.role,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = (e) => {
    e.preventDefault();

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));

    setSearch(searchInput);
  };

  // =========================================================
  // FILTER CHANGE
  // =========================================================

  const handleRoleChange = (value) => {
    setRole(value);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleStatusChange = (value) => {
    setStatus(value);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleSortChange = (value) => {
    setSort(value);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const openEditModal = (targetUser) => {
    setSelectedUser(targetUser);

    setEditForm({
      name: targetUser.name || "",
      role: targetUser.role || "customer",
      isActive: targetUser.isActive !== false,
    });

    setShowEditModal(true);
    setError("");
    setSuccess("");
  };

  const closeEditModal = () => {
    if (actionLoading) return;

    setShowEditModal(false);
    setSelectedUser(null);
  };

  // =========================================================
  // EDIT FORM
  // =========================================================

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // UPDATE USER
  // =========================================================

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      setActionLoading(`edit-${selectedUser._id}`);
      setError("");
      setSuccess("");

      const response = await api.put(
        `/admin/users/${selectedUser._id}`,
        {
          name: editForm.name.trim(),
          role: editForm.role,
          isActive: editForm.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const updatedUser =
        response.data?.user ||
        response.data?.data?.user ||
        response.data?.data;

      if (updatedUser?._id) {
        setUsers((prev) =>
          prev.map((item) =>
            item._id === updatedUser._id ? updatedUser : item
          )
        );
      } else {
        await fetchUsers();
      }

      setShowEditModal(false);
      setSelectedUser(null);

      setSuccess("User updated successfully.");
    } catch (err) {
      console.error("Update user error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update user. Please try again."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================================================
  // TOGGLE ACTIVE / INACTIVE
  // =========================================================

  const handleToggleStatus = async (targetUser) => {
    if (targetUser._id === user?._id) {
      setError("You cannot deactivate your own admin account.");
      return;
    }

    const nextStatus = !targetUser.isActive;

    try {
      setActionLoading(`status-${targetUser._id}`);
      setError("");
      setSuccess("");

      const response = await api.put(
        `/admin/users/${targetUser._id}`,
        {
          isActive: nextStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const updatedUser =
        response.data?.user ||
        response.data?.data?.user ||
        response.data?.data;

      if (updatedUser?._id) {
        setUsers((prev) =>
          prev.map((item) =>
            item._id === updatedUser._id ? updatedUser : item
          )
        );
      } else {
        setUsers((prev) =>
          prev.map((item) =>
            item._id === targetUser._id
              ? { ...item, isActive: nextStatus }
              : item
          )
        );
      }

      setSuccess(
        `User ${nextStatus ? "activated" : "deactivated"} successfully.`
      );
    } catch (err) {
      console.error("Toggle user status error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to change user status."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================================================
  // DELETE USER
  // =========================================================

  const handleDeleteUser = async (targetUser) => {
    if (targetUser._id === user?._id) {
      setError("You cannot delete your own admin account.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${targetUser.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(`delete-${targetUser._id}`);
      setError("");
      setSuccess("");

      await api.delete(`/admin/users/${targetUser._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUsers((prev) =>
        prev.filter((item) => item._id !== targetUser._id)
      );

      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, Number(prev.total || 0) - 1),
      }));

      setSuccess("User deleted successfully.");
    } catch (err) {
      console.error("Delete user error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete user."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const goToPage = (page) => {
    if (page < 1 || page > (pagination.pages || 1)) return;

    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  const pageNumbers = useMemo(() => {
    const totalPages = Number(pagination.pages || 1);
    const currentPage = Number(pagination.page || 1);

    const pages = [];

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [pagination.page, pagination.pages]);

  // =========================================================
  // ACCESS DENIED
  // =========================================================

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <main className="min-h-screen bg-[#05020b] px-5 pb-20 pt-36 text-white">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[2rem] border border-red-400/10 bg-white/[0.025] p-10 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-red-400/20 bg-red-500/10 text-3xl">
              🔒
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red-400/70">
              AmitShop Admin
            </p>

            <h1 className="text-4xl font-black tracking-tight">
              Access Denied
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/40">
              Only administrators can manage platform users.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <main className="min-h-screen overflow-hidden bg-[#05020b] px-4 pb-20 pt-32 text-white sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute right-[5%] top-[30%] h-80 w-80 rounded-full bg-fuchsia-600/10 blur-[140px]" />
        <div className="absolute bottom-[5%] left-[35%] h-72 w-72 rounded-full bg-indigo-600/10 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <section className="mb-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/10 bg-violet-500/[0.06] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-violet-300/70">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
                AmitShop Admin
              </div>

              <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                User Management
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/35">
                Manage customers, sellers and administrators from one secure
                control center.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchUsers}
              disabled={loading}
              className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-violet-400/15 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/80 transition hover:border-violet-400/30 hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span
                className={`text-lg ${
                  loading ? "animate-spin" : "group-hover:rotate-180"
                } transition-transform duration-500`}
              >
                ↻
              </span>

              Refresh Users
            </button>
          </div>
        </section>

        {/* =====================================================
            STATS
        ====================================================== */}

        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/20">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Total Users
            </p>

            <p className="mt-3 text-3xl font-black">
              {pagination.total ?? 0}
            </p>

            <p className="mt-2 text-xs text-violet-300/50">
              Platform accounts
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Customers
            </p>

            <p className="mt-3 text-3xl font-black">
              {users.filter((item) => item.role === "customer").length}
            </p>

            <p className="mt-2 text-xs text-cyan-300/50">
              Current page
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/20">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Sellers
            </p>

            <p className="mt-3 text-3xl font-black">
              {users.filter((item) => item.role === "seller").length}
            </p>

            <p className="mt-2 text-xs text-violet-300/50">
              Current page
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Active
            </p>

            <p className="mt-3 text-3xl font-black">
              {users.filter((item) => item.isActive).length}
            </p>

            <p className="mt-2 text-xs text-emerald-300/50">
              Current page
            </p>
          </div>
        </section>

        {/* =====================================================
            ALERTS
        ====================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-500/[0.07] px-5 py-4 text-sm text-red-300">
            <span className="text-lg">⚠</span>

            <div className="flex-1">
              <p className="font-semibold">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-white/30 transition hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.07] px-5 py-4 text-sm text-emerald-300">
            <span className="text-lg">✓</span>

            <div className="flex-1">
              <p className="font-semibold">{success}</p>
            </div>

            <button
              type="button"
              onClick={() => setSuccess("")}
              className="text-white/30 transition hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {/* =====================================================
            FILTER PANEL
        ====================================================== */}

        <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.025] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row">
            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="flex flex-1 gap-2"
            >
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25">
                  ⌕
                </span>

                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by name or email..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/30 focus:bg-violet-500/[0.04]"
                />
              </div>

              <button
                type="submit"
                className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-sm font-black transition hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(124,58,237,0.25)]"
              >
                Search
              </button>
            </form>

            {/* Role */}
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="h-12 rounded-2xl border border-white/10 bg-[#100a19] px-4 text-sm text-white/70 outline-none transition focus:border-violet-400/30"
            >
              {ROLE_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item === "all"
                    ? "All Roles"
                    : item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="h-12 rounded-2xl border border-white/10 bg-[#100a19] px-4 text-sm text-white/70 outline-none transition focus:border-violet-400/30"
            >
              {STATUS_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item === "all"
                    ? "All Status"
                    : item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-12 rounded-2xl border border-white/10 bg-[#100a19] px-4 text-sm text-white/70 outline-none transition focus:border-violet-400/30"
            >
              <option value="-createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
              <option value="name">Name A-Z</option>
              <option value="-name">Name Z-A</option>
            </select>
          </div>
        </section>

        {/* =====================================================
            USER TABLE
        ====================================================== */}

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-7">
            <div>
              <h2 className="text-lg font-black">All Users</h2>

              <p className="mt-1 text-xs text-white/30">
                Page {pagination.page || 1} of {pagination.pages || 1}
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold text-white/40">
              {users.length} shown
            </div>
          </div>

          {loading ? (
            <div className="space-y-4 p-5 sm:p-7">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-2xl bg-white/[0.04]"
                />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-2xl">
                👥
              </div>

              <h3 className="text-xl font-black">
                No users found
              </h3>

              <p className="mt-2 text-sm text-white/30">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-7 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                        User
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                        Role
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                        Status
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                        Joined
                      </th>

                      <th className="px-7 py-4 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((item) => {
                      const isSelf = item._id === user?._id;

                      return (
                        <tr
                          key={item._id}
                          className="border-b border-white/[0.06] transition hover:bg-violet-500/[0.025]"
                        >
                          {/* User */}
                          <td className="px-7 py-5">
                            <div className="flex items-center gap-4">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10">
                                {item.avatar ? (
                                  <img
                                    src={item.avatar}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span className="text-sm font-black text-violet-300">
                                    {(item.name || "U")
                                      .charAt(0)
                                      .toUpperCase()}
                                  </span>
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="truncate text-sm font-bold text-white/90">
                                    {item.name || "Unnamed User"}
                                  </p>

                                  {isSelf && (
                                    <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-fuchsia-300">
                                      You
                                    </span>
                                  )}
                                </div>

                                <p className="mt-1 max-w-[260px] truncate text-xs text-white/30">
                                  {item.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${
                                roleStyles[item.role] ||
                                "border-white/10 bg-white/5 text-white/50"
                              }`}
                            >
                              {item.role}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${
                                item.isActive
                                  ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                                  : "border-red-400/20 bg-red-500/10 text-red-300"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  item.isActive
                                    ? "bg-emerald-400"
                                    : "bg-red-400"
                                }`}
                              />

                              {item.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>

                          {/* Joined */}
                          <td className="px-5 py-5">
                            <p className="text-xs text-white/40">
                              {item.createdAt
                                ? new Date(
                                    item.createdAt
                                  ).toLocaleDateString()
                                : "—"}
                            </p>
                          </td>

                          {/* Actions */}
                          <td className="px-7 py-5">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(item)}
                                className="rounded-xl border border-violet-400/15 bg-violet-500/[0.06] px-3 py-2 text-xs font-bold text-violet-300 transition hover:border-violet-400/30 hover:bg-violet-500/10"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                disabled={
                                  isSelf ||
                                  actionLoading === `status-${item._id}`
                                }
                                onClick={() => handleToggleStatus(item)}
                                className={`rounded-xl border px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-30 ${
                                  item.isActive
                                    ? "border-amber-400/15 bg-amber-500/[0.05] text-amber-300 hover:bg-amber-500/10"
                                    : "border-emerald-400/15 bg-emerald-500/[0.05] text-emerald-300 hover:bg-emerald-500/10"
                                }`}
                              >
                                {actionLoading === `status-${item._id}`
                                  ? "..."
                                  : item.isActive
                                  ? "Disable"
                                  : "Enable"}
                              </button>

                              <button
                                type="button"
                                disabled={
                                  isSelf ||
                                  actionLoading === `delete-${item._id}`
                                }
                                onClick={() => handleDeleteUser(item)}
                                className="rounded-xl border border-red-400/15 bg-red-500/[0.04] px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                {actionLoading === `delete-${item._id}`
                                  ? "..."
                                  : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="space-y-4 p-4 lg:hidden">
                {users.map((item) => {
                  const isSelf = item._id === user?._id;

                  return (
                    <div
                      key={item._id}
                      className="rounded-3xl border border-white/10 bg-black/10 p-5 transition hover:border-violet-400/20"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-violet-400/10 bg-violet-500/10">
                            {item.avatar ? (
                              <img
                                src={item.avatar}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="font-black text-violet-300">
                                {(item.name || "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-bold">
                                {item.name || "Unnamed User"}
                              </p>

                              {isSelf && (
                                <span className="rounded-full bg-fuchsia-500/10 px-2 py-0.5 text-[8px] font-black text-fuchsia-300">
                                  YOU
                                </span>
                              )}
                            </div>

                            <p className="mt-1 truncate text-xs text-white/30">
                              {item.email}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase ${
                            item.isActive
                              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                              : "border-red-400/20 bg-red-500/10 text-red-300"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-[9px] font-black uppercase ${
                            roleStyles[item.role] ||
                            "border-white/10 bg-white/5 text-white/50"
                          }`}
                        >
                          {item.role}
                        </span>

                        <span className="text-[10px] text-white/25">
                          {item.createdAt
                            ? new Date(
                                item.createdAt
                              ).toLocaleDateString()
                            : "—"}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="rounded-xl border border-violet-400/15 bg-violet-500/[0.06] px-3 py-2.5 text-xs font-bold text-violet-300"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => handleToggleStatus(item)}
                          className="rounded-xl border border-amber-400/15 bg-amber-500/[0.04] px-3 py-2.5 text-xs font-bold text-amber-300 disabled:opacity-30"
                        >
                          {item.isActive ? "Disable" : "Enable"}
                        </button>

                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => handleDeleteUser(item)}
                          className="rounded-xl border border-red-400/15 bg-red-500/[0.04] px-3 py-2.5 text-xs font-bold text-red-300 disabled:opacity-30"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ===================================================
              PAGINATION
          ==================================================== */}

          {!loading && users.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 px-5 py-5 sm:flex-row sm:px-7">
              <p className="text-xs text-white/30">
                Showing page{" "}
                <span className="font-bold text-white/60">
                  {pagination.page || 1}
                </span>{" "}
                of{" "}
                <span className="font-bold text-white/60">
                  {pagination.pages || 1}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => goToPage(pagination.page - 1)}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white/50 transition hover:border-violet-400/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                >
                  ←
                </button>

                {pageNumbers.map((pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`h-9 min-w-9 rounded-xl px-3 text-xs font-black transition ${
                      Number(pagination.page) === pageNumber
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_8px_30px_rgba(124,58,237,0.25)]"
                        : "border border-white/10 bg-white/[0.03] text-white/40 hover:border-violet-400/20 hover:text-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => goToPage(pagination.page + 1)}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white/50 transition hover:border-violet-400/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* =======================================================
          EDIT USER MODAL
      ======================================================== */}

      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-md">
          <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-violet-400/15 bg-[#0d0816] shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-400/60">
                  Admin Control
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Edit User
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/40 transition hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6">
              {/* User Info */}
              <div className="mb-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 font-black text-violet-300">
                  {(selectedUser.name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    {selectedUser.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-white/30">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              {/* Name */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/35">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-violet-400/30"
                />
              </div>

              {/* Role */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/35">
                  Role
                </label>

                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  disabled={selectedUser._id === user?._id}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-[#100a19] px-4 text-sm text-white outline-none transition focus:border-violet-400/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>

                {selectedUser._id === user?._id && (
                  <p className="mt-2 text-[10px] text-amber-300/60">
                    Your own admin role cannot be changed here.
                  </p>
                )}
              </div>

              {/* Status */}
              <label
                className={`flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.025] p-4 ${
                  selectedUser._id === user?._id
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                <div>
                  <p className="text-sm font-bold">
                    Account Status
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    {editForm.isActive
                      ? "User can access the platform."
                      : "User access is disabled."}
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="isActive"
                  checked={editForm.isActive}
                  onChange={handleEditChange}
                  disabled={selectedUser._id === user?._id}
                  className="h-5 w-5 accent-violet-600"
                />
              </label>

              {/* Buttons */}
              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={!!actionLoading}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-white/50 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!!actionLoading}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-black transition hover:shadow-[0_10px_40px_rgba(124,58,237,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionLoading === `edit-${selectedUser._id}`
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminUsers;
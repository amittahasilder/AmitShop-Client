import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const STATUS_OPTIONS = ["all", "active", "inactive"];
const STOCK_OPTIONS = ["all", "in-stock", "low-stock", "out-of-stock"];

const AdminProducts = () => {
  const { user, accessToken, isAuthenticated } = useAuthStore();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [stock, setStock] = useState("all");
  const [sort, setSort] = useState("-createdAt");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    brand: "",
    description: "",
  });

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  const fetchProducts = useCallback(async () => {
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

      if (category !== "all") {
        params.set("category", category);
      }

      if (status !== "all") {
        params.set("status", status);
      }

      if (sort) {
        params.set("sort", sort);
      }

      const response = await api.get(
        `/admin/products?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data?.data || response.data;

      let fetchedProducts = data?.products || [];

      // Stock filtering is handled on frontend because
      // backend stock filter may not exist.
      if (stock === "in-stock") {
        fetchedProducts = fetchedProducts.filter(
          (product) => Number(product.stock || 0) > 5
        );
      }

      if (stock === "low-stock") {
        fetchedProducts = fetchedProducts.filter((product) => {
          const currentStock = Number(product.stock || 0);
          return currentStock > 0 && currentStock <= 5;
        });
      }

      if (stock === "out-of-stock") {
        fetchedProducts = fetchedProducts.filter(
          (product) => Number(product.stock || 0) <= 0
        );
      }

      setProducts(fetchedProducts);

      setPagination((prev) => ({
        ...prev,
        ...(data?.pagination || {}),
      }));
    } catch (err) {
      console.error("Admin products fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  }, [
    accessToken,
    category,
    isAuthenticated,
    pagination.limit,
    pagination.page,
    search,
    sort,
    status,
    stock,
    user?.role,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
  // FILTERS
  // =========================================================

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("all");
    setStatus("all");
    setStock("all");
    setSort("-createdAt");

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const changeFilter = (setter) => (value) => {
    setter(value);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const openEditModal = (product) => {
    setSelectedProduct(product);

    setEditForm({
      name: product.name || "",
      price: product.price ?? "",
      discountPrice: product.discountPrice ?? "",
      stock: product.stock ?? "",
      category:
        typeof product.category === "object"
          ? product.category?.name || ""
          : product.category || "",
      brand: product.brand || "",
      description: product.description || "",
    });

    setShowEditModal(true);
    setError("");
    setSuccess("");
  };

  const closeEditModal = () => {
    if (actionLoading) return;

    setShowEditModal(false);
    setSelectedProduct(null);
  };

  // =========================================================
  // EDIT FORM
  // =========================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // UPDATE PRODUCT
  // =========================================================

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!selectedProduct) return;

    try {
      setActionLoading(`edit-${selectedProduct._id}`);
      setError("");
      setSuccess("");

      const payload = {
        name: editForm.name.trim(),
        price: Number(editForm.price),
        discountPrice:
          editForm.discountPrice === ""
            ? 0
            : Number(editForm.discountPrice),
        stock: Number(editForm.stock),
        category: editForm.category.trim(),
        brand: editForm.brand.trim(),
        description: editForm.description.trim(),
      };

      const response = await api.put(
        `/admin/products/${selectedProduct._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const updatedProduct =
        response.data?.product ||
        response.data?.data?.product ||
        response.data?.data;

      if (updatedProduct?._id) {
        setProducts((prev) =>
          prev.map((product) =>
            product._id === updatedProduct._id
              ? updatedProduct
              : product
          )
        );
      } else {
        await fetchProducts();
      }

      setShowEditModal(false);
      setSelectedProduct(null);
      setSuccess("Product updated successfully.");
    } catch (err) {
      console.error("Update product error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update product."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================================================
  // TOGGLE PRODUCT STATUS
  // =========================================================

  const handleToggleStatus = async (product) => {
    const nextStatus = !product.isActive;

    try {
      setActionLoading(`status-${product._id}`);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/admin/products/${product._id}/status`,
        {
          isActive: nextStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const updatedProduct =
        response.data?.product ||
        response.data?.data?.product ||
        response.data?.data;

      if (updatedProduct?._id) {
        setProducts((prev) =>
          prev.map((item) =>
            item._id === updatedProduct._id
              ? updatedProduct
              : item
          )
        );
      } else {
        setProducts((prev) =>
          prev.map((item) =>
            item._id === product._id
              ? { ...item, isActive: nextStatus }
              : item
          )
        );
      }

      setSuccess(
        `Product ${
          nextStatus ? "activated" : "deactivated"
        } successfully.`
      );
    } catch (err) {
      console.error("Product status error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to change product status."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(`delete-${product._id}`);
      setError("");
      setSuccess("");

      await api.delete(
        `/admin/products/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setProducts((prev) =>
        prev.filter((item) => item._id !== product._id)
      );

      setPagination((prev) => ({
        ...prev,
        total: Math.max(
          0,
          Number(prev.total || 0) - 1
        ),
      }));

      setSuccess("Product deleted successfully.");
    } catch (err) {
      console.error("Delete product error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete product."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > Number(pagination.pages || 1)
    ) {
      return;
    }

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
          <div className="rounded-[2rem] border border-red-400/10 bg-white/[0.025] p-10 text-center backdrop-blur-2xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-red-400/20 bg-red-500/10 text-3xl">
              🔒
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red-400/70">
              AmitShop Admin
            </p>

            <h1 className="text-4xl font-black">
              Access Denied
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/40">
              Only administrators can manage products.
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
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[5%] top-[10%] h-80 w-80 rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="absolute right-[5%] top-[30%] h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[150px]" />
        <div className="absolute bottom-[5%] left-[40%] h-72 w-72 rounded-full bg-indigo-600/10 blur-[130px]" />
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
                Product Management
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/35">
                Manage every product across the AmitShop marketplace.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchProducts}
              disabled={loading}
              className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-violet-400/15 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/80 transition hover:border-violet-400/30 hover:bg-violet-500/10 disabled:opacity-50"
            >
              <span
                className={`text-lg transition-transform duration-500 ${
                  loading
                    ? "animate-spin"
                    : "group-hover:rotate-180"
                }`}
              >
                ↻
              </span>

              Refresh Products
            </button>
          </div>
        </section>

        {/* =====================================================
            STATS
        ====================================================== */}

        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl transition hover:-translate-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Total Products
            </p>

            <p className="mt-3 text-3xl font-black">
              {pagination.total ?? 0}
            </p>

            <p className="mt-2 text-xs text-violet-300/50">
              Marketplace products
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl transition hover:-translate-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Active
            </p>

            <p className="mt-3 text-3xl font-black">
              {products.filter(
                (product) => product.isActive
              ).length}
            </p>

            <p className="mt-2 text-xs text-emerald-300/50">
              Current page
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl transition hover:-translate-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Low Stock
            </p>

            <p className="mt-3 text-3xl font-black">
              {
                products.filter((product) => {
                  const value = Number(product.stock || 0);
                  return value > 0 && value <= 5;
                }).length
              }
            </p>

            <p className="mt-2 text-xs text-amber-300/50">
              1–5 units
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl transition hover:-translate-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Out of Stock
            </p>

            <p className="mt-3 text-3xl font-black">
              {
                products.filter(
                  (product) =>
                    Number(product.stock || 0) <= 0
                ).length
              }
            </p>

            <p className="mt-2 text-xs text-red-300/50">
              Requires attention
            </p>
          </div>
        </section>

        {/* =====================================================
            ALERTS
        ====================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-500/[0.07] px-5 py-4 text-sm text-red-300">
            <span className="text-lg">⚠</span>

            <p className="flex-1 font-semibold">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-white/30 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.07] px-5 py-4 text-sm text-emerald-300">
            <span className="text-lg">✓</span>

            <p className="flex-1 font-semibold">
              {success}
            </p>

            <button
              type="button"
              onClick={() => setSuccess("")}
              className="text-white/30 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {/* =====================================================
            FILTERS
        ====================================================== */}

        <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-2xl sm:p-5">
          <div className="flex flex-col gap-4">

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25">
                  ⌕
                </span>

                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) =>
                    setSearchInput(e.target.value)
                  }
                  placeholder="Search product name, brand..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/30"
                />
              </div>

              <button
                type="submit"
                className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-sm font-black transition hover:scale-[1.02]"
              >
                Search
              </button>
            </form>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <input
                type="text"
                value={category === "all" ? "" : category}
                onChange={(e) =>
                  changeFilter(setCategory)(
                    e.target.value || "all"
                  )
                }
                placeholder="Category"
                className="h-11 rounded-xl border border-white/10 bg-[#100a19] px-4 text-sm text-white/70 outline-none focus:border-violet-400/30"
              />

              <select
                value={status}
                onChange={(e) =>
                  changeFilter(setStatus)(e.target.value)
                }
                className="h-11 rounded-xl border border-white/10 bg-[#100a19] px-4 text-sm text-white/70 outline-none focus:border-violet-400/30"
              >
                {STATUS_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item === "all"
                      ? "All Status"
                      : item === "active"
                      ? "Active"
                      : "Inactive"}
                  </option>
                ))}
              </select>

              <select
                value={stock}
                onChange={(e) =>
                  changeFilter(setStock)(e.target.value)
                }
                className="h-11 rounded-xl border border-white/10 bg-[#100a19] px-4 text-sm text-white/70 outline-none focus:border-violet-400/30"
              >
                {STOCK_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item === "all"
                      ? "All Stock"
                      : item === "in-stock"
                      ? "In Stock"
                      : item === "low-stock"
                      ? "Low Stock"
                      : "Out of Stock"}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) =>
                  changeFilter(setSort)(e.target.value)
                }
                className="h-11 rounded-xl border border-white/10 bg-[#100a19] px-4 text-sm text-white/70 outline-none focus:border-violet-400/30"
              >
                <option value="-createdAt">
                  Newest
                </option>
                <option value="createdAt">
                  Oldest
                </option>
                <option value="price">
                  Price Low
                </option>
                <option value="-price">
                  Price High
                </option>
                <option value="name">
                  Name A-Z
                </option>
              </select>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="self-start rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold text-white/40 transition hover:border-violet-400/20 hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        </section>

        {/* =====================================================
            PRODUCTS
        ====================================================== */}

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-2xl">

          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-7">
            <div>
              <h2 className="text-lg font-black">
                All Products
              </h2>

              <p className="mt-1 text-xs text-white/30">
                Page {pagination.page || 1} of{" "}
                {pagination.pages || 1}
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold text-white/40">
              {products.length} shown
            </div>
          </div>

          {loading ? (
            <div className="space-y-4 p-5 sm:p-7">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-2xl bg-white/[0.04]"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-2xl">
                📦
              </div>

              <h3 className="text-xl font-black">
                No products found
              </h3>

              <p className="mt-2 text-sm text-white/30">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <>
              {/* =================================================
                  DESKTOP TABLE
              ================================================== */}

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1050px]">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-7 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                        Product
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                        Seller
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                        Price
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                        Stock
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                        Status
                      </th>

                      <th className="px-7 py-4 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => {
                      const stockValue = Number(
                        product.stock || 0
                      );

                      const seller =
                        product.seller?.name ||
                        product.seller?.email ||
                        "Unknown Seller";

                      const image =
                        product.images?.[0]?.url ||
                        product.images?.[0] ||
                        "";

                      return (
                        <tr
                          key={product._id}
                          className="border-b border-white/[0.06] transition hover:bg-violet-500/[0.025]"
                        >
                          {/* Product */}
                          <td className="px-7 py-5">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xl">
                                    📦
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-[260px] truncate text-sm font-bold text-white/90">
                                  {product.name}
                                </p>

                                <p className="mt-1 text-xs text-white/25">
                                  {product.brand ||
                                    "AmitShop Product"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Seller */}
                          <td className="px-5 py-5">
                            <p className="max-w-[160px] truncate text-xs text-white/50">
                              {seller}
                            </p>
                          </td>

                          {/* Price */}
                          <td className="px-5 py-5">
                            <div>
                              <p className="text-sm font-black">
                                $
                                {Number(
                                  product.discountPrice ||
                                    product.price ||
                                    0
                                ).toFixed(2)}
                              </p>

                              {product.discountPrice &&
                                Number(
                                  product.discountPrice
                                ) <
                                  Number(product.price) && (
                                  <p className="mt-1 text-[10px] text-white/25 line-through">
                                    $
                                    {Number(
                                      product.price
                                    ).toFixed(2)}
                                  </p>
                                )}
                            </div>
                          </td>

                          {/* Stock */}
                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-black ${
                                stockValue <= 0
                                  ? "border-red-400/20 bg-red-500/10 text-red-300"
                                  : stockValue <= 5
                                  ? "border-amber-400/20 bg-amber-500/10 text-amber-300"
                                  : "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                              }`}
                            >
                              {stockValue <= 0
                                ? "Out"
                                : `${stockValue} units`}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase ${
                                product.isActive
                                  ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                                  : "border-red-400/20 bg-red-500/10 text-red-300"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  product.isActive
                                    ? "bg-emerald-400"
                                    : "bg-red-400"
                                }`}
                              />

                              {product.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-7 py-5">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(product)
                                }
                                className="rounded-xl border border-violet-400/15 bg-violet-500/[0.06] px-3 py-2 text-xs font-bold text-violet-300 transition hover:bg-violet-500/10"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                disabled={
                                  actionLoading ===
                                  `status-${product._id}`
                                }
                                onClick={() =>
                                  handleToggleStatus(product)
                                }
                                className="rounded-xl border border-amber-400/15 bg-amber-500/[0.05] px-3 py-2 text-xs font-bold text-amber-300 disabled:opacity-40"
                              >
                                {actionLoading ===
                                `status-${product._id}`
                                  ? "..."
                                  : product.isActive
                                  ? "Disable"
                                  : "Enable"}
                              </button>

                              <button
                                type="button"
                                disabled={
                                  actionLoading ===
                                  `delete-${product._id}`
                                }
                                onClick={() =>
                                  handleDeleteProduct(
                                    product
                                  )
                                }
                                className="rounded-xl border border-red-400/15 bg-red-500/[0.04] px-3 py-2 text-xs font-bold text-red-300 disabled:opacity-40"
                              >
                                {actionLoading ===
                                `delete-${product._id}`
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

              {/* =================================================
                  MOBILE CARDS
              ================================================== */}

              <div className="space-y-4 p-4 lg:hidden">
                {products.map((product) => {
                  const stockValue = Number(
                    product.stock || 0
                  );

                  const image =
                    product.images?.[0]?.url ||
                    product.images?.[0] ||
                    "";

                  return (
                    <div
                      key={product._id}
                      className="rounded-3xl border border-white/10 bg-black/10 p-5"
                    >
                      <div className="flex gap-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10">
                          {image ? (
                            <img
                              src={image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              📦
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-white/30">
                            {product.brand ||
                              "AmitShop Product"}
                          </p>

                          <p className="mt-2 text-sm font-black text-violet-300">
                            $
                            {Number(
                              product.discountPrice ||
                                product.price ||
                                0
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-2">
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                          <p className="text-[9px] uppercase text-white/25">
                            Stock
                          </p>

                          <p className="mt-1 text-xs font-bold">
                            {stockValue}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                          <p className="text-[9px] uppercase text-white/25">
                            Status
                          </p>

                          <p
                            className={`mt-1 text-xs font-bold ${
                              product.isActive
                                ? "text-emerald-300"
                                : "text-red-300"
                            }`}
                          >
                            {product.isActive
                              ? "Active"
                              : "Off"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                          <p className="text-[9px] uppercase text-white/25">
                            Seller
                          </p>

                          <p className="mt-1 truncate text-xs font-bold">
                            {product.seller?.name ||
                              "Seller"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(product)
                          }
                          className="rounded-xl border border-violet-400/15 bg-violet-500/[0.06] py-2.5 text-xs font-bold text-violet-300"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(product)
                          }
                          className="rounded-xl border border-amber-400/15 bg-amber-500/[0.04] py-2.5 text-xs font-bold text-amber-300"
                        >
                          {product.isActive
                            ? "Disable"
                            : "Enable"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteProduct(product)
                          }
                          className="rounded-xl border border-red-400/15 bg-red-500/[0.04] py-2.5 text-xs font-bold text-red-300"
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

          {/* =================================================
              PAGINATION
          ================================================== */}

          {!loading && products.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 px-5 py-5 sm:flex-row sm:px-7">
              <p className="text-xs text-white/30">
                Page{" "}
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
                  onClick={() =>
                    goToPage(pagination.page - 1)
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white/50 disabled:opacity-25"
                >
                  ←
                </button>

                {pageNumbers.map((page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`h-9 min-w-9 rounded-xl px-3 text-xs font-black ${
                      Number(pagination.page) === page
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                        : "border border-white/10 bg-white/[0.03] text-white/40"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() =>
                    goToPage(pagination.page + 1)
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white/50 disabled:opacity-25"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* =======================================================
          EDIT MODAL
      ======================================================== */}

      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 px-4 py-8 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-[2rem] border border-violet-400/15 bg-[#0d0816] shadow-[0_40px_120px_rgba(0,0,0,0.7)]">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-400/60">
                  Admin Control
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Edit Product
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/40 hover:text-white"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleUpdateProduct}
              className="p-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">

                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/35">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-violet-400/30"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/35">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={editForm.price}
                    onChange={handleEditChange}
                    required
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-violet-400/30"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/35">
                    Discount Price
                  </label>

                  <input
                    type="number"
                    name="discountPrice"
                    min="0"
                    step="0.01"
                    value={editForm.discountPrice}
                    onChange={handleEditChange}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-violet-400/30"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/35">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={editForm.stock}
                    onChange={handleEditChange}
                    required
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-violet-400/30"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/35">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-violet-400/30"
                  />
                </div>

                {/* Brand */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/35">
                    Brand
                  </label>

                  <input
                    type="text"
                    name="brand"
                    value={editForm.brand}
                    onChange={handleEditChange}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-violet-400/30"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/35">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-violet-400/30"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={!!actionLoading}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-white/50 hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!!actionLoading}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-black disabled:opacity-50"
                >
                  {actionLoading ===
                  `edit-${selectedProduct._id}`
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

export default AdminProducts;
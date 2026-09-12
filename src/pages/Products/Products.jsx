import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/axios";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [sort, setSort] = useState(
    searchParams.get("sort") || "newest"
  );

  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || ""
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  /* =========================================================
     PRODUCT IMAGE
  ========================================================= */

  const getProductImage = (product) => {
    if (!product?.images || product.images.length === 0) {
      return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=90";
    }

    const firstImage = product.images[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    return (
      firstImage?.url ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=90"
    );
  };

  /* =========================================================
     FINAL PRICE
  ========================================================= */

  const getFinalPrice = (product) => {
    if (
      product?.discountPrice !== undefined &&
      product?.discountPrice !== null &&
      Number(product.discountPrice) < Number(product.price)
    ) {
      return Number(product.discountPrice);
    }

    return Number(product?.price || 0);
  };

  /* =========================================================
     DISCOUNT
  ========================================================= */

  const getDiscount = (product) => {
    if (
      product?.price &&
      product?.discountPrice &&
      Number(product.discountPrice) < Number(product.price)
    ) {
      return Math.round(
        ((Number(product.price) -
          Number(product.discountPrice)) /
          Number(product.price)) *
          100
      );
    }

    return 0;
  };

  /* =========================================================
     FETCH PRODUCTS
  ========================================================= */

  const fetchProducts = async (page = 1) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const params = {
        page,
        limit: 12,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (category.trim()) {
        params.category = category.trim();
      }

      if (minPrice !== "") {
        params.minPrice = minPrice;
      }

      if (maxPrice !== "") {
        params.maxPrice = maxPrice;
      }

      if (sort) {
        params.sort = sort;
      }

      const response = await api.get("/products", {
        params,
      });

      if (response.data.success) {
        setProducts(response.data.products || []);

        if (response.data.pagination) {
          setPagination({
            currentPage:
              response.data.pagination.currentPage || page,

            totalPages:
              response.data.pagination.totalPages || 1,

            totalProducts:
              response.data.pagination.totalProducts ||
              response.data.products?.length ||
              0,
          });
        }
      } else {
        setErrorMessage(
          response.data.message ||
            "Failed to load products."
        );
      }
    } catch (error) {
      console.error("Products Fetch Error:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load products right now."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================================
     INITIAL / FILTER FETCH
  ========================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(1);
    }, 250);

    return () => clearTimeout(timer);
  }, [
    search,
    category,
    sort,
    minPrice,
    maxPrice,
  ]);

  /* =========================================================
     UPDATE URL
  ========================================================= */

  useEffect(() => {
    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (category.trim()) {
      params.category = category.trim();
    }

    if (sort && sort !== "newest") {
      params.sort = sort;
    }

    if (minPrice !== "") {
      params.minPrice = minPrice;
    }

    if (maxPrice !== "") {
      params.maxPrice = maxPrice;
    }

    setSearchParams(params, {
      replace: true,
    });
  }, [
    search,
    category,
    sort,
    minPrice,
    maxPrice,
    setSearchParams,
  ]);

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
  };

  /* =========================================================
     PAGINATION
  ========================================================= */

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.currentPage
    ) {
      return;
    }

    fetchProducts(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     INPUT CLASS
  ========================================================= */

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-white/25 focus:border-violet-400/40 focus:bg-violet-500/[0.06] focus:ring-2 focus:ring-violet-500/10";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05020b] px-4 pb-24 pt-32 text-white sm:px-6 lg:px-10">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[160px]" />

      <div className="pointer-events-none absolute -left-40 top-[35%] h-80 w-80 rounded-full bg-fuchsia-600/[0.05] blur-[130px]" />

      <div className="pointer-events-none absolute -right-40 top-[55%] h-80 w-80 rounded-full bg-purple-600/[0.06] blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <section className="mb-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-violet-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />

            AmitShop Collection
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Explore{" "}
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                  Products
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
                Find exactly what you are looking for
                with powerful search, filters and sorting.
              </p>
            </div>

            {!isLoading && (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 py-4 backdrop-blur-xl">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
                  Results
                </p>

                <p className="mt-1 text-2xl font-black text-white">
                  {pagination.totalProducts}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            SEARCH + FILTER PANEL
        ====================================================== */}

        <section className="relative mb-10 overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-7">
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-600/10 blur-[90px]" />

          <div className="relative">
            {/* SEARCH */}

            <div className="mb-6">
              <label className="mb-2 block text-xs font-bold text-white/55">
                Search Products
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                    />
                    <path d="m20 20-4-4" />
                  </svg>
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search products..."
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            {/* FILTER GRID */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-xs font-bold text-white/55">
                  Category
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  placeholder="Electronics"
                  className={inputClass}
                />
              </div>

              {/* MIN PRICE */}

              <div>
                <label className="mb-2 block text-xs font-bold text-white/55">
                  Minimum Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) =>
                    setMinPrice(event.target.value)
                  }
                  placeholder="0"
                  className={inputClass}
                />
              </div>

              {/* MAX PRICE */}

              <div>
                <label className="mb-2 block text-xs font-bold text-white/55">
                  Maximum Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(event.target.value)
                  }
                  placeholder="1000"
                  className={inputClass}
                />
              </div>

              {/* SORT */}

              <div>
                <label className="mb-2 block text-xs font-bold text-white/55">
                  Sort By
                </label>

                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value)
                  }
                  className={`${inputClass} cursor-pointer`}
                >
                  <option
                    value="newest"
                    className="bg-[#12091d]"
                  >
                    Newest
                  </option>

                  <option
                    value="price-low"
                    className="bg-[#12091d]"
                  >
                    Price: Low to High
                  </option>

                  <option
                    value="price-high"
                    className="bg-[#12091d]"
                  >
                    Price: High to Low
                  </option>

                  <option
                    value="rating"
                    className="bg-[#12091d]"
                  >
                    Highest Rated
                  </option>

                  <option
                    value="popular"
                    className="bg-[#12091d]"
                  >
                    Most Popular
                  </option>
                </select>
              </div>
            </div>

            {/* CLEAR */}

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full border border-white/10 bg-white/[0.035] px-5 py-2.5 text-xs font-bold text-white/50 transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {!isLoading && errorMessage && (
          <div className="rounded-[30px] border border-red-400/15 bg-red-500/[0.06] p-10 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-2xl text-red-300">
              !
            </div>

            <h2 className="mt-5 text-xl font-black">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-white/40">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() =>
                fetchProducts(
                  pagination.currentPage || 1
                )
              }
              className="mt-6 rounded-full border border-violet-400/20 bg-violet-500/10 px-6 py-3 text-sm font-bold text-violet-300 transition-all duration-300 hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* =====================================================
            LOADING
        ====================================================== */}

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.035]"
                >
                  <div className="h-72 bg-white/[0.05]" />

                  <div className="space-y-4 p-5">
                    <div className="h-3 w-24 rounded-full bg-white/[0.08]" />

                    <div className="h-5 w-40 rounded-full bg-white/[0.08]" />

                    <div className="h-4 w-28 rounded-full bg-white/[0.08]" />

                    <div className="h-7 w-24 rounded-full bg-white/[0.08]" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* =====================================================
            EMPTY
        ====================================================== */}

        {!isLoading &&
          !errorMessage &&
          products.length === 0 && (
            <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] px-6 py-20 text-center backdrop-blur-xl">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-400/20 bg-violet-500/10 text-3xl text-violet-300">
                ✦
              </div>

              <h2 className="mt-6 text-2xl font-black">
                No Products Found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/35">
                Try changing your search or filter
                settings to find more products.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-7 rounded-full border border-violet-400/20 bg-violet-500/10 px-6 py-3 text-sm font-bold text-violet-300 transition-all duration-300 hover:bg-violet-500/20 hover:text-white"
              >
                Reset Filters
              </button>
            </div>
          )}

        {/* =====================================================
            PRODUCTS
        ====================================================== */}

        {!isLoading &&
          !errorMessage &&
          products.length > 0 && (
            <section>
              <div className="mb-7 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400/70">
                    Collection
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    {search
                      ? `Results for "${search}"`
                      : "Latest Products"}
                  </h2>
                </div>

                <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/40 sm:block">
                  Page {pagination.currentPage} /{" "}
                  {pagination.totalPages}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => {
                  const image =
                    getProductImage(product);

                  const finalPrice =
                    getFinalPrice(product);

                  const discount =
                    getDiscount(product);

                  return (
                    <article
                      key={product._id}
                      className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.035] shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-violet-400/30 hover:bg-white/[0.055]"
                    >
                      {/* GLOW */}

                      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-600/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                      {/* IMAGE */}

                      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-white/[0.04] to-violet-950/20">
                        {discount > 0 && (
                          <div className="absolute left-4 top-4 z-10 rounded-full border border-violet-300/20 bg-violet-600/90 px-3 py-1.5 text-[10px] font-black tracking-wider text-white shadow-lg shadow-violet-900/30">
                            {discount}% OFF
                          </div>
                        )}

                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />

                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#080510] to-transparent" />

                        {/* QUICK VIEW */}

                        <Link
                          to={`/products/${product._id}`}
                          className="absolute bottom-5 left-1/2 -translate-x-1/2 translate-y-4 rounded-full border border-violet-300/20 bg-violet-600/90 px-5 py-2.5 text-xs font-black text-white opacity-0 shadow-xl shadow-violet-950/30 backdrop-blur-xl transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-violet-500"
                        >
                          Quick View →
                        </Link>
                      </div>

                      {/* CONTENT */}

                      <div className="p-5">
                        <p className="mb-2 truncate text-[10px] font-black uppercase tracking-[0.18em] text-violet-400/80">
                          {product.category ||
                            "General"}
                        </p>

                        <h3 className="truncate text-lg font-extrabold text-white transition-colors duration-300 group-hover:text-violet-300">
                          {product.name}
                        </h3>

                        {product.brand && (
                          <p className="mt-1 truncate text-xs text-white/30">
                            {product.brand}
                          </p>
                        )}

                        {/* RATING */}

                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex items-center gap-0.5 text-yellow-400">
                            {Array.from({
                              length: 5,
                            }).map((_, index) => (
                              <span
                                key={index}
                                className="text-xs"
                              >
                                ★
                              </span>
                            ))}
                          </div>

                          <span className="text-xs font-semibold text-white/40">
                            {product.ratings || 0}
                          </span>

                          <span className="text-xs text-white/25">
                            (
                            {product.numReviews ||
                              0}
                            )
                          </span>
                        </div>

                        {/* PRICE */}

                        <div className="mt-5 flex items-end justify-between gap-3">
                          <div>
                            <span className="text-2xl font-black text-white">
                              $
                              {finalPrice.toFixed(
                                2
                              )}
                            </span>

                            {discount > 0 && (
                              <span className="ml-2 text-sm text-white/30 line-through">
                                $
                                {Number(
                                  product.price ||
                                    0
                                ).toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* STOCK */}

                          <div
                            className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${
                              Number(
                                product.stock
                              ) > 0
                                ? "border-emerald-400/15 bg-emerald-500/10 text-emerald-300"
                                : "border-red-400/15 bg-red-500/10 text-red-300"
                            }`}
                          >
                            {Number(
                              product.stock
                            ) > 0
                              ? "In Stock"
                              : "Out"}
                          </div>
                        </div>

                        {/* VIEW */}

                        <Link
                          to={`/products/${product._id}`}
                          className="mt-5 flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-xs font-bold text-white/60 transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white"
                        >
                          View Product

                          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </Link>
                      </div>

                      {/* BOTTOM LINE */}

                      <div className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-500 to-transparent transition-all duration-500 group-hover:w-2/3" />
                    </article>
                  );
                })}
              </div>
            </section>
          )}

        {/* =====================================================
            PAGINATION
        ====================================================== */}

        {!isLoading &&
          !errorMessage &&
          products.length > 0 &&
          pagination.totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                disabled={
                  pagination.currentPage === 1
                }
                onClick={() =>
                  handlePageChange(
                    pagination.currentPage - 1
                  )
                }
                className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-bold text-white/50 transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Prev
              </button>

              {Array.from(
                {
                  length: pagination.totalPages,
                },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    handlePageChange(page)
                  }
                  className={`h-10 min-w-10 rounded-xl border px-3 text-xs font-black transition-all duration-300 ${
                    page ===
                    pagination.currentPage
                      ? "border-violet-400/30 bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                      : "border-white/10 bg-white/[0.035] text-white/40 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={
                  pagination.currentPage ===
                  pagination.totalPages
                }
                onClick={() =>
                  handlePageChange(
                    pagination.currentPage + 1
                  )
                }
                className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-bold text-white/50 transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          )}
      </div>
    </main>
  );
};

export default Products;
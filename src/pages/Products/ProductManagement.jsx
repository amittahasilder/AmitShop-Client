// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../../api/axios";
// import useAuthStore from "../../store/authStore";

// const ProductManagement = () => {
//   const { user, accessToken, isAuthenticated } = useAuthStore();

//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     productsPerPage: 12,
//     totalProducts: 0,
//     totalPages: 0,
//     hasNextPage: false,
//     hasPreviousPage: false,
//   });

//   const [deletingId, setDeletingId] = useState(null);

//   // ==========================================
//   // FETCH MY PRODUCTS
//   // ==========================================

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const params = new URLSearchParams();

//       params.set("page", currentPage);
//       params.set("limit", 12);

//       if (search.trim()) {
//         params.set("search", search.trim());
//       }

//       const response = await api.get(
//         `/products/my-products?${params.toString()}`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       if (response.data?.success) {
//         setProducts(response.data.products || []);
//         setPagination(
//           response.data.pagination || {}
//         );
//       } else {
//         setProducts([]);
//         setError(
//           response.data?.message ||
//             "Failed to fetch products"
//         );
//       }
//     } catch (err) {
//       console.error(
//         "Fetch Management Products Error:",
//         err
//       );

//       setProducts([]);

//       setError(
//         err.response?.data?.message ||
//           "Unable to load products"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // FETCH WHEN PAGE / SEARCH CHANGES
//   // ==========================================

//   useEffect(() => {
//     if (!isAuthenticated || !accessToken) {
//       setLoading(false);
//       return;
//     }

//     if (
//       user?.role !== "seller" &&
//       user?.role !== "admin"
//     ) {
//       setLoading(false);
//       return;
//     }

//     fetchProducts();
//   }, [
//     currentPage,
//     accessToken,
//     isAuthenticated,
//     user?.role,
//   ]);

//   // ==========================================
//   // SEARCH
//   // ==========================================

//   const handleSearchSubmit = (event) => {
//     event.preventDefault();

//     setCurrentPage(1);
//     fetchProducts();
//   };

//   // ==========================================
//   // DELETE PRODUCT
//   // ==========================================

//   const handleDelete = async (productId) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this product?"
//     );

//     if (!confirmed) return;

//     try {
//       setDeletingId(productId);
//       setError("");

//       const response = await api.delete(
//         `/products/${productId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       if (!response.data?.success) {
//         throw new Error(
//           response.data?.message ||
//             "Failed to delete product"
//         );
//       }

//       await fetchProducts();
//     } catch (err) {
//       console.error(
//         "Delete Product Error:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//           "Unable to delete product"
//       );
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // ==========================================
//   // HELPERS
//   // ==========================================

//   const getProductImage = (product) => {
//     if (
//       product?.images &&
//       product.images.length > 0
//     ) {
//       const firstImage = product.images[0];

//       if (typeof firstImage === "string") {
//         return firstImage;
//       }

//       return firstImage?.url || "";
//     }

//     return "";
//   };

//   const getFinalPrice = (product) => {
//     if (
//       product?.discountPrice !== null &&
//       product?.discountPrice !== undefined &&
//       Number(product.discountPrice) <
//         Number(product.price)
//     ) {
//       return Number(product.discountPrice);
//     }

//     return Number(product.price || 0);
//   };

//   const getDiscountPercentage = (product) => {
//     if (
//       !product?.price ||
//       !product?.discountPrice ||
//       Number(product.discountPrice) >=
//         Number(product.price)
//     ) {
//       return 0;
//     }

//     return Math.round(
//       ((Number(product.price) -
//         Number(product.discountPrice)) /
//         Number(product.price)) *
//         100
//     );
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(price);
//   };

//   const visiblePageNumbers = useMemo(() => {
//     const totalPages = pagination.totalPages || 0;

//     if (totalPages <= 5) {
//       return Array.from(
//         { length: totalPages },
//         (_, index) => index + 1
//       );
//     }

//     if (currentPage <= 3) {
//       return [1, 2, 3, 4, 5];
//     }

//     if (currentPage >= totalPages - 2) {
//       return [
//         totalPages - 4,
//         totalPages - 3,
//         totalPages - 2,
//         totalPages - 1,
//         totalPages,
//       ];
//     }

//     return [
//       currentPage - 2,
//       currentPage - 1,
//       currentPage,
//       currentPage + 1,
//       currentPage + 2,
//     ];
//   }, [
//     currentPage,
//     pagination.totalPages,
//   ]);

//   // ==========================================
//   // AUTHORIZATION UI
//   // ==========================================

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
//         <div className="max-w-md w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
//           <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-3xl">
//             🔐
//           </div>

//           <h1 className="text-2xl font-bold">
//             Authentication Required
//           </h1>

//           <p className="mt-3 text-slate-400">
//             Please login to manage your products.
//           </p>

//           <Link
//             to="/login"
//             className="mt-6 inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-500"
//           >
//             Go to Login
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (
//     user?.role !== "seller" &&
//     user?.role !== "admin"
//   ) {
//     return (
//       <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
//         <div className="max-w-md w-full rounded-3xl border border-red-500/20 bg-white/[0.04] p-8 text-center shadow-2xl">
//           <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-3xl">
//             🚫
//           </div>

//           <h1 className="text-2xl font-bold">
//             Access Denied
//           </h1>

//           <p className="mt-3 text-slate-400">
//             You do not have permission to manage
//             products.
//           </p>

//           <Link
//             to="/products"
//             className="mt-6 inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-500"
//           >
//             Browse Products
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // ==========================================
//   // MAIN UI
//   // ==========================================

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       {/* Background Glow */}
//       <div className="pointer-events-none fixed inset-0 overflow-hidden">
//         <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-700/10 blur-3xl" />
//         <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-fuchsia-700/10 blur-3xl" />
//       </div>

//       <main className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
//         {/* ==========================================
//             HEADER
//         ========================================== */}

//         <section className="mb-8">
//           <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
//             <div>
//               <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300">
//                 <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />
//                 {user.role === "admin"
//                   ? "Admin Management"
//                   : "Seller Management"}
//               </div>

//               <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
//                 Product{" "}
//                 <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
//                   Management
//                 </span>
//               </h1>

//               <p className="mt-3 max-w-2xl text-slate-400">
//                 Manage your products, inventory,
//                 pricing and product status from one
//                 powerful dashboard.
//               </p>
//             </div>

//             <Link
//               to="/products/add"
//               className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3.5 font-bold shadow-lg shadow-purple-900/30 transition duration-300 hover:-translate-y-1 hover:shadow-purple-500/20"
//             >
//               <span className="text-xl">+</span>
//               Add Product
//             </Link>
//           </div>
//         </section>

//         {/* ==========================================
//             STATS
//         ========================================== */}

//         {!loading && !error && (
//           <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
//             <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-purple-500/30">
//               <p className="text-sm text-slate-400">
//                 Total Products
//               </p>

//               <p className="mt-2 text-3xl font-black">
//                 {pagination.totalProducts || 0}
//               </p>
//             </div>

//             <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-emerald-500/30">
//               <p className="text-sm text-slate-400">
//                 Active Products
//               </p>

//               <p className="mt-2 text-3xl font-black text-emerald-400">
//                 {
//                   products.filter(
//                     (product) =>
//                       product.isActive !== false
//                   ).length
//                 }
//               </p>
//             </div>

//             <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-amber-500/30">
//               <p className="text-sm text-slate-400">
//                 Low Stock
//               </p>

//               <p className="mt-2 text-3xl font-black text-amber-400">
//                 {
//                   products.filter(
//                     (product) =>
//                       Number(product.stock) <= 5
//                   ).length
//                 }
//               </p>
//             </div>
//           </section>
//         )}

//         {/* ==========================================
//             SEARCH
//         ========================================== */}

//         <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-xl sm:p-5">
//           <form
//             onSubmit={handleSearchSubmit}
//             className="flex flex-col gap-3 sm:flex-row"
//           >
//             <div className="relative flex-1">
//               <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-500">
//                 ⌕
//               </span>

//               <input
//                 type="text"
//                 value={search}
//                 onChange={(event) =>
//                   setSearch(event.target.value)
//                 }
//                 placeholder="Search products, category or brand..."
//                 className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-12 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10"
//               />
//             </div>

//             <button
//               type="submit"
//               className="rounded-2xl bg-white px-7 py-3.5 font-bold text-slate-950 transition hover:bg-purple-100"
//             >
//               Search
//             </button>

//             {search && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSearch("");
//                   setCurrentPage(1);

//                   setTimeout(() => {
//                     fetchProducts();
//                   }, 0);
//                 }}
//                 className="rounded-2xl border border-white/10 px-6 py-3.5 font-semibold text-slate-300 transition hover:bg-white/5"
//               >
//                 Clear
//               </button>
//             )}
//           </form>
//         </section>

//         {/* ==========================================
//             ERROR
//         ========================================== */}

//         {error && (
//           <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
//             <div className="flex items-start gap-3">
//               <span className="text-xl">⚠️</span>

//               <div>
//                 <p className="font-bold">
//                   Something went wrong
//                 </p>

//                 <p className="mt-1 text-sm text-red-300/80">
//                   {error}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==========================================
//             LOADING
//         ========================================== */}

//         {loading && (
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
//             {Array.from({ length: 6 }).map(
//               (_, index) => (
//                 <div
//                   key={index}
//                   className="animate-pulse overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
//                 >
//                   <div className="h-56 bg-white/5" />

//                   <div className="space-y-4 p-5">
//                     <div className="h-5 w-3/4 rounded bg-white/5" />
//                     <div className="h-4 w-1/2 rounded bg-white/5" />
//                     <div className="h-10 w-full rounded bg-white/5" />
//                   </div>
//                 </div>
//               )
//             )}
//           </div>
//         )}

//         {/* ==========================================
//             EMPTY
//         ========================================== */}

//         {!loading &&
//           !error &&
//           products.length === 0 && (
//             <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-20 text-center">
//               <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-500/10 text-4xl">
//                 📦
//               </div>

//               <h2 className="text-2xl font-bold">
//                 No products found
//               </h2>

//               <p className="mx-auto mt-3 max-w-md text-slate-400">
//                 {search
//                   ? "Try another search term."
//                   : "You haven't created any products yet."}
//               </p>

//               {!search && (
//                 <Link
//                   to="/products/add"
//                   className="mt-6 inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500"
//                 >
//                   Create Your First Product
//                 </Link>
//               )}
//             </div>
//           )}

//         {/* ==========================================
//             PRODUCT GRID
//         ========================================== */}

//         {!loading &&
//           !error &&
//           products.length > 0 && (
//             <>
//               <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
//                 {products.map((product) => {
//                   const image =
//                     getProductImage(product);

//                   const discount =
//                     getDiscountPercentage(product);

//                   const finalPrice =
//                     getFinalPrice(product);

//                   const isActive =
//                     product.isActive !== false;

//                   const isLowStock =
//                     Number(product.stock) <= 5;

//                   return (
//                     <article
//                       key={product._id}
//                       className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-purple-500/30 hover:shadow-purple-950/20"
//                     >
//                       {/* IMAGE */}
//                       <div className="relative h-60 overflow-hidden bg-slate-900">
//                         {image ? (
//                           <img
//                             src={image}
//                             alt={product.name}
//                             className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
//                           />
//                         ) : (
//                           <div className="flex h-full items-center justify-center text-5xl text-slate-700">
//                             📦
//                           </div>
//                         )}

//                         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

//                         {discount > 0 && (
//                           <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-xs font-black text-white shadow-lg">
//                             -{discount}%
//                           </span>
//                         )}

//                         <span
//                           className={`absolute right-4 top-4 rounded-full border px-3 py-1.5 text-xs font-bold ${
//                             isActive
//                               ? "border-emerald-400/20 bg-emerald-500/15 text-emerald-300"
//                               : "border-red-400/20 bg-red-500/15 text-red-300"
//                           }`}
//                         >
//                           {isActive
//                             ? "Active"
//                             : "Inactive"}
//                         </span>
//                       </div>

//                       {/* CONTENT */}
//                       <div className="p-5">
//                         <div className="mb-3 flex items-start justify-between gap-3">
//                           <div className="min-w-0">
//                             <h2 className="truncate text-lg font-bold text-white">
//                               {product.name}
//                             </h2>

//                             <p className="mt-1 truncate text-sm text-slate-500">
//                               {product.category ||
//                                 "Uncategorized"}
//                             </p>
//                           </div>

//                           <div className="flex shrink-0 items-center gap-1 text-sm text-amber-400">
//                             <span>★</span>
//                             <span>
//                               {Number(
//                                 product.ratings || 0
//                               ).toFixed(1)}
//                             </span>
//                           </div>
//                         </div>

//                         {/* PRICE */}
//                         <div className="flex items-center gap-2">
//                           <span className="text-xl font-black text-purple-300">
//                             {formatPrice(
//                               finalPrice
//                             )}
//                           </span>

//                           {discount > 0 && (
//                             <span className="text-sm text-slate-500 line-through">
//                               {formatPrice(
//                                 Number(
//                                   product.price
//                                 )
//                               )}
//                             </span>
//                           )}
//                         </div>

//                         {/* STOCK */}
//                         <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/5 bg-black/10 px-4 py-3">
//                           <span className="text-sm text-slate-400">
//                             Inventory
//                           </span>

//                           <span
//                             className={`text-sm font-bold ${
//                               isLowStock
//                                 ? "text-amber-400"
//                                 : "text-emerald-400"
//                             }`}
//                           >
//                             {product.stock}{" "}
//                             {isLowStock
//                               ? "left"
//                               : "in stock"}
//                           </span>
//                         </div>

//                         {/* ACTIONS */}
//                         <div className="mt-5 grid grid-cols-2 gap-3">
//                           <Link
//                             to={`/products/edit/${product._id}`}
//                             className="inline-flex items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm font-bold text-purple-300 transition hover:bg-purple-500/20"
//                           >
//                             ✏️ Edit
//                           </Link>

//                           <button
//                             type="button"
//                             disabled={
//                               deletingId ===
//                               product._id
//                             }
//                             onClick={() =>
//                               handleDelete(
//                                 product._id
//                               )
//                             }
//                             className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
//                           >
//                             {deletingId ===
//                             product._id
//                               ? "Deleting..."
//                               : "🗑️ Delete"}
//                           </button>
//                         </div>
//                       </div>
//                     </article>
//                   );
//                 })}
//               </section>

//               {/* ==========================================
//                   PAGINATION
//               ========================================== */}

//               {pagination.totalPages > 1 && (
//                 <section className="mt-10 flex flex-wrap items-center justify-center gap-2">
//                   <button
//                     type="button"
//                     disabled={
//                       !pagination.hasPreviousPage
//                     }
//                     onClick={() =>
//                       setCurrentPage(
//                         (page) => page - 1
//                       )
//                     }
//                     className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
//                   >
//                     ← Previous
//                   </button>

//                   {visiblePageNumbers.map(
//                     (page) => (
//                       <button
//                         key={page}
//                         type="button"
//                         onClick={() =>
//                           setCurrentPage(page)
//                         }
//                         className={`h-11 min-w-11 rounded-xl px-3 text-sm font-bold transition ${
//                           currentPage === page
//                             ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
//                             : "border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
//                         }`}
//                       >
//                         {page}
//                       </button>
//                     )
//                   )}

//                   <button
//                     type="button"
//                     disabled={
//                       !pagination.hasNextPage
//                     }
//                     onClick={() =>
//                       setCurrentPage(
//                         (page) => page + 1
//                       )
//                     }
//                     className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
//                   >
//                     Next →
//                   </button>
//                 </section>
//               )}
//             </>
//           )}
//       </main>
//     </div>
//   );
// };

// // export default ProductManagement;




import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const ProductManagement = () => {
  const { user, accessToken, isAuthenticated } = useAuthStore();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    productsPerPage: 12,
    totalProducts: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // FETCH MY PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("page", currentPage);
      params.set("limit", 12);

      if (appliedSearch.trim()) {
        params.set("search", appliedSearch.trim());
      }

      const response = await api.get(
        `/products/my-products?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.success) {
        setProducts(response.data.products || []);

        setPagination(
          response.data.pagination || {
            currentPage: 1,
            productsPerPage: 12,
            totalProducts: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          }
        );
      } else {
        setProducts([]);

        setError(
          response.data?.message ||
            "Failed to fetch products"
        );
      }
    } catch (err) {
      console.error(
        "Fetch Management Products Error:",
        err
      );

      setProducts([]);

      setError(
        err.response?.data?.message ||
          "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH WHEN PAGE / SEARCH CHANGES
  // ==========================================

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      setLoading(false);
      return;
    }

    if (
      user?.role !== "seller" &&
      user?.role !== "admin"
    ) {
      setLoading(false);
      return;
    }

    fetchProducts();
  }, [
    currentPage,
    appliedSearch,
    accessToken,
    isAuthenticated,
    user?.role,
  ]);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    setCurrentPage(1);
    setAppliedSearch(search.trim());
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const handleClearSearch = () => {
    setSearch("");
    setAppliedSearch("");
    setCurrentPage(1);
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(productId);
      setError("");

      const response = await api.delete(
        `/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to delete product"
        );
      }

      await fetchProducts();
    } catch (err) {
      console.error(
        "Delete Product Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // HELPERS
  // ==========================================

  const getProductImage = (product) => {
    if (
      product?.images &&
      product.images.length > 0
    ) {
      const firstImage = product.images[0];

      if (typeof firstImage === "string") {
        return firstImage;
      }

      return firstImage?.url || "";
    }

    return "";
  };

  const getFinalPrice = (product) => {
    if (
      product?.discountPrice !== null &&
      product?.discountPrice !== undefined &&
      Number(product.discountPrice) <
        Number(product.price)
    ) {
      return Number(product.discountPrice);
    }

    return Number(product.price || 0);
  };

  const getDiscountPercentage = (product) => {
    if (
      !product?.price ||
      !product?.discountPrice ||
      Number(product.discountPrice) >=
        Number(product.price)
    ) {
      return 0;
    }

    return Math.round(
      ((Number(product.price) -
        Number(product.discountPrice)) /
        Number(product.price)) *
        100
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const visiblePageNumbers = useMemo(() => {
    const totalPages = pagination.totalPages || 0;

    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }, [
    currentPage,
    pagination.totalPages,
  ]);

  // ==========================================
  // AUTHORIZATION UI
  // ==========================================

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-3xl">
            🔐
          </div>

          <h1 className="text-2xl font-bold">
            Authentication Required
          </h1>

          <p className="mt-3 text-slate-400">
            Please login to manage your products.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-500"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (
    user?.role !== "seller" &&
    user?.role !== "admin"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-white/[0.04] p-8 text-center shadow-2xl">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-3xl">
            🚫
          </div>

          <h1 className="text-2xl font-bold">
            Access Denied
          </h1>

          <p className="mt-3 text-slate-400">
            You do not have permission to manage
            products.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-500"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-700/10 blur-3xl" />

        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-fuchsia-700/10 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <section className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />

                {user.role === "admin"
                  ? "Admin Management"
                  : "Seller Management"}
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Product{" "}
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  Management
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-slate-400">
                Manage your products, inventory,
                pricing and product status from one
                powerful dashboard.
              </p>

            </div>

            <Link
              to="/products/add"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3.5 font-bold shadow-lg shadow-purple-900/30 transition duration-300 hover:-translate-y-1 hover:shadow-purple-500/20"
            >
              <span className="text-xl">+</span>
              Add Product
            </Link>

          </div>
        </section>

        {/* ==========================================
            STATS
        ========================================== */}

        {!loading && !error && (
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-purple-500/30">
              <p className="text-sm text-slate-400">
                Total Products
              </p>

              <p className="mt-2 text-3xl font-black">
                {pagination.totalProducts || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-emerald-500/30">
              <p className="text-sm text-slate-400">
                Active Products
              </p>

              <p className="mt-2 text-3xl font-black text-emerald-400">
                {
                  products.filter(
                    (product) =>
                      product.isActive !== false
                  ).length
                }
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-amber-500/30">
              <p className="text-sm text-slate-400">
                Low Stock
              </p>

              <p className="mt-2 text-3xl font-black text-amber-400">
                {
                  products.filter(
                    (product) =>
                      Number(product.stock) <= 5
                  ).length
                }
              </p>
            </div>

          </section>
        )}

        {/* ==========================================
            SEARCH
        ========================================== */}

        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-xl sm:p-5">

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >

            <div className="relative flex-1">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-500">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products, category or brand..."
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-12 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10"
              />

            </div>

            <button
              type="submit"
              className="rounded-2xl bg-white px-7 py-3.5 font-bold text-slate-950 transition hover:bg-purple-100"
            >
              Search
            </button>

            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="rounded-2xl border border-white/10 px-6 py-3.5 font-semibold text-slate-300 transition hover:bg-white/5"
              >
                Clear
              </button>
            )}

          </form>
        </section>

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">

            <div className="flex items-start gap-3">

              <span className="text-xl">
                ⚠️
              </span>

              <div>
                <p className="font-bold">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm text-red-300/80">
                  {error}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ==========================================
            LOADING
        ========================================== */}

        {loading && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
                >
                  <div className="h-56 bg-white/5" />

                  <div className="space-y-4 p-5">
                    <div className="h-5 w-3/4 rounded bg-white/5" />

                    <div className="h-4 w-1/2 rounded bg-white/5" />

                    <div className="h-10 w-full rounded bg-white/5" />
                  </div>
                </div>
              )
            )}

          </div>
        )}

        {/* ==========================================
            EMPTY
        ========================================== */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-20 text-center">

              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-500/10 text-4xl">
                📦
              </div>

              <h2 className="text-2xl font-bold">
                No products found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-slate-400">
                {appliedSearch
                  ? "Try another search term."
                  : "You haven't created any products yet."}
              </p>

              {!appliedSearch && (
                <Link
                  to="/products/add"
                  className="mt-6 inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500"
                >
                  Create Your First Product
                </Link>
              )}

            </div>
          )}

        {/* ==========================================
            PRODUCT GRID
        ========================================== */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <>

              <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                {products.map((product) => {
                  const image =
                    getProductImage(product);

                  const discount =
                    getDiscountPercentage(product);

                  const finalPrice =
                    getFinalPrice(product);

                  const isActive =
                    product.isActive !== false;

                  const isLowStock =
                    Number(product.stock) <= 5;

                  return (
                    <article
                      key={product._id}
                      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-purple-500/30 hover:shadow-purple-950/20"
                    >

                      {/* IMAGE */}

                      <div className="relative h-60 overflow-hidden bg-slate-900">

                        {image ? (
                          <img
                            src={image}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-5xl text-slate-700">
                            📦
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                        {discount > 0 && (
                          <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-xs font-black text-white shadow-lg">
                            -{discount}%
                          </span>
                        )}

                        <span
                          className={`absolute right-4 top-4 rounded-full border px-3 py-1.5 text-xs font-bold ${
                            isActive
                              ? "border-emerald-400/20 bg-emerald-500/15 text-emerald-300"
                              : "border-red-400/20 bg-red-500/15 text-red-300"
                          }`}
                        >
                          {isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>

                      {/* CONTENT */}

                      <div className="p-5">

                        <div className="mb-3 flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <h2 className="truncate text-lg font-bold text-white">
                              {product.name}
                            </h2>

                            <p className="mt-1 truncate text-sm text-slate-500">
                              {product.category ||
                                "Uncategorized"}
                            </p>

                          </div>

                          <div className="flex shrink-0 items-center gap-1 text-sm text-amber-400">
                            <span>★</span>

                            <span>
                              {Number(
                                product.ratings || 0
                              ).toFixed(1)}
                            </span>
                          </div>

                        </div>

                        {/* PRICE */}

                        <div className="flex items-center gap-2">

                          <span className="text-xl font-black text-purple-300">
                            {formatPrice(
                              finalPrice
                            )}
                          </span>

                          {discount > 0 && (
                            <span className="text-sm text-slate-500 line-through">
                              {formatPrice(
                                Number(
                                  product.price
                                )
                              )}
                            </span>
                          )}

                        </div>

                        {/* STOCK */}

                        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/5 bg-black/10 px-4 py-3">

                          <span className="text-sm text-slate-400">
                            Inventory
                          </span>

                          <span
                            className={`text-sm font-bold ${
                              isLowStock
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }`}
                          >
                            {product.stock}{" "}
                            {isLowStock
                              ? "left"
                              : "in stock"}
                          </span>

                        </div>

                        {/* ACTIONS */}

                        <div className="mt-5 grid grid-cols-2 gap-3">

                          <Link
                            to={`/products/edit/${product._id}`}
                            className="inline-flex items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm font-bold text-purple-300 transition hover:bg-purple-500/20"
                          >
                            ✏️ Edit
                          </Link>

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              product._id
                            }
                            onClick={() =>
                              handleDelete(
                                product._id
                              )
                            }
                            className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId ===
                            product._id
                              ? "Deleting..."
                              : "🗑️ Delete"}
                          </button>

                        </div>

                      </div>

                    </article>
                  );
                })}

              </section>

              {/* ==========================================
                  PAGINATION
              ========================================== */}

              {pagination.totalPages > 1 && (
                <section className="mt-10 flex flex-wrap items-center justify-center gap-2">

                  <button
                    type="button"
                    disabled={
                      !pagination.hasPreviousPage
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) => page - 1
                      )
                    }
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ← Previous
                  </button>

                  {visiblePageNumbers.map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          setCurrentPage(page)
                        }
                        className={`h-11 min-w-11 rounded-xl px-3 text-sm font-bold transition ${
                          currentPage === page
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                            : "border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    disabled={
                      !pagination.hasNextPage
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) => page + 1
                      )
                    }
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next →
                  </button>

                </section>
              )}

            </>
          )}

      </main>
    </div>
  );
};

export default ProductManagement;

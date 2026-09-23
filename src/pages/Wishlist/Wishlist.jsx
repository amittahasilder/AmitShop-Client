// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../../api/axios";
// import useAuthStore from "../../store/authStore";

// const Wishlist = () => {
//   const navigate = useNavigate();

//   const {
//     accessToken,
//     isAuthenticated,
//   } = useAuthStore();

//   const [wishlist, setWishlist] = useState({
//     items: [],
//   });

//   const [isLoading, setIsLoading] = useState(true);
//   const [removingProduct, setRemovingProduct] = useState(null);
//   const [addingProduct, setAddingProduct] = useState(null);
//   const [isClearing, setIsClearing] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // ==========================================
//   // AUTH CONFIG
//   // ==========================================

//   const getAuthConfig = () => {
//     return {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     };
//   };

//   // ==========================================
//   // PRODUCT IMAGE
//   // ==========================================

//   const getProductImage = (product) => {
//     if (!product?.images || product.images.length === 0) {
//       return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=90";
//     }

//     const image = product.images[0];

//     if (typeof image === "string") {
//       return image;
//     }

//     return (
//       image?.url ||
//       "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=90"
//     );
//   };

//   // ==========================================
//   // PRODUCT PRICE
//   // ==========================================

//   const getProductPrice = (product) => {
//     if (
//       product?.discountPrice !== undefined &&
//       product?.discountPrice !== null &&
//       product.discountPrice < product.price
//     ) {
//       return product.discountPrice;
//     }

//     return product?.price || 0;
//   };

//   // ==========================================
//   // FORMAT PRICE
//   // ==========================================

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       maximumFractionDigits: 2,
//     }).format(price || 0);
//   };

//   // ==========================================
//   // FETCH WISHLIST
//   // ==========================================

//   const fetchWishlist = async () => {
//     try {
//       setIsLoading(true);
//       setError("");

//       if (!isAuthenticated || !accessToken) {
//         navigate("/login");
//         return;
//       }

//       const response = await api.get(
//         "/wishlist",
//         getAuthConfig()
//       );

//       if (response.data.success) {
//         setWishlist(
//           response.data.wishlist || {
//             items: [],
//           }
//         );
//       } else {
//         setError(
//           response.data.message ||
//             "Unable to load your wishlist."
//         );
//       }
//     } catch (err) {
//       console.error(
//         "Fetch Wishlist Error:",
//         err
//       );

//       if (err.response?.status === 401) {
//         navigate("/login");
//         return;
//       }

//       setError(
//         err.response?.data?.message ||
//           "Something went wrong while loading your wishlist."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ==========================================
//   // INITIAL LOAD
//   // ==========================================

//   useEffect(() => {
//     fetchWishlist();
//   }, [isAuthenticated, accessToken]);

//   // ==========================================
//   // REMOVE FROM WISHLIST
//   // ==========================================

//   const removeFromWishlist = async (
//     productId
//   ) => {
//     try {
//       setRemovingProduct(productId);
//       setError("");
//       setSuccess("");

//       const response = await api.delete(
//         `/wishlist/${productId}`,
//         getAuthConfig()
//       );

//       if (response.data.success) {
//         setWishlist(response.data.wishlist);

//         setSuccess(
//           "Product removed from wishlist."
//         );

//         setTimeout(() => {
//           setSuccess("");
//         }, 2500);
//       } else {
//         setError(
//           response.data.message ||
//             "Unable to remove product."
//         );
//       }
//     } catch (err) {
//       console.error(
//         "Remove Wishlist Error:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//           "Something went wrong while removing product."
//       );
//     } finally {
//       setRemovingProduct(null);
//     }
//   };

//   // ==========================================
//   // CLEAR WISHLIST
//   // ==========================================

//   const clearWishlist = async () => {
//     if (!wishlist.items?.length) return;

//     try {
//       setIsClearing(true);
//       setError("");
//       setSuccess("");

//       const response = await api.delete(
//         "/wishlist",
//         getAuthConfig()
//       );

//       if (response.data.success) {
//         setWishlist(response.data.wishlist);

//         setSuccess(
//           "Wishlist cleared successfully."
//         );

//         setTimeout(() => {
//           setSuccess("");
//         }, 2500);
//       } else {
//         setError(
//           response.data.message ||
//             "Unable to clear wishlist."
//         );
//       }
//     } catch (err) {
//       console.error(
//         "Clear Wishlist Error:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//           "Something went wrong while clearing wishlist."
//       );
//     } finally {
//       setIsClearing(false);
//     }
//   };

//   // ==========================================
//   // ADD TO CART
//   // ==========================================

//   const addToCart = async (productId) => {
//     try {
//       setAddingProduct(productId);
//       setError("");
//       setSuccess("");

//       const response = await api.post(
//         "/cart",
//         {
//           productId,
//           quantity: 1,
//         },
//         getAuthConfig()
//       );

//       if (response.data.success) {
//         setSuccess(
//           "Product added to cart successfully."
//         );

//         setTimeout(() => {
//           setSuccess("");
//         }, 2500);
//       } else {
//         setError(
//           response.data.message ||
//             "Unable to add product to cart."
//         );
//       }
//     } catch (err) {
//       console.error(
//         "Add To Cart Error:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//           "Something went wrong while adding product to cart."
//       );
//     } finally {
//       setAddingProduct(null);
//     }
//   };

//   // ==========================================
//   // LOADING
//   // ==========================================

//   if (isLoading) {
//     return (
//       <main className="min-h-screen bg-[#05020b] px-5 pb-24 pt-36 text-white sm:px-8 lg:px-12">
//         <div className="mx-auto max-w-7xl">
//           <div className="mb-12">
//             <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />

//             <div className="mt-5 h-12 w-80 animate-pulse rounded-2xl bg-white/10" />
//           </div>

//           <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {[1, 2, 3, 4].map((item) => (
//               <div
//                 key={item}
//                 className="h-[430px] animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.03]"
//               />
//             ))}
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // ==========================================
//   // EMPTY WISHLIST
//   // ==========================================

//   if (
//     !wishlist.items ||
//     wishlist.items.length === 0
//   ) {
//     return (
//       <main className="relative min-h-screen overflow-hidden bg-[#05020b] px-5 pb-24 pt-36 text-white sm:px-8 lg:px-12">
//         <div className="pointer-events-none absolute left-1/2 top-40 h-96 w-96 -translate-x-1/2 rounded-full bg-fuchsia-600/10 blur-[140px]" />

//         <div className="relative mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center">
//           <div className="w-full rounded-[2rem] border border-violet-400/10 bg-white/[0.025] p-10 text-center shadow-[0_30px_100px_rgba(124,58,237,0.1)] backdrop-blur-2xl sm:p-16">
//             <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-300 shadow-[0_0_50px_rgba(217,70,239,0.15)]">
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 className="h-11 w-11"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M20.8 8.6c0 5.2-8.8 10.3-8.8 10.3S3.2 13.8 3.2 8.6A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.4Z"
//                 />
//               </svg>
//             </div>

//             <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-fuchsia-300/70">
//               Saved For Later
//             </p>

//             <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
//               Your wishlist is{" "}
//               <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
//                 empty
//               </span>
//             </h1>

//             <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/45">
//               Save products you love and keep them
//               here for later. Your next favorite
//               product might be waiting.
//             </p>

//             <Link
//               to="/products"
//               className="group mt-9 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-sm font-black shadow-[0_15px_40px_rgba(139,92,246,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)]"
//             >
//               Explore Products

//               <span className="transition-transform duration-300 group-hover:translate-x-1">
//                 →
//               </span>
//             </Link>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // ==========================================
//   // MAIN WISHLIST
//   // ==========================================

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-[#05020b] px-5 pb-24 pt-36 text-white sm:px-8 lg:px-12">
//       {/* BACKGROUND */}

//       <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-violet-700/10 blur-[140px]" />

//       <div className="pointer-events-none absolute -right-40 top-[30%] h-96 w-96 rounded-full bg-fuchsia-700/10 blur-[140px]" />

//       <div className="relative mx-auto max-w-7xl">
//         {/* HEADER */}

//         <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
//           <div>
//             <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-300">
//               <span className="h-2 w-2 animate-pulse rounded-full bg-fuchsia-400" />

//               Saved Collection
//             </div>

//             <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
//               My{" "}
//               <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
//                 Wishlist
//               </span>
//             </h1>

//             <p className="mt-3 text-sm text-white/45">
//               {wishlist.items.length}{" "}
//               {wishlist.items.length === 1
//                 ? "product"
//                 : "products"}{" "}
//               saved for later.
//             </p>
//           </div>

//           {/* CLEAR */}

//           <button
//             type="button"
//             onClick={clearWishlist}
//             disabled={isClearing}
//             className="group inline-flex items-center justify-center gap-2 rounded-full border border-red-400/10 bg-red-500/[0.04] px-5 py-3 text-sm font-bold text-red-300/80 transition-all duration-300 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               className="h-4 w-4"
//               stroke="currentColor"
//               strokeWidth="1.8"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3"
//               />
//             </svg>

//             {isClearing
//               ? "Clearing..."
//               : "Clear Wishlist"}
//           </button>
//         </div>

//         {/* MESSAGES */}

//         {error && (
//           <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/[0.07] px-5 py-4 text-sm text-red-200">
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               className="mt-0.5 h-5 w-5 shrink-0"
//               stroke="currentColor"
//               strokeWidth="1.8"
//             >
//               <circle cx="12" cy="12" r="9" />
//               <path
//                 strokeLinecap="round"
//                 d="M12 8v5"
//               />
//               <path
//                 strokeLinecap="round"
//                 d="M12 16.5h.01"
//               />
//             </svg>

//             <span>{error}</span>
//           </div>
//         )}

//         {success && (
//           <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.07] px-5 py-4 text-sm text-emerald-200">
//             <span className="text-lg">
//               ✓
//             </span>

//             <span>{success}</span>
//           </div>
//         )}

//         {/* PRODUCTS */}

//         <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {wishlist.items.map((item) => {
//             const product = item.product;

//             if (!product) return null;

//             const productId = product._id;

//             const price = getProductPrice(product);

//             const originalPrice =
//               product.price || price;

//             const hasDiscount =
//               originalPrice > price;

//             const isRemoving =
//               removingProduct === productId;

//             const isAdding =
//               addingProduct === productId;

//             return (
//               <article
//                 key={productId}
//                 className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] shadow-[0_20px_70px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-400/25 hover:bg-white/[0.04] hover:shadow-[0_30px_90px_rgba(124,58,237,0.15)]"
//               >
//                 {/* IMAGE */}

//                 <div className="relative aspect-square overflow-hidden bg-black/20">
//                   <Link
//                     to={`/products/${productId}`}
//                     className="block h-full w-full"
//                   >
//                     <img
//                       src={getProductImage(product)}
//                       alt={
//                         product.name ||
//                         "Product"
//                       }
//                       className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
//                     />

//                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
//                   </Link>

//                   {/* SALE */}

//                   {hasDiscount && (
//                     <span className="absolute left-4 top-4 rounded-full bg-violet-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-lg">
//                       Sale
//                     </span>
//                   )}

//                   {/* HEART */}

//                   <button
//                     type="button"
//                     onClick={() =>
//                       removeFromWishlist(
//                         productId
//                       )
//                     }
//                     disabled={
//                       isRemoving ||
//                       isAdding
//                     }
//                     className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-fuchsia-300 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:bg-red-500/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
//                     aria-label="Remove from wishlist"
//                   >
//                     {isRemoving ? (
//                       <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-fuchsia-300" />
//                     ) : (
//                       <svg
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                         className="h-5 w-5"
//                       >
//                         <path d="M12 21s-7.5-4.6-9.5-9.1C.7 8.4 2.7 5 6.2 5c2 0 3.4 1.1 4.3 2.5C11.4 6.1 12.8 5 14.8 5c3.5 0 5.5 3.4 3.7 6.9C19.5 16.4 12 21 12 21Z" />
//                       </svg>
//                     )}
//                   </button>
//                 </div>

//                 {/* CONTENT */}

//                 <div className="p-5">
//                   {product.brand && (
//                     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
//                       {product.brand}
//                     </p>
//                   )}

//                   <Link
//                     to={`/products/${productId}`}
//                     className="mt-2 block line-clamp-2 min-h-[3.5rem] text-lg font-black leading-7 text-white transition-colors hover:text-violet-300"
//                   >
//                     {product.name}
//                   </Link>

//                   {/* RATING */}

//                   <div className="mt-3 flex items-center gap-2">
//                     <div className="flex items-center gap-0.5 text-sm text-amber-300">
//                       ★★★★★
//                     </div>

//                     <span className="text-xs text-white/30">
//                       {product.ratings
//                         ? Number(
//                             product.ratings
//                           ).toFixed(1)
//                         : "New"}
//                     </span>
//                   </div>

//                   {/* PRICE */}

//                   <div className="mt-4 flex items-end gap-2">
//                     <span className="text-xl font-black">
//                       {formatPrice(price)}
//                     </span>

//                     {hasDiscount && (
//                       <span className="pb-0.5 text-xs text-white/30 line-through">
//                         {formatPrice(
//                           originalPrice
//                         )}
//                       </span>
//                     )}
//                   </div>

//                   {/* ACTIONS */}

//                   <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         addToCart(productId)
//                       }
//                       disabled={
//                         isAdding ||
//                         isRemoving ||
//                         !product.stock ||
//                         product.stock < 1
//                       }
//                       className="group/btn flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-xs font-black shadow-[0_10px_30px_rgba(124,58,237,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(124,58,237,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
//                     >
//                       {isAdding ? (
//                         <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
//                       ) : (
//                         <>
//                           <svg
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             className="h-4 w-4"
//                             stroke="currentColor"
//                             strokeWidth="1.8"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6"
//                             />
//                             <path
//                               strokeLinecap="round"
//                               d="M10 20h.01M18 20h.01"
//                             />
//                           </svg>

//                           {product.stock
//                             ? "Add to Cart"
//                             : "Out of Stock"}
//                         </>
//                       )}
//                     </button>

//                     <Link
//                       to={`/products/${productId}`}
//                       className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs font-bold text-white/50 transition-all duration-300 hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-white"
//                     >
//                       View
//                     </Link>
//                   </div>

//                   {/* STOCK */}

//                   <div className="mt-4 flex items-center gap-2">
//                     <span
//                       className={`h-1.5 w-1.5 rounded-full ${
//                         product.stock > 5
//                           ? "bg-emerald-400"
//                           : product.stock > 0
//                           ? "bg-amber-400"
//                           : "bg-red-400"
//                       }`}
//                     />

//                     <span className="text-[11px] text-white/30">
//                       {product.stock > 5
//                         ? "In stock"
//                         : product.stock > 0
//                         ? `Only ${product.stock} left`
//                         : "Out of stock"}
//                     </span>
//                   </div>
//                 </div>
//               </article>
//             );
//           })}
//         </section>

//         {/* BOTTOM INFO */}

//         <div className="mt-12 grid gap-4 sm:grid-cols-3">
//           {[
//             {
//               icon: "♡",
//               title: "Save Favorites",
//               text: "Keep products you love in one place.",
//             },
//             {
//               icon: "🛒",
//               title: "Shop Anytime",
//               text: "Move saved products to your cart whenever you're ready.",
//             },
//             {
//               icon: "🔒",
//               title: "Secure Shopping",
//               text: "Your wishlist is private to your account.",
//             },
//           ].map((item) => (
//             <div
//               key={item.title}
//               className="rounded-3xl border border-white/5 bg-white/[0.02] p-5 text-center"
//             >
//               <div className="text-2xl text-violet-300">
//                 {item.icon}
//               </div>

//               <h3 className="mt-3 text-sm font-black">
//                 {item.title}
//               </h3>

//               <p className="mt-2 text-xs leading-5 text-white/25">
//                 {item.text}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Wishlist;



import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/700x700/171225/ffffff?text=AmitShop";

const Wishlist = () => {
  const navigate = useNavigate();

  const { accessToken, isAuthenticated } = useAuthStore();

  const [wishlist, setWishlist] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // =========================================================
  // AUTH CONFIG
  // =========================================================

  const getAuthConfig = () => ({
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {},
  });

  // =========================================================
  // FETCH WISHLIST
  // =========================================================

  useEffect(() => {
    const loadWishlist = async () => {
      if (!isAuthenticated || !accessToken) {
        setIsLoading(false);

        if (!isAuthenticated) {
          navigate("/login");
        }

        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await api.get(
          "/wishlist",
          getAuthConfig()
        );

        setWishlist(
          response.data?.wishlist || {
            items: [],
          }
        );
      } catch (error) {
        console.error("Wishlist fetch error:", error);

        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }

        setErrorMessage(
          error.response?.data?.message ||
            "Failed to load wishlist."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [isAuthenticated, accessToken, navigate]);

  // =========================================================
  // WISHLIST ITEMS
  // =========================================================

  const items = Array.isArray(wishlist?.items)
    ? wishlist.items
    : [];

  // =========================================================
  // HELPERS
  // =========================================================

  const getProduct = (item) => {
    return item?.product || item;
  };

  const getProductId = (item) => {
    const product = getProduct(item);

    return product?._id || item?._id;
  };

  const getProductImage = (product) => {
    if (!product) {
      return FALLBACK_IMAGE;
    }

    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];

      if (typeof firstImage === "string") {
        return firstImage;
      }

      if (firstImage?.url) {
        return firstImage.url;
      }

      if (firstImage?.secure_url) {
        return firstImage.secure_url;
      }
    }

    if (product.image) {
      return product.image;
    }

    return FALLBACK_IMAGE;
  };

  const getOriginalPrice = (product) => {
    return Number(product?.price || 0);
  };

  const getDiscountPrice = (product) => {
    const discountPrice = Number(product?.discountPrice || 0);

    if (
      discountPrice > 0 &&
      discountPrice < getOriginalPrice(product)
    ) {
      return discountPrice;
    }

    return null;
  };

  const getFinalPrice = (product) => {
    return (
      getDiscountPrice(product) ??
      getOriginalPrice(product)
    );
  };

  const getDiscountPercentage = (product) => {
    const originalPrice = getOriginalPrice(product);
    const discountPrice = getDiscountPrice(product);

    if (!discountPrice || originalPrice <= 0) {
      return 0;
    }

    return Math.round(
      ((originalPrice - discountPrice) / originalPrice) * 100
    );
  };

  const getRating = (product) => {
    return Number(
      product?.ratingAverage ??
        product?.rating ??
        product?.ratings ??
        0
    );
  };

  const getStock = (product) => {
    return Number(product?.stock ?? 0);
  };

  // =========================================================
  // REMOVE ITEM
  // =========================================================

  const handleRemove = async (productId) => {
    if (!productId) {
      return;
    }

    try {
      setActionLoading(`remove-${productId}`);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await api.delete(
        `/wishlist/${productId}`,
        getAuthConfig()
      );

      setWishlist(
        response.data?.wishlist || {
          items: [],
        }
      );

      window.dispatchEvent(
        new Event("amitshop:wishlist-updated")
      );

      setSuccessMessage("Removed from wishlist.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (error) {
      console.error("Remove wishlist error:", error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to remove item."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================================================
  // CLEAR WISHLIST
  // =========================================================

  const handleClearWishlist = async () => {
    if (items.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear your entire wishlist?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading("clear");
      setErrorMessage("");
      setSuccessMessage("");

      const response = await api.delete(
        "/wishlist",
        getAuthConfig()
      );

      setWishlist(
        response.data?.wishlist || {
          items: [],
        }
      );

      window.dispatchEvent(
        new Event("amitshop:wishlist-updated")
      );

      setSuccessMessage("Wishlist cleared successfully.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (error) {
      console.error("Clear wishlist error:", error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to clear wishlist."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = async (product) => {
    const productId = product?._id;

    if (!productId) {
      setErrorMessage("Product information is missing.");
      return;
    }

    if (!isAuthenticated || !accessToken) {
      navigate("/login");
      return;
    }

    if (getStock(product) <= 0) {
      setErrorMessage("This product is currently out of stock.");
      return;
    }

    try {
      setActionLoading(`cart-${productId}`);
      setErrorMessage("");
      setSuccessMessage("");

      await api.post(
        "/cart",
        {
          productId,
          quantity: 1,
        },
        getAuthConfig()
      );

      window.dispatchEvent(
        new Event("amitshop:cart-updated")
      );

      setSuccessMessage("Added to cart successfully.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (error) {
      console.error("Add to cart error:", error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to add product to cart."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08050f] text-white px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <div className="h-10 w-64 rounded-xl bg-white/10 animate-pulse" />
            <div className="mt-3 h-5 w-80 rounded-lg bg-white/5 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
              >
                <div className="aspect-square animate-pulse bg-white/10" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 rounded bg-white/10 animate-pulse" />
                  <div className="h-4 w-1/2 rounded bg-white/10 animate-pulse" />
                  <div className="h-10 w-full rounded-xl bg-white/10 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // STATS
  // =========================================================

  const totalItems = items.length;

  const inStockItems = items.filter((item) => {
    const product = getProduct(item);
    return getStock(product) > 0;
  }).length;

  const outOfStockItems = totalItems - inStockItems;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08050f] text-white">
      {/* =====================================================
          ANIMATION STYLES
      ====================================================== */}

      <style>{`
        @keyframes wishlistFadeUp {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.97);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes wishlistFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-10px) rotate(4deg);
          }
        }

        @keyframes wishlistGlow {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(1);
          }

          50% {
            opacity: 0.55;
            transform: scale(1.12);
          }
        }

        @keyframes wishlistPulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.08);
          }
        }

        @keyframes wishlistShimmer {
          0% {
            background-position: -200% center;
          }

          100% {
            background-position: 200% center;
          }
        }

        .wishlist-card-enter {
          animation: wishlistFadeUp
            0.65s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .wishlist-float {
          animation: wishlistFloat 5s ease-in-out infinite;
        }

        .wishlist-glow {
          animation: wishlistGlow 5s ease-in-out infinite;
        }

        .wishlist-pulse {
          animation: wishlistPulse 2.5s ease-in-out infinite;
        }

        .wishlist-shimmer {
          background-size: 200% auto;
          animation: wishlistShimmer 4s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .wishlist-card-enter,
          .wishlist-float,
          .wishlist-glow,
          .wishlist-pulse,
          .wishlist-shimmer {
            animation: none !important;
          }
        }
      `}</style>

      {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="wishlist-glow absolute -left-32 top-20 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />

        <div
          className="wishlist-glow absolute -right-32 top-80 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-3xl"
          style={{ animationDelay: "1.2s" }}
        />

        <div
          className="wishlist-glow absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-200 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-purple-400 wishlist-pulse" />
              Your Personal Collection
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              My{" "}
              <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                Wishlist
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
              Save the products you love and keep them ready
              for your next purchase.
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearWishlist}
              disabled={actionLoading === "clear"}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition duration-300 hover:-translate-y-1 hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="transition-transform duration-300 group-hover:rotate-12">
                🗑️
              </span>

              {actionLoading === "clear"
                ? "Clearing..."
                : "Clear Wishlist"}
            </button>
          )}
        </div>

        {/* ===================================================
            ALERTS
        ==================================================== */}

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-200 shadow-lg shadow-red-950/20">
            <div className="flex items-start gap-3">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200 shadow-lg shadow-emerald-950/20">
            <div className="flex items-center gap-3">
              <span className="wishlist-pulse">✓</span>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* ===================================================
            STATS
        ==================================================== */}

        {items.length > 0 && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-purple-400/20 hover:bg-white/[0.06]">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Total Saved
              </p>

              <p className="mt-2 text-3xl font-black text-white">
                {totalItems}
              </p>
            </div>

            <div className="group rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.04] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                In Stock
              </p>

              <p className="mt-2 text-3xl font-black text-emerald-300">
                {inStockItems}
              </p>
            </div>

            <div className="group rounded-2xl border border-red-400/10 bg-red-500/[0.04] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-red-400/20">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Out of Stock
              </p>

              <p className="mt-2 text-3xl font-black text-red-300">
                {outOfStockItems}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            EMPTY STATE
        ==================================================== */}

        {items.length === 0 ? (
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] px-6 py-20 text-center backdrop-blur-2xl sm:px-10">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-3xl" />

            <div className="relative z-10">
              <div className="wishlist-float mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-3xl border border-purple-400/20 bg-purple-500/10 text-5xl shadow-2xl shadow-purple-950/30">
                ♡
              </div>

              <h2 className="text-2xl font-bold sm:text-3xl">
                Your wishlist is empty
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/45">
                You haven't saved any products yet. Explore
                AmitShop and add your favorite products here.
              </p>

              <Link
                to="/products"
                className="wishlist-shimmer mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-purple-950/30 transition duration-300 hover:-translate-y-1 hover:scale-[1.02]"
              >
                Explore Products
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        ) : (
          /* =================================================
             PRODUCT GRID
          ================================================== */

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item, index) => {
              const product = getProduct(item);
              const productId = getProductId(item);

              const originalPrice = getOriginalPrice(product);
              const discountPrice = getDiscountPrice(product);
              const finalPrice = getFinalPrice(product);
              const discountPercentage =
                getDiscountPercentage(product);

              const rating = getRating(product);
              const stock = getStock(product);

              const image = getProductImage(product);

              return (
                <article
                  key={productId || item?._id || index}
                  className="wishlist-card-enter group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-purple-400/25 hover:bg-white/[0.065] hover:shadow-purple-950/20"
                  style={{
                    animationDelay: `${index * 90}ms`,
                  }}
                >
                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    <Link
                      to={`/products/${productId}`}
                      className="block"
                    >
                      <div className="aspect-square overflow-hidden bg-[#120c1f]">
                        <img
                          src={image}
                          alt={product?.name || "Product"}
                          onError={(event) => {
                            event.currentTarget.src =
                              FALLBACK_IMAGE;
                          }}
                          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                        />
                      </div>
                    </Link>

                    {/* IMAGE OVERLAY */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                    {/* DISCOUNT */}
                    {discountPercentage > 0 && (
                      <div className="absolute left-4 top-4 rounded-full border border-emerald-300/20 bg-emerald-400/15 px-3 py-1.5 text-xs font-bold text-emerald-200 backdrop-blur-xl">
                        -{discountPercentage}%
                      </div>
                    )}

                    {/* REMOVE */}
                    <button
                      type="button"
                      onClick={() => handleRemove(productId)}
                      disabled={
                        actionLoading === `remove-${productId}`
                      }
                      aria-label="Remove from wishlist"
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/80 backdrop-blur-xl transition duration-300 hover:scale-110 hover:border-red-400/30 hover:bg-red-500/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionLoading ===
                      `remove-${productId}` ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        "♥"
                      )}
                    </button>

                    {/* STOCK */}
                    <div className="absolute bottom-4 left-4">
                      {stock > 0 ? (
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-200 backdrop-blur-xl">
                          In Stock
                        </span>
                      ) : (
                        <span className="rounded-full border border-red-400/20 bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-200 backdrop-blur-xl">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    {/* CATEGORY */}
                    {product?.category && (
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-300/70">
                        {typeof product.category === "object"
                          ? product.category?.name
                          : product.category}
                      </p>
                    )}

                    {/* NAME */}
                    <Link
                      to={`/products/${productId}`}
                      className="line-clamp-2 min-h-[3.5rem] text-lg font-bold leading-7 text-white transition duration-300 hover:text-purple-300"
                    >
                      {product?.name || "Unnamed Product"}
                    </Link>

                    {/* RATING */}
                    {rating > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-yellow-300">
                          <span>★</span>
                          <span>{rating.toFixed(1)}</span>
                        </div>

                        <span className="text-xs text-white/30">
                          Product rating
                        </span>
                      </div>
                    )}

                    {/* PRICE */}
                    <div className="mt-4 flex items-end gap-2">
                      <span className="text-2xl font-black text-white">
                        ${finalPrice.toFixed(2)}
                      </span>

                      {discountPrice && (
                        <span className="pb-0.5 text-sm text-white/35 line-through">
                          ${originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-5 flex gap-2">
                      <Link
                        to={`/products/${productId}`}
                        className="flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm font-semibold text-white/80 transition duration-300 hover:-translate-y-0.5 hover:border-purple-400/20 hover:bg-purple-500/10 hover:text-white"
                      >
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        disabled={
                          stock <= 0 ||
                          actionLoading === `cart-${productId}`
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-3 py-3 text-sm font-bold text-white shadow-lg shadow-purple-950/30 transition duration-300 hover:-translate-y-0.5 hover:from-purple-500 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {actionLoading === `cart-${productId}` ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <span>🛒</span>
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ===================================================
            FOOTER CTA
        ==================================================== */}

        {items.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 rounded-2xl border border-purple-400/20 bg-purple-500/10 px-6 py-3.5 text-sm font-semibold text-purple-200 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:bg-purple-500/15"
            >
              Continue Shopping
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
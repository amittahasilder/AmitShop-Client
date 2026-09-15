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

const Wishlist = () => {
  const navigate = useNavigate();

  const {
    accessToken,
    isAuthenticated,
  } = useAuthStore();

  const [wishlist, setWishlist] = useState({
    items: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [isClearing, setIsClearing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------------------------
  // AUTH CONFIG
  // --------------------------------------------------
  const getAuthConfig = () => {
    if (!accessToken) return {};

    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  };

  // --------------------------------------------------
  // FETCH WISHLIST
  // --------------------------------------------------
  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get(
        "/wishlist",
        getAuthConfig()
      );

      if (response.data.success) {
        setWishlist(
          response.data.wishlist || {
            items: [],
          }
        );
      }
    } catch (err) {
      console.error("Wishlist Fetch Error:", err);

      if (err.response?.status === 401) {
        setError("Please login to view your wishlist.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load wishlist."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchWishlist();
  }, [isAuthenticated]);

  // --------------------------------------------------
  // SUCCESS MESSAGE AUTO CLEAR
  // --------------------------------------------------
  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [success]);

  // --------------------------------------------------
  // REMOVE FROM WISHLIST
  // --------------------------------------------------
  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);
      setError("");
      setSuccess("");

      const response = await api.delete(
        `/wishlist/${productId}`,
        getAuthConfig()
      );

      if (response.data.success) {
        setWishlist(
          response.data.wishlist || {
            items: [],
          }
        );

        window.dispatchEvent(
          new Event("amitshop:wishlist-updated")
        );

        setSuccess(
          "Product removed from wishlist."
        );
      }
    } catch (err) {
      console.error("Remove Wishlist Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to remove product."
      );
    } finally {
      setRemovingId(null);
    }
  };

  // --------------------------------------------------
  // CLEAR WISHLIST
  // --------------------------------------------------
  const handleClearWishlist = async () => {
    if (!wishlist.items?.length) return;

    const confirmed = window.confirm(
      "Are you sure you want to clear your entire wishlist?"
    );

    if (!confirmed) return;

    try {
      setIsClearing(true);
      setError("");
      setSuccess("");

      const response = await api.delete(
        "/wishlist",
        getAuthConfig()
      );

      if (response.data.success) {
        setWishlist(
          response.data.wishlist || {
            items: [],
          }
        );

        window.dispatchEvent(
          new Event("amitshop:wishlist-updated")
        );

        setSuccess(
          "Wishlist cleared successfully."
        );
      }
    } catch (err) {
      console.error("Clear Wishlist Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to clear wishlist."
      );
    } finally {
      setIsClearing(false);
    }
  };

  // --------------------------------------------------
  // ADD TO CART
  // --------------------------------------------------
  const handleAddToCart = async (product) => {
    const productId =
      product?.product?._id ||
      product?._id;

    if (!productId) return;

    try {
      setAddingId(productId);
      setError("");
      setSuccess("");

      const response = await api.post(
        "/cart",
        {
          productId,
          quantity: 1,
        },
        getAuthConfig()
      );

      if (response.data.success) {
        window.dispatchEvent(
          new Event("amitshop:cart-updated")
        );

        setSuccess(
          "Product added to cart successfully."
        );
      }
    } catch (err) {
      console.error("Add To Cart Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to add product to cart."
      );
    } finally {
      setAddingId(null);
    }
  };

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------
  const getProduct = (item) => {
    return item?.product || item;
  };

  const getProductImage = (product) => {
    if (!product) {
      return "https://via.placeholder.com/600x600?text=AmitShop";
    }

    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      const firstImage = product.images[0];

      if (typeof firstImage === "string") {
        return firstImage;
      }

      return (
        firstImage?.url ||
        firstImage?.secure_url ||
        "https://via.placeholder.com/600x600?text=AmitShop"
      );
    }

    if (product.image) {
      return product.image;
    }

    return "https://via.placeholder.com/600x600?text=AmitShop";
  };

  const getProductPrice = (product) => {
    if (!product) return 0;

    const price = Number(product.price || 0);
    const discountPrice = Number(
      product.discountPrice || 0
    );

    if (
      discountPrice > 0 &&
      discountPrice < price
    ) {
      return discountPrice;
    }

    return price;
  };

  const getDiscountPercent = (product) => {
    if (!product) return 0;

    const price = Number(product.price || 0);
    const discountPrice = Number(
      product.discountPrice || 0
    );

    if (
      price > 0 &&
      discountPrice > 0 &&
      discountPrice < price
    ) {
      return Math.round(
        ((price - discountPrice) / price) * 100
      );
    }

    return 0;
  };

  const formatPrice = (price) => {
    return `$${Number(price || 0).toFixed(2)}`;
  };

  const items = Array.isArray(wishlist.items)
    ? wishlist.items
    : [];

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05020b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />

          <p className="mt-5 text-sm text-white/50">
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-[#05020b] text-white">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-700/20 blur-[120px]" />

        <div className="absolute top-[45%] -left-40 h-80 w-80 rounded-full bg-fuchsia-700/10 blur-[120px]" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-700/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-300">
              <span className="text-base">♡</span>
              Your Collection
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              My Wishlist
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/45 sm:text-base">
              Save your favorite products and keep
              everything you love in one place.
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearWishlist}
              disabled={isClearing}
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3 text-sm font-semibold text-red-300 transition hover:border-red-500/40 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>
                {isClearing ? "Clearing..." : "Clear Wishlist"}
              </span>
            </button>
          )}
        </div>

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300">
            ✓ {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Empty Wishlist */}
        {items.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.06] via-transparent to-fuchsia-500/[0.04]" />

            <div className="relative mx-auto max-w-md">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/10 text-5xl text-violet-300 shadow-2xl shadow-violet-900/20">
                ♡
              </div>

              <h2 className="mt-7 text-2xl font-bold">
                Your wishlist is empty
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/45">
                You haven't saved any products yet.
                Explore AmitShop and add your favorite
                products here.
              </p>

              <Link
                to="/products"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/30 transition hover:-translate-y-0.5 hover:shadow-violet-900/50"
              >
                Explore Products →
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Wishlist Stats */}
            <div className="mb-7 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Saved Items
                </p>

                <p className="mt-2 text-2xl font-black">
                  {items.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Available
                </p>

                <p className="mt-2 text-2xl font-black text-emerald-300">
                  {
                    items.filter((item) => {
                      const product = getProduct(item);
                      return Number(product?.stock || 0) > 0;
                    }).length
                  }
                </p>
              </div>

              <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:block">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  On Sale
                </p>

                <p className="mt-2 text-2xl font-black text-violet-300">
                  {
                    items.filter(
                      (item) =>
                        getDiscountPercent(
                          getProduct(item)
                        ) > 0
                    ).length
                  }
                </p>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item, index) => {
                const product = getProduct(item);

                const productId = product?._id;

                const price =
                  getProductPrice(product);

                const originalPrice = Number(
                  product?.price || 0
                );

                const discount =
                  getDiscountPercent(product);

                const stock = Number(
                  product?.stock || 0
                );

                const isOutOfStock = stock <= 0;

                return (
                  <div
                    key={
                      productId ||
                      item?._id ||
                      index
                    }
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.05]"
                  >
                    {/* Image */}
                    <Link
                      to={
                        productId
                          ? `/products/${productId}`
                          : "/products"
                      }
                      className="relative block aspect-square overflow-hidden bg-black/20"
                    >
                      <img
                        src={getProductImage(product)}
                        alt={
                          product?.name ||
                          "AmitShop Product"
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/600x600?text=AmitShop";
                        }}
                      />

                      {/* Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                      {/* Discount */}
                      {discount > 0 && (
                        <div className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-black shadow-lg">
                          -{discount}%
                        </div>
                      )}

                      {/* Wishlist Heart */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(productId);
                        }}
                        disabled={
                          removingId === productId
                        }
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-xl text-red-300 backdrop-blur-md transition hover:scale-110 hover:bg-red-500/20 disabled:opacity-50"
                        aria-label="Remove from wishlist"
                      >
                        {removingId === productId
                          ? "..."
                          : "♥"}
                      </button>

                      {/* Stock */}
                      <div className="absolute bottom-4 left-4">
                        {isOutOfStock ? (
                          <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 backdrop-blur-md">
                            Out of stock
                          </span>
                        ) : (
                          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md">
                            {stock} in stock
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-5">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs font-medium uppercase tracking-wider text-violet-300/70">
                          {product?.brand ||
                            product?.category ||
                            "AmitShop"}
                        </span>

                        {product?.rating !== undefined && (
                          <span className="text-xs text-amber-300">
                            ★{" "}
                            {Number(
                              product.rating || 0
                            ).toFixed(1)}
                          </span>
                        )}
                      </div>

                      <Link
                        to={
                          productId
                            ? `/products/${productId}`
                            : "/products"
                        }
                      >
                        <h3 className="min-h-[48px] text-base font-bold leading-6 text-white transition group-hover:text-violet-300">
                          {product?.name ||
                            "Product"}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="mt-4 flex items-center gap-3">
                        <span className="text-xl font-black">
                          {formatPrice(price)}
                        </span>

                        {discount > 0 &&
                          originalPrice > price && (
                            <span className="text-sm text-white/30 line-through">
                              {formatPrice(
                                originalPrice
                              )}
                            </span>
                          )}
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex gap-2">
                        <button
                          onClick={() =>
                            handleAddToCart(product)
                          }
                          disabled={
                            isOutOfStock ||
                            addingId === productId
                          }
                          className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/20 transition hover:-translate-y-0.5 hover:shadow-violet-900/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                        >
                          {addingId === productId
                            ? "Adding..."
                            : isOutOfStock
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </button>

                        <button
                          onClick={() =>
                            handleRemove(productId)
                          }
                          disabled={
                            removingId === productId
                          }
                          className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg text-white/60 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-40"
                          aria-label="Remove product"
                        >
                          {removingId === productId
                            ? "..."
                            : "×"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-3xl border border-violet-500/10 bg-gradient-to-r from-violet-500/[0.08] to-fuchsia-500/[0.05] p-6 sm:flex-row">
              <div>
                <h3 className="font-bold">
                  Looking for more?
                </h3>

                <p className="mt-1 text-sm text-white/40">
                  Discover more products from AmitShop.
                </p>
              </div>

              <Link
                to="/products"
                className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-6 py-3 text-sm font-bold text-violet-200 transition hover:bg-violet-500/20"
              >
                Continue Shopping →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
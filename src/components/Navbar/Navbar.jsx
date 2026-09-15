// import { useEffect, useState } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import useAuthStore from "../../store/authStore";

// const Navbar = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [productsOpen, setProductsOpen] = useState(false);
//   const [categoriesOpen, setCategoriesOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(true);
//   const [profileOpen, setProfileOpen] = useState(false);

//   const navigate = useNavigate();
//   const {
//     user,
//     isAuthenticated,
//     getCurrentUser,
//     // logout,
//   } = useAuthStore();

//   useEffect(() => {
//     getCurrentUser();
//   }, [getCurrentUser]);

//   const closeMenus = () => {
//     setProductsOpen(false);
//     setCategoriesOpen(false);
//     setProfileOpen(false);
//     setMobileOpen(false);
//   };

//   const navLinkClass = ({ isActive }) => `
//     group relative flex items-center gap-2
//     rounded-xl px-4 py-2.5
//     text-[13px] font-semibold tracking-wide
//     transition-all duration-300 ease-out

//     ${
//       isActive
//         ? `
//           bg-gradient-to-r
//           from-violet-500/20
//           via-purple-500/15
//           to-fuchsia-500/10
//           text-white
//           shadow-[inset_0_0_25px_rgba(139,92,246,0.08)]
//         `
//         : `
//           text-white/55
//           hover:-translate-y-[1px]
//           hover:bg-white/[0.045]
//           hover:text-white
//         `
//     }
//   `;

//   const mobileItems = [
//     ["Home", "/"],
//     ["Products", "/products"],
//     ["Deals", "/deals"],
//     ["Categories", "/categories"],
//     ["About", "/about"],
//     ["Contact", "/contact"],
//   ];

//   const categories = [
//     ["📱", "Electronics", "Tech & gadgets"],
//     ["👟", "Fashion", "Style & trends"],
//     ["⌚", "Watches", "Premium watches"],
//     ["🎧", "Audio", "Sound & music"],
//     ["🏠", "Home", "Home essentials"],
//     ["🎮", "Gaming", "Gaming gear"],
//   ];

//   return (
//     <>
//       {/* =====================================================
//           AMBIENT BACKGROUND
//       ====================================================== */}

//       <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-52 overflow-hidden">
//         <div
//           className="
//             absolute left-[5%] top-0
//             h-36 w-36
//             rounded-full
//             bg-violet-600/20
//             blur-[70px]
//             animate-pulse
//           "
//         />

//         <div
//           className="
//             absolute right-[8%] top-2
//             h-40 w-40
//             rounded-full
//             bg-fuchsia-600/15
//             blur-[80px]
//             animate-pulse
//           "
//           style={{ animationDelay: "1.2s" }}
//         />

//         <div
//           className="
//             absolute left-1/2 top-0
//             h-24 w-96
//             -translate-x-1/2
//             rounded-full
//             bg-purple-600/10
//             blur-[80px]
//           "
//         />
//       </div>

//       {/* =====================================================
//           ANNOUNCEMENT BAR
//       ====================================================== */}

//       <div
//         className="
//           fixed left-0 right-0 top-0 z-[70]
//           hidden h-8
//           border-b border-violet-500/10
//           bg-[#05020b]/90
//           backdrop-blur-2xl
//           md:block
//         "
//       >
//         <div
//           className="
//             mx-auto flex h-full max-w-7xl
//             items-center justify-between
//             px-6
//             text-[10px]
//             font-medium
//             tracking-wide
//             text-white/45
//           "
//         >
//           <div className="flex items-center gap-5">

//             <span className="flex items-center gap-1.5">
//               <span className="animate-pulse text-violet-400">
//                 ✦
//               </span>

//               Free Shipping on Orders Over $50
//             </span>

//             <span className="h-3 w-px bg-white/10" />

//             <span className="flex items-center gap-1.5">
//               <span className="text-fuchsia-400">
//                 ◆
//               </span>

//               20% OFF First Order
//             </span>

//             <span className="h-3 w-px bg-white/10" />

//             <span className="text-purple-300/60">
//               Shop Smart • Live Better
//             </span>
//           </div>

//           <div className="flex items-center gap-4">
//             <span>24/7 Support</span>

//             <span className="h-3 w-px bg-white/10" />

//             <span>Secure Payments</span>
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           NAVBAR
//       ====================================================== */}

//       <header
//         className="
//           fixed left-0 right-0 top-0 z-50
//           px-3 pt-3
//           md:top-8 md:px-6 md:pt-4
//           lg:px-8
//         "
//       >
//         <nav
//           className="
//             group/nav
//             relative mx-auto max-w-7xl
//             overflow-visible
//             rounded-[22px]

//             border border-violet-400/20

//             bg-gradient-to-r
//             from-[#18082e]/90
//             via-[#080510]/95
//             to-[#170721]/90

//             shadow-[0_20px_80px_rgba(76,29,149,0.28)]

//             backdrop-blur-[30px]

//             transition-all duration-500

//             hover:border-violet-400/35

//             hover:shadow-[0_25px_100px_rgba(109,40,217,0.38)]
//           "
//         >

//           {/* =================================================
//               ANIMATED GRADIENT BORDER
//           ================================================== */}

//           <div
//             className="
//               pointer-events-none
//               absolute left-[5%] right-[5%] top-0
//               h-px
//               overflow-hidden
//               bg-gradient-to-r
//               from-transparent
//               via-violet-400/80
//               to-transparent
//             "
//           >
//             <div
//               className="
//                 absolute
//                 -left-1/3
//                 top-0
//                 h-full
//                 w-1/3

//                 bg-gradient-to-r
//                 from-transparent
//                 via-white
//                 to-transparent

//                 opacity-80
//                 blur-[1px]

//                 transition-all
//                 duration-[1400ms]
//                 ease-out

//                 group-hover/nav:left-full
//               "
//             />
//           </div>

//           {/* =================================================
//               MAIN ROW
//           ================================================== */}

//           <div
//             className="
//               relative flex h-[70px]
//               items-center justify-between
//               px-4
//               sm:px-5
//               lg:px-6
//             "
//           >

//             {/* =================================================
//                 LOGO
//             ================================================== */}

//             <Link
//               to="/"
//               onClick={closeMenus}
//               className="group/logo flex shrink-0 items-center gap-3"
//             >
//               {/* Logo Box */}

//               <div
//                 className="
//                   relative
//                   flex h-11 w-11
//                   items-center justify-center
//                   overflow-hidden
//                   rounded-[14px]

//                   border border-violet-300/25

//                   bg-gradient-to-br
//                   from-violet-500
//                   via-purple-600
//                   to-fuchsia-600

//                   shadow-[0_8px_35px_rgba(139,92,246,0.4)]

//                   transition-all
//                   duration-500
//                   ease-out

//                   group-hover/logo:scale-110
//                   group-hover/logo:-rotate-3

//                   group-hover/logo:shadow-[0_12px_50px_rgba(217,70,239,0.6)]
//                 "
//               >

//                 {/* Inner gradient */}

//                 <div
//                   className="
//                     absolute inset-0
//                     bg-gradient-to-br
//                     from-white/25
//                     via-transparent
//                     to-black/25
//                   "
//                 />

//                 {/* Shine */}

//                 <div
//                   className="
//                     absolute
//                     -left-16
//                     top-[-20%]
//                     h-[140%]
//                     w-8
//                     rotate-[20deg]
//                     bg-white/35
//                     blur-md

//                     transition-transform
//                     duration-700
//                     ease-out

//                     group-hover/logo:translate-x-24
//                   "
//                 />

//                 {/* Glow */}

//                 <div
//                   className="
//                     absolute inset-2
//                     rounded-xl
//                     border border-white/10
//                   "
//                 />

//                 <span
//                   className="
//                     relative
//                     text-xl
//                     font-black
//                     text-white
//                     drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]
//                   "
//                 >
//                   A
//                 </span>
//               </div>

//               {/* Brand */}

//               <div className="hidden sm:block">
//                 <div
//                   className="
//                     text-[21px]
//                     font-black
//                     leading-none
//                     tracking-tight
//                     text-white
//                   "
//                 >
//                   Amit
//                   <span
//                     className="
//                       bg-gradient-to-r
//                       from-violet-400
//                       via-purple-400
//                       to-fuchsia-400
//                       bg-clip-text
//                       text-transparent
//                     "
//                   >
//                     Shop
//                   </span>
//                 </div>

//                 <div
//                   className="
//                     mt-1
//                     text-[8px]
//                     font-bold
//                     uppercase
//                     tracking-[0.3em]
//                     text-violet-300/45
//                   "
//                 >
//                   Shop Smart • Live Better
//                 </div>
//               </div>
//             </Link>

//             {/* =================================================
//                 DESKTOP NAV
//             ================================================== */}

//             <div
//               className="
//                 hidden
//                 items-center
//                 gap-1
//                 xl:flex
//               "
//             >

//               {/* HOME */}

//               <NavLink
//                 to="/"
//                 className={navLinkClass}
//               >
//                 <span className="text-[15px]">
//                   ⌂
//                 </span>

//                 Home

//                 <span
//                   className="
//                     absolute
//                     bottom-1
//                     left-1/2
//                     h-[2px]
//                     w-0
//                     -translate-x-1/2
//                     rounded-full
//                     bg-gradient-to-r
//                     from-violet-400
//                     to-fuchsia-400

//                     shadow-[0_0_12px_rgba(192,132,252,0.8)]

//                     transition-all
//                     duration-300

//                     group-hover:w-5
//                   "
//                 />
//               </NavLink>

//               {/* =================================================
//                   PRODUCTS
//               ================================================== */}

//               <div className="relative">

//                 <button
//                   onClick={() => {
//                     setProductsOpen(!productsOpen);
//                     setCategoriesOpen(false);
//                   }}
//                   className="
//                     group
//                     flex items-center gap-2
//                     rounded-xl
//                     px-4 py-2.5
//                     text-[13px]
//                     font-semibold
//                     tracking-wide
//                     text-white/55

//                     transition-all
//                     duration-300

//                     hover:-translate-y-[1px]
//                     hover:bg-white/[0.045]
//                     hover:text-white
//                   "
//                 >
//                   <span className="text-[14px]">
//                     ◈
//                   </span>

//                   Products

//                   <span
//                     className={`
//                       text-[11px]
//                       transition-transform
//                       duration-300
//                       ${
//                         productsOpen
//                           ? "rotate-180"
//                           : ""
//                       }
//                     `}
//                   >
//                     ▾
//                   </span>
//                 </button>

//                 {/* PRODUCTS DROPDOWN */}

//                 {productsOpen && (
//                   <div
//                     className="
//                       absolute
//                       left-1/2
//                       top-[calc(100%+14px)]
//                       w-72
//                       -translate-x-1/2

//                       rounded-2xl

//                       border
//                       border-violet-400/20

//                       bg-gradient-to-br
//                       from-[#16082b]/98
//                       via-[#0b0615]/98
//                       to-[#180820]/98

//                       p-2

//                       shadow-[0_30px_90px_rgba(0,0,0,0.65)]

//                       backdrop-blur-3xl

//                       animate-[fadeIn_0.2s_ease-out]
//                     "
//                   >

//                     <div
//                       className="
//                         mb-1
//                         px-3
//                         py-2
//                         text-[9px]
//                         font-bold
//                         uppercase
//                         tracking-[0.25em]
//                         text-violet-400/60
//                       "
//                     >
//                       Explore Products
//                     </div>

//                     {[
//                       [
//                         "🛍️",
//                         "All Products",
//                         "Explore everything",
//                         "/products",
//                       ],
//                       [
//                         "✨",
//                         "New Arrivals",
//                         "Latest products",
//                         "/products?sort=newest",
//                       ],
//                       [
//                         "⭐",
//                         "Featured",
//                         "Our top picks",
//                         "/products?featured=true",
//                       ],
//                     ].map(
//                       ([
//                         icon,
//                         title,
//                         subtitle,
//                         path,
//                       ]) => (
//                         <Link
//                           key={title}
//                           to={path}
//                           onClick={() =>
//                             setProductsOpen(false)
//                           }
//                           className="
//                             group/item
//                             flex items-center gap-3
//                             rounded-xl
//                             p-3

//                             transition-all
//                             duration-300

//                             hover:translate-x-1
//                             hover:bg-violet-500/10
//                           "
//                         >
//                           <span
//                             className="
//                               flex h-10 w-10
//                               shrink-0
//                               items-center justify-center
//                               rounded-xl
//                               border border-white/5
//                               bg-white/[0.04]
//                               text-base

//                               transition-all
//                               duration-300

//                               group-hover/item:scale-110
//                               group-hover/item:border-violet-400/20
//                               group-hover/item:bg-violet-500/10
//                             "
//                           >
//                             {icon}
//                           </span>

//                           <span>
//                             <span
//                               className="
//                                 block
//                                 text-sm
//                                 font-bold
//                                 text-white/85
//                                 transition-colors
//                                 group-hover/item:text-white
//                               "
//                             >
//                               {title}
//                             </span>

//                             <span
//                               className="
//                                 text-[11px]
//                                 text-white/35
//                               "
//                             >
//                               {subtitle}
//                             </span>
//                           </span>
//                         </Link>
//                       )
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* =================================================
//                   DEALS
//               ================================================== */}

//               <NavLink
//                 to="/deals"
//                 className={({ isActive }) => `
//                   group relative
//                   flex items-center gap-2
//                   rounded-xl
//                   px-4 py-2.5
//                   text-[13px]
//                   font-semibold
//                   tracking-wide
//                   transition-all
//                   duration-300

//                   ${
//                     isActive
//                       ? "bg-fuchsia-500/10 text-fuchsia-300"
//                       : "text-white/55 hover:-translate-y-[1px] hover:bg-white/[0.045] hover:text-white"
//                   }
//                 `}
//               >
//                 <span>
//                   %
//                 </span>

//                 Deals

//                 <span
//                   className="
//                     absolute
//                     -right-1
//                     -top-1
//                     rounded-full
//                     bg-gradient-to-r
//                     from-fuchsia-500
//                     to-pink-500
//                     px-1.5
//                     py-0.5

//                     text-[7px]
//                     font-black
//                     text-white

//                     shadow-[0_0_15px_rgba(217,70,239,0.55)]

//                     animate-pulse
//                   "
//                 >
//                   HOT
//                 </span>
//               </NavLink>

//               {/* =================================================
//                   CATEGORIES
//               ================================================== */}

//               <div className="relative">

//                 <button
//                   onClick={() => {
//                     setCategoriesOpen(!categoriesOpen);
//                     setProductsOpen(false);
//                   }}
//                   className="
//                     group
//                     flex items-center gap-2
//                     rounded-xl
//                     px-4 py-2.5
//                     text-[13px]
//                     font-semibold
//                     tracking-wide
//                     text-white/55

//                     transition-all
//                     duration-300

//                     hover:-translate-y-[1px]
//                     hover:bg-white/[0.045]
//                     hover:text-white
//                   "
//                 >
//                   <span className="text-[14px]">
//                     ▦
//                   </span>

//                   Categories

//                   <span
//                     className={`
//                       text-[11px]
//                       transition-transform
//                       duration-300
//                       ${
//                         categoriesOpen
//                           ? "rotate-180"
//                           : ""
//                       }
//                     `}
//                   >
//                     ▾
//                   </span>
//                 </button>

//                 {/* CATEGORY DROPDOWN */}

//                 {categoriesOpen && (
//                   <div
//                     className="
//                       absolute
//                       left-1/2
//                       top-[calc(100%+14px)]
//                       w-[360px]
//                       -translate-x-1/2

//                       rounded-2xl

//                       border
//                       border-violet-400/20

//                       bg-gradient-to-br
//                       from-[#16082b]/98
//                       via-[#0b0615]/98
//                       to-[#180820]/98

//                       p-3

//                       shadow-[0_30px_90px_rgba(0,0,0,0.65)]

//                       backdrop-blur-3xl
//                     "
//                   >

//                     <div
//                       className="
//                         mb-3
//                         px-2
//                         text-[9px]
//                         font-bold
//                         uppercase
//                         tracking-[0.25em]
//                         text-violet-400/60
//                       "
//                     >
//                       Shop Categories
//                     </div>

//                     <div className="grid grid-cols-2 gap-1">

//                       {categories.map(
//                         ([icon, name, subtitle]) => (
//                           <Link
//                             key={name}
//                             to={`/products?category=${name.toLowerCase()}`}
//                             onClick={() =>
//                               setCategoriesOpen(false)
//                             }
//                             className="
//                               group/category
//                               rounded-xl
//                               p-3

//                               transition-all
//                               duration-300

//                               hover:bg-violet-500/10
//                               hover:-translate-y-0.5
//                             "
//                           >
//                             <div className="flex items-center gap-2.5">

//                               <span
//                                 className="
//                                   flex h-9 w-9
//                                   shrink-0
//                                   items-center justify-center
//                                   rounded-lg
//                                   border border-white/5
//                                   bg-white/[0.035]

//                                   transition-all
//                                   duration-300

//                                   group-hover/category:scale-110
//                                   group-hover/category:border-violet-400/20
//                                   group-hover/category:bg-violet-500/10
//                                 "
//                               >
//                                 {icon}
//                               </span>

//                               <span>
//                                 <span
//                                   className="
//                                     block
//                                     text-xs
//                                     font-bold
//                                     text-white/70
//                                     group-hover/category:text-white
//                                   "
//                                 >
//                                   {name}
//                                 </span>

//                                 <span
//                                   className="
//                                     text-[9px]
//                                     text-white/30
//                                   "
//                                 >
//                                   {subtitle}
//                                 </span>
//                               </span>

//                             </div>
//                           </Link>
//                         )
//                       )}

//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* ABOUT */}

//               <NavLink
//                 to="/about"
//                 className={navLinkClass}
//               >
//                 <span>ⓘ</span>
//                 About
//               </NavLink>

//               {/* CONTACT */}

//               <NavLink
//                 to="/contact"
//                 className={navLinkClass}
//               >
//                 <span>✉</span>
//                 Contact
//               </NavLink>
//             </div>

//             {/* =================================================
//                 RIGHT SIDE
//             ================================================== */}

//             <div
//               className="
//                 hidden
//                 items-center
//                 gap-1
//                 md:flex
//               "
//             >

//               {/* SEARCH */}

//               <button
//                 type="button"
//                 className="
//                   group/search
//                   flex h-10 w-10
//                   items-center justify-center
//                   rounded-xl

//                   text-white/50

//                   transition-all
//                   duration-300

//                   hover:-translate-y-0.5
//                   hover:bg-violet-500/10
//                   hover:text-violet-300

//                   hover:shadow-[0_0_30px_rgba(139,92,246,0.18)]
//                 "
//               >
//                 <span
//                   className="
//                     text-lg
//                     transition-transform
//                     duration-300

//                     group-hover/search:scale-110
//                   "
//                 >
//                   ⌕
//                 </span>
//               </button>

//               {/* WISHLIST */}

//               <Link
//                 to="/wishlist"
//                 className="
//                   group/icon
//                   relative
//                   flex h-10 w-10
//                   items-center justify-center
//                   rounded-xl

//                   text-white/50

//                   transition-all
//                   duration-300

//                   hover:-translate-y-0.5
//                   hover:bg-pink-500/10
//                   hover:text-pink-300

//                   hover:shadow-[0_0_25px_rgba(236,72,153,0.12)]
//                 "
//               >
//                 <span
//                   className="
//                     text-[19px]
//                     transition-transform
//                     duration-300
//                     group-hover/icon:scale-110
//                   "
//                 >
//                   ♡
//                 </span>

//                 <span
//                   className="
//                     absolute
//                     right-0
//                     top-0
//                     flex h-4 min-w-4
//                     items-center justify-center
//                     rounded-full

//                     bg-gradient-to-r
//                     from-pink-500
//                     to-fuchsia-500

//                     px-1
//                     text-[8px]
//                     font-black
//                     text-white

//                     shadow-[0_0_12px_rgba(236,72,153,0.6)]
//                   "
//                 >
//                   0
//                 </span>
//               </Link>

//               {/* CART */}

//               <Link
//                 to="/cart"
//                 className="
//                   group/icon
//                   relative
//                   flex h-10 w-10
//                   items-center justify-center
//                   rounded-xl

//                   text-white/50

//                   transition-all
//                   duration-300

//                   hover:-translate-y-0.5
//                   hover:bg-violet-500/10
//                   hover:text-violet-300

//                   hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]
//                 "
//               >
//                 <span
//                   className="
//                     text-[18px]
//                     transition-transform
//                     duration-300
//                     group-hover/icon:scale-110
//                   "
//                 >
//                   🛒
//                 </span>

//                 <span
//                   className="
//                     absolute
//                     right-0
//                     top-0
//                     flex h-4 min-w-4
//                     items-center justify-center
//                     rounded-full

//                     bg-gradient-to-r
//                     from-violet-500
//                     to-fuchsia-500

//                     px-1
//                     text-[8px]
//                     font-black
//                     text-white

//                     shadow-[0_0_12px_rgba(168,85,247,0.6)]
//                   "
//                 >
//                   0
//                 </span>
//               </Link>

//               {/* DIVIDER */}

//               <div
//                 className="
//                   mx-1
//                   h-7
//                   w-px
//                   bg-gradient-to-b
//                   from-transparent
//                   via-violet-400/20
//                   to-transparent
//                 "
//               />

//               {/* THEME */}

//               <button
//                 type="button"
//                 onClick={() =>
//                   setDarkMode(!darkMode)
//                 }
//                 className="
//                   group/theme
//                   relative
//                   flex h-10 w-10
//                   items-center justify-center

//                   overflow-hidden
//                   rounded-xl

//                   border border-violet-400/15

//                   bg-gradient-to-br
//                   from-violet-500/10
//                   to-fuchsia-500/5

//                   text-violet-300

//                   transition-all
//                   duration-300

//                   hover:scale-105
//                   hover:border-violet-400/35

//                   hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]
//                 "
//               >
//                 <span
//                   className="
//                     text-base
//                     transition-all
//                     duration-500

//                     group-hover/theme:rotate-45
//                     group-hover/theme:scale-110
//                   "
//                 >
//                   {darkMode ? "☀" : "☾"}
//                 </span>
//               </button>

//               {/* =================================================
//                   AUTH / PROFILE
//               ================================================== */}

//               {isAuthenticated ? (
//                 <div className="relative ml-1">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setProfileOpen(!profileOpen);
//                       setProductsOpen(false);
//                       setCategoriesOpen(false);
//                     }}
//                     className="
//                       group/profile
//                       flex items-center gap-2.5
//                       rounded-xl
//                       border border-violet-400/20
//                       bg-gradient-to-r
//                       from-violet-600/15
//                       via-purple-600/10
//                       to-fuchsia-600/10
//                       px-3 py-2
//                       text-left
//                       transition-all duration-300
//                       hover:-translate-y-0.5
//                       hover:border-violet-400/35
//                       hover:bg-violet-500/15
//                     "
//                   >
//                     <span
//                       className="
//                         flex h-8 w-8 items-center justify-center
//                         rounded-lg
//                         bg-gradient-to-br
//                         from-violet-500
//                         via-purple-600
//                         to-fuchsia-600
//                         text-xs font-black text-white
//                         shadow-[0_0_20px_rgba(139,92,246,0.35)]
//                         transition-transform duration-300
//                         group-hover/profile:scale-105
//                       "
//                     >
//                       {(user?.name || "U").charAt(0).toUpperCase()}
//                     </span>

//                     <span className="hidden max-w-[100px] sm:block">
//                       <span className="block truncate text-xs font-bold text-white/90">
//                         {user?.name || "User"}
//                       </span>
//                       <span className="block text-[9px] uppercase tracking-wider text-violet-300/50">
//                         {user?.role || "customer"}
//                       </span>
//                     </span>

//                     <span
//                       className={`text-[10px] text-white/45 transition-transform duration-300 ${
//                         profileOpen ? "rotate-180" : ""
//                       }`}
//                     >
//                       ▾
//                     </span>
//                   </button>

//                   {profileOpen && (
//                     <div
//                       className="
//                         absolute right-0 top-[calc(100%+12px)]
//                         w-64 rounded-2xl
//                         border border-violet-400/20
//                         bg-gradient-to-br
//                         from-[#16082b]/98
//                         via-[#0b0615]/98
//                         to-[#180820]/98
//                         p-2
//                         shadow-[0_30px_90px_rgba(0,0,0,0.65)]
//                         backdrop-blur-3xl
//                       "
//                     >
//                       <div className="mb-1 rounded-xl border border-white/5 bg-white/[0.03] p-3">
//                         <p className="truncate text-sm font-bold text-white">
//                           {user?.name || "AmitShop User"}
//                         </p>
//                         <p className="mt-1 truncate text-[10px] text-white/35">
//                           {user?.email || ""}
//                         </p>
//                       </div>

//                       <Link
//                         to="/profile"
//                         onClick={closeMenus}
//                         className="
//                           flex items-center gap-3 rounded-xl p-3
//                           text-sm font-semibold text-white/70
//                           transition-all duration-300
//                           hover:translate-x-1 hover:bg-violet-500/10 hover:text-white
//                         "
//                       >
//                         <span className="text-base">◉</span>
//                         My Profile
//                       </Link>

//                       <Link
//                         to="/wishlist"
//                         onClick={closeMenus}
//                         className="
//                           flex items-center gap-3 rounded-xl p-3
//                           text-sm font-semibold text-white/70
//                           transition-all duration-300
//                           hover:translate-x-1 hover:bg-pink-500/10 hover:text-white
//                         "
//                       >
//                         <span className="text-base">♡</span>
//                         Wishlist
//                       </Link>

//                       <Link
//                         to="/cart"
//                         onClick={closeMenus}
//                         className="
//                           flex items-center gap-3 rounded-xl p-3
//                           text-sm font-semibold text-white/70
//                           transition-all duration-300
//                           hover:translate-x-1 hover:bg-violet-500/10 hover:text-white
//                         "
//                       >
//                         <span className="text-base">🛒</span>
//                         Cart
//                       </Link>

//                       <div className="my-1 h-px bg-white/5" />

//                       <button
//                         type="button"
//                         onClick={async () => {
//                           await logout();
//                           closeMenus();
//                           navigate("/");
//                         }}
//                         className="
//                           flex w-full items-center gap-3 rounded-xl p-3
//                           text-sm font-semibold text-red-300/80
//                           transition-all duration-300
//                           hover:translate-x-1 hover:bg-red-500/10 hover:text-red-200
//                         "
//                       >
//                         <span className="text-base">↪</span>
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="
//                     group/login
//                     ml-1
//                     flex items-center gap-2
//                     rounded-xl
//                     border border-violet-400/20
//                     bg-gradient-to-r
//                     from-violet-600
//                     via-purple-600
//                     to-fuchsia-600
//                     px-4 py-2.5
//                     text-[13px] font-bold text-white
//                     shadow-[0_8px_30px_rgba(124,58,237,0.3)]
//                     transition-all duration-300
//                     hover:-translate-y-0.5
//                     hover:border-violet-300/30
//                     hover:shadow-[0_14px_45px_rgba(168,85,247,0.52)]
//                     active:translate-y-0
//                   "
//                 >
//                   <span className="transition-transform duration-300 group-hover/login:translate-x-0.5">
//                     →
//                   </span>
//                   Login
//                 </Link>
//               )}
//             </div>

//             {/* =================================================
//                 MOBILE BUTTON
//             ================================================== */}

//             <button
//               type="button"
//               onClick={() =>
//                 setMobileOpen(!mobileOpen)
//               }
//               className="
//                 flex h-11 w-11
//                 items-center justify-center

//                 rounded-xl

//                 border
//                 border-violet-400/15

//                 bg-violet-500/10

//                 text-violet-200

//                 transition-all
//                 duration-300

//                 hover:scale-105
//                 hover:border-violet-400/30
//                 hover:bg-violet-500/20

//                 md:hidden
//               "
//             >
//               <span
//                 className="
//                   text-xl
//                   transition-transform
//                   duration-300
//                 "
//               >
//                 {mobileOpen ? "×" : "☰"}
//               </span>
//             </button>
//           </div>

//           {/* =================================================
//               MOBILE MENU
//           ================================================== */}

//           <div
//             className={`
//               overflow-hidden
//               transition-all
//               duration-500
//               ease-out
//               md:hidden

//               ${
//                 mobileOpen
//                   ? "max-h-[800px] opacity-100"
//                   : "max-h-0 opacity-0"
//               }
//             `}
//           >
//             <div
//               className="
//                 border-t
//                 border-violet-400/10

//                 px-4
//                 pb-5
//                 pt-4
//               "
//             >

//               {/* Mobile Links */}

//               <div className="flex flex-col gap-1">

//                 {mobileItems.map(
//                   ([name, path]) => (
//                     <NavLink
//                       key={path}
//                       to={path}
//                       onClick={closeMenus}
//                       className={({ isActive }) => `
//                         rounded-xl
//                         px-4 py-3

//                         text-sm
//                         font-semibold

//                         transition-all
//                         duration-300

//                         ${
//                           isActive
//                             ? `
//                               bg-gradient-to-r
//                               from-violet-500/20
//                               to-fuchsia-500/10
//                               text-white
//                             `
//                             : `
//                               text-white/55
//                               hover:translate-x-1
//                               hover:bg-white/[0.04]
//                               hover:text-white
//                             `
//                         }
//                       `}
//                     >
//                       {name}
//                     </NavLink>
//                   )
//                 )}

//               </div>

//               {/* Mobile Actions */}

//               <div
//                 className="
//                   mt-3
//                   grid
//                   grid-cols-3
//                   gap-2
//                 "
//               >

//                 <Link
//                   to="/wishlist"
//                   onClick={closeMenus}
//                   className="
//                     flex
//                     items-center
//                     justify-center

//                     rounded-xl

//                     border
//                     border-white/5

//                     bg-white/[0.03]

//                     py-3

//                     text-xs
//                     font-semibold
//                     text-pink-200

//                     transition-all
//                     duration-300

//                     hover:-translate-y-0.5
//                     hover:bg-pink-500/10
//                   "
//                 >
//                   ♡ Wishlist
//                 </Link>

//                 <Link
//                   to="/cart"
//                   onClick={closeMenus}
//                   className="
//                     flex
//                     items-center
//                     justify-center

//                     rounded-xl

//                     border
//                     border-white/5

//                     bg-white/[0.03]

//                     py-3

//                     text-xs
//                     font-semibold
//                     text-violet-200

//                     transition-all
//                     duration-300

//                     hover:-translate-y-0.5
//                     hover:bg-violet-500/10
//                   "
//                 >
//                   🛒 Cart
//                 </Link>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setDarkMode(!darkMode)
//                   }
//                   className="
//                     flex
//                     items-center
//                     justify-center

//                     rounded-xl

//                     border
//                     border-white/5

//                     bg-white/[0.03]

//                     py-3

//                     text-xs
//                     font-semibold
//                     text-violet-200

//                     transition-all
//                     duration-300

//                     hover:-translate-y-0.5
//                     hover:bg-violet-500/10
//                   "
//                 >
//                   {darkMode
//                     ? "☀ Light"
//                     : "☾ Dark"}
//                 </button>
//               </div>

//               {/* Mobile Auth */}

//               {isAuthenticated ? (
//                 <div className="mt-3 rounded-2xl border border-violet-400/10 bg-white/[0.025] p-3">
//                   <div className="flex items-center gap-3">
//                     <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 text-sm font-black text-white">
//                       {(user?.name || "U").charAt(0).toUpperCase()}
//                     </span>
//                     <div className="min-w-0 flex-1">
//                       <p className="truncate text-sm font-bold text-white">
//                         {user?.name || "User"}
//                       </p>
//                       <p className="text-[10px] uppercase tracking-wider text-violet-300/50">
//                         {user?.role || "customer"}
//                       </p>
//                     </div>
//                   </div>

//                   <Link
//                     to="/profile"
//                     onClick={closeMenus}
//                     className="mt-3 flex items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10 py-3 text-sm font-semibold text-violet-200 transition-all duration-300 hover:bg-violet-500/20"
//                   >
//                     ◉ My Profile
//                   </Link>

//                   <button
//                     type="button"
//                     onClick={async () => {
//                       await logout();
//                       closeMenus();
//                       navigate("/");
//                     }}
//                     className="mt-2 flex w-full items-center justify-center rounded-xl border border-red-400/10 bg-red-500/5 py-3 text-sm font-semibold text-red-300 transition-all duration-300 hover:bg-red-500/10"
//                   >
//                     ↪ Logout
//                   </button>
//                 </div>
//               ) : (
//                 <Link
//                   to="/login"
//                   onClick={closeMenus}
//                   className="
//                     mt-3 flex items-center justify-center gap-2
//                     rounded-xl border border-violet-400/20
//                     bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600
//                     py-3 text-sm font-bold text-white
//                     shadow-[0_8px_30px_rgba(124,58,237,0.3)]
//                     transition-all duration-300
//                     hover:-translate-y-0.5
//                     hover:shadow-[0_12px_40px_rgba(168,85,247,0.45)]
//                   "
//                 >
//                   → Login to AmitShop
//                 </Link>
//               )}
//             </div>
//           </div>

//           {/* =================================================
//               BOTTOM GLOW
//           ================================================== */}

//           <div
//             className="
//               pointer-events-none
//               absolute
//               bottom-0
//               left-1/2
//               h-px
//               w-1/3
//               -translate-x-1/2

//               bg-gradient-to-r
//               from-transparent
//               via-violet-400/70
//               to-transparent

//               blur-sm
//             "
//           />
//         </nav>
//       </header>
//     </>
//   );
// };

// export default Navbar;








import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import useAuthStore from "../../store/authStore";
import api from "../../api/axios";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  // Dynamic cart + wishlist counts
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    isAuthenticated,
    getCurrentUser,
    logout,
  } = useAuthStore();

  // =========================================================
  // CURRENT USER
  // =========================================================

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  // =========================================================
  // GET COUNT FROM API RESPONSE
  // =========================================================

  const getItemCount = (data) => {
    const items =
      data?.cart?.items ||
      data?.wishlist?.items ||
      data?.items ||
      data?.data?.items ||
      [];

    if (!Array.isArray(items)) {
      return 0;
    }

    return items.reduce(
      (total, item) =>
        total + Number(item?.quantity || 1),
      0
    );
  };

  // =========================================================
  // FETCH CART + WISHLIST COUNT
  // =========================================================

  const fetchNavbarCounts = async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }

    try {
      const [cartResponse, wishlistResponse] =
        await Promise.allSettled([
          api.get("/cart"),
          api.get("/wishlist"),
        ]);

      // ---------------- CART ----------------

      if (cartResponse.status === "fulfilled") {
        setCartCount(
          getItemCount(cartResponse.value?.data)
        );
      } else {
        setCartCount(0);
      }

      // ---------------- WISHLIST ----------------

      if (wishlistResponse.status === "fulfilled") {
        setWishlistCount(
          getItemCount(wishlistResponse.value?.data)
        );
      } else {
        setWishlistCount(0);
      }
    } catch (error) {
      console.error(
        "Navbar Count Error:",
        error
      );
    }
  };

  // =========================================================
  // REFRESH COUNTS
  // =========================================================

  useEffect(() => {
    fetchNavbarCounts();
  }, [isAuthenticated, location.pathname]);

  // =========================================================
  // LISTEN FOR CART / WISHLIST UPDATES
  // =========================================================

  useEffect(() => {
    const handleCartUpdate = () => {
      fetchNavbarCounts();
    };

    const handleWishlistUpdate = () => {
      fetchNavbarCounts();
    };

    const handleWindowFocus = () => {
      fetchNavbarCounts();
    };

    window.addEventListener(
      "amitshop:cart-updated",
      handleCartUpdate
    );

    window.addEventListener(
      "amitshop:wishlist-updated",
      handleWishlistUpdate
    );

    window.addEventListener(
      "focus",
      handleWindowFocus
    );

    return () => {
      window.removeEventListener(
        "amitshop:cart-updated",
        handleCartUpdate
      );

      window.removeEventListener(
        "amitshop:wishlist-updated",
        handleWishlistUpdate
      );

      window.removeEventListener(
        "focus",
        handleWindowFocus
      );
    };
  }, [isAuthenticated]);

  // =========================================================
  // CLOSE MENUS
  // =========================================================

  const closeMenus = () => {
    setProductsOpen(false);
    setCategoriesOpen(false);
    setProfileOpen(false);
    setMobileOpen(false);
  };

  // =========================================================
  // NAV LINK STYLE
  // =========================================================

  const navLinkClass = ({ isActive }) => `
    group relative flex items-center gap-2
    rounded-xl px-4 py-2.5
    text-[13px] font-semibold tracking-wide
    transition-all duration-300 ease-out

    ${
      isActive
        ? `
          bg-gradient-to-r
          from-violet-500/20
          via-purple-500/15
          to-fuchsia-500/10
          text-white
          shadow-[inset_0_0_25px_rgba(139,92,246,0.08)]
        `
        : `
          text-white/55
          hover:-translate-y-[1px]
          hover:bg-white/[0.045]
          hover:text-white
        `
    }
  `;

  // =========================================================
  // MOBILE ITEMS
  // =========================================================

  const mobileItems = [
    ["Home", "/"],
    ["Products", "/products"],
    ["Deals", "/deals"],
    ["Categories", "/categories"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ];

  // =========================================================
  // CATEGORIES
  // =========================================================

  const categories = [
    ["📱", "Electronics", "Tech & gadgets"],
    ["👟", "Fashion", "Style & trends"],
    ["⌚", "Watches", "Premium watches"],
    ["🎧", "Audio", "Sound & music"],
    ["🏠", "Home", "Home essentials"],
    ["🎮", "Gaming", "Gaming gear"],
  ];

  return (
    <>
      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-52 overflow-hidden">
        <div
          className="
            absolute left-[5%] top-0
            h-36 w-36
            rounded-full
            bg-violet-600/20
            blur-[70px]
            animate-pulse
          "
        />

        <div
          className="
            absolute right-[8%] top-2
            h-40 w-40
            rounded-full
            bg-fuchsia-600/15
            blur-[80px]
            animate-pulse
          "
          style={{ animationDelay: "1.2s" }}
        />

        <div
          className="
            absolute left-1/2 top-0
            h-24 w-96
            -translate-x-1/2
            rounded-full
            bg-purple-600/10
            blur-[80px]
          "
        />
      </div>

      {/* =====================================================
          ANNOUNCEMENT BAR
      ====================================================== */}

      <div
        className="
          fixed left-0 right-0 top-0 z-[70]
          hidden h-8
          border-b border-violet-500/10
          bg-[#05020b]/90
          backdrop-blur-2xl
          md:block
        "
      >
        <div
          className="
            mx-auto flex h-full max-w-7xl
            items-center justify-between
            px-6
            text-[10px]
            font-medium
            tracking-wide
            text-white/45
          "
        >
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <span className="animate-pulse text-violet-400">
                ✦
              </span>

              Free Shipping on Orders Over $50
            </span>

            <span className="h-3 w-px bg-white/10" />

            <span className="flex items-center gap-1.5">
              <span className="text-fuchsia-400">
                ◆
              </span>

              20% OFF First Order
            </span>

            <span className="h-3 w-px bg-white/10" />

            <span className="text-purple-300/60">
              Shop Smart • Live Better
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>24/7 Support</span>

            <span className="h-3 w-px bg-white/10" />

            <span>Secure Payments</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header
        className="
          fixed left-0 right-0 top-0 z-50
          px-3 pt-3
          md:top-8 md:px-6 md:pt-4
          lg:px-8
        "
      >
        <nav
          className="
            group/nav
            relative mx-auto max-w-7xl
            overflow-visible
            rounded-[22px]
            border border-violet-400/20
            bg-gradient-to-r
            from-[#18082e]/90
            via-[#080510]/95
            to-[#170721]/90
            shadow-[0_20px_80px_rgba(76,29,149,0.28)]
            backdrop-blur-[30px]
            transition-all duration-500
            hover:border-violet-400/35
            hover:shadow-[0_25px_100px_rgba(109,40,217,0.38)]
          "
        >
          {/* =================================================
              ANIMATED GRADIENT BORDER
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute left-[5%] right-[5%] top-0
              h-px
              overflow-hidden
              bg-gradient-to-r
              from-transparent
              via-violet-400/80
              to-transparent
            "
          >
            <div
              className="
                absolute
                -left-1/3
                top-0
                h-full
                w-1/3
                bg-gradient-to-r
                from-transparent
                via-white
                to-transparent
                opacity-80
                blur-[1px]
                transition-all
                duration-[1400ms]
                ease-out
                group-hover/nav:left-full
              "
            />
          </div>

          {/* =================================================
              MAIN ROW
          ================================================== */}

          <div
            className="
              relative flex h-[70px]
              items-center justify-between
              px-4
              sm:px-5
              lg:px-6
            "
          >
            {/* =================================================
                LOGO
            ================================================== */}

            <Link
              to="/"
              onClick={closeMenus}
              className="group/logo flex shrink-0 items-center gap-3"
            >
              <div
                className="
                  relative
                  flex h-11 w-11
                  items-center justify-center
                  overflow-hidden
                  rounded-[14px]
                  border border-violet-300/25
                  bg-gradient-to-br
                  from-violet-500
                  via-purple-600
                  to-fuchsia-600
                  shadow-[0_8px_35px_rgba(139,92,246,0.4)]
                  transition-all
                  duration-500
                  ease-out
                  group-hover/logo:scale-110
                  group-hover/logo:-rotate-3
                  group-hover/logo:shadow-[0_12px_50px_rgba(217,70,239,0.6)]
                "
              >
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-br
                    from-white/25
                    via-transparent
                    to-black/25
                  "
                />

                <div
                  className="
                    absolute
                    -left-16
                    top-[-20%]
                    h-[140%]
                    w-8
                    rotate-[20deg]
                    bg-white/35
                    blur-md
                    transition-transform
                    duration-700
                    ease-out
                    group-hover/logo:translate-x-24
                  "
                />

                <div
                  className="
                    absolute inset-2
                    rounded-xl
                    border border-white/10
                  "
                />

                <span
                  className="
                    relative
                    text-xl
                    font-black
                    text-white
                    drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                  "
                >
                  A
                </span>
              </div>

              <div className="hidden sm:block">
                <div
                  className="
                    text-[21px]
                    font-black
                    leading-none
                    tracking-tight
                    text-white
                  "
                >
                  Amit
                  <span
                    className="
                      bg-gradient-to-r
                      from-violet-400
                      via-purple-400
                      to-fuchsia-400
                      bg-clip-text
                      text-transparent
                    "
                  >
                    Shop
                  </span>
                </div>

                <div
                  className="
                    mt-1
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.3em]
                    text-violet-300/45
                  "
                >
                  Shop Smart • Live Better
                </div>
              </div>
            </Link>

            {/* =================================================
                DESKTOP NAV
            ================================================== */}

            <div
              className="
                hidden
                items-center
                gap-1
                xl:flex
              "
            >
              {/* HOME */}

              <NavLink
                to="/"
                className={navLinkClass}
              >
                <span className="text-[15px]">
                  ⌂
                </span>

                Home

                <span
                  className="
                    absolute
                    bottom-1
                    left-1/2
                    h-[2px]
                    w-0
                    -translate-x-1/2
                    rounded-full
                    bg-gradient-to-r
                    from-violet-400
                    to-fuchsia-400
                    shadow-[0_0_12px_rgba(192,132,252,0.8)]
                    transition-all
                    duration-300
                    group-hover:w-5
                  "
                />
              </NavLink>

              {/* PRODUCTS */}

              <div className="relative">
                <button
                  onClick={() => {
                    setProductsOpen(!productsOpen);
                    setCategoriesOpen(false);
                  }}
                  className="
                    group
                    flex items-center gap-2
                    rounded-xl
                    px-4 py-2.5
                    text-[13px]
                    font-semibold
                    tracking-wide
                    text-white/55
                    transition-all
                    duration-300
                    hover:-translate-y-[1px]
                    hover:bg-white/[0.045]
                    hover:text-white
                  "
                >
                  <span className="text-[14px]">
                    ◈
                  </span>

                  Products

                  <span
                    className={`
                      text-[11px]
                      transition-transform
                      duration-300
                      ${
                        productsOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  >
                    ▾
                  </span>
                </button>

                {productsOpen && (
                  <div
                    className="
                      absolute
                      left-1/2
                      top-[calc(100%+14px)]
                      w-72
                      -translate-x-1/2
                      rounded-2xl
                      border
                      border-violet-400/20
                      bg-gradient-to-br
                      from-[#16082b]/98
                      via-[#0b0615]/98
                      to-[#180820]/98
                      p-2
                      shadow-[0_30px_90px_rgba(0,0,0,0.65)]
                      backdrop-blur-3xl
                      animate-[fadeIn_0.2s_ease-out]
                    "
                  >
                    <div
                      className="
                        mb-1
                        px-3
                        py-2
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.25em]
                        text-violet-400/60
                      "
                    >
                      Explore Products
                    </div>

                    {[
                      [
                        "🛍️",
                        "All Products",
                        "Explore everything",
                        "/products",
                      ],
                      [
                        "✨",
                        "New Arrivals",
                        "Latest products",
                        "/products?sort=newest",
                      ],
                      [
                        "⭐",
                        "Featured",
                        "Our top picks",
                        "/products?featured=true",
                      ],
                    ].map(
                      ([
                        icon,
                        title,
                        subtitle,
                        path,
                      ]) => (
                        <Link
                          key={title}
                          to={path}
                          onClick={() =>
                            setProductsOpen(false)
                          }
                          className="
                            group/item
                            flex items-center gap-3
                            rounded-xl
                            p-3
                            transition-all
                            duration-300
                            hover:translate-x-1
                            hover:bg-violet-500/10
                          "
                        >
                          <span
                            className="
                              flex h-10 w-10
                              shrink-0
                              items-center justify-center
                              rounded-xl
                              border border-white/5
                              bg-white/[0.04]
                              text-base
                              transition-all
                              duration-300
                              group-hover/item:scale-110
                              group-hover/item:border-violet-400/20
                              group-hover/item:bg-violet-500/10
                            "
                          >
                            {icon}
                          </span>

                          <span>
                            <span
                              className="
                                block
                                text-sm
                                font-bold
                                text-white/85
                                transition-colors
                                group-hover/item:text-white
                              "
                            >
                              {title}
                            </span>

                            <span
                              className="
                                text-[11px]
                                text-white/35
                              "
                            >
                              {subtitle}
                            </span>
                          </span>
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* DEALS */}

              <NavLink
                to="/deals"
                className={({ isActive }) => `
                  group relative
                  flex items-center gap-2
                  rounded-xl
                  px-4 py-2.5
                  text-[13px]
                  font-semibold
                  tracking-wide
                  transition-all
                  duration-300

                  ${
                    isActive
                      ? "bg-fuchsia-500/10 text-fuchsia-300"
                      : "text-white/55 hover:-translate-y-[1px] hover:bg-white/[0.045] hover:text-white"
                  }
                `}
              >
                <span>%</span>

                Deals

                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    rounded-full
                    bg-gradient-to-r
                    from-fuchsia-500
                    to-pink-500
                    px-1.5
                    py-0.5
                    text-[7px]
                    font-black
                    text-white
                    shadow-[0_0_15px_rgba(217,70,239,0.55)]
                    animate-pulse
                  "
                >
                  HOT
                </span>
              </NavLink>

              {/* CATEGORIES */}

              <div className="relative">
                <button
                  onClick={() => {
                    setCategoriesOpen(!categoriesOpen);
                    setProductsOpen(false);
                  }}
                  className="
                    group
                    flex items-center gap-2
                    rounded-xl
                    px-4 py-2.5
                    text-[13px]
                    font-semibold
                    tracking-wide
                    text-white/55
                    transition-all
                    duration-300
                    hover:-translate-y-[1px]
                    hover:bg-white/[0.045]
                    hover:text-white
                  "
                >
                  <span className="text-[14px]">
                    ▦
                  </span>

                  Categories

                  <span
                    className={`
                      text-[11px]
                      transition-transform
                      duration-300
                      ${
                        categoriesOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  >
                    ▾
                  </span>
                </button>

                {categoriesOpen && (
                  <div
                    className="
                      absolute
                      left-1/2
                      top-[calc(100%+14px)]
                      w-[360px]
                      -translate-x-1/2
                      rounded-2xl
                      border
                      border-violet-400/20
                      bg-gradient-to-br
                      from-[#16082b]/98
                      via-[#0b0615]/98
                      to-[#180820]/98
                      p-3
                      shadow-[0_30px_90px_rgba(0,0,0,0.65)]
                      backdrop-blur-3xl
                    "
                  >
                    <div
                      className="
                        mb-3
                        px-2
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.25em]
                        text-violet-400/60
                      "
                    >
                      Shop Categories
                    </div>

                    <div className="grid grid-cols-2 gap-1">
                      {categories.map(
                        ([
                          icon,
                          name,
                          subtitle,
                        ]) => (
                          <Link
                            key={name}
                            to={`/products?category=${name.toLowerCase()}`}
                            onClick={() =>
                              setCategoriesOpen(false)
                            }
                            className="
                              group/category
                              rounded-xl
                              p-3
                              transition-all
                              duration-300
                              hover:bg-violet-500/10
                              hover:-translate-y-0.5
                            "
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className="
                                  flex h-9 w-9
                                  shrink-0
                                  items-center justify-center
                                  rounded-lg
                                  border border-white/5
                                  bg-white/[0.035]
                                  transition-all
                                  duration-300
                                  group-hover/category:scale-110
                                  group-hover/category:border-violet-400/20
                                  group-hover/category:bg-violet-500/10
                                "
                              >
                                {icon}
                              </span>

                              <span>
                                <span
                                  className="
                                    block
                                    text-xs
                                    font-bold
                                    text-white/70
                                    group-hover/category:text-white
                                  "
                                >
                                  {name}
                                </span>

                                <span
                                  className="
                                    text-[9px]
                                    text-white/30
                                  "
                                >
                                  {subtitle}
                                </span>
                              </span>
                            </div>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ABOUT */}

              <NavLink
                to="/about"
                className={navLinkClass}
              >
                <span>ⓘ</span>
                About
              </NavLink>

              {/* CONTACT */}

              <NavLink
                to="/contact"
                className={navLinkClass}
              >
                <span>✉</span>
                Contact
              </NavLink>
            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================== */}

            <div
              className="
                hidden
                items-center
                gap-1
                md:flex
              "
            >
              {/* SEARCH */}

              <button
                type="button"
                className="
                  group/search
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  text-white/50
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-violet-500/10
                  hover:text-violet-300
                  hover:shadow-[0_0_30px_rgba(139,92,246,0.18)]
                "
              >
                <span
                  className="
                    text-lg
                    transition-transform
                    duration-300
                    group-hover/search:scale-110
                  "
                >
                  ⌕
                </span>
              </button>

              {/* =================================================
                  WISHLIST
              ================================================== */}

              <Link
                to="/wishlist"
                className="
                  group/icon
                  relative
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  text-white/50
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-pink-500/10
                  hover:text-pink-300
                  hover:shadow-[0_0_25px_rgba(236,72,153,0.12)]
                "
              >
                <span
                  className="
                    text-[19px]
                    transition-transform
                    duration-300
                    group-hover/icon:scale-110
                  "
                >
                  ♡
                </span>

                <span
                  className="
                    absolute
                    right-0
                    top-0
                    flex h-4 min-w-4
                    items-center justify-center
                    rounded-full
                    bg-gradient-to-r
                    from-pink-500
                    to-fuchsia-500
                    px-1
                    text-[8px]
                    font-black
                    text-white
                    shadow-[0_0_12px_rgba(236,72,153,0.6)]
                  "
                >
                  {wishlistCount}
                </span>
              </Link>

              {/* =================================================
                  CART
              ================================================== */}

              <Link
                to="/cart"
                className="
                  group/icon
                  relative
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  text-white/50
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-violet-500/10
                  hover:text-violet-300
                  hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]
                "
              >
                <span
                  className="
                    text-[18px]
                    transition-transform
                    duration-300
                    group-hover/icon:scale-110
                  "
                >
                  🛒
                </span>

                <span
                  className="
                    absolute
                    right-0
                    top-0
                    flex h-4 min-w-4
                    items-center justify-center
                    rounded-full
                    bg-gradient-to-r
                    from-violet-500
                    to-fuchsia-500
                    px-1
                    text-[8px]
                    font-black
                    text-white
                    shadow-[0_0_12px_rgba(168,85,247,0.6)]
                  "
                >
                  {cartCount}
                </span>
              </Link>

              {/* DIVIDER */}

              <div
                className="
                  mx-1
                  h-7
                  w-px
                  bg-gradient-to-b
                  from-transparent
                  via-violet-400/20
                  to-transparent
                "
              />

              {/* THEME */}

              <button
                type="button"
                onClick={() =>
                  setDarkMode(!darkMode)
                }
                className="
                  group/theme
                  relative
                  flex h-10 w-10
                  items-center justify-center
                  overflow-hidden
                  rounded-xl
                  border border-violet-400/15
                  bg-gradient-to-br
                  from-violet-500/10
                  to-fuchsia-500/5
                  text-violet-300
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:border-violet-400/35
                  hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]
                "
              >
                <span
                  className="
                    text-base
                    transition-all
                    duration-500
                    group-hover/theme:rotate-45
                    group-hover/theme:scale-110
                  "
                >
                  {darkMode ? "☀" : "☾"}
                </span>
              </button>

              {/* =================================================
                  AUTH / PROFILE
              ================================================== */}

              {isAuthenticated ? (
                <div className="relative ml-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(!profileOpen);
                      setProductsOpen(false);
                      setCategoriesOpen(false);
                    }}
                    className="
                      group/profile
                      flex items-center gap-2.5
                      rounded-xl
                      border border-violet-400/20
                      bg-gradient-to-r
                      from-violet-600/15
                      via-purple-600/10
                      to-fuchsia-600/10
                      px-3 py-2
                      text-left
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:border-violet-400/35
                      hover:bg-violet-500/15
                    "
                  >
                    <span
                      className="
                        flex h-8 w-8
                        items-center justify-center
                        rounded-lg
                        bg-gradient-to-br
                        from-violet-500
                        via-purple-600
                        to-fuchsia-600
                        text-xs
                        font-black
                        text-white
                        shadow-[0_0_20px_rgba(139,92,246,0.35)]
                        transition-transform
                        duration-300
                        group-hover/profile:scale-105
                      "
                    >
                      {(user?.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>

                    <span className="hidden max-w-[100px] sm:block">
                      <span className="block truncate text-xs font-bold text-white/90">
                        {user?.name || "User"}
                      </span>

                      <span className="block text-[9px] uppercase tracking-wider text-violet-300/50">
                        {user?.role || "customer"}
                      </span>
                    </span>

                    <span
                      className={`text-[10px] text-white/45 transition-transform duration-300 ${
                        profileOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    >
                      ▾
                    </span>
                  </button>

                  {profileOpen && (
                    <div
                      className="
                        absolute right-0 top-[calc(100%+12px)]
                        w-64 rounded-2xl
                        border border-violet-400/20
                        bg-gradient-to-br
                        from-[#16082b]/98
                        via-[#0b0615]/98
                        to-[#180820]/98
                        p-2
                        shadow-[0_30px_90px_rgba(0,0,0,0.65)]
                        backdrop-blur-3xl
                      "
                    >
                      <div className="mb-1 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                        <p className="truncate text-sm font-bold text-white">
                          {user?.name ||
                            "AmitShop User"}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-white/35">
                          {user?.email || ""}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={closeMenus}
                        className="
                          flex items-center gap-3 rounded-xl p-3
                          text-sm font-semibold text-white/70
                          transition-all duration-300
                          hover:translate-x-1
                          hover:bg-violet-500/10
                          hover:text-white
                        "
                      >
                        <span className="text-base">
                          ◉
                        </span>

                        My Profile
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={closeMenus}
                        className="
                          flex items-center gap-3 rounded-xl p-3
                          text-sm font-semibold text-white/70
                          transition-all duration-300
                          hover:translate-x-1
                          hover:bg-pink-500/10
                          hover:text-white
                        "
                      >
                        <span className="text-base">
                          ♡
                        </span>

                        Wishlist
                      </Link>

                      <Link
                        to="/cart"
                        onClick={closeMenus}
                        className="
                          flex items-center gap-3 rounded-xl p-3
                          text-sm font-semibold text-white/70
                          transition-all duration-300
                          hover:translate-x-1
                          hover:bg-violet-500/10
                          hover:text-white
                        "
                      >
                        <span className="text-base">
                          🛒
                        </span>

                        Cart
                      </Link>

                      <div className="my-1 h-px bg-white/5" />

                      <button
                        type="button"
                        onClick={async () => {
                          await logout();

                          setCartCount(0);
                          setWishlistCount(0);

                          closeMenus();
                          navigate("/");
                        }}
                        className="
                          flex w-full items-center gap-3 rounded-xl p-3
                          text-sm font-semibold text-red-300/80
                          transition-all duration-300
                          hover:translate-x-1
                          hover:bg-red-500/10
                          hover:text-red-200
                        "
                      >
                        <span className="text-base">
                          ↪
                        </span>

                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="
                    group/login
                    ml-1
                    flex items-center gap-2
                    rounded-xl
                    border border-violet-400/20
                    bg-gradient-to-r
                    from-violet-600
                    via-purple-600
                    to-fuchsia-600
                    px-4 py-2.5
                    text-[13px]
                    font-bold
                    text-white
                    shadow-[0_8px_30px_rgba(124,58,237,0.3)]
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:border-violet-300/30
                    hover:shadow-[0_14px_45px_rgba(168,85,247,0.52)]
                    active:translate-y-0
                  "
                >
                  <span className="transition-transform duration-300 group-hover/login:translate-x-0.5">
                    →
                  </span>

                  Login
                </Link>
              )}
            </div>

            {/* =================================================
                MOBILE BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                setMobileOpen(!mobileOpen)
              }
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-xl
                border border-violet-400/15
                bg-violet-500/10
                text-violet-200
                transition-all
                duration-300
                hover:scale-105
                hover:border-violet-400/30
                hover:bg-violet-500/20
                md:hidden
              "
            >
              <span
                className="
                  text-xl
                  transition-transform
                  duration-300
                "
              >
                {mobileOpen ? "×" : "☰"}
              </span>
            </button>
          </div>

          {/* =================================================
              MOBILE MENU
          ================================================== */}

          <div
            className={`
              overflow-hidden
              transition-all
              duration-500
              ease-out
              md:hidden

              ${
                mobileOpen
                  ? "max-h-[800px] opacity-100"
                  : "max-h-0 opacity-0"
              }
            `}
          >
            <div
              className="
                border-t
                border-violet-400/10
                px-4
                pb-5
                pt-4
              "
            >
              {/* Mobile Links */}

              <div className="flex flex-col gap-1">
                {mobileItems.map(
                  ([name, path]) => (
                    <NavLink
                      key={path}
                      to={path}
                      onClick={closeMenus}
                      className={({
                        isActive,
                      }) => `
                        rounded-xl
                        px-4 py-3
                        text-sm
                        font-semibold
                        transition-all
                        duration-300

                        ${
                          isActive
                            ? `
                              bg-gradient-to-r
                              from-violet-500/20
                              to-fuchsia-500/10
                              text-white
                            `
                            : `
                              text-white/55
                              hover:translate-x-1
                              hover:bg-white/[0.04]
                              hover:text-white
                            `
                        }
                      `}
                    >
                      {name}
                    </NavLink>
                  )
                )}
              </div>

              {/* Mobile Actions */}

              <div
                className="
                  mt-3
                  grid
                  grid-cols-3
                  gap-2
                "
              >
                {/* Wishlist */}

                <Link
                  to="/wishlist"
                  onClick={closeMenus}
                  className="
                    flex
                    items-center
                    justify-center
                    rounded-xl
                    border border-white/5
                    bg-white/[0.03]
                    py-3
                    text-xs
                    font-semibold
                    text-pink-200
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-pink-500/10
                  "
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>♡</span>

                    <span>Wishlist</span>

                    <span
                      className="
                        flex h-4 min-w-4
                        items-center justify-center
                        rounded-full
                        bg-gradient-to-r
                        from-pink-500
                        to-fuchsia-500
                        px-1
                        text-[8px]
                        font-black
                        text-white
                      "
                    >
                      {wishlistCount}
                    </span>
                  </div>
                </Link>

                {/* Cart */}

                <Link
                  to="/cart"
                  onClick={closeMenus}
                  className="
                    flex
                    items-center
                    justify-center
                    rounded-xl
                    border border-white/5
                    bg-white/[0.03]
                    py-3
                    text-xs
                    font-semibold
                    text-violet-200
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-violet-500/10
                  "
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>🛒</span>

                    <span>Cart</span>

                    <span
                      className="
                        flex h-4 min-w-4
                        items-center justify-center
                        rounded-full
                        bg-gradient-to-r
                        from-violet-500
                        to-fuchsia-500
                        px-1
                        text-[8px]
                        font-black
                        text-white
                      "
                    >
                      {cartCount}
                    </span>
                  </div>
                </Link>

                {/* Theme */}

                <button
                  type="button"
                  onClick={() =>
                    setDarkMode(!darkMode)
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    rounded-xl
                    border border-white/5
                    bg-white/[0.03]
                    py-3
                    text-xs
                    font-semibold
                    text-violet-200
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-violet-500/10
                  "
                >
                  {darkMode
                    ? "☀ Light"
                    : "☾ Dark"}
                </button>
              </div>

              {/* Mobile Auth */}

              {isAuthenticated ? (
                <div className="mt-3 rounded-2xl border border-violet-400/10 bg-white/[0.025] p-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 text-sm font-black text-white">
                      {(user?.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">
                        {user?.name || "User"}
                      </p>

                      <p className="text-[10px] uppercase tracking-wider text-violet-300/50">
                        {user?.role || "customer"}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={closeMenus}
                    className="
                      mt-3
                      flex
                      items-center
                      justify-center
                      rounded-xl
                      border border-violet-400/15
                      bg-violet-500/10
                      py-3
                      text-sm
                      font-semibold
                      text-violet-200
                      transition-all
                      duration-300
                      hover:bg-violet-500/20
                    "
                  >
                    ◉ My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={async () => {
                      await logout();

                      setCartCount(0);
                      setWishlistCount(0);

                      closeMenus();
                      navigate("/");
                    }}
                    className="
                      mt-2
                      flex
                      w-full
                      items-center
                      justify-center
                      rounded-xl
                      border border-red-400/10
                      bg-red-500/5
                      py-3
                      text-sm
                      font-semibold
                      text-red-300
                      transition-all
                      duration-300
                      hover:bg-red-500/10
                    "
                  >
                    ↪ Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="
                    mt-3
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border border-violet-400/20
                    bg-gradient-to-r
                    from-violet-600
                    via-purple-600
                    to-fuchsia-600
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-[0_8px_30px_rgba(124,58,237,0.3)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_12px_40px_rgba(168,85,247,0.45)]
                  "
                >
                  → Login to AmitShop
                </Link>
              )}
            </div>
          </div>

          {/* =================================================
              BOTTOM GLOW
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-0
              left-1/2
              h-px
              w-1/3
              -translate-x-1/2
              bg-gradient-to-r
              from-transparent
              via-violet-400/70
              to-transparent
              blur-sm
            "
          />
        </nav>
      </header>
    </>
  );
};

export default Navbar;
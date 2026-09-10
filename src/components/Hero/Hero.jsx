// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// const products = [
//   {
//     name: "iPhone Pro Max",
//     category: "Smartphones",
//     price: "$899",
//     oldPrice: "$1,199",
//     discount: "25% OFF",
//     image:
//       "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1000&q=90",
//     background:
//       "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1800&q=85",
//   },
//   {
//     name: "Premium Headphones",
//     category: "Audio Collection",
//     price: "$199",
//     oldPrice: "$399",
//     discount: "50% OFF",
//     image:
//       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=90",
//     background:
//       "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=85",
//   },
//   {
//     name: "Air Max Sneakers",
//     category: "Premium Fashion",
//     price: "$129",
//     oldPrice: "$299",
//     discount: "60% OFF",
//     image:
//       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=90",
//     background:
//       "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1800&q=85",
//   },
//   {
//     name: "Smart Watch Ultra",
//     category: "Wearable Technology",
//     price: "$179",
//     oldPrice: "$299",
//     discount: "40% OFF",
//     image:
//       "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=90",
//     background:
//       "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1800&q=85",
//   },
// ];

// const sideMessages = [
//   {
//     icon: "⚡",
//     title: "Flash Sale",
//     text: "Up to 60% OFF",
//   },
//   {
//     icon: "✦",
//     title: "Premium Picks",
//     text: "Top rated products",
//   },
//   {
//     icon: "🚀",
//     title: "Fast Delivery",
//     text: "Delivered quickly",
//   },
//   {
//     icon: "🔒",
//     title: "Secure Shopping",
//     text: "100% protected",
//   },
// ];

// const Hero = () => {
//   const [active, setActive] = useState(0);
//   const [sideMessage, setSideMessage] = useState(0);
//   const [rotation, setRotation] = useState(0);
//   const [visible, setVisible] = useState(true);

//   const product = products[active];
//   const message = sideMessages[sideMessage];

//   useEffect(() => {
//     const productTimer = setInterval(() => {
//       setVisible(false);

//       setTimeout(() => {
//         setActive((prev) => (prev + 1) % products.length);
//         setRotation((prev) => prev + 360);
//         setVisible(true);
//       }, 350);
//     }, 5000);

//     return () => clearInterval(productTimer);
//   }, []);

//   useEffect(() => {
//     const messageTimer = setInterval(() => {
//       setSideMessage((prev) => (prev + 1) % sideMessages.length);
//     }, 3000);

//     return () => clearInterval(messageTimer);
//   }, []);

//   return (
//     <section className="relative min-h-screen overflow-hidden bg-[#030108] text-white">
//       {/* =====================================================
//           PREMIUM BACKGROUND IMAGE
//       ====================================================== */}

//       <div className="absolute inset-0">
//         <div
//           key={product.background}
//           className="absolute inset-0 bg-cover bg-center opacity-25 transition-all duration-[2000ms]"
//           style={{
//             backgroundImage: `url("${product.background}")`,
//           }}
//         />

//         {/* Dark cinematic overlay */}

//         <div className="absolute inset-0 bg-[#030108]/75" />

//         <div className="absolute inset-0 bg-gradient-to-r from-[#030108] via-[#030108]/75 to-[#030108]/35" />

//         <div className="absolute inset-0 bg-gradient-to-t from-[#030108] via-transparent to-[#030108]/70" />
//       </div>

//       {/* =====================================================
//           PURPLE AMBIENT LIGHTS
//       ====================================================== */}

//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <div className="absolute -left-52 top-0 h-[650px] w-[650px] rounded-full bg-violet-700/20 blur-[180px]" />

//         <div className="absolute right-[-200px] top-[5%] h-[700px] w-[700px] rounded-full bg-fuchsia-700/20 blur-[190px]" />

//         <div className="absolute bottom-[-350px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-purple-700/20 blur-[190px]" />
//       </div>

//       {/* =====================================================
//           GRID
//       ====================================================== */}

//       <div
//         className="pointer-events-none absolute inset-0 opacity-[0.035]"
//         style={{
//           backgroundImage:
//             "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
//           backgroundSize: "70px 70px",
//         }}
//       />

//       {/* =====================================================
//           CONTENT
//       ====================================================== */}

//       <div className="relative mx-auto max-w-7xl px-5 pb-32 pt-32 sm:px-8 lg:px-10">
//         <div className="grid min-h-[calc(100vh-8rem)] items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
//           {/* =================================================
//               LEFT TEXT
//           ================================================== */}

//           <div className="relative z-30 max-w-2xl">
//             {/* Premium badge */}

//             <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-violet-400/20 bg-white/[0.04] px-4 py-2.5 text-[10px] font-black tracking-[0.18em] text-violet-300 shadow-[0_10px_40px_rgba(124,58,237,0.12)] backdrop-blur-2xl">
//               <span className="relative flex h-2 w-2">
//                 <span className="absolute h-full w-full animate-ping rounded-full bg-violet-400 opacity-70" />
//                 <span className="relative h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_15px_rgba(167,139,250,1)]" />
//               </span>

//               AMITSHOP PREMIUM

//               <span className="text-fuchsia-400">✦</span>
//             </div>

//             {/* Heading */}

//             <h1 className="text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-6xl lg:text-7xl xl:text-[82px]">
//               Everything
//               <br />

//               <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
//                 You Love.
//               </span>

//               <br />

//               One Place.
//             </h1>

//             {/* Description */}

//             <p className="mt-7 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
//               Discover premium technology, fashion and lifestyle products with
//               exclusive prices — designed for the way you live today.
//             </p>

//             {/* Dynamic sale text */}

//             <div className="mt-7 flex items-center gap-3">
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 text-lg">
//                 %
//               </div>

//               <div>
//                 <div className="text-sm font-black">
//                   Special Offer
//                 </div>

//                 <div className="text-xs text-white/35">
//                   Selected products up to{" "}
//                   <span className="font-black text-fuchsia-300">
//                     60% OFF
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Buttons */}

//             <div className="mt-9 flex flex-wrap gap-4">
//               <Link
//                 to="/products"
//                 className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-7 py-4 text-sm font-black shadow-[0_15px_55px_rgba(124,58,237,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_75px_rgba(168,85,247,0.55)]"
//               >
//                 <span className="relative z-10">
//                   Shop Collection

//                   <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
//                     →
//                   </span>
//                 </span>

//                 <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
//               </Link>

//               <Link
//                 to="/deals"
//                 className="rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-bold text-white/75 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white"
//               >
//                 Today's Deals
//               </Link>
//             </div>

//             {/* Stats */}

//             <div className="mt-10 flex items-center gap-6">
//               <div>
//                 <div className="text-2xl font-black">
//                   50K+
//                 </div>

//                 <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
//                   Products
//                 </div>
//               </div>

//               <div className="h-9 w-px bg-white/10" />

//               <div>
//                 <div className="text-2xl font-black">
//                   100K+
//                 </div>

//                 <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
//                   Customers
//                 </div>
//               </div>

//               <div className="h-9 w-px bg-white/10" />

//               <div>
//                 <div className="text-2xl font-black">
//                   4.9
//                 </div>

//                 <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
//                   Rating
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* =================================================
//               RIGHT 3D SHOWCASE
//           ================================================== */}

//           <div className="relative mx-auto h-[620px] w-full max-w-[680px]">
//             {/* Product glow */}

//             <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[100px]" />

//             {/* =================================================
//                 OUTER 3D ORBIT
//             ================================================== */}

//             <div
//               className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/10"
//               style={{
//                 transform: `translate(-50%, -50%) rotateX(67deg) rotateZ(${rotation}deg)`,
//                 transition:
//                   "transform 5s cubic-bezier(.22,.61,.36,1)",
//               }}
//             >
//               <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-violet-300 shadow-[0_0_35px_rgba(196,181,253,1)]" />

//               <span className="absolute bottom-4 left-12 h-3 w-3 rounded-full bg-fuchsia-400 shadow-[0_0_30px_rgba(232,121,249,1)]" />

//               <span className="absolute right-5 top-1/2 h-2.5 w-2.5 rounded-full bg-purple-300 shadow-[0_0_25px_rgba(216,180,254,1)]" />
//             </div>

//             {/* =================================================
//                 INNER ORBIT
//             ================================================== */}

//             <div
//               className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-400/[0.09]"
//               style={{
//                 transform: `translate(-50%, -50%) rotateX(67deg) rotateZ(${-rotation}deg)`,
//                 transition:
//                   "transform 5s cubic-bezier(.22,.61,.36,1)",
//               }}
//             />

//             {/* =================================================
//                 MAIN PRODUCT
//             ================================================== */}

//             <div
//               className={`absolute left-1/2 top-1/2 z-20 ${
//                 visible
//                   ? "translate-y-[-55%] opacity-100"
//                   : "translate-y-[-50%] opacity-0"
//               }`}
//               style={{
//                 transform: "translateX(-50%)",
//                 transition:
//                   "all 700ms cubic-bezier(.22,.61,.36,1)",
//               }}
//             >
//               <div
//                 className="relative"
//                 style={{
//                   transform: `perspective(1400px) rotateY(${
//                     rotation / 2
//                   }deg) rotateX(5deg)`,
//                   transition:
//                     "transform 5s cubic-bezier(.22,.61,.36,1)",
//                   transformStyle: "preserve-3d",
//                 }}
//               >
//                 {/* Product shadow */}

//                 <div className="absolute -bottom-16 left-1/2 h-24 w-56 -translate-x-1/2 rounded-full bg-violet-700/30 blur-3xl" />

//                 {/* Product frame */}

//                 <div className="relative h-[390px] w-[275px] rounded-[46px] border border-white/20 bg-white/[0.08] p-3 shadow-[0_45px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl">
//                   {/* Inner */}

//                   <div className="relative h-full w-full overflow-hidden rounded-[37px] border border-white/10 bg-black">
//                     {/* Product Image */}

//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="h-full w-full object-cover"
//                     />

//                     {/* image gradient */}

//                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

//                     {/* shine */}

//                     <div className="pointer-events-none absolute -left-20 top-0 h-full w-24 rotate-[18deg] bg-white/10 blur-2xl" />

//                     {/* Tag */}

//                     <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[8px] font-black tracking-[0.2em] backdrop-blur-xl">
//                       {product.category}
//                     </div>

//                     {/* Favorite */}

//                     <button className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-lg backdrop-blur-xl transition-all hover:scale-110 hover:bg-violet-500/30">
//                       ♡
//                     </button>

//                     {/* Product info */}

//                     <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/55 p-4 backdrop-blur-2xl">
//                       <div className="flex items-center justify-between">
//                         <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-violet-300">
//                           Featured
//                         </span>

//                         <span className="rounded-full bg-fuchsia-500/15 px-2 py-1 text-[8px] font-black text-fuchsia-300">
//                           {product.discount}
//                         </span>
//                       </div>

//                       <h3 className="mt-2 text-lg font-black">
//                         {product.name}
//                       </h3>

//                       <div className="mt-2 flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <span className="text-xl font-black">
//                             {product.price}
//                           </span>

//                           <span className="text-xs text-white/30 line-through">
//                             {product.oldPrice}
//                           </span>
//                         </div>

//                         <span className="text-xs font-bold text-yellow-300">
//                           ★ 4.9
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* =================================================
//                 60% OFF FLOATING CARD
//             ================================================== */}

//             <div className="absolute left-[-10px] top-[90px] z-30 animate-[bounce_5s_ease-in-out_infinite]">
//               <div className="rounded-2xl border border-fuchsia-400/20 bg-black/50 px-4 py-3 shadow-[0_20px_60px_rgba(217,70,239,0.2)] backdrop-blur-2xl">
//                 <div className="text-[9px] font-black uppercase tracking-[0.2em] text-fuchsia-300">
//                   Limited Offer
//                 </div>

//                 <div className="mt-1 text-2xl font-black">
//                   60%
//                   <span className="ml-1 text-xs text-white/50">
//                     OFF
//                   </span>
//                 </div>

//                 <div className="mt-1 text-[9px] text-white/30">
//                   Selected products
//                 </div>
//               </div>
//             </div>

//             {/* =================================================
//                 AUTO SIDE CARD
//             ================================================== */}

//             <div
//               key={sideMessage}
//               className="absolute right-[-5px] top-[175px] z-30 animate-[bounce_6s_ease-in-out_infinite]"
//             >
//               <div className="w-[195px] rounded-2xl border border-white/10 bg-black/50 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-xl">
//                     {message.icon}
//                   </div>

//                   <div>
//                     <div className="text-xs font-black">
//                       {message.title}
//                     </div>

//                     <div className="mt-1 text-[9px] text-white/35">
//                       {message.text}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
//                   <div className="h-full w-[60%] animate-pulse rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
//                 </div>
//               </div>
//             </div>

//             {/* =================================================
//                 MINI FLOATING PRODUCTS
//             ================================================== */}

//             <div className="absolute bottom-[180px] left-[5%] z-10 animate-[bounce_7s_ease-in-out_infinite]">
//               <div className="h-[72px] w-[72px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl">
//                 <img
//                   src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80"
//                   alt="Sneakers"
//                   className="h-full w-full rounded-xl object-cover"
//                 />
//               </div>
//             </div>

//             <div className="absolute right-[2%] bottom-[250px] z-10 animate-[bounce_6s_ease-in-out_infinite]">
//               <div className="h-[68px] w-[68px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl">
//                 <img
//                   src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80"
//                   alt="Smart Watch"
//                   className="h-full w-full rounded-xl object-cover"
//                 />
//               </div>
//             </div>

//             {/* =================================================
//                 3D PLATFORM
//             ================================================== */}

//             <div className="absolute bottom-[55px] left-1/2 z-10 -translate-x-1/2">
//               <div
//                 className="relative h-[120px] w-[460px]"
//                 style={{
//                   transform:
//                     "perspective(900px) rotateX(62deg)",
//                 }}
//               >
//                 <div className="absolute inset-0 rounded-full border border-violet-400/40 bg-gradient-to-br from-violet-600/25 via-purple-950/90 to-fuchsia-900/25 shadow-[0_0_100px_rgba(139,92,246,0.5)]" />

//                 <div className="absolute inset-[15px] rounded-full border border-violet-400/20 bg-black/75" />

//                 <div className="absolute inset-[30px] rounded-full border border-fuchsia-400/20 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20" />

//                 <div className="absolute inset-[44px] rounded-full bg-violet-500/15 shadow-[inset_0_0_50px_rgba(168,85,247,0.5)]" />
//               </div>
//             </div>

//             {/* =================================================
//                 360 BADGE
//             ================================================== */}

//             <div className="absolute bottom-[12px] left-1/2 z-40 -translate-x-1/2">
//               <div className="flex items-center gap-2 rounded-full border border-violet-400/20 bg-black/65 px-5 py-2.5 shadow-[0_0_40px_rgba(139,92,246,0.25)] backdrop-blur-2xl">
//                 <span className="animate-spin text-lg text-violet-300">
//                   ↻
//                 </span>

//                 <span className="text-[9px] font-black tracking-[0.22em]">
//                   360° EXPERIENCE
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           BOTTOM TRUST BAR
//       ====================================================== */}

//       <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06] bg-black/40 backdrop-blur-2xl">
//         <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/[0.06] sm:grid-cols-4">
//           <div className="flex items-center gap-3 px-5 py-4">
//             <span className="text-xl">⚡</span>

//             <div>
//               <div className="text-xs font-black">
//                 Fast Delivery
//               </div>

//               <div className="mt-1 text-[9px] text-white/30">
//                 Quick & reliable
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 px-5 py-4">
//             <span className="text-xl">🔒</span>

//             <div>
//               <div className="text-xs font-black">
//                 Secure Payment
//               </div>

//               <div className="mt-1 text-[9px] text-white/30">
//                 Fully protected
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 px-5 py-4">
//             <span className="text-xl">↩</span>

//             <div>
//               <div className="text-xs font-black">
//                 Easy Returns
//               </div>

//               <div className="mt-1 text-[9px] text-white/30">
//                 Hassle-free
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 px-5 py-4">
//             <span className="text-xl">✦</span>

//             <div>
//               <div className="text-xs font-black">
//                 Premium Quality
//               </div>

//               <div className="mt-1 text-[9px] text-white/30">
//                 Carefully selected
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

import { useEffect, useState } from "react";

const products = [
  {
    id: 1,
    name: "Air Max Sneakers",
    shortName: "SNEAKERS",
    category: "Premium Footwear",
    headline: "Walk Beyond Limits.",
    description:
      "Engineered comfort meets futuristic street style.",
    price: "$129",
    oldPrice: "$299",
    discount: "60% OFF",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=95",
  },
  {
    id: 2,
    name: "Oversized Street T-Shirt",
    shortName: "T-SHIRT",
    category: "Urban Fashion",
    headline: "Wear Your Identity.",
    description:
      "Premium oversized fit designed for modern street culture.",
    price: "$49",
    oldPrice: "$89",
    discount: "45% OFF",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=95",
  },
  {
    id: 3,
    name: "Premium Headphones",
    shortName: "HEADPHONES",
    category: "Audio Collection",
    headline: "Hear Everything.",
    description:
      "Immersive sound with premium comfort and deep bass.",
    price: "$199",
    oldPrice: "$399",
    discount: "50% OFF",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=95",
  },
  {
    id: 4,
    name: "iPhone Pro Max",
    shortName: "SMARTPHONE",
    category: "Next-Gen Technology",
    headline: "Power. Redefined.",
    description:
      "A powerful smartphone experience built for the future.",
    price: "$899",
    oldPrice: "$1,199",
    discount: "25% OFF",
    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1400&q=95",
  },
  {
    id: 5,
    name: "Smart Watch Ultra",
    shortName: "SMART WATCH",
    category: "Wearable Technology",
    headline: "Your World. On Your Wrist.",
    description:
      "Smart technology designed to move with your lifestyle.",
    price: "$179",
    oldPrice: "$299",
    discount: "40% OFF",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=95",
  },
  {
    id: 6,
    name: "MacBook Pro",
    shortName: "LAPTOP",
    category: "Professional Technology",
    headline: "Create Without Limits.",
    description:
      "Powerful performance wrapped in an iconic premium design.",
    price: "$1,699",
    oldPrice: "$1,999",
    discount: "15% OFF",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=95",
  },
  {
    id: 7,
    name: "Luxury Leather Bag",
    shortName: "LUXURY BAG",
    category: "Premium Accessories",
    headline: "Carry Your Ambition.",
    description:
      "Timeless craftsmanship for a modern premium lifestyle.",
    price: "$149",
    oldPrice: "$249",
    discount: "40% OFF",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1400&q=95",
  },
  {
    id: 8,
    name: "Premium Sunglasses",
    shortName: "SUNGLASSES",
    category: "Luxury Eyewear",
    headline: "See The Future.",
    description:
      "Bold eyewear with a refined futuristic aesthetic.",
    price: "$79",
    oldPrice: "$149",
    discount: "47% OFF",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1400&q=95",
  },
];

const Hero = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = products.length;

  /*
    ------------------------------------------------------------
    AUTO 360 LOOP
    ------------------------------------------------------------
  */

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setActive((current) => (current + 1) % total);
    }, 3200);

    return () => clearInterval(timer);
  }, [paused, total]);

  /*
    ------------------------------------------------------------
    NAVIGATION
    ------------------------------------------------------------
  */

  const nextProduct = () => {
    setActive((current) => (current + 1) % total);
  };

  const previousProduct = () => {
    setActive((current) => (current - 1 + total) % total);
  };

  /*
    ------------------------------------------------------------
    ACTIVE PRODUCT
    ------------------------------------------------------------
  */

  const currentProduct = products[active];

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#05020b] text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ======================================================
          BACKGROUND
      ======================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main purple glow */}

        <div className="absolute left-[-15%] top-[-20%] h-[600px] w-[600px] rounded-full bg-violet-700/20 blur-[150px]" />

        <div className="absolute right-[-15%] top-[10%] h-[650px] w-[650px] rounded-full bg-fuchsia-700/15 blur-[170px]" />

        <div className="absolute bottom-[-25%] left-[35%] h-[650px] w-[650px] rounded-full bg-indigo-700/15 blur-[180px]" />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage:
              "radial-gradient(circle at center, black 0%, transparent 75%)",
          }}
        />

        {/* Vignette */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(5,2,11,.75)_100%)]" />
      </div>

      {/* ======================================================
          TOP LABEL
      ======================================================= */}

      <div className="relative z-30 flex justify-center px-5 pt-28 sm:pt-32">
        <div className="flex items-center gap-3 rounded-full border border-violet-400/20 bg-white/[0.055] px-5 py-2.5 shadow-[0_0_50px_rgba(124,58,237,.15)] backdrop-blur-2xl">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-violet-400 opacity-70" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-violet-400" />
          </span>

          <span className="text-[10px] font-black uppercase tracking-[0.28em] text-violet-200 sm:text-xs">
            AmitShop • Future Of Shopping
          </span>
        </div>
      </div>

      {/* ======================================================
          MAIN HERO
      ======================================================= */}

      <div className="relative z-10 mx-auto grid min-h-[760px] max-w-[1500px] items-center px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:px-10">
        {/* ==================================================
            LEFT TEXT
        =================================================== */}

        <div className="relative z-50 mx-auto max-w-[610px] text-center lg:mx-0 lg:text-left">
          {/* Dynamic category */}

          <div
            key={currentProduct.id}
            className="animate-text-in mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 backdrop-blur-xl"
          >
            <span className="text-violet-300">✦</span>

            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55 sm:text-xs">
              {currentProduct.category}
            </span>
          </div>

          {/* Dynamic title */}

          <div
            key={`title-${currentProduct.id}`}
            className="animate-title-in"
          >
            <p className="mb-3 text-sm font-black uppercase tracking-[0.35em] text-violet-300 sm:text-base">
              {currentProduct.shortName}
            </p>

            <h1 className="text-[52px] font-black leading-[.91] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[88px]">
              {currentProduct.headline.split(" ").map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className={
                    index === currentProduct.headline.split(" ").length - 1
                      ? "block bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent"
                      : "mr-3 inline-block"
                  }
                >
                  {word}
                </span>
              ))}
            </h1>
          </div>

          {/* Dynamic description */}

          <p
            key={`description-${currentProduct.id}`}
            className="animate-text-in mx-auto mt-7 max-w-[500px] text-sm leading-7 text-white/45 sm:text-base sm:leading-8 lg:mx-0"
          >
            {currentProduct.description}
          </p>

          {/* Price */}

          <div
            key={`price-${currentProduct.id}`}
            className="animate-price-in mt-7 flex items-center justify-center gap-4 lg:justify-start"
          >
            <span className="text-3xl font-black">
              {currentProduct.price}
            </span>

            <span className="text-base text-white/25 line-through">
              {currentProduct.oldPrice}
            </span>

            <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1.5 text-[10px] font-black text-fuchsia-300">
              {currentProduct.discount}
            </span>
          </div>

          {/* Buttons */}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <button className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-7 py-4 font-bold shadow-[0_20px_60px_rgba(124,58,237,.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(168,85,247,.5)]">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Shop {currentProduct.shortName}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>

              <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
            </button>

            <button className="rounded-2xl border border-white/10 bg-white/[0.045] px-7 py-4 font-bold text-white/75 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.08] hover:text-white">
              Explore Collection
            </button>
          </div>

          {/* Stats */}

          <div className="mt-10 grid max-w-[500px] grid-cols-3 border-t border-white/10 pt-6">
            <div>
              <p className="text-2xl font-black">50K+</p>
              <p className="mt-1 text-[9px] uppercase tracking-[.18em] text-white/30">
                Products
              </p>
            </div>

            <div className="border-x border-white/10">
              <p className="text-2xl font-black">98%</p>
              <p className="mt-1 text-[9px] uppercase tracking-[.18em] text-white/30">
                Happy Users
              </p>
            </div>

            <div>
              <p className="text-2xl font-black">24/7</p>
              <p className="mt-1 text-[9px] uppercase tracking-[.18em] text-white/30">
                Support
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            TRUE 3D PRODUCT SYSTEM
        =================================================== */}

        <div className="relative mt-[-20px] flex h-[650px] items-center justify-center sm:h-[720px] lg:mt-0 lg:h-[780px]">
          {/* =================================================
              HUGE GLOW
          ================================================= */}

          <div
            className="absolute h-[320px] w-[320px] rounded-full bg-violet-600/20 blur-[100px] transition-all duration-1000 sm:h-[450px] sm:w-[450px]"
            style={{
              opacity: 0.45 + active * 0.025,
            }}
          />

          {/* =================================================
              3D FLOOR
          ================================================= */}

          <div
            className="absolute bottom-[90px] h-[170px] w-[420px] rounded-[50%]"
            style={{
              transform: "perspective(700px) rotateX(70deg)",
              background:
                "radial-gradient(ellipse, rgba(139,92,246,.30), rgba(139,92,246,.06) 45%, transparent 70%)",
              filter: "blur(5px)",
            }}
          />

          {/* =================================================
              OUTER 3D RINGS
          ================================================= */}

          <div
            className="absolute h-[450px] w-[450px] rounded-full border border-violet-400/[0.10] sm:h-[590px] sm:w-[590px]"
            style={{
              transform:
                "perspective(1100px) rotateX(66deg) rotateZ(-10deg)",
            }}
          />

          <div
            className="absolute h-[360px] w-[360px] rounded-full border border-fuchsia-400/[0.09] sm:h-[490px] sm:w-[490px]"
            style={{
              transform:
                "perspective(1100px) rotateX(66deg) rotateZ(18deg)",
            }}
          />

          {/* =================================================
              TRUE 3D CAROUSEL
          ================================================= */}

          <div
            className="absolute left-1/2 top-1/2 h-[1px] w-[1px]"
            style={{
              perspective: "1600px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            <div
              className="relative h-0 w-0"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(${-active * 45}deg)`,
                transition:
                  "transform 1.5s cubic-bezier(.22,.61,.36,1)",
              }}
            >
              {products.map((product, index) => {
                const angle = index * 45;

                const isActive = index === active;

                return (
                  <div
                    key={product.id}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: `
                        translate(-50%, -50%)
                        rotateY(${angle}deg)
                        translateZ(
                          clamp(245px, 25vw, 360px)
                        )
                        rotateY(${-angle}deg)
                      `,
                    }}
                  >
                    <div
                      className={`relative overflow-hidden rounded-[30px] border backdrop-blur-xl transition-all duration-1000 ${
                        isActive
                          ? "h-[310px] w-[235px] border-violet-300/40 bg-white/[0.11] shadow-[0_35px_100px_rgba(124,58,237,.38)]"
                          : "h-[230px] w-[175px] border-white/10 bg-white/[0.045] shadow-[0_25px_70px_rgba(0,0,0,.45)]"
                      }`}
                    >
                      {/* Product image */}

                      <div className="absolute inset-[5px] overflow-hidden rounded-[25px] bg-gradient-to-br from-violet-950 via-[#11091c] to-black">
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`h-full w-full object-contain p-5 transition-all duration-1000 ${
                            isActive
                              ? "scale-105"
                              : "scale-90 opacity-60"
                          }`}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-transparent" />

                        {/* Product label */}

                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-[9px] font-bold uppercase tracking-[.15em] text-violet-300">
                            {product.category}
                          </p>

                          <p className="mt-1 line-clamp-1 text-sm font-black">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs font-bold text-white/60">
                            {product.price}
                          </p>
                        </div>

                        {/* 3D badge */}

                        {isActive && (
                          <div className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[8px] font-black tracking-wider backdrop-blur-xl">
                            360°
                          </div>
                        )}
                      </div>

                      {/* Outer glow */}

                      {isActive && (
                        <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[35px] bg-violet-500/20 blur-2xl" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================
              CENTER FEATURE PRODUCT
          ================================================= */}

          <div className="relative z-[500] mt-[-5px]">
            {/* spinning halo */}

            <div
              className="absolute -inset-8 rounded-[50px] opacity-50 blur-2xl"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(139,92,246,.55), transparent, rgba(217,70,239,.55), transparent, rgba(99,102,241,.55))",
                animation: "haloSpin 8s linear infinite",
              }}
            />

            {/* Main card */}

            <div className="relative h-[410px] w-[300px] overflow-hidden rounded-[38px] border border-white/20 bg-[#0b0612]/90 p-2 shadow-[0_50px_130px_rgba(0,0,0,.8)] backdrop-blur-3xl sm:h-[500px] sm:w-[365px]">
              {/* Shine */}

              <div className="pointer-events-none absolute left-[-30%] top-[-50%] h-[100%] w-[60%] rotate-12 bg-white/[0.08] blur-3xl" />

              {/* Image */}

              <div className="relative h-[275px] overflow-hidden rounded-[30px] bg-gradient-to-br from-violet-950 via-[#140a21] to-[#030205] sm:h-[345px]">
                <img
                  key={currentProduct.id}
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="animate-main-product h-full w-full object-contain p-7 drop-shadow-[0_35px_40px_rgba(0,0,0,.8)] sm:p-9"
                />

                {/* Glow */}

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,.20),transparent_60%)]" />

                {/* Discount */}

                <div className="absolute left-4 top-4 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/15 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-fuchsia-200 backdrop-blur-xl">
                  {currentProduct.discount}
                </div>

                {/* Rotation */}

                <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/30 text-[9px] font-black backdrop-blur-xl">
                  360°
                </div>
              </div>

              {/* Main information */}

              <div className="px-5 pt-5 sm:px-6">
                <p className="text-[9px] font-black uppercase tracking-[.25em] text-violet-300">
                  {currentProduct.category}
                </p>

                <h2
                  key={`main-name-${currentProduct.id}`}
                  className="animate-name-in mt-1.5 text-xl font-black tracking-tight sm:text-2xl"
                >
                  {currentProduct.name}
                </h2>

                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xl font-black">
                    {currentProduct.price}
                  </span>

                  <span className="text-sm text-white/25 line-through">
                    {currentProduct.oldPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              FLOATING LEFT CARD
          ================================================= */}

          <div className="absolute left-[1%] top-[17%] z-[700] hidden animate-float lg:block">
            <div className="rounded-2xl border border-white/10 bg-black/35 p-4 shadow-[0_20px_60px_rgba(0,0,0,.5)] backdrop-blur-2xl">
              <p className="text-[8px] font-black uppercase tracking-[.25em] text-white/35">
                Live Showcase
              </p>

              <p className="mt-1 text-lg font-black">
                360° View
              </p>

              <p className="mt-1 text-[9px] text-violet-300">
                Premium Products
              </p>
            </div>
          </div>

          {/* =================================================
              FLOATING RIGHT CARD
          ================================================= */}

          <div className="absolute right-[1%] top-[19%] z-[700] hidden animate-float-reverse lg:block">
            <div className="rounded-2xl border border-white/10 bg-black/35 p-4 shadow-[0_20px_60px_rgba(0,0,0,.5)] backdrop-blur-2xl">
              <p className="text-[8px] font-black uppercase tracking-[.25em] text-white/35">
                Today's Drop
              </p>

              <p className="mt-1 text-lg font-black text-fuchsia-300">
                {currentProduct.discount}
              </p>

              <p className="mt-1 text-[9px] text-white/40">
                Limited Collection
              </p>
            </div>
          </div>

          {/* =================================================
              CONTROLS
          ================================================= */}

          <div className="absolute bottom-4 left-1/2 z-[900] flex -translate-x-1/2 items-center gap-3">
            <button
              onClick={previousProduct}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/60 backdrop-blur-xl transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-500/20 hover:text-white"
            >
              ←
            </button>

            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-4 py-2.5 backdrop-blur-xl">
              {products.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => setActive(index)}
                  aria-label={`Show ${product.name}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === active
                      ? "w-7 bg-violet-400"
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextProduct}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/60 backdrop-blur-xl transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-500/20 hover:text-white"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================
          TRUST BAR
      ======================================================= */}

      <div className="relative z-30 mx-auto mb-10 max-w-6xl px-5">
        <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-2xl sm:grid-cols-4">
          {[
            ["🚚", "Free Delivery", "Orders over $50"],
            ["🔒", "Secure Payment", "100% protected"],
            ["↩", "Easy Returns", "30-day guarantee"],
            ["⚡", "Fast Support", "Available 24/7"],
          ].map(([icon, title, subtitle], index) => (
            <div
              key={title}
              className={`flex items-center gap-3 px-5 py-4 ${
                index !== 3
                  ? "border-b border-white/10 sm:border-b-0 sm:border-r"
                  : ""
              }`}
            >
              <span className="text-xl">{icon}</span>

              <div>
                <p className="text-xs font-bold">{title}</p>

                <p className="mt-0.5 text-[9px] text-white/30">
                  {subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================
          ANIMATIONS
      ======================================================= */}

      <style>{`
        /*
        ================================================
        MAIN PRODUCT ENTER
        ================================================
        */

        @keyframes mainProduct {
          0% {
            opacity: 0;
            transform:
              perspective(1000px)
              rotateY(-35deg)
              rotateX(10deg)
              scale(.72)
              translateX(80px);
          }

          55% {
            opacity: 1;
          }

          100% {
            opacity: 1;
            transform:
              perspective(1000px)
              rotateY(0deg)
              rotateX(0deg)
              scale(1)
              translateX(0);
          }
        }

        /*
        ================================================
        TEXT
        ================================================
        */

        @keyframes textIn {
          0% {
            opacity: 0;
            transform: translateY(18px);
            filter: blur(8px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes titleIn {
          0% {
            opacity: 0;
            transform:
              translateY(30px)
              rotateX(15deg);
            filter: blur(10px);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              rotateX(0);
            filter: blur(0);
          }
        }

        @keyframes priceIn {
          0% {
            opacity: 0;
            transform: translateY(15px) scale(.95);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes nameIn {
          0% {
            opacity: 0;
            transform: translateX(20px);
            filter: blur(7px);
          }

          100% {
            opacity: 1;
            transform: translateX(0);
            filter: blur(0);
          }
        }

        /*
        ================================================
        FLOAT
        ================================================
        */

        @keyframes floating {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-14px);
          }
        }

        @keyframes floatingReverse {
          0%, 100% {
            transform: translateY(-6px);
          }

          50% {
            transform: translateY(10px);
          }
        }

        /*
        ================================================
        HALO
        ================================================
        */

        @keyframes haloSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .animate-main-product {
          animation:
            mainProduct
            .9s
            cubic-bezier(.22,.61,.36,1);
        }

        .animate-text-in {
          animation:
            textIn
            .65s
            cubic-bezier(.22,.61,.36,1);
        }

        .animate-title-in {
          animation:
            titleIn
            .8s
            cubic-bezier(.22,.61,.36,1);
        }

        .animate-price-in {
          animation:
            priceIn
            .7s
            cubic-bezier(.22,.61,.36,1);
        }

        .animate-name-in {
          animation:
            nameIn
            .65s
            cubic-bezier(.22,.61,.36,1);
        }

        .animate-float {
          animation:
            floating
            4s
            ease-in-out
            infinite;
        }

        .animate-float-reverse {
          animation:
            floatingReverse
            4.5s
            ease-in-out
            infinite;
        }

        /*
        ================================================
        MOBILE OPTIMIZATION
        ================================================
        */

        @media (max-width: 640px) {
          .animate-main-product {
            animation-duration: .7s;
          }
        }

        /*
        ================================================
        REDUCED MOTION
        ================================================
        */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
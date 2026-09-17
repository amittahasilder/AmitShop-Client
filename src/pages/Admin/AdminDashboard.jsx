// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// import api from "../../api/axios";
// import useAuthStore from "../../store/authStore";

// const AdminDashboard = () => {
//   const {
//     user,
//     accessToken,
//     isAuthenticated,
//   } = useAuthStore();

//   const [dashboard, setDashboard] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ============================================================
//   // FETCH ADMIN DASHBOARD
//   // ============================================================

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       if (!isAuthenticated || !accessToken) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError("");

//         const response = await api.get(
//           "/admin/dashboard",
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );

//         setDashboard(
//           response.data.dashboard
//         );
//       } catch (error) {
//         console.error(
//           "Admin Dashboard Error:",
//           error
//         );

//         setError(
//           error?.response?.data?.message ||
//             "Failed to load admin dashboard"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboard();
//   }, [
//     isAuthenticated,
//     accessToken,
//   ]);

//   // ============================================================
//   // LOADING
//   // ============================================================

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-14 h-14 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-5" />

//           <p className="text-slate-400">
//             Loading admin dashboard...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ============================================================
//   // AUTH
//   // ============================================================

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold mb-3">
//             Authentication Required
//           </h1>

//           <p className="text-slate-400 mb-6">
//             Please login to access the admin dashboard.
//           </p>

//           <Link
//             to="/login"
//             className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 font-semibold hover:scale-105 transition"
//           >
//             Login
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // ============================================================
//   // ADMIN SECURITY
//   // ============================================================

//   if (user?.role !== "admin") {
//     return (
//       <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
//         <div className="max-w-md text-center">
//           <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
//             <span className="text-4xl">
//               🔒
//             </span>
//           </div>

//           <h1 className="text-3xl font-bold mb-3">
//             Access Denied
//           </h1>

//           <p className="text-slate-400 mb-7">
//             Only administrators can access
//             this dashboard.
//           </p>

//           <Link
//             to="/"
//             className="inline-flex px-6 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition"
//           >
//             Back to Home
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // ============================================================
//   // ERROR
//   // ============================================================

//   if (error) {
//     return (
//       <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
//         <div className="max-w-lg text-center">
//           <div className="text-5xl mb-5">
//             ⚠️
//           </div>

//           <h1 className="text-2xl font-bold mb-3">
//             Dashboard Error
//           </h1>

//           <p className="text-red-400 mb-6">
//             {error}
//           </p>

//           <button
//             onClick={() =>
//               window.location.reload()
//             }
//             className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition font-semibold"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!dashboard) {
//     return null;
//   }

//   // ============================================================
//   // DATA
//   // ============================================================

//   const users = dashboard.users || {};
//   const products = dashboard.products || {};
//   const orders = dashboard.orders || {};
//   const sales = dashboard.sales || {};

//   const recentOrders =
//     dashboard.recentOrders || [];

//   const recentUsers =
//     dashboard.recentUsers || [];

//   // ============================================================
//   // FORMATTERS
//   // ============================================================

//   const formatCurrency = (value) => {
//     return `$${Number(value || 0).toFixed(2)}`;
//   };

//   const formatDate = (date) => {
//     if (!date) return "N/A";

//     return new Date(date).toLocaleDateString(
//       "en-US",
//       {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       }
//     );
//   };

//   const getStatusClass = (status) => {
//     const classes = {
//       pending:
//         "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

//       confirmed:
//         "bg-blue-500/10 text-blue-400 border-blue-500/20",

//       processing:
//         "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",

//       shipped:
//         "bg-purple-500/10 text-purple-400 border-purple-500/20",

//       delivered:
//         "bg-green-500/10 text-green-400 border-green-500/20",

//       cancelled:
//         "bg-red-500/10 text-red-400 border-red-500/20",
//     };

//     return (
//       classes[status] ||
//       "bg-white/5 text-slate-300 border-white/10"
//     );
//   };

//   // ============================================================
//   // STAT CARD
//   // ============================================================

//   const StatCard = ({
//     title,
//     value,
//     subtitle,
//     icon,
//   }) => {
//     return (
//       <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1">
//         <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-purple-600/10 blur-2xl group-hover:bg-purple-600/20 transition" />

//         <div className="relative flex items-start justify-between">
//           <div>
//             <p className="text-sm text-slate-400 mb-2">
//               {title}
//             </p>

//             <h3 className="text-3xl font-black text-white">
//               {value}
//             </h3>

//             {subtitle && (
//               <p className="text-xs text-slate-500 mt-2">
//                 {subtitle}
//               </p>
//             )}
//           </div>

//           <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl">
//             {icon}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // ============================================================
//   // PAGE
//   // ============================================================

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       {/* Background effects */}

//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl" />

//         <div className="absolute top-1/3 -right-40 w-96 h-96 bg-fuchsia-700/10 rounded-full blur-3xl" />

//         <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-700/10 rounded-full blur-3xl" />
//       </div>

//       <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         {/* ================================================== */}
//         {/* HEADER */}
//         {/* ================================================== */}

//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
//           <div>
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-semibold mb-4">
//               <span>⚡</span>
//               AmitShop Admin
//             </div>

//             <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
//               Admin Dashboard
//             </h1>

//             <p className="text-slate-400 mt-3 max-w-2xl">
//               Welcome back,{" "}
//               <span className="text-white font-semibold">
//                 {user?.name || "Admin"}
//               </span>
//               . Manage your entire AmitShop
//               platform from one place.
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <Link
//               to="/admin/users"
//               className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-semibold"
//             >
//               Manage Users
//             </Link>

//             <Link
//               to="/admin/products"
//               className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 transition font-semibold shadow-lg shadow-purple-900/20"
//             >
//               Manage Products
//             </Link>
//           </div>
//         </div>

//         {/* ================================================== */}
//         {/* MAIN STATS */}
//         {/* ================================================== */}

//         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
//           <StatCard
//             title="Total Users"
//             value={users.total || 0}
//             subtitle={`${users.active || 0} active users`}
//             icon="👥"
//           />

//           <StatCard
//             title="Total Products"
//             value={products.total || 0}
//             subtitle={`${products.active || 0} active products`}
//             icon="📦"
//           />

//           <StatCard
//             title="Total Orders"
//             value={orders.total || 0}
//             subtitle={`${orders.pending || 0} pending`}
//             icon="🛒"
//           />

//           <StatCard
//             title="Total Revenue"
//             value={formatCurrency(
//               sales.totalSales
//             )}
//             subtitle={`${sales.averageOrderValue ? formatCurrency(sales.averageOrderValue) : "$0.00"} avg order`}
//             icon="💰"
//           />
//         </section>

//         {/* ================================================== */}
//         {/* SECONDARY STATS */}
//         {/* ================================================== */}

//         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
//           <StatCard
//             title="Customers"
//             value={users.customers || 0}
//             subtitle="Registered customers"
//             icon="🧑‍💼"
//           />

//           <StatCard
//             title="Sellers"
//             value={users.sellers || 0}
//             subtitle="Registered sellers"
//             icon="🏪"
//           />

//           <StatCard
//             title="Low Stock"
//             value={products.lowStock || 0}
//             subtitle={`${products.outOfStock || 0} out of stock`}
//             icon="⚠️"
//           />

//           <StatCard
//             title="Delivered Orders"
//             value={orders.delivered || 0}
//             subtitle={`${orders.cancelled || 0} cancelled`}
//             icon="✅"
//           />
//         </section>

//         {/* ================================================== */}
//         {/* ORDER + USER OVERVIEW */}
//         {/* ================================================== */}

//         <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
//           {/* Order Statistics */}

//           <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h2 className="text-xl font-bold">
//                   Order Statistics
//                 </h2>

//                 <p className="text-sm text-slate-500 mt-1">
//                   Current order status overview
//                 </p>
//               </div>

//               <span className="text-2xl">
//                 📊
//               </span>
//             </div>

//             <div className="space-y-4">
//               {[
//                 [
//                   "Pending",
//                   orders.pending,
//                   "bg-yellow-500",
//                 ],
//                 [
//                   "Confirmed",
//                   orders.confirmed,
//                   "bg-blue-500",
//                 ],
//                 [
//                   "Processing",
//                   orders.processing,
//                   "bg-indigo-500",
//                 ],
//                 [
//                   "Shipped",
//                   orders.shipped,
//                   "bg-purple-500",
//                 ],
//                 [
//                   "Delivered",
//                   orders.delivered,
//                   "bg-green-500",
//                 ],
//                 [
//                   "Cancelled",
//                   orders.cancelled,
//                   "bg-red-500",
//                 ],
//               ].map(
//                 ([label, value, color]) => {
//                   const total =
//                     Number(orders.total) || 1;

//                   const percentage = Math.min(
//                     100,
//                     Math.round(
//                       ((Number(value) || 0) /
//                         total) *
//                         100
//                     )
//                   );

//                   return (
//                     <div key={label}>
//                       <div className="flex justify-between text-sm mb-2">
//                         <span className="text-slate-300">
//                           {label}
//                         </span>

//                         <span className="text-white font-semibold">
//                           {value || 0}
//                         </span>
//                       </div>

//                       <div className="h-2 rounded-full bg-white/5 overflow-hidden">
//                         <div
//                           className={`h-full ${color} rounded-full transition-all duration-700`}
//                           style={{
//                             width: `${percentage}%`,
//                           }}
//                         />
//                       </div>
//                     </div>
//                   );
//                 }
//               )}
//             </div>
//           </div>

//           {/* Platform Overview */}

//           <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h2 className="text-xl font-bold">
//                   Platform Overview
//                 </h2>

//                 <p className="text-sm text-slate-500 mt-1">
//                   Users and product health
//                 </p>
//               </div>

//               <span className="text-2xl">
//                 📈
//               </span>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-5">
//                 <p className="text-sm text-slate-500">
//                   Active Users
//                 </p>

//                 <p className="text-2xl font-bold mt-2">
//                   {users.active || 0}
//                 </p>

//                 <p className="text-xs text-green-400 mt-2">
//                   {users.inactive || 0} inactive
//                 </p>
//               </div>

//               <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-5">
//                 <p className="text-sm text-slate-500">
//                   Active Products
//                 </p>

//                 <p className="text-2xl font-bold mt-2">
//                   {products.active || 0}
//                 </p>

//                 <p className="text-xs text-red-400 mt-2">
//                   {products.inactive || 0} inactive
//                 </p>
//               </div>

//               <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-5">
//                 <p className="text-sm text-slate-500">
//                   Total Sellers
//                 </p>

//                 <p className="text-2xl font-bold mt-2">
//                   {users.sellers || 0}
//                 </p>

//                 <p className="text-xs text-purple-400 mt-2">
//                   Seller accounts
//                 </p>
//               </div>

//               <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-5">
//                 <p className="text-sm text-slate-500">
//                   Sale Orders
//                 </p>

//                 <p className="text-2xl font-bold mt-2">
//                   {sales.totalSaleOrders ||
//                     orders.total ||
//                     0}
//                 </p>

//                 <p className="text-xs text-blue-400 mt-2">
//                   Revenue generating orders
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ================================================== */}
//         {/* RECENT ORDERS */}
//         {/* ================================================== */}

//         <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden mb-10">
//           <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h2 className="text-xl font-bold">
//                 Recent Orders
//               </h2>

//               <p className="text-sm text-slate-500 mt-1">
//                 Latest customer orders
//               </p>
//             </div>

//             <Link
//               to="/admin/orders"
//               className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition"
//             >
//               View All Orders →
//             </Link>
//           </div>

//           {recentOrders.length === 0 ? (
//             <div className="p-10 text-center text-slate-500">
//               No recent orders found.
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[760px]">
//                 <thead>
//                   <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-white/5">
//                     <th className="px-6 py-4">
//                       Order
//                     </th>

//                     <th className="px-6 py-4">
//                       Customer
//                     </th>

//                     <th className="px-6 py-4">
//                       Items
//                     </th>

//                     <th className="px-6 py-4">
//                       Amount
//                     </th>

//                     <th className="px-6 py-4">
//                       Status
//                     </th>

//                     <th className="px-6 py-4">
//                       Date
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {recentOrders.map(
//                     (order) => (
//                       <tr
//                         key={order._id}
//                         className="border-b border-white/5 last:border-0 hover:bg-white/[0.025] transition"
//                       >
//                         <td className="px-6 py-5">
//                           <Link
//                             to={`/admin/orders/${order._id}`}
//                             className="font-semibold text-purple-400 hover:text-purple-300"
//                           >
//                             #
//                             {order._id
//                               ?.slice(-8)
//                               .toUpperCase()}
//                           </Link>
//                         </td>

//                         <td className="px-6 py-5">
//                           <div>
//                             <p className="font-medium">
//                               {order.user?.name ||
//                                 "Unknown"}
//                             </p>

//                             <p className="text-xs text-slate-500">
//                               {order.user?.email ||
//                                 "N/A"}
//                             </p>
//                           </div>
//                         </td>

//                         <td className="px-6 py-5 text-slate-300">
//                           {order.items?.length ||
//                             0}
//                         </td>

//                         <td className="px-6 py-5 font-semibold">
//                           {formatCurrency(
//                             order.totalPrice
//                           )}
//                         </td>

//                         <td className="px-6 py-5">
//                           <span
//                             className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-semibold capitalize ${getStatusClass(
//                               order.orderStatus
//                             )}`}
//                           >
//                             {order.orderStatus ||
//                               "pending"}
//                           </span>
//                         </td>

//                         <td className="px-6 py-5 text-sm text-slate-400">
//                           {formatDate(
//                             order.createdAt
//                           )}
//                         </td>
//                       </tr>
//                     )
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>

//         {/* ================================================== */}
//         {/* RECENT USERS */}
//         {/* ================================================== */}

//         <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden mb-10">
//           <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h2 className="text-xl font-bold">
//                 Recent Users
//               </h2>

//               <p className="text-sm text-slate-500 mt-1">
//                 Newly registered users
//               </p>
//             </div>

//             <Link
//               to="/admin/users"
//               className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition"
//             >
//               Manage Users →
//             </Link>
//           </div>

//           {recentUsers.length === 0 ? (
//             <div className="p-10 text-center text-slate-500">
//               No recent users found.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
//               {recentUsers.map(
//                 (recentUser) => (
//                   <div
//                     key={recentUser._id}
//                     className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 hover:bg-white/[0.05] transition"
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center font-bold text-lg">
//                         {recentUser.name
//                           ?.charAt(0)
//                           ?.toUpperCase() ||
//                           "U"}
//                       </div>

//                       <div className="min-w-0 flex-1">
//                         <p className="font-semibold truncate">
//                           {recentUser.name ||
//                             "Unknown User"}
//                         </p>

//                         <p className="text-sm text-slate-500 truncate">
//                           {recentUser.email ||
//                             "N/A"}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between mt-5">
//                       <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold capitalize">
//                         {recentUser.role ||
//                           "customer"}
//                       </span>

//                       <span className="text-xs text-slate-500">
//                         {formatDate(
//                           recentUser.createdAt
//                         )}
//                       </span>
//                     </div>
//                   </div>
//                 )
//               )}
//             </div>
//           )}
//         </section>

//         {/* ================================================== */}
//         {/* QUICK ACTIONS */}
//         {/* ================================================== */}

//         <section>
//           <div className="mb-5">
//             <h2 className="text-2xl font-bold">
//               Quick Actions
//             </h2>

//             <p className="text-sm text-slate-500 mt-1">
//               Manage your AmitShop platform
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             <Link
//               to="/admin/users"
//               className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 hover:border-purple-500/30 hover:bg-purple-500/[0.04] transition-all duration-300 hover:-translate-y-1"
//             >
//               <div className="text-3xl mb-4">
//                 👥
//               </div>

//               <h3 className="font-bold text-lg">
//                 Manage Users
//               </h3>

//               <p className="text-sm text-slate-500 mt-2">
//                 View and manage customer,
//                 seller and admin accounts.
//               </p>

//               <span className="inline-block mt-5 text-purple-400 font-semibold text-sm">
//                 Manage →
//               </span>
//             </Link>

//             <Link
//               to="/admin/products"
//               className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 hover:border-purple-500/30 hover:bg-purple-500/[0.04] transition-all duration-300 hover:-translate-y-1"
//             >
//               <div className="text-3xl mb-4">
//                 📦
//               </div>

//               <h3 className="font-bold text-lg">
//                 Manage Products
//               </h3>

//               <p className="text-sm text-slate-500 mt-2">
//                 Control products, stock and
//                 product status.
//               </p>

//               <span className="inline-block mt-5 text-purple-400 font-semibold text-sm">
//                 Manage →
//               </span>
//             </Link>

//             <Link
//               to="/admin/orders"
//               className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 hover:border-purple-500/30 hover:bg-purple-500/[0.04] transition-all duration-300 hover:-translate-y-1"
//             >
//               <div className="text-3xl mb-4">
//                 🛒
//               </div>

//               <h3 className="font-bold text-lg">
//                 Manage Orders
//               </h3>

//               <p className="text-sm text-slate-500 mt-2">
//                 Review orders and update
//                 order/payment status.
//               </p>

//               <span className="inline-block mt-5 text-purple-400 font-semibold text-sm">
//                 Manage →
//               </span>
//             </Link>

//             <Link
//               to="/admin/analytics"
//               className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 hover:border-purple-500/30 hover:bg-purple-500/[0.04] transition-all duration-300 hover:-translate-y-1"
//             >
//               <div className="text-3xl mb-4">
//                 📈
//               </div>

//               <h3 className="font-bold text-lg">
//                 Analytics
//               </h3>

//               <p className="text-sm text-slate-500 mt-2">
//                 View sales, products, sellers
//                 and platform analytics.
//               </p>

//               <span className="inline-block mt-5 text-purple-400 font-semibold text-sm">
//                 View Analytics →
//               </span>
//             </Link>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

// ============================================================
// ADMIN DASHBOARD
// Premium Glass / Mirror / Animated Dashboard
// ============================================================

const AdminDashboard = () => {
  const { user, accessToken, isAuthenticated } = useAuthStore();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================================
  // FETCH DASHBOARD
  // ==========================================================

  const fetchDashboard = async (isRefresh = false) => {
    if (!isAuthenticated || !accessToken) {
      setLoading(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = response?.data?.dashboard;

      setDashboard(data || {});
    } catch (err) {
      console.error("Admin Dashboard Error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load admin dashboard"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [isAuthenticated, accessToken]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <>
        <DashboardStyles />

        <div className="admin-shell min-h-screen flex items-center justify-center px-6">
          <div className="ambient ambient-one" />
          <div className="ambient ambient-two" />

          <div className="glass-loader text-center">
            <div className="loader-ring">
              <div className="loader-core">A</div>
            </div>

            <h2 className="mt-7 text-2xl font-black text-white">
              Loading Admin Panel
            </h2>

            <p className="mt-2 text-white/40 text-sm">
              Preparing your dashboard...
            </p>

            <div className="loader-line mt-6">
              <div />
            </div>
          </div>
        </div>
      </>
    );
  }

  // ==========================================================
  // AUTH
  // ==========================================================

  if (!isAuthenticated) {
    return (
      <>
        <DashboardStyles />

        <div className="admin-shell min-h-screen flex items-center justify-center px-6">
          <div className="ambient ambient-one" />
          <div className="ambient ambient-two" />

          <div className="glass-panel max-w-md w-full text-center p-10">
            <div className="icon-box mx-auto mb-6">🔐</div>

            <h1 className="text-3xl font-black text-white">
              Authentication Required
            </h1>

            <p className="text-white/40 mt-3 mb-7">
              Please login to access the admin dashboard.
            </p>

            <Link
              to="/login"
              className="premium-button inline-flex"
            >
              Login →
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ==========================================================
  // ADMIN SECURITY
  // ==========================================================

  if (user?.role !== "admin") {
    return (
      <>
        <DashboardStyles />

        <div className="admin-shell min-h-screen flex items-center justify-center px-6">
          <div className="ambient ambient-one" />
          <div className="ambient ambient-two" />

          <div className="glass-panel max-w-lg w-full text-center p-10">
            <div className="lock-orb mx-auto mb-7">
              🔒
            </div>

            <div className="status-badge mb-5">
              <span className="status-dot red" />
              ADMIN ACCESS
            </div>

            <h1 className="text-4xl font-black text-white">
              Access Denied
            </h1>

            <p className="text-white/40 mt-4 mb-7 leading-7">
              Only administrators can access this dashboard.
            </p>

            <Link
              to="/"
              className="glass-button inline-flex"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <>
        <DashboardStyles />

        <div className="admin-shell min-h-screen flex items-center justify-center px-6">
          <div className="ambient ambient-one" />
          <div className="ambient ambient-two" />

          <div className="glass-panel max-w-lg w-full text-center p-10">
            <div className="error-orb mx-auto mb-7">
              ⚠️
            </div>

            <h1 className="text-3xl font-black text-white">
              Dashboard Error
            </h1>

            <p className="text-red-400 mt-4 mb-7">
              {error}
            </p>

            <button
              onClick={() => fetchDashboard(true)}
              className="premium-button"
            >
              Try Again ↻
            </button>
          </div>
        </div>
      </>
    );
  }

  // ==========================================================
  // DATA
  // ==========================================================

  const users = dashboard?.users || {};
  const products = dashboard?.products || {};
  const orders = dashboard?.orders || {};
  const sales = dashboard?.sales || {};

  const recentOrders = dashboard?.recentOrders || [];
  const recentUsers = dashboard?.recentUsers || [];

  const totalOrders = Number(orders.total) || 0;

  const orderStatuses = [
    {
      label: "Pending",
      value: Number(orders.pending) || 0,
      icon: "⏳",
      color: "#f59e0b",
    },
    {
      label: "Confirmed",
      value: Number(orders.confirmed) || 0,
      icon: "✓",
      color: "#3b82f6",
    },
    {
      label: "Processing",
      value: Number(orders.processing) || 0,
      icon: "⚙",
      color: "#6366f1",
    },
    {
      label: "Shipped",
      value: Number(orders.shipped) || 0,
      icon: "🚚",
      color: "#a855f7",
    },
    {
      label: "Delivered",
      value: Number(orders.delivered) || 0,
      icon: "✓",
      color: "#22c55e",
    },
    {
      label: "Cancelled",
      value: Number(orders.cancelled) || 0,
      icon: "×",
      color: "#ef4444",
    },
  ];

  // ==========================================================
  // FORMATTERS
  // ==========================================================

  const formatCurrency = (value) => {
    return `$${Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "N/A";
    }

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    const normalized = String(status || "pending").toLowerCase();

    const classes = {
      pending:
        "status-yellow",
      confirmed:
        "status-blue",
      processing:
        "status-indigo",
      shipped:
        "status-purple",
      delivered:
        "status-green",
      cancelled:
        "status-red",
    };

    return classes[normalized] || "status-default";
  };

  // ==========================================================
  // DONUT GRADIENT
  // ==========================================================

  const getDonutGradient = () => {
    const values = orderStatuses.map((item) => item.value);

    const total =
      values.reduce((sum, value) => sum + value, 0) || 1;

    let current = 0;

    return orderStatuses
      .map((item) => {
        const start = (current / total) * 360;

        current += item.value;

        const end = (current / total) * 360;

        return `${item.color} ${start}deg ${end}deg`;
      })
      .join(", ");
  };

  // ==========================================================
  // COMPONENTS
  // ==========================================================

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    accent = "purple",
    trend,
  }) => {
    return (
      <div className={`stat-card accent-${accent}`}>
        <div className="card-shine" />

        <div className="card-glow" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="stat-label">
                {title}
              </p>

              <h3 className="stat-value">
                {value}
              </h3>

              <p className="stat-subtitle">
                {subtitle}
              </p>
            </div>

            <div className="stat-icon">
              {icon}
            </div>
          </div>

          <div className="flex items-center justify-between mt-5">
            <div className="stat-progress">
              <div />
            </div>

            {trend && (
              <span className="trend">
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const MiniMetric = ({
    label,
    value,
    icon,
  }) => {
    return (
      <div className="mini-metric">
        <div className="mini-icon">
          {icon}
        </div>

        <div>
          <p>{label}</p>
          <strong>{value}</strong>
        </div>
      </div>
    );
  };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <>
      <DashboardStyles />

      <div className="admin-shell min-h-screen text-white overflow-hidden">
        {/* ====================================================
            BACKGROUND
        ==================================================== */}

        <div className="background-layer">
          <div className="grid-overlay" />

          <div className="ambient ambient-one" />
          <div className="ambient ambient-two" />
          <div className="ambient ambient-three" />

          <div className="floating-orb orb-one" />
          <div className="floating-orb orb-two" />
          <div className="floating-orb orb-three" />
        </div>

        {/* ====================================================
            MAIN
        ==================================================== */}

        <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

          {/* ==================================================
              TOP BAR
          ================================================== */}

          <div className="top-glass mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div className="flex items-center gap-4">
                <div className="brand-orb">
                  A
                </div>

                <div>
                  <p className="text-white font-black text-lg">
                    AmitShop
                  </p>

                  <p className="text-white/30 text-xs">
                    Enterprise Control Center
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="status-badge">
                  <span className="status-dot green" />
                  SYSTEM ONLINE
                </div>

                <button
                  onClick={() => fetchDashboard(true)}
                  disabled={refreshing}
                  className="glass-button"
                >
                  <span
                    className={
                      refreshing
                        ? "animate-spin inline-block"
                        : ""
                    }
                  >
                    ↻
                  </span>

                  {refreshing
                    ? "Refreshing..."
                    : "Refresh"}
                </button>
              </div>

            </div>
          </div>

          {/* ==================================================
              HERO
          ================================================== */}

          <section className="hero-section mb-10">

            <div>
              <div className="status-badge mb-5">
                <span className="status-dot purple" />
                LIVE ADMIN PANEL
              </div>

              <h1 className="hero-title">
                Admin{" "}
                <span>
                  Dashboard
                </span>
              </h1>

              <p className="hero-description">
                Welcome back,{" "}
                <strong>
                  {user?.name || "Admin"}
                </strong>
                . Monitor your AmitShop ecosystem,
                revenue, orders, users and inventory
                from one intelligent control center.
              </p>
            </div>

            <div className="hero-actions">
              <Link
                to="/admin/users"
                className="glass-button"
              >
                👥 Users
              </Link>

              <Link
                to="/admin/products"
                className="premium-button"
              >
                📦 Products
              </Link>
            </div>

          </section>

          {/* ==================================================
              KPI CARDS
          ================================================== */}

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

            <StatCard
              title="Total Users"
              value={users.total || 0}
              subtitle={`${users.active || 0} active accounts`}
              icon="👥"
              accent="purple"
              trend="+ LIVE"
            />

            <StatCard
              title="Total Products"
              value={products.total || 0}
              subtitle={`${products.active || 0} active products`}
              icon="📦"
              accent="blue"
              trend="+ STOCK"
            />

            <StatCard
              title="Total Orders"
              value={orders.total || 0}
              subtitle={`${orders.pending || 0} currently pending`}
              icon="🛒"
              accent="orange"
              trend="LIVE"
            />

            <StatCard
              title="Total Revenue"
              value={formatCurrency(sales.totalSales)}
              subtitle={`${formatCurrency(
                sales.averageOrderValue
              )} average order`}
              icon="💰"
              accent="green"
              trend="SALES"
            />

          </section>

          {/* ==================================================
              SECONDARY CARDS
          ================================================== */}

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">

            <StatCard
              title="Customers"
              value={users.customers || 0}
              subtitle="Registered customers"
              icon="🧑"
              accent="purple"
            />

            <StatCard
              title="Sellers"
              value={users.sellers || 0}
              subtitle="Marketplace sellers"
              icon="🏪"
              accent="blue"
            />

            <StatCard
              title="Low Stock"
              value={products.lowStock || 0}
              subtitle={`${products.outOfStock || 0} out of stock`}
              icon="⚠️"
              accent="orange"
            />

            <StatCard
              title="Delivered"
              value={orders.delivered || 0}
              subtitle={`${orders.cancelled || 0} cancelled`}
              icon="🚀"
              accent="green"
            />

          </section>

          {/* ==================================================
              ANALYTICS
          ================================================== */}

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">

            {/* ==================================================
                DONUT CHART
            ================================================== */}

            <div className="glass-panel xl:col-span-1 p-7">

              <div className="section-header">
                <div>
                  <p className="section-kicker">
                    ANALYTICS
                  </p>

                  <h2 className="section-title">
                    Order Status
                  </h2>

                  <p className="section-subtitle">
                    Real-time order distribution
                  </p>
                </div>

                <div className="header-icon">
                  📊
                </div>
              </div>

              <div className="donut-wrapper">

                <div
                  className="donut"
                  style={{
                    background: `conic-gradient(${getDonutGradient()})`,
                  }}
                >
                  <div className="donut-inner">
                    <span className="donut-number">
                      {totalOrders}
                    </span>

                    <span className="donut-label">
                      TOTAL ORDERS
                    </span>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3 mt-7">

                {orderStatuses.map((item) => (
                  <div
                    key={item.label}
                    className="chart-legend"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="legend-dot"
                        style={{
                          background: item.color,
                        }}
                      />

                      <span>
                        {item.label}
                      </span>
                    </div>

                    <strong>
                      {item.value}
                    </strong>
                  </div>
                ))}

              </div>
            </div>

            {/* ==================================================
                BAR CHART
            ================================================== */}

            <div className="glass-panel xl:col-span-2 p-7">

              <div className="section-header">

                <div>
                  <p className="section-kicker">
                    PERFORMANCE
                  </p>

                  <h2 className="section-title">
                    Order Overview
                  </h2>

                  <p className="section-subtitle">
                    Current order activity by status
                  </p>
                </div>

                <div className="live-pill">
                  <span className="status-dot green" />
                  Live Data
                </div>

              </div>

              <div className="bar-chart">

                {orderStatuses.map((item, index) => {

                  const percentage =
                    totalOrders > 0
                      ? Math.round(
                          (item.value /
                            totalOrders) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      className="bar-row"
                      key={item.label}
                    >

                      <div className="bar-info">
                        <div className="bar-name">
                          <span className="bar-icon">
                            {item.icon}
                          </span>

                          <span>
                            {item.label}
                          </span>
                        </div>

                        <div className="bar-number">
                          <span>
                            {percentage}%
                          </span>

                          <strong>
                            {item.value}
                          </strong>
                        </div>
                      </div>

                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${percentage}%`,
                            background: item.color,
                            animationDelay: `${index * 100}ms`,
                          }}
                        />
                      </div>

                    </div>
                  );
                })}

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">

                <MiniMetric
                  label="Customers"
                  value={users.customers || 0}
                  icon="👥"
                />

                <MiniMetric
                  label="Sellers"
                  value={users.sellers || 0}
                  icon="🏪"
                />

                <MiniMetric
                  label="Products"
                  value={products.total || 0}
                  icon="📦"
                />

              </div>

            </div>
          </section>

          {/* ==================================================
              PLATFORM HEALTH
          ================================================== */}

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

            {/* USERS */}

            <div className="glass-panel p-7">

              <div className="section-header">

                <div>
                  <p className="section-kicker">
                    COMMUNITY
                  </p>

                  <h2 className="section-title">
                    User Overview
                  </h2>

                  <p className="section-subtitle">
                    Platform account distribution
                  </p>
                </div>

                <div className="header-icon">
                  👥
                </div>

              </div>

              <div className="space-y-6 mt-7">

                {[
                  {
                    label: "Customers",
                    value: Number(users.customers) || 0,
                    color: "#a855f7",
                  },
                  {
                    label: "Sellers",
                    value: Number(users.sellers) || 0,
                    color: "#d946ef",
                  },
                  {
                    label: "Admins",
                    value: Number(users.admins) || 0,
                    color: "#3b82f6",
                  },
                ].map((item) => {

                  const total =
                    Number(users.total) || 1;

                  const percentage = Math.min(
                    100,
                    Math.round(
                      (item.value / total) *
                        100
                    )
                  );

                  return (
                    <div key={item.label}>

                      <div className="flex items-center justify-between mb-2">

                        <span className="text-sm text-white/50">
                          {item.label}
                        </span>

                        <span className="font-bold">
                          {item.value}
                        </span>

                      </div>

                      <div className="health-track">
                        <div
                          className="health-fill"
                          style={{
                            width: `${percentage}%`,
                            background: item.color,
                          }}
                        />
                      </div>

                      <p className="text-[11px] text-white/25 mt-2">
                        {percentage}% of total users
                      </p>

                    </div>
                  );
                })}

              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">

                <div className="health-card green-health">
                  <span>ACTIVE</span>
                  <strong>
                    {users.active || 0}
                  </strong>
                </div>

                <div className="health-card red-health">
                  <span>INACTIVE</span>
                  <strong>
                    {users.inactive || 0}
                  </strong>
                </div>

              </div>
            </div>

            {/* PRODUCTS */}

            <div className="glass-panel p-7">

              <div className="section-header">

                <div>
                  <p className="section-kicker">
                    INVENTORY
                  </p>

                  <h2 className="section-title">
                    Product Health
                  </h2>

                  <p className="section-subtitle">
                    Inventory status overview
                  </p>
                </div>

                <div className="header-icon">
                  📦
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7">

                <div className="inventory-card inventory-green">
                  <div>
                    <span>ACTIVE</span>
                    <strong>
                      {products.active || 0}
                    </strong>
                  </div>

                  <div className="inventory-icon">
                    ✓
                  </div>
                </div>

                <div className="inventory-card">
                  <div>
                    <span>INACTIVE</span>
                    <strong>
                      {products.inactive || 0}
                    </strong>
                  </div>

                  <div className="inventory-icon">
                    ○
                  </div>
                </div>

                <div className="inventory-card inventory-yellow">
                  <div>
                    <span>LOW STOCK</span>
                    <strong>
                      {products.lowStock || 0}
                    </strong>
                  </div>

                  <div className="inventory-icon">
                    ⚠
                  </div>
                </div>

                <div className="inventory-card inventory-red">
                  <div>
                    <span>OUT OF STOCK</span>
                    <strong>
                      {products.outOfStock || 0}
                    </strong>
                  </div>

                  <div className="inventory-icon">
                    ×
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* ==================================================
              RECENT ORDERS
          ================================================== */}

          <section className="glass-panel overflow-hidden mb-10">

            <div className="section-header p-7 border-b border-white/10">

              <div>
                <p className="section-kicker">
                  ACTIVITY
                </p>

                <h2 className="section-title">
                  Recent Orders
                </h2>

                <p className="section-subtitle">
                  Latest customer activity
                </p>
              </div>

              <Link
                to="/admin/orders"
                className="glass-button"
              >
                View All →
              </Link>

            </div>

            {recentOrders.length === 0 ? (
              <div className="empty-state">
                <div>🛒</div>
                <p>No recent orders found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>ORDER</th>
                      <th>CUSTOMER</th>
                      <th>ITEMS</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                      <th>DATE</th>
                    </tr>
                  </thead>

                  <tbody>

                    {recentOrders.map((order) => (

                      <tr key={order._id}>

                        <td>
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="order-id"
                          >
                            #
                            {order._id
                              ?.slice(-8)
                              .toUpperCase()}
                          </Link>
                        </td>

                        <td>
                          <div className="customer-cell">

                            <div className="avatar">
                              {order.user?.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "U"}
                            </div>

                            <div>
                              <p className="customer-name">
                                {order.user?.name ||
                                  "Unknown"}
                              </p>

                              <p className="customer-email">
                                {order.user?.email ||
                                  "N/A"}
                              </p>
                            </div>

                          </div>
                        </td>

                        <td>
                          {order.items?.length || 0}
                        </td>

                        <td>
                          <strong>
                            {formatCurrency(
                              order.totalPrice
                            )}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`order-status ${getStatusClass(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus ||
                              "pending"}
                          </span>
                        </td>

                        <td>
                          {formatDate(
                            order.createdAt
                          )}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>
              </div>
            )}

          </section>

          {/* ==================================================
              RECENT USERS
          ================================================== */}

          <section className="glass-panel overflow-hidden mb-10">

            <div className="section-header p-7 border-b border-white/10">

              <div>
                <p className="section-kicker">
                  COMMUNITY
                </p>

                <h2 className="section-title">
                  Recent Users
                </h2>

                <p className="section-subtitle">
                  Latest registered members
                </p>
              </div>

              <Link
                to="/admin/users"
                className="glass-button"
              >
                Manage Users →
              </Link>

            </div>

            {recentUsers.length === 0 ? (
              <div className="empty-state">
                <div>👥</div>
                <p>No recent users found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-7">

                {recentUsers.map((recentUser) => (

                  <div
                    key={recentUser._id}
                    className="user-card"
                  >

                    <div className="flex items-center gap-4">

                      <div className="avatar avatar-large">
                        {recentUser.name
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "U"}

                        <span className="online-dot" />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="font-bold truncate text-white">
                          {recentUser.name ||
                            "Unknown User"}
                        </p>

                        <p className="text-xs text-white/30 truncate mt-1">
                          {recentUser.email ||
                            "N/A"}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center justify-between mt-5">

                      <span className="role-badge">
                        {recentUser.role ||
                          "customer"}
                      </span>

                      <span className="text-xs text-white/25">
                        {formatDate(
                          recentUser.createdAt
                        )}
                      </span>

                    </div>

                  </div>
                ))}
              </div>
            )}

          </section>

          {/* ==================================================
              QUICK ACTIONS
          ================================================== */}

          <section className="pb-10">

            <div className="mb-6">
              <p className="section-kicker">
                CONTROL CENTER
              </p>

              <h2 className="text-3xl font-black mt-2">
                Quick Actions
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

              {[
                {
                  to: "/admin/users",
                  icon: "👥",
                  title: "Manage Users",
                  text: "Control customers, sellers and admin accounts.",
                },
                {
                  to: "/admin/products",
                  icon: "📦",
                  title: "Manage Products",
                  text: "Manage products, stock and product status.",
                },
                {
                  to: "/admin/orders",
                  icon: "🛒",
                  title: "Manage Orders",
                  text: "Review orders and payment information.",
                },
                {
                  to: "/admin/analytics",
                  icon: "📈",
                  title: "Analytics",
                  text: "Explore sales and platform analytics.",
                },
              ].map((item) => (

                <Link
                  key={item.title}
                  to={item.to}
                  className="action-card"
                >

                  <div className="action-glow" />

                  <div className="action-icon">
                    {item.icon}
                  </div>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.text}
                  </p>

                  <span className="action-link">
                    Open Panel →
                  </span>

                </Link>
              ))}

            </div>

          </section>

        </main>
      </div>
    </>
  );
};

// ============================================================
// GLOBAL DASHBOARD STYLES
// ============================================================

const DashboardStyles = () => {
  return (
    <style>{`

      /* ======================================================
         BASE
      ====================================================== */

      .admin-shell {
        background:
          radial-gradient(
            circle at 10% 10%,
            rgba(124, 58, 237, 0.16),
            transparent 32%
          ),
          radial-gradient(
            circle at 90% 15%,
            rgba(217, 70, 239, 0.12),
            transparent 30%
          ),
          radial-gradient(
            circle at 50% 100%,
            rgba(59, 130, 246, 0.10),
            transparent 35%
          ),
          #03020a;
        position: relative;
        isolation: isolate;
      }

      .background-layer {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
      }

      .grid-overlay {
        position: absolute;
        inset: 0;
        opacity: 0.16;
        background-image:
          linear-gradient(
            rgba(255,255,255,0.035) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(255,255,255,0.035) 1px,
            transparent 1px
          );
        background-size: 55px 55px;
        mask-image: linear-gradient(
          to bottom,
          black,
          transparent 85%
        );
      }

      /* ======================================================
         AMBIENT LIGHT
      ====================================================== */

      .ambient {
        position: absolute;
        border-radius: 999px;
        filter: blur(100px);
        animation: ambientFloat 9s ease-in-out infinite;
      }

      .ambient-one {
        width: 480px;
        height: 480px;
        background: rgba(124, 58, 237, 0.14);
        top: -200px;
        left: -160px;
      }

      .ambient-two {
        width: 450px;
        height: 450px;
        background: rgba(217, 70, 239, 0.11);
        right: -180px;
        top: 25%;
        animation-delay: -3s;
      }

      .ambient-three {
        width: 500px;
        height: 500px;
        background: rgba(37, 99, 235, 0.08);
        left: 30%;
        bottom: -300px;
        animation-delay: -6s;
      }

      .floating-orb {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255,255,255,0.7);
        box-shadow:
          0 0 20px rgba(168,85,247,0.8),
          0 0 50px rgba(168,85,247,0.4);
        animation: particleFloat 10s linear infinite;
      }

      .orb-one {
        left: 15%;
        top: 30%;
      }

      .orb-two {
        left: 75%;
        top: 55%;
        animation-delay: -4s;
      }

      .orb-three {
        left: 45%;
        top: 75%;
        animation-delay: -7s;
      }

      /* ======================================================
         GLASS
      ====================================================== */

      .glass-panel,
      .top-glass,
      .glass-loader {
        background:
          linear-gradient(
            135deg,
            rgba(255,255,255,0.075),
            rgba(255,255,255,0.018)
          );
        border: 1px solid rgba(255,255,255,0.10);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.10),
          inset 0 -1px 0 rgba(255,255,255,0.025),
          0 30px 80px rgba(0,0,0,0.28);
        backdrop-filter: blur(28px) saturate(140%);
        -webkit-backdrop-filter: blur(28px) saturate(140%);
      }

      .glass-panel {
        border-radius: 30px;
        position: relative;
        overflow: hidden;
        transition:
          transform 0.45s ease,
          border-color 0.45s ease,
          box-shadow 0.45s ease;
      }

      .glass-panel::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          linear-gradient(
            120deg,
            transparent 20%,
            rgba(255,255,255,0.055) 45%,
            transparent 70%
          );
        transform: translateX(-120%);
        transition: transform 0.9s ease;
      }

      .glass-panel:hover::before {
        transform: translateX(120%);
      }

      .glass-panel:hover {
        border-color: rgba(168,85,247,0.25);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.13),
          0 35px 100px rgba(0,0,0,0.35),
          0 0 50px rgba(124,58,237,0.08);
      }

      .top-glass {
        border-radius: 22px;
        padding: 14px 18px;
      }

      /* ======================================================
         HERO
      ====================================================== */

      .hero-section {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 30px;
      }

      .hero-title {
        font-size: clamp(42px, 6vw, 78px);
        line-height: 0.95;
        font-weight: 950;
        letter-spacing: -0.055em;
        color: white;
      }

      .hero-title span {
        background:
          linear-gradient(
            90deg,
            #a78bfa,
            #e879f9,
            #8b5cf6,
            #c084fc
          );
        background-size: 250% auto;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: gradientMove 5s linear infinite;
      }

      .hero-description {
        max-width: 720px;
        color: rgba(255,255,255,0.38);
        margin-top: 20px;
        line-height: 1.8;
        font-size: 15px;
      }

      .hero-description strong {
        color: white;
      }

      .hero-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      /* ======================================================
         BADGES
      ====================================================== */

      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        color: rgba(255,255,255,0.55);
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.18em;
      }

      .status-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        display: inline-block;
        box-shadow: 0 0 12px currentColor;
      }

      .status-dot.green {
        background: #22c55e;
        color: #22c55e;
      }

      .status-dot.red {
        background: #ef4444;
        color: #ef4444;
      }

      .status-dot.purple {
        background: #a855f7;
        color: #a855f7;
      }

      .live-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        border-radius: 14px;
        background: rgba(34,197,94,0.06);
        border: 1px solid rgba(34,197,94,0.15);
        color: #86efac;
        font-size: 11px;
        font-weight: 800;
      }

      /* ======================================================
         BUTTONS
      ====================================================== */

      .glass-button,
      .premium-button {
        min-height: 44px;
        padding: 11px 17px;
        border-radius: 14px;
        font-size: 13px;
        font-weight: 800;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        transition:
          transform 0.3s ease,
          box-shadow 0.3s ease,
          background 0.3s ease;
      }

      .glass-button {
        color: rgba(255,255,255,0.75);
        background: rgba(255,255,255,0.045);
        border: 1px solid rgba(255,255,255,0.09);
      }

      .glass-button:hover {
        transform: translateY(-3px);
        background: rgba(255,255,255,0.08);
        box-shadow: 0 15px 35px rgba(0,0,0,0.25);
      }

      .premium-button {
        color: white;
        background:
          linear-gradient(
            135deg,
            #7c3aed,
            #c026d3
          );
        border: 1px solid rgba(255,255,255,0.12);
        box-shadow:
          0 15px 35px rgba(124,58,237,0.25);
      }

      .premium-button:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow:
          0 20px 45px rgba(124,58,237,0.4);
      }

      /* ======================================================
         BRAND
      ====================================================== */

      .brand-orb {
        width: 46px;
        height: 46px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 21px;
        font-weight: 950;
        background:
          linear-gradient(
            135deg,
            #7c3aed,
            #d946ef
          );
        box-shadow:
          0 10px 30px rgba(124,58,237,0.35),
          inset 0 1px 1px rgba(255,255,255,0.35);
      }

      /* ======================================================
         STAT CARDS
      ====================================================== */

      .stat-card {
        position: relative;
        min-height: 190px;
        padding: 24px;
        overflow: hidden;
        border-radius: 26px;
        border: 1px solid rgba(255,255,255,0.09);
        background:
          linear-gradient(
            145deg,
            rgba(255,255,255,0.065),
            rgba(255,255,255,0.018)
          );
        backdrop-filter: blur(24px) saturate(140%);
        -webkit-backdrop-filter: blur(24px) saturate(140%);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.09),
          0 20px 50px rgba(0,0,0,0.2);
        transition:
          transform 0.45s cubic-bezier(.2,.8,.2,1),
          border-color 0.45s ease,
          box-shadow 0.45s ease;
      }

      .stat-card:hover {
        transform:
          perspective(800px)
          rotateX(2deg)
          rotateY(-2deg)
          translateY(-8px);
        border-color: rgba(168,85,247,0.25);
        box-shadow:
          0 30px 70px rgba(0,0,0,0.35),
          0 0 45px rgba(124,58,237,0.08);
      }

      .card-shine {
        position: absolute;
        top: -120%;
        left: -30%;
        width: 50%;
        height: 300%;
        transform: rotate(25deg);
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255,255,255,0.07),
          transparent
        );
        transition: left 0.8s ease;
        pointer-events: none;
      }

      .stat-card:hover .card-shine {
        left: 130%;
      }

      .card-glow {
        position: absolute;
        right: -50px;
        top: -50px;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        filter: blur(45px);
        opacity: 0.20;
        background: #8b5cf6;
        transition: transform 0.6s ease;
      }

      .stat-card:hover .card-glow {
        transform: scale(1.5);
      }

      .accent-blue .card-glow {
        background: #3b82f6;
      }

      .accent-orange .card-glow {
        background: #f59e0b;
      }

      .accent-green .card-glow {
        background: #22c55e;
      }

      .stat-label {
        color: rgba(255,255,255,0.36);
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 8px;
      }

      .stat-value {
        color: white;
        font-size: clamp(30px, 3vw, 42px);
        font-weight: 950;
        letter-spacing: -0.04em;
      }

      .stat-subtitle {
        color: rgba(255,255,255,0.25);
        font-size: 11px;
        margin-top: 7px;
      }

      .stat-icon {
        width: 55px;
        height: 55px;
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        background: rgba(255,255,255,0.045);
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.10);
        transition:
          transform 0.5s ease,
          background 0.5s ease;
      }

      .stat-card:hover .stat-icon {
        transform: rotate(8deg) scale(1.12);
        background: rgba(255,255,255,0.08);
      }

      .stat-progress {
        height: 4px;
        flex: 1;
        max-width: 130px;
        border-radius: 999px;
        background: rgba(255,255,255,0.05);
        overflow: hidden;
      }

      .stat-progress div {
        height: 100%;
        width: 55%;
        border-radius: inherit;
        background:
          linear-gradient(
            90deg,
            #8b5cf6,
            #d946ef
          );
        animation: progressPulse 3s ease-in-out infinite;
      }

      .trend {
        font-size: 9px;
        font-weight: 900;
        color: #c4b5fd;
        letter-spacing: 0.12em;
      }

      /* ======================================================
         SECTION HEADERS
      ====================================================== */

      .section-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
      }

      .section-kicker {
        color: rgba(168,85,247,0.8);
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.25em;
      }

      .section-title {
        color: white;
        font-size: 25px;
        font-weight: 950;
        margin-top: 7px;
        letter-spacing: -0.025em;
      }

      .section-subtitle {
        color: rgba(255,255,255,0.27);
        font-size: 12px;
        margin-top: 4px;
      }

      .header-icon {
        width: 46px;
        height: 46px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(139,92,246,0.08);
        border: 1px solid rgba(139,92,246,0.15);
        font-size: 20px;
      }

      /* ======================================================
         DONUT
      ====================================================== */

      .donut-wrapper {
        display: flex;
        justify-content: center;
        padding: 30px 0 10px;
      }

      .donut {
        width: 235px;
        height: 235px;
        border-radius: 50%;
        padding: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
          0 0 60px rgba(139,92,246,0.12),
          inset 0 0 35px rgba(0,0,0,0.35);
        animation: donutFloat 5s ease-in-out infinite;
        transition: transform 0.5s ease;
      }

      .donut:hover {
        transform: scale(1.05) rotate(5deg);
      }

      .donut-inner {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background:
          radial-gradient(
            circle,
            #0d0818 0%,
            #07040d 65%,
            #03020a 100%
          );
        border: 1px solid rgba(255,255,255,0.08);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow:
          inset 0 0 50px rgba(0,0,0,0.6);
      }

      .donut-number {
        font-size: 43px;
        line-height: 1;
        font-weight: 950;
      }

      .donut-label {
        color: rgba(255,255,255,0.28);
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.18em;
        margin-top: 8px;
      }

      .chart-legend {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 11px;
        border-radius: 13px;
        background: rgba(255,255,255,0.025);
        border: 1px solid rgba(255,255,255,0.045);
        color: rgba(255,255,255,0.42);
        font-size: 11px;
        transition: all 0.3s ease;
      }

      .chart-legend:hover {
        background: rgba(255,255,255,0.055);
        transform: translateX(3px);
      }

      .chart-legend strong {
        color: white;
      }

      .legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        box-shadow: 0 0 10px currentColor;
      }

      /* ======================================================
         BAR CHART
      ====================================================== */

      .bar-chart {
        margin-top: 32px;
        display: flex;
        flex-direction: column;
        gap: 19px;
      }

      .bar-row {
        animation: fadeUp 0.7s both;
      }

      .bar-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .bar-name {
        display: flex;
        align-items: center;
        gap: 10px;
        color: rgba(255,255,255,0.50);
        font-size: 12px;
      }

      .bar-icon {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 9px;
        background: rgba(255,255,255,0.045);
        border: 1px solid rgba(255,255,255,0.06);
      }

      .bar-number {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .bar-number span {
        color: rgba(255,255,255,0.25);
        font-size: 10px;
      }

      .bar-number strong {
        color: white;
        font-size: 12px;
      }

      .bar-track {
        height: 9px;
        border-radius: 999px;
        background: rgba(255,255,255,0.045);
        overflow: hidden;
      }

      .bar-fill {
        height: 100%;
        border-radius: inherit;
        transform-origin: left;
        animation: barGrow 1.2s cubic-bezier(.2,.8,.2,1) both;
        box-shadow: 0 0 18px currentColor;
      }

      /* ======================================================
         MINI METRICS
      ====================================================== */

      .mini-metric {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 15px;
        border-radius: 18px;
        background: rgba(255,255,255,0.025);
        border: 1px solid rgba(255,255,255,0.055);
        transition:
          transform 0.3s ease,
          background 0.3s ease;
      }

      .mini-metric:hover {
        transform: translateY(-4px);
        background: rgba(255,255,255,0.055);
      }

      .mini-icon {
        width: 39px;
        height: 39px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(139,92,246,0.09);
      }

      .mini-metric p {
        color: rgba(255,255,255,0.28);
        font-size: 10px;
      }

      .mini-metric strong {
        display: block;
        color: white;
        font-size: 18px;
        margin-top: 2px;
      }

      /* ======================================================
         HEALTH
      ====================================================== */

      .health-track {
        height: 9px;
        border-radius: 999px;
        overflow: hidden;
        background: rgba(255,255,255,0.045);
      }

      .health-fill {
        height: 100%;
        border-radius: inherit;
        animation: barGrow 1.2s ease both;
      }

      .health-card {
        border-radius: 20px;
        padding: 18px;
        border: 1px solid rgba(255,255,255,0.06);
        background: rgba(255,255,255,0.025);
      }

      .health-card span {
        display: block;
        color: rgba(255,255,255,0.25);
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.15em;
      }

      .health-card strong {
        display: block;
        font-size: 29px;
        font-weight: 950;
        margin-top: 5px;
      }

      .green-health strong {
        color: #4ade80;
      }

      .red-health strong {
        color: #f87171;
      }

      /* ======================================================
         INVENTORY
      ====================================================== */

      .inventory-card {
        min-height: 130px;
        padding: 20px;
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,0.07);
        background: rgba(255,255,255,0.025);
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition:
          transform 0.35s ease,
          background 0.35s ease,
          border-color 0.35s ease;
      }

      .inventory-card:hover {
        transform: translateY(-5px);
        background: rgba(255,255,255,0.05);
        border-color: rgba(255,255,255,0.14);
      }

      .inventory-card span {
        display: block;
        color: rgba(255,255,255,0.27);
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.13em;
      }

      .inventory-card strong {
        display: block;
        color: white;
        font-size: 32px;
        font-weight: 950;
        margin-top: 6px;
      }

      .inventory-icon {
        width: 48px;
        height: 48px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.045);
        font-size: 21px;
      }

      .inventory-green {
        border-color: rgba(34,197,94,0.12);
      }

      .inventory-green strong {
        color: #4ade80;
      }

      .inventory-yellow {
        border-color: rgba(234,179,8,0.12);
      }

      .inventory-yellow strong {
        color: #facc15;
      }

      .inventory-red {
        border-color: rgba(239,68,68,0.12);
      }

      .inventory-red strong {
        color: #f87171;
      }

      /* ======================================================
         TABLE
      ====================================================== */

      .admin-table {
        width: 100%;
        min-width: 850px;
        border-collapse: collapse;
      }

      .admin-table th {
        text-align: left;
        padding: 18px 28px;
        color: rgba(255,255,255,0.22);
        font-size: 9px;
        letter-spacing: 0.18em;
        font-weight: 900;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }

      .admin-table td {
        padding: 18px 28px;
        color: rgba(255,255,255,0.40);
        font-size: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.045);
      }

      .admin-table tbody tr {
        transition:
          background 0.3s ease,
          transform 0.3s ease;
      }

      .admin-table tbody tr:hover {
        background: rgba(139,92,246,0.045);
      }

      .order-id {
        color: #a78bfa;
        font-weight: 900;
      }

      .order-id:hover {
        color: #e879f9;
      }

      .customer-cell {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .customer-name {
        color: white;
        font-weight: 800;
      }

      .customer-email {
        color: rgba(255,255,255,0.22);
        font-size: 10px;
        margin-top: 3px;
      }

      .avatar {
        width: 39px;
        height: 39px;
        flex-shrink: 0;
        border-radius: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 950;
        background:
          linear-gradient(
            135deg,
            #7c3aed,
            #d946ef
          );
        box-shadow:
          0 8px 20px rgba(124,58,237,0.2);
        position: relative;
      }

      .avatar-large {
        width: 52px;
        height: 52px;
        border-radius: 17px;
        font-size: 17px;
      }

      .online-dot {
        position: absolute;
        right: -2px;
        bottom: -2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #22c55e;
        border: 2px solid #09050f;
        box-shadow: 0 0 10px rgba(34,197,94,0.7);
      }

      .order-status {
        display: inline-flex;
        padding: 7px 10px;
        border-radius: 999px;
        border: 1px solid transparent;
        font-size: 10px;
        font-weight: 900;
        text-transform: capitalize;
      }

      .status-yellow {
        color: #facc15;
        background: rgba(234,179,8,0.08);
        border-color: rgba(234,179,8,0.15);
      }

      .status-blue {
        color: #60a5fa;
        background: rgba(59,130,246,0.08);
        border-color: rgba(59,130,246,0.15);
      }

      .status-indigo {
        color: #818cf8;
        background: rgba(99,102,241,0.08);
        border-color: rgba(99,102,241,0.15);
      }

      .status-purple {
        color: #c084fc;
        background: rgba(168,85,247,0.08);
        border-color: rgba(168,85,247,0.15);
      }

      .status-green {
        color: #4ade80;
        background: rgba(34,197,94,0.08);
        border-color: rgba(34,197,94,0.15);
      }

      .status-red {
        color: #f87171;
        background: rgba(239,68,68,0.08);
        border-color: rgba(239,68,68,0.15);
      }

      .status-default {
        color: rgba(255,255,255,0.45);
        background: rgba(255,255,255,0.04);
        border-color: rgba(255,255,255,0.08);
      }

      /* ======================================================
         USERS
      ====================================================== */

      .user-card {
        padding: 20px;
        border-radius: 22px;
        background: rgba(255,255,255,0.025);
        border: 1px solid rgba(255,255,255,0.06);
        transition:
          transform 0.4s ease,
          background 0.4s ease,
          border-color 0.4s ease;
      }

      .user-card:hover {
        transform: translateY(-6px);
        background: rgba(255,255,255,0.05);
        border-color: rgba(168,85,247,0.2);
      }

      .role-badge {
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(139,92,246,0.08);
        border: 1px solid rgba(139,92,246,0.14);
        color: #c4b5fd;
        font-size: 9px;
        font-weight: 900;
        text-transform: capitalize;
      }

      /* ======================================================
         QUICK ACTION
      ====================================================== */

      .action-card {
        position: relative;
        overflow: hidden;
        padding: 25px;
        min-height: 220px;
        border-radius: 28px;
        border: 1px solid rgba(255,255,255,0.08);
        background:
          linear-gradient(
            145deg,
            rgba(255,255,255,0.055),
            rgba(255,255,255,0.018)
          );
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        transition:
          transform 0.45s ease,
          border-color 0.45s ease,
          box-shadow 0.45s ease;
      }

      .action-card:hover {
        transform:
          perspective(800px)
          rotateX(2deg)
          rotateY(-2deg)
          translateY(-8px);
        border-color: rgba(168,85,247,0.30);
        box-shadow:
          0 30px 70px rgba(0,0,0,0.35),
          0 0 45px rgba(124,58,237,0.10);
      }

      .action-glow {
        position: absolute;
        width: 150px;
        height: 150px;
        right: -70px;
        top: -70px;
        border-radius: 50%;
        background: rgba(168,85,247,0.15);
        filter: blur(45px);
        transition: transform 0.6s ease;
      }

      .action-card:hover .action-glow {
        transform: scale(1.7);
      }

      .action-icon {
        position: relative;
        width: 58px;
        height: 58px;
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 27px;
        background: rgba(139,92,246,0.08);
        border: 1px solid rgba(139,92,246,0.15);
        transition:
          transform 0.45s ease,
          background 0.45s ease;
      }

      .action-card:hover .action-icon {
        transform: rotate(8deg) scale(1.1);
        background: rgba(139,92,246,0.15);
      }

      .action-card h3 {
        position: relative;
        color: white;
        font-size: 18px;
        font-weight: 950;
        margin-top: 20px;
      }

      .action-card p {
        position: relative;
        color: rgba(255,255,255,0.30);
        font-size: 12px;
        line-height: 1.7;
        margin-top: 7px;
      }

      .action-link {
        position: relative;
        display: inline-block;
        color: #a78bfa;
        font-size: 11px;
        font-weight: 900;
        margin-top: 18px;
        transition: color 0.3s ease;
      }

      .action-card:hover .action-link {
        color: #e879f9;
      }

      /* ======================================================
         EMPTY / LOADING
      ====================================================== */

      .empty-state {
        min-height: 220px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: rgba(255,255,255,0.25);
        gap: 12px;
      }

      .empty-state div {
        font-size: 40px;
        opacity: 0.6;
      }

      .lock-orb,
      .error-orb,
      .icon-box {
        width: 90px;
        height: 90px;
        border-radius: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        background:
          linear-gradient(
            145deg,
            rgba(255,255,255,0.07),
            rgba(255,255,255,0.02)
          );
        border: 1px solid rgba(255,255,255,0.10);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.10),
          0 20px 50px rgba(0,0,0,0.25);
      }

      .error-orb {
        background: rgba(239,68,68,0.07);
        border-color: rgba(239,68,68,0.15);
      }

      /* ======================================================
         LOADER
      ====================================================== */

      .loader-ring {
        width: 110px;
        height: 110px;
        margin: auto;
        border-radius: 50%;
        padding: 4px;
        background:
          conic-gradient(
            #7c3aed,
            #d946ef,
            #3b82f6,
            #7c3aed
          );
        animation: spin 1.4s linear infinite;
        box-shadow:
          0 0 60px rgba(124,58,237,0.25);
      }

      .loader-core {
        width: 100%;
        height: 100%;
        border-radius: inherit;
        background: #08040f;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        font-weight: 950;
      }

      .loader-line {
        width: 200px;
        height: 4px;
        margin-left: auto;
        margin-right: auto;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(255,255,255,0.06);
      }

      .loader-line div {
        height: 100%;
        width: 50%;
        background:
          linear-gradient(
            90deg,
            #7c3aed,
            #d946ef
          );
        animation: loaderMove 1.3s ease-in-out infinite;
      }

      /* ======================================================
         ANIMATIONS
      ====================================================== */

      @keyframes ambientFloat {
        0%, 100% {
          transform: translate3d(0,0,0) scale(1);
        }

        50% {
          transform: translate3d(25px,-30px,0) scale(1.08);
        }
      }

      @keyframes particleFloat {
        0% {
          transform: translateY(100px) translateX(0);
          opacity: 0;
        }

        20% {
          opacity: 1;
        }

        80% {
          opacity: 0.7;
        }

        100% {
          transform: translateY(-500px) translateX(100px);
          opacity: 0;
        }
      }

      @keyframes gradientMove {
        0% {
          background-position: 0% 50%;
        }

        100% {
          background-position: 250% 50%;
        }
      }

      @keyframes progressPulse {
        0%, 100% {
          width: 45%;
        }

        50% {
          width: 75%;
        }
      }

      @keyframes donutFloat {
        0%, 100% {
          transform: translateY(0);
        }

        50% {
          transform: translateY(-7px);
        }
      }

      @keyframes barGrow {
        from {
          transform: scaleX(0);
        }

        to {
          transform: scaleX(1);
        }
      }

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

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes loaderMove {
        0% {
          transform: translateX(-120%);
        }

        50% {
          transform: translateX(100%);
        }

        100% {
          transform: translateX(250%);
        }
      }

      /* ======================================================
         RESPONSIVE
      ====================================================== */

      @media (max-width: 900px) {
        .hero-section {
          align-items: flex-start;
          flex-direction: column;
        }

        .hero-actions {
          width: 100%;
        }
      }

      @media (max-width: 640px) {
        .glass-panel {
          border-radius: 23px;
        }

        .top-glass {
          border-radius: 18px;
        }

        .hero-title {
          font-size: 45px;
        }

        .stat-card {
          min-height: 165px;
          padding: 20px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 15px;
        }

        .donut {
          width: 205px;
          height: 205px;
        }

        .section-title {
          font-size: 22px;
        }
      }

      /* ======================================================
         REDUCED MOTION
      ====================================================== */

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

    `}</style>
  );
};

export default AdminDashboard;
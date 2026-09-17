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
// HELPERS
// ============================================================

const formatCurrency = (value) => {
  return `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString("en-US");
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

const getStatusStyle = (status) => {
  const normalized = String(status || "pending").toLowerCase();

  const styles = {
    pending:
      "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
    confirmed:
      "bg-blue-500/10 text-blue-300 border-blue-500/20",
    processing:
      "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    shipped:
      "bg-purple-500/10 text-purple-300 border-purple-500/20",
    delivered:
      "bg-green-500/10 text-green-300 border-green-500/20",
    cancelled:
      "bg-red-500/10 text-red-300 border-red-500/20",
  };

  return (
    styles[normalized] ||
    "bg-white/5 text-white/50 border-white/10"
  );
};


// ============================================================
// ICON COMPONENT
// ============================================================

const Icon = ({ type, size = 22 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === "users") {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (type === "box") {
    return (
      <svg {...common}>
        <path d="m21 8-9-5-9 5 9 5 9-5Z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </svg>
    );
  }

  if (type === "cart") {
    return (
      <svg {...common}>
        <circle cx="9" cy="20" r="1" />
        <circle cx="19" cy="20" r="1" />
        <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21 8H6" />
      </svg>
    );
  }

  if (type === "money") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M7 9h.01M17 15h.01" />
      </svg>
    );
  }

  if (type === "chart") {
    return (
      <svg {...common}>
        <path d="M4 19V5" />
        <path d="M4 19h17" />
        <path d="m7 15 4-5 3 3 5-7" />
      </svg>
    );
  }

  if (type === "activity") {
    return (
      <svg {...common}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    );
  }

  if (type === "arrow") {
    return (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    );
  }

  if (type === "package") {
    return (
      <svg {...common}>
        <path d="M16.5 9.4 7.55 4.24" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
};


// ============================================================
// GLASS CARD
// ============================================================

const GlassCard = ({
  children,
  className = "",
  hover = true,
}) => {
  return (
    <div
      className={`
        relative overflow-hidden
        rounded-[28px]
        border border-white/[0.09]
        bg-white/[0.035]
        backdrop-blur-2xl
        shadow-[0_20px_80px_rgba(0,0,0,0.25)]
        ${hover ? "admin-glass-card" : ""}
        ${className}
      `}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-purple-500/[0.03]" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};


// ============================================================
// ANIMATED STAT CARD
// ============================================================

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  accent = "purple",
}) => {
  const accents = {
    purple: {
      glow: "bg-purple-500/20",
      icon: "bg-purple-500/10 text-purple-300 border-purple-500/20",
      line: "from-purple-500 to-fuchsia-500",
    },

    blue: {
      glow: "bg-blue-500/20",
      icon: "bg-blue-500/10 text-blue-300 border-blue-500/20",
      line: "from-blue-500 to-cyan-400",
    },

    green: {
      glow: "bg-green-500/20",
      icon: "bg-green-500/10 text-green-300 border-green-500/20",
      line: "from-green-500 to-emerald-400",
    },

    orange: {
      glow: "bg-orange-500/20",
      icon: "bg-orange-500/10 text-orange-300 border-orange-500/20",
      line: "from-orange-500 to-yellow-400",
    },
  };

  const style = accents[accent] || accents.purple;

  return (
    <GlassCard className="group p-6">
      {/* Glow */}
      <div
        className={`
          pointer-events-none
          absolute -right-16 -top-16
          h-40 w-40 rounded-full
          ${style.glow}
          blur-3xl
          transition-all duration-700
          group-hover:scale-150
        `}
      />

      {/* Shine */}
      <div className="pointer-events-none absolute -left-[120%] top-0 h-full w-[70%] rotate-12 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent transition-all duration-1000 group-hover:left-[130%]" />

      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {value}
          </h3>

          <p className="mt-3 text-xs text-white/30">
            {subtitle}
          </p>
        </div>

        <div
          className={`
            flex h-14 w-14 shrink-0
            items-center justify-center
            rounded-2xl border
            ${style.icon}
            transition-all duration-500
            group-hover:rotate-6
            group-hover:scale-110
          `}
        >
          <Icon type={icon} size={25} />
        </div>
      </div>

      <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className={`
            h-full w-[42%]
            rounded-full
            bg-gradient-to-r ${style.line}
            transition-all duration-1000
            group-hover:w-full
          `}
        />
      </div>
    </GlassCard>
  );
};


// ============================================================
// DONUT CHART
// ============================================================

const DonutChart = ({ data, total }) => {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;

  const segments = data.map((item) => {
    const percentage =
      total > 0 ? item.value / total : 0;

    const length = percentage * circumference;

    const segment = {
      ...item,
      length,
      offset: -accumulated,
    };

    accumulated += length;

    return segment;
  });

  return (
    <div className="relative mx-auto h-[260px] w-[260px]">
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full -rotate-90"
      >
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="18"
        />

        {segments.map((item, index) => (
          <circle
            key={item.label}
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={item.svgColor}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={`${item.length} ${circumference}`}
            strokeDashoffset={item.offset}
            className="admin-chart-segment"
            style={{
              animationDelay: `${index * 120}ms`,
            }}
          />
        ))}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black tracking-tight">
          {formatNumber(total)}
        </span>

        <span className="mt-1 text-xs uppercase tracking-[0.18em] text-white/30">
          Total Orders
        </span>
      </div>
    </div>
  );
};


// ============================================================
// BAR
// ============================================================

const ProgressBar = ({
  label,
  value,
  total,
  color,
  icon,
}) => {
  const percentage =
    total > 0
      ? Math.min(100, Math.round((value / total) * 100))
      : 0;

  return (
    <div className="group">
      <div className="mb-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-sm">
            {icon}
          </div>

          <span className="text-sm font-medium text-white/55 transition group-hover:text-white">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-white/25">
            {percentage}%
          </span>

          <span className="text-sm font-black">
            {formatNumber(value)}
          </span>
        </div>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/[0.04]">
        <div
          className={`h-full rounded-full ${color} admin-progress-bar`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};


// ============================================================
// MAIN
// ============================================================

const AdminDashboard = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
  } = useAuthStore();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // ==========================================================
  // FETCH
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      if (!isAuthenticated || !accessToken) {
        if (mounted) {
          setLoading(false);
        }

        return;
      }

      try {
        if (mounted) {
          setLoading(true);
          setError("");
        }

        const response = await api.get(
          "/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!mounted) return;

        const payload = response?.data?.dashboard;

        setDashboard(payload || {});
        setLastUpdated(new Date());
      } catch (err) {
        console.error(
          "Admin Dashboard Error:",
          err
        );

        if (!mounted) return;

        const status = err?.response?.status;

        if (status === 401) {
          setError(
            "Your login session has expired. Please login again."
          );
        } else if (status === 403) {
          setError(
            "Access denied. Your account does not have administrator permission."
          );
        } else {
          setError(
            err?.response?.data?.message ||
              "Failed to load admin dashboard."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      mounted = false;
    };
  }, [accessToken, isAuthenticated]);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04020a] text-white">
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-purple-700/20 blur-[120px] animate-pulse" />

        <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-fuchsia-700/20 blur-[120px] animate-pulse" />

        <div className="relative text-center">
          <div className="relative mx-auto h-24 w-24">
            <div className="absolute inset-0 rounded-full border border-purple-500/20" />

            <div className="absolute inset-1 rounded-full border-4 border-transparent border-t-purple-500 border-r-fuchsia-500 animate-spin" />

            <div className="absolute inset-5 rounded-full bg-purple-500/20 blur-xl animate-pulse" />

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">A</span>
            </div>
          </div>

          <p className="mt-7 text-sm font-semibold tracking-[0.2em] text-white/40">
            LOADING ADMIN PANEL
          </p>
        </div>
      </div>
    );
  }


  // ==========================================================
  // AUTH
  // ==========================================================

  if (!isAuthenticated || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#04020a] px-6 text-white">
        <GlassCard className="max-w-md p-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-purple-500/20 bg-purple-500/10 text-4xl">
            🔐
          </div>

          <h1 className="mt-7 text-3xl font-black">
            Authentication Required
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/35">
            Please login to continue to the administrator dashboard.
          </p>

          <Link
            to="/login"
            className="mt-7 inline-flex rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-7 py-3 font-bold transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/40"
          >
            Login
          </Link>
        </GlassCard>
      </div>
    );
  }


  // ==========================================================
  // ADMIN CHECK
  // ==========================================================

  const currentRole = String(
    user?.role || ""
  ).toLowerCase();

  if (currentRole !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#04020a] px-6 text-white">
        <GlassCard className="max-w-md p-10 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] border border-red-500/20 bg-red-500/10 text-5xl">
            🔒
          </div>

          <h1 className="mt-7 text-4xl font-black">
            Access Denied
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/35">
            Only administrators can access this dashboard.
          </p>

          <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.025] p-4 text-left">
            <p className="text-xs text-white/25">
              Current account role
            </p>

            <p className="mt-1 font-bold text-red-300">
              {user?.role || "unknown"}
            </p>
          </div>

          <Link
            to="/"
            className="mt-7 inline-flex rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-3 font-bold transition hover:bg-white/[0.08]"
          >
            Back to Home
          </Link>
        </GlassCard>
      </div>
    );
  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04020a] px-6 text-white">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-red-500/10 blur-[130px]" />

        <GlassCard className="max-w-lg p-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 text-4xl">
            ⚠️
          </div>

          <h1 className="mt-7 text-3xl font-black">
            Dashboard Error
          </h1>

          <p className="mt-4 text-sm leading-6 text-red-300">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-7 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-7 py-3 font-bold transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/40"
          >
            Try Again
          </button>
        </GlassCard>
      </div>
    );
  }


  // ==========================================================
  // DATA
  // ==========================================================

  const users = dashboard?.users || {};
  const products = dashboard?.products || {};
  const orders = dashboard?.orders || {};
  const sales = dashboard?.sales || {};

  const recentOrders =
    Array.isArray(dashboard?.recentOrders)
      ? dashboard.recentOrders
      : [];

  const recentUsers =
    Array.isArray(dashboard?.recentUsers)
      ? dashboard.recentUsers
      : [];


  // ==========================================================
  // ORDER DATA
  // ==========================================================

  const orderChartData = [
    {
      label: "Pending",
      value: Number(orders.pending) || 0,
      icon: "⏳",
      color: "bg-yellow-500",
      svgColor: "#eab308",
      text: "text-yellow-300",
    },
    {
      label: "Confirmed",
      value: Number(orders.confirmed) || 0,
      icon: "✓",
      color: "bg-blue-500",
      svgColor: "#3b82f6",
      text: "text-blue-300",
    },
    {
      label: "Processing",
      value: Number(orders.processing) || 0,
      icon: "⚙",
      color: "bg-indigo-500",
      svgColor: "#6366f1",
      text: "text-indigo-300",
    },
    {
      label: "Shipped",
      value: Number(orders.shipped) || 0,
      icon: "🚚",
      color: "bg-purple-500",
      svgColor: "#a855f7",
      text: "text-purple-300",
    },
    {
      label: "Delivered",
      value: Number(orders.delivered) || 0,
      icon: "✓",
      color: "bg-green-500",
      svgColor: "#22c55e",
      text: "text-green-300",
    },
    {
      label: "Cancelled",
      value: Number(orders.cancelled) || 0,
      icon: "×",
      color: "bg-red-500",
      svgColor: "#ef4444",
      text: "text-red-300",
    },
  ];

  const totalOrders =
    Number(orders.total) ||
    orderChartData.reduce(
      (sum, item) => sum + item.value,
      0
    );


  // ==========================================================
  // PLATFORM HEALTH
  // ==========================================================

  const userTotal =
    Number(users.total) || 0;

  const productTotal =
    Number(products.total) || 0;


  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="admin-dashboard min-h-screen overflow-hidden bg-[#04020a] text-white">

      {/* ======================================================
          ANIMATED BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-72 -top-72 h-[650px] w-[650px] rounded-full bg-purple-700/[0.10] blur-[150px] admin-orb" />

        <div className="absolute -right-72 top-[18%] h-[650px] w-[650px] rounded-full bg-fuchsia-700/[0.08] blur-[150px] admin-orb admin-orb-delay" />

        <div className="absolute bottom-[-300px] left-[30%] h-[600px] w-[600px] rounded-full bg-indigo-700/[0.08] blur-[150px] admin-orb" />

        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:60px_60px]" />
      </div>


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="relative mx-auto max-w-[1550px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <section className="mb-9">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-purple-300">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-purple-400" />
                </span>

                Live Admin Control Center
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Admin{" "}
                <span className="bg-gradient-to-r from-purple-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/35 sm:text-base">
                Welcome back,{" "}
                <span className="font-bold text-white">
                  {user?.name || "Administrator"}
                </span>
                . Manage your store, monitor orders,
                customers, products and revenue from one place.
              </p>

              {lastUpdated && (
                <p className="mt-3 text-xs text-white/20">
                  Last synchronized{" "}
                  {lastUpdated.toLocaleTimeString()}
                </p>
              )}

            </div>


            {/* HEADER ACTIONS */}

            <div className="flex flex-wrap gap-3">

              <Link
                to="/admin/users"
                className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-bold text-white/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/20 hover:bg-white/[0.07] hover:text-white"
              >
                <Icon type="users" size={18} />
                Users
              </Link>

              <Link
                to="/admin/products"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3 text-sm font-black shadow-xl shadow-purple-950/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:from-purple-500 hover:to-fuchsia-500"
              >
                <Icon type="box" size={18} />
                Products
              </Link>

            </div>

          </div>

        </section>


        {/* ====================================================
            KPI
        ==================================================== */}

        <section className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Users"
            value={formatNumber(users.total)}
            subtitle={`${formatNumber(users.active)} active accounts`}
            icon="users"
            accent="purple"
          />

          <StatCard
            title="Total Products"
            value={formatNumber(products.total)}
            subtitle={`${formatNumber(products.active)} active products`}
            icon="box"
            accent="blue"
          />

          <StatCard
            title="Total Orders"
            value={formatNumber(orders.total)}
            subtitle={`${formatNumber(orders.pending)} currently pending`}
            icon="cart"
            accent="orange"
          />

          <StatCard
            title="Total Revenue"
            value={formatCurrency(sales.totalSales)}
            subtitle={`${formatCurrency(sales.averageOrderValue)} average order`}
            icon="money"
            accent="green"
          />

        </section>


        {/* ====================================================
            SECONDARY KPI
        ==================================================== */}

        <section className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Customers"
            value={formatNumber(users.customers)}
            subtitle="Registered customers"
            icon="users"
            accent="purple"
          />

          <StatCard
            title="Sellers"
            value={formatNumber(users.sellers)}
            subtitle="Marketplace sellers"
            icon="box"
            accent="blue"
          />

          <StatCard
            title="Low Stock"
            value={formatNumber(products.lowStock)}
            subtitle={`${formatNumber(products.outOfStock)} out of stock`}
            icon="activity"
            accent="orange"
          />

          <StatCard
            title="Delivered"
            value={formatNumber(orders.delivered)}
            subtitle={`${formatNumber(orders.cancelled)} cancelled orders`}
            icon="package"
            accent="green"
          />

        </section>


        {/* ====================================================
            ANALYTICS
        ==================================================== */}

        <section className="mb-7 grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* DONUT */}

          <GlassCard className="p-6 sm:p-7">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400/70">
                  Analytics
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Order Status
                </h2>

                <p className="mt-1 text-sm text-white/25">
                  Current order distribution
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-300">
                <Icon type="chart" size={21} />
              </div>

            </div>

            <div className="py-5">
              <DonutChart
                data={orderChartData}
                total={totalOrders}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">

              {orderChartData.map((item) => (
                <div
                  key={item.label}
                  className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.025] px-3 py-2.5 transition hover:border-white/10 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-2">

                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          item.svgColor,
                      }}
                    />

                    <span className="text-xs text-white/40">
                      {item.label}
                    </span>

                  </div>

                  <span
                    className={`text-sm font-black ${item.text}`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}

            </div>

          </GlassCard>


          {/* BAR CHART */}

          <GlassCard className="p-6 sm:p-7 xl:col-span-2">

            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-400/70">
                  Performance
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Order Overview
                </h2>

                <p className="mt-1 text-sm text-white/25">
                  Real-time distribution across order stages
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-bold text-green-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                Live Data
              </div>

            </div>

            <div className="space-y-6">

              {orderChartData.map((item) => (
                <ProgressBar
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  total={totalOrders}
                  color={item.color}
                  icon={item.icon}
                />
              ))}

            </div>

            {/* Mini metrics */}

            <div className="mt-8 grid grid-cols-3 gap-3">

              <div className="group rounded-2xl border border-white/5 bg-white/[0.025] p-4 text-center transition hover:-translate-y-1 hover:border-purple-500/20 hover:bg-purple-500/[0.04]">
                <p className="text-[10px] uppercase tracking-wider text-white/25">
                  Customers
                </p>

                <p className="mt-2 text-xl font-black">
                  {formatNumber(users.customers)}
                </p>
              </div>

              <div className="group rounded-2xl border border-white/5 bg-white/[0.025] p-4 text-center transition hover:-translate-y-1 hover:border-blue-500/20 hover:bg-blue-500/[0.04]">
                <p className="text-[10px] uppercase tracking-wider text-white/25">
                  Sellers
                </p>

                <p className="mt-2 text-xl font-black">
                  {formatNumber(users.sellers)}
                </p>
              </div>

              <div className="group rounded-2xl border border-white/5 bg-white/[0.025] p-4 text-center transition hover:-translate-y-1 hover:border-fuchsia-500/20 hover:bg-fuchsia-500/[0.04]">
                <p className="text-[10px] uppercase tracking-wider text-white/25">
                  Products
                </p>

                <p className="mt-2 text-xl font-black">
                  {formatNumber(products.total)}
                </p>
              </div>

            </div>

          </GlassCard>

        </section>


        {/* ====================================================
            HEALTH
        ==================================================== */}

        <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* USERS */}

          <GlassCard className="p-6 sm:p-7">

            <div className="mb-7 flex items-center justify-between">

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400/70">
                  Community
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  User Overview
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-300">
                <Icon type="users" size={21} />
              </div>

            </div>

            <div className="space-y-6">

              <ProgressBar
                label="Customers"
                value={Number(users.customers) || 0}
                total={userTotal || 1}
                color="bg-purple-500"
                icon="🧑"
              />

              <ProgressBar
                label="Sellers"
                value={Number(users.sellers) || 0}
                total={userTotal || 1}
                color="bg-fuchsia-500"
                icon="🏪"
              />

              <ProgressBar
                label="Admins"
                value={Number(users.admins) || 0}
                total={userTotal || 1}
                color="bg-blue-500"
                icon="🛡️"
              />

            </div>

            <div className="mt-7 grid grid-cols-2 gap-4">

              <div className="rounded-2xl border border-green-500/10 bg-green-500/[0.04] p-5 transition hover:-translate-y-1">
                <p className="text-xs text-white/25">
                  Active Accounts
                </p>

                <p className="mt-2 text-3xl font-black text-green-300">
                  {formatNumber(users.active)}
                </p>
              </div>

              <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.04] p-5 transition hover:-translate-y-1">
                <p className="text-xs text-white/25">
                  Inactive Accounts
                </p>

                <p className="mt-2 text-3xl font-black text-red-300">
                  {formatNumber(users.inactive)}
                </p>
              </div>

            </div>

          </GlassCard>


          {/* PRODUCTS */}

          <GlassCard className="p-6 sm:p-7">

            <div className="mb-7 flex items-center justify-between">

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-400/70">
                  Inventory
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Product Health
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300">
                <Icon type="box" size={21} />
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="group rounded-2xl border border-green-500/10 bg-green-500/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:bg-green-500/[0.07]">
                <p className="text-xs text-white/25">
                  Active
                </p>

                <p className="mt-2 text-3xl font-black text-green-300">
                  {formatNumber(products.active)}
                </p>
              </div>

              <div className="group rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1">
                <p className="text-xs text-white/25">
                  Inactive
                </p>

                <p className="mt-2 text-3xl font-black">
                  {formatNumber(products.inactive)}
                </p>
              </div>

              <div className="group rounded-2xl border border-yellow-500/10 bg-yellow-500/[0.04] p-5 transition duration-300 hover:-translate-y-1">
                <p className="text-xs text-white/25">
                  Low Stock
                </p>

                <p className="mt-2 text-3xl font-black text-yellow-300">
                  {formatNumber(products.lowStock)}
                </p>
              </div>

              <div className="group rounded-2xl border border-red-500/10 bg-red-500/[0.04] p-5 transition duration-300 hover:-translate-y-1">
                <p className="text-xs text-white/25">
                  Out of Stock
                </p>

                <p className="mt-2 text-3xl font-black text-red-300">
                  {formatNumber(products.outOfStock)}
                </p>
              </div>

            </div>

            <div className="mt-6">
              <ProgressBar
                label="Active Product Ratio"
                value={Number(products.active) || 0}
                total={productTotal || 1}
                color="bg-gradient-to-r from-purple-500 to-fuchsia-500"
                icon="📦"
              />
            </div>

          </GlassCard>

        </section>


        {/* ====================================================
            RECENT ORDERS
        ==================================================== */}

        <GlassCard
          className="mb-10 overflow-hidden"
          hover={false}
        >

          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400/70">
                Activity
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-white/25">
                Latest customer order activity
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="group inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white/60 transition hover:border-purple-500/20 hover:bg-purple-500/10 hover:text-white"
            >
              View All
              <Icon type="arrow" size={16} />
            </Link>

          </div>


          {recentOrders.length === 0 ? (

            <div className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] text-2xl">
                🛒
              </div>

              <p className="mt-4 text-sm text-white/25">
                No recent orders found.
              </p>
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b border-white/[0.05] text-left text-[10px] uppercase tracking-[0.18em] text-white/20">

                    <th className="px-7 py-5">
                      Order
                    </th>

                    <th className="px-7 py-5">
                      Customer
                    </th>

                    <th className="px-7 py-5">
                      Items
                    </th>

                    <th className="px-7 py-5">
                      Amount
                    </th>

                    <th className="px-7 py-5">
                      Status
                    </th>

                    <th className="px-7 py-5">
                      Date
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {recentOrders.map((order) => (

                    <tr
                      key={order._id}
                      className="group border-b border-white/[0.04] transition hover:bg-purple-500/[0.025]"
                    >

                      <td className="px-7 py-5">

                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="font-black text-purple-300 transition group-hover:text-fuchsia-300"
                        >
                          #
                          {String(order._id || "")
                            .slice(-8)
                            .toUpperCase()}
                        </Link>

                      </td>

                      <td className="px-7 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 font-black shadow-lg shadow-purple-950/20">
                            {order.user?.name
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>

                          <div className="min-w-0">

                            <p className="font-bold">
                              {order.user?.name ||
                                "Unknown"}
                            </p>

                            <p className="max-w-[180px] truncate text-xs text-white/25">
                              {order.user?.email ||
                                "N/A"}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-7 py-5 text-white/45">
                        {order.items?.length || 0}
                      </td>

                      <td className="px-7 py-5 font-black">
                        {formatCurrency(
                          order.totalPrice
                        )}
                      </td>

                      <td className="px-7 py-5">

                        <span
                          className={`
                            inline-flex rounded-full
                            border px-3 py-1.5
                            text-xs font-bold capitalize
                            ${getStatusStyle(
                              order.orderStatus
                            )}
                          `}
                        >
                          {order.orderStatus ||
                            "pending"}
                        </span>

                      </td>

                      <td className="px-7 py-5 text-sm text-white/25">
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

        </GlassCard>


        {/* ====================================================
            RECENT USERS
        ==================================================== */}

        <GlassCard
          className="mb-10 overflow-hidden"
          hover={false}
        >

          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-400/70">
                Community
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Recent Users
              </h2>

              <p className="mt-1 text-sm text-white/25">
                Latest registered members
              </p>
            </div>

            <Link
              to="/admin/users"
              className="group inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white/60 transition hover:border-purple-500/20 hover:bg-purple-500/10 hover:text-white"
            >
              Manage Users
              <Icon type="arrow" size={16} />
            </Link>

          </div>


          {recentUsers.length === 0 ? (

            <div className="p-12 text-center text-sm text-white/25">
              No recent users found.
            </div>

          ) : (

            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-3 sm:p-7">

              {recentUsers.map((recentUser) => (

                <div
                  key={recentUser._id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-purple-500/20 hover:bg-white/[0.045]"
                >

                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-500/10 blur-3xl transition duration-700 group-hover:scale-150" />

                  <div className="relative flex items-center gap-4">

                    <div className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 text-lg font-black shadow-lg shadow-purple-950/20">
                      {recentUser.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}

                      <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#08050e] bg-green-400" />
                    </div>

                    <div className="min-w-0">

                      <p className="truncate font-bold">
                        {recentUser.name ||
                          "Unknown User"}
                      </p>

                      <p className="mt-1 truncate text-xs text-white/25">
                        {recentUser.email || "N/A"}
                      </p>

                    </div>

                  </div>

                  <div className="relative mt-5 flex items-center justify-between">

                    <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-bold capitalize text-purple-300">
                      {recentUser.role ||
                        "customer"}
                    </span>

                    <span className="text-xs text-white/20">
                      {formatDate(
                        recentUser.createdAt
                      )}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </GlassCard>


        {/* ====================================================
            QUICK ACTIONS
        ==================================================== */}

        <section className="pb-10">

          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400/70">
              Control Center
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {[
              {
                to: "/admin/users",
                icon: "users",
                title: "Manage Users",
                text: "Control customers, sellers and admin accounts.",
              },
              {
                to: "/admin/products",
                icon: "box",
                title: "Manage Products",
                text: "Manage products, inventory and product status.",
              },
              {
                to: "/admin/orders",
                icon: "cart",
                title: "Manage Orders",
                text: "Review orders, customers and payment information.",
              },
              {
                to: "/admin/analytics",
                icon: "chart",
                title: "Analytics",
                text: "Explore sales and platform performance.",
              },
            ].map((item) => (

              <Link
                key={item.title}
                to={item.to}
                className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-6 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/30 hover:bg-purple-500/[0.045] hover:shadow-2xl hover:shadow-purple-950/20"
              >

                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-purple-500/10 blur-3xl transition duration-700 group-hover:scale-150" />

                <div className="relative">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-300 transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <Icon type={item.icon} size={25} />
                  </div>

                  <h3 className="mt-5 text-lg font-black">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/30">
                    {item.text}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-black text-purple-300 transition group-hover:text-fuchsia-300">
                    Open Panel
                    <Icon type="arrow" size={16} />
                  </div>

                </div>

              </Link>

            ))}

          </div>

        </section>

      </main>


      {/* ======================================================
          INTERNAL ANIMATION CSS
      ====================================================== */}

      <style>{`
        .admin-glass-card {
          transition:
            transform 500ms cubic-bezier(.2,.8,.2,1),
            border-color 500ms ease,
            box-shadow 500ms ease,
            background 500ms ease;
        }

        .admin-glass-card:hover {
          transform: translateY(-5px);
          border-color: rgba(168,85,247,.20);
          box-shadow:
            0 25px 90px rgba(0,0,0,.30),
            0 0 50px rgba(168,85,247,.05);
        }

        .admin-orb {
          animation: adminOrb 9s ease-in-out infinite;
        }

        .admin-orb-delay {
          animation-delay: -4s;
        }

        @keyframes adminOrb {
          0%, 100% {
            transform: translate3d(0,0,0) scale(1);
          }

          50% {
            transform: translate3d(30px,-25px,0) scale(1.08);
          }
        }

        .admin-chart-segment {
          transform-origin: 100px 100px;
          animation: chartSegment 1.2s cubic-bezier(.2,.8,.2,1) both;
        }

        @keyframes chartSegment {
          from {
            opacity: 0;
            stroke-dasharray: 0 1000;
          }

          to {
            opacity: 1;
          }
        }

        .admin-progress-bar {
          transform-origin: left center;
          animation: progressBar 1.1s cubic-bezier(.2,.8,.2,1) both;
          box-shadow: 0 0 15px rgba(168,85,247,.25);
        }

        @keyframes progressBar {
          from {
            width: 0 !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .admin-glass-card,
          .admin-orb,
          .admin-chart-segment,
          .admin-progress-bar {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

    </div>
  );
};

export default AdminDashboard;
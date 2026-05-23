import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaTags,
  FaRupeeSign,
  FaChartLine,
  FaSignOutAlt,
  FaHome,
  FaSync,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { logout } from "../slices/authSlice";
import EcometLogo from "./EcometLogo";

const API = "http://localhost:5001/api";

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-5 shadow-sm"
  >
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${color}`}
    >
      <Icon className="text-lg" />
    </div>
    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
      {value}
    </p>
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
      {label}
    </p>
    {sub && (
      <p className="text-xs text-slate-400 mt-2">{sub}</p>
    )}
  </motion.div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${userInfo?.token}`,
    }),
    [userInfo?.token]
  );

  const loadData = async () => {
    setLoading(true);
    setErrors({});
    const err = {};

    try {
      const res = await fetch(`${API}/products`);
      const json = await res.json();
      setProducts(json.data || json || []);
    } catch {
      err.products = "Could not load products";
    }

    try {
      const res = await fetch(`${API}/categories/main`);
      const json = await res.json();
      setCategories(json.data || []);
    } catch {
      err.categories = "Could not load categories";
    }

    try {
      const { data } = await axios.get(`${API}/orders`, {
        headers: authHeaders,
      });
      setOrders(Array.isArray(data) ? data : data.orders || data.data || []);
    } catch {
      try {
        const { data } = await axios.get(`${API}/orders/all`, {
          headers: authHeaders,
        });
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch {
        err.orders = "Orders API unavailable (admin endpoint may be required)";
        setOrders([]);
      }
    }

    try {
      const { data } = await axios.get(`${API}/users`, {
        headers: authHeaders,
      });
      setUsers(Array.isArray(data) ? data : data.users || data.data || []);
    } catch {
      err.users = "Users list unavailable";
      setUsers([]);
    }

    setErrors(err);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (Number(o.totalPrice) || 0),
    0
  );

  const paidOrders = orders.filter(
    (o) => o.isPaid || o.paymentStatus === "paid" || o.paymentStatus === "success"
  ).length;

  const lowStock = products.filter((p) => (p.stock ?? 99) <= 10).length;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "products", label: `Products (${products.length})` },
    { id: "orders", label: `Orders (${orders.length})` },
    { id: "categories", label: `Categories (${categories.length})` },
    { id: "users", label: `Users (${users.length})` },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const formatPrice = (p) => {
    const n = Number(p);
    return n > 1000 ? `₹${Math.round(n / 100).toLocaleString("en-IN")}` : `₹${n}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#020617]">
      {/* Admin top bar */}
      <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700/80 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/admin" className="flex items-center gap-3">
            <EcometLogo size={36} />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest text-emerald-400/90 border-l border-slate-600 pl-3">
              Admin
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="p-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
              aria-label="Refresh data"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
            </button>
            <Link
              to="/"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <FaHome /> Storefront
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Welcome back, {userInfo?.name || "Admin"} — store overview at a glance
          </p>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-sm text-amber-800 dark:text-amber-200">
            {Object.entries(errors).map(([k, v]) => (
              <p key={k}>• {v}</p>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={FaShoppingBag}
            label="Products"
            value={loading ? "…" : products.length}
            sub={`${lowStock} low stock`}
            color="bg-emerald-500/15 text-emerald-600"
          />
          <StatCard
            icon={FaBox}
            label="Orders"
            value={loading ? "…" : orders.length}
            sub={`${paidOrders} paid`}
            color="bg-blue-500/15 text-blue-600"
          />
          <StatCard
            icon={FaTags}
            label="Categories"
            value={loading ? "…" : categories.length}
            color="bg-violet-500/15 text-violet-600"
          />
          <StatCard
            icon={FaRupeeSign}
            label="Revenue"
            value={loading ? "…" : `₹${totalRevenue.toLocaleString("en-IN")}`}
            sub="From loaded orders"
            color="bg-amber-500/15 text-amber-600"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === t.id
                  ? "bg-emerald-500 text-slate-900 shadow-md"
                  : "bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 text-sm">Loading store data…</p>
            </div>
          ) : (
            <>
              {tab === "overview" && (
                <div className="p-6 md:p-8 space-y-8">
                  <section>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <FaChartLine className="text-emerald-500" />
                      Quick insights
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5">
                        <p className="text-slate-500">Average order value</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                          {orders.length
                            ? `₹${Math.round(totalRevenue / orders.length).toLocaleString("en-IN")}`
                            : "—"}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5">
                        <p className="text-slate-500">Catalog health</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                          {products.length} SKUs · {categories.length} categories
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-lg font-bold mb-4">Recent orders</h2>
                    {orders.length === 0 ? (
                      <p className="text-slate-500 text-sm">No orders loaded.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs uppercase text-slate-500 border-b border-slate-100 dark:border-white/10">
                            <tr>
                              <th className="py-3 pr-4">Order</th>
                              <th className="py-3 pr-4">Customer</th>
                              <th className="py-3 pr-4">Total</th>
                              <th className="py-3">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.slice(0, 5).map((o) => (
                              <tr
                                key={o._id}
                                className="border-b border-slate-50 dark:border-white/5"
                              >
                                <td className="py-3 pr-4 font-mono text-xs">
                                  {String(o._id).slice(-8)}
                                </td>
                                <td className="py-3 pr-4">
                                  {o.shippingAddress?.fullName || o.user?.name || "—"}
                                </td>
                                <td className="py-3 pr-4 font-bold">
                                  ₹{o.totalPrice}
                                </td>
                                <td className="py-3">
                                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600">
                                    {o.paymentStatus || (o.isPaid ? "paid" : "pending")}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {tab === "products" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-white/5 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Product</th>
                        <th className="px-4 py-3 text-left">Price</th>
                        <th className="px-4 py-3 text-left">Stock</th>
                        <th className="px-4 py-3 text-left">Rating</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr
                          key={p._id}
                          className="border-t border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images?.[0]?.url || p.image}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                              />
                              <span className="font-medium line-clamp-1 max-w-[200px]">
                                {p.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-bold">
                            {formatPrice(p.price)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={
                                (p.stock ?? 99) <= 10
                                  ? "text-red-500 font-bold"
                                  : ""
                              }
                            >
                              {p.stock ?? "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {p.ratings?.toFixed(1) || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              to={`/productDetails/${p._id}`}
                              className="text-emerald-600 hover:underline inline-flex items-center gap-1 text-xs font-bold"
                            >
                              View <FaExternalLinkAlt />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === "orders" && (
                <div className="overflow-x-auto">
                  {orders.length === 0 ? (
                    <p className="p-8 text-slate-500 text-sm text-center">
                      No orders returned. Ensure your account has admin access and
                      GET /api/orders is enabled on the backend.
                    </p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-white/5 text-xs uppercase text-slate-500">
                        <tr>
                          <th className="px-4 py-3 text-left">ID</th>
                          <th className="px-4 py-3 text-left">Customer</th>
                          <th className="px-4 py-3 text-left">Items</th>
                          <th className="px-4 py-3 text-left">Total</th>
                          <th className="px-4 py-3 text-left">Payment</th>
                          <th className="px-4 py-3 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr
                            key={o._id}
                            className="border-t border-slate-100 dark:border-white/5"
                          >
                            <td className="px-4 py-3 font-mono text-xs">
                              {String(o._id).slice(-10)}
                            </td>
                            <td className="px-4 py-3">
                              {o.shippingAddress?.fullName || "—"}
                            </td>
                            <td className="px-4 py-3">
                              {o.orderItems?.length ?? "—"}
                            </td>
                            <td className="px-4 py-3 font-bold">
                              ₹{o.totalPrice}
                            </td>
                            <td className="px-4 py-3">
                              {o.paymentStatus || (o.isPaid ? "Paid" : "Pending")}
                            </td>
                            <td className="px-4 py-3 text-slate-500 text-xs">
                              {o.createdAt
                                ? new Date(o.createdAt).toLocaleDateString()
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {tab === "categories" && (
                <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((c) => (
                    <div
                      key={c._id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {c.name}
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-1">
                          {c._id}
                        </p>
                      </div>
                      <Link
                        to={`/category/${c._id}`}
                        className="text-xs font-bold text-emerald-600"
                      >
                        Open
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {tab === "users" && (
                <div className="overflow-x-auto">
                  {users.length === 0 ? (
                    <p className="p-8 text-slate-500 text-sm text-center">
                      No users loaded — backend may restrict GET /api/users to
                      admins only.
                    </p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-white/5 text-xs uppercase text-slate-500">
                        <tr>
                          <th className="px-4 py-3 text-left">Name</th>
                          <th className="px-4 py-3 text-left">Email</th>
                          <th className="px-4 py-3 text-left">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr
                            key={u._id}
                            className="border-t border-slate-100 dark:border-white/5"
                          >
                            <td className="px-4 py-3 font-medium">{u.name}</td>
                            <td className="px-4 py-3">{u.email}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                  u.isAdmin || u.role === "admin"
                                    ? "bg-emerald-500/15 text-emerald-600"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {u.role || (u.isAdmin ? "admin" : "user")}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          Admin access requires{" "}
          <code className="text-emerald-600">isAdmin: true</code> or{" "}
          <code className="text-emerald-600">role: &quot;admin&quot;</code> on login
          response.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;

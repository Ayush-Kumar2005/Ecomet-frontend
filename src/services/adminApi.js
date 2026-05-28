import axios from "axios";

const API = "http://localhost:5001/api";

const authConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/** Safe fetch — returns fallback on failure */
const safeGet = async (url, config, fallback = []) => {
  try {
    const { data } = await axios.get(url, config);
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.products)) return data.products; // Matches your product controller
    if (Array.isArray(data?.orders)) return data.orders;     // Matches your order controller
    if (Array.isArray(data?.users)) return data.users;       // Matches your user controller
    if (Array.isArray(data?.data)) return data.data;
    return Array.isArray(data) ? data : fallback;
  } catch {
    return fallback;
  }
};

export const fetchAdminOverview = async (token) => {
  const config = token ? authConfig(token) : {};

  const [productsRes, categoriesRes, orders, users] = await Promise.all([
    fetch(`${API}/products`).then((r) => r.json()).catch(() => ({})),
    fetch(`${API}/categories/main`).then((r) => r.json()).catch(() => ({})),
    safeGet(`${API}/orders`, config, []), // Pass empty array as default fallback instead of null
    safeGet(`${API}/users`, config, []),  // Pass empty array as default fallback instead of null
  ]);

  // 💡 FIXED: Now correctly extracts using your backend's exact "products" object key payload
  const products = productsRes?.products || productsRes?.data || (Array.isArray(productsRes) ? productsRes : []);
  const categories = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);

  const ordersList = Array.isArray(orders) ? orders : [];
  const usersList = Array.isArray(users) ? users : [];

  const revenue = ordersList.reduce(
    (sum, o) => sum + (Number(o.totalPrice) || 0),
    0
  );

  return {
    products,
    categories,
    orders: ordersList,
    users: usersList,
    ordersAvailable: ordersList.length >= 0,
    usersAvailable: usersList.length >= 0,
    stats: {
      productCount: products.length,
      categoryCount: categories.length,
      orderCount: ordersList.length,
      userCount: usersList.length,
      revenue,
    },
  };
};
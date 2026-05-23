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
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.orders)) return data.orders;
    if (Array.isArray(data?.users)) return data.users;
    return data;
  } catch {
    return fallback;
  }
};

export const fetchAdminOverview = async (token) => {
  const config = token ? authConfig(token) : {};

  const [productsRes, categoriesRes, orders, users] = await Promise.all([
    fetch(`${API}/products`).then((r) => r.json()).catch(() => ({})),
    fetch(`${API}/categories/main`).then((r) => r.json()).catch(() => ({})),
    safeGet(`${API}/orders`, config, null),
    safeGet(`${API}/users`, config, null),
  ]);

  const products = productsRes?.data || (Array.isArray(productsRes) ? productsRes : []);
  const categories = categoriesRes?.data || [];

  const ordersList = orders === null ? [] : Array.isArray(orders) ? orders : [];
  const usersList = users === null ? [] : Array.isArray(users) ? users : [];

  const revenue = ordersList.reduce(
    (sum, o) => sum + (Number(o.totalPrice) || 0),
    0
  );

  return {
    products,
    categories,
    orders: ordersList,
    users: usersList,
    ordersAvailable: orders !== null && ordersList.length >= 0,
    usersAvailable: users !== null,
    stats: {
      productCount: products.length,
      categoryCount: categories.length,
      orderCount: ordersList.length,
      userCount: usersList.length,
      revenue,
    },
  };
};

const API_BASE = "http://localhost:5001/api";

export const parseSearchResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.main && Array.isArray(data.main)) return data.main;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
};

export const fetchSearchSuggestions = async (query, limit = 8) => {
  const res = await fetch(
    `${API_BASE}/products/search?q=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json();
  return parseSearchResponse(data).slice(0, limit);
};

export const TRENDING_SEARCHES = [
  "Electronics",
  "Fashion",
  "Sneakers",
  "Watches",
  "Headphones",
  "Home decor",
];

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("q");

  const [products, setProducts] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    fetchSearchResults();
  }, [query]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5001/api/products/search?q=${query}`
      );

      const data = await res.json();

      setProducts(data.main || data); // main results
      setRelated(data.related || []);  // fallback
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  if (!query) return <p>No search query</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Results for "{query}"
      </h1>

      {loading && <p>Loading...</p>}

      {/* MAIN RESULTS */}
      <h2 className="text-lg font-semibold mb-3">Top Matches</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {products.map((p) => (
          <div
            key={p._id}
            onClick={() => navigate(`/productDetails/${p._id}`)}
            className="border rounded-xl p-3 cursor-pointer hover:shadow-lg"
          >
            <img
              src={p.images?.[0]?.url}
              className="w-full h-40 object-cover rounded-lg"
            />
            <p className="font-semibold mt-2">{p.name}</p>
          </div>
        ))}
      </div>

      {/* RELATED RESULTS */}
      {related.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3">
            Related Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/product/${p._id}`)}
                className="border rounded-xl p-3 cursor-pointer hover:shadow-lg opacity-90"
              >
                <img
                  src={p.images?.[0]?.url}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <p className="font-semibold mt-2">{p.name}</p>
                <p className="text-sm text-gray-500">₹{p.price}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
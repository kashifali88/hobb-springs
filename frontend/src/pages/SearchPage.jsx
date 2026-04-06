import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

export default function Search() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // get search query from URL
  const params = new URLSearchParams(location.search);
  const query = params.get("query");

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/filter?search=${query}`);
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message);
      setProducts(data.products);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) fetchSearchResults();
  }, [query]);

  return (
    <div className="p-4 min-h-screen">
      <h2 className="text-lg font-bold mb-4">
        Search results for: "{query}"
      </h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <Card key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
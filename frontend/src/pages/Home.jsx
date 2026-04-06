import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Card from '../components/Card';
import Spinner from '../components/Spinner'
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]); // selected categories
  const [price, setPrice] = useState(""); // price range
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate();


   // handle search 
   const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };


  // Fetch all products (default)
  const getProducts = async (pageNumber =1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/get-products?page=${pageNumber}&limit=16`);
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message);
      setProducts(pageNumber === 1 ? data.products : [...products, ...data.products]);
      setTotalProducts(data.totalProducts)
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
// Load more button click
const handleLoadMore = () => {
  const nextPage = page + 1;
  setPage(nextPage);
  getProducts(nextPage);
};
  // Fetch filtered products
  const fetchFilterProducts = async () => {
    try {
      setLoading(true);
      let query = [];

      // Category filter
      if (checked.length > 0) query.push(`category=${checked.join(',')}`);

      // Price filter
      if (price) {
        const [min, max] = price.split('-');
        if (min) query.push(`minPrice=${min}`);
        if (max) query.push(`maxPrice=${max}`);
      }

      const queryString = query.length ? `?${query.join('&')}` : '';
      const res = await fetch(`/api/products/filter${queryString}`);
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message);

      setProducts(data.products);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle category checkbox
  const handleCategoryChange = (catId) => {
    const newChecked = checked.includes(catId)
      ? checked.filter((id) => id !== catId)
      : [...checked, catId];
    setChecked(newChecked);
  };

  // Fetch all categories
  const getCategories = async () => {
    try {
      const res = await fetch('/api/category');
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message);
      setCategories(data.category);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Initial load: all products + categories
  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  // Re-fetch filtered products whenever filter changes
  useEffect(() => {
    if (checked.length > 0 || price) {
      fetchFilterProducts();
    } else {
      getProducts(); // no filters, load all products
    }
  }, [checked, price]);

  return (
  <div className="min-h-screen bg-gray-50">

    {/*  MOBILE SEARCH */}
  <form
  onSubmit={handleSearch}
  className="md:hidden p-3 bg-white shadow-sm sticky top-0 z-50"
>
  <div className="flex items-center border border-slate-300 rounded-md px-3 py-2">
    
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search products..."
      className="flex-1 outline-none text-sm"
    />

    <button type="submit">
      <FaSearch className="text-gray-500 text-sm" />
    </button>

  </div>
</form>

    <div className="md:flex">

      {/* SIDEBAR (ONLY DESKTOP) */}
      <div className="hidden md:block w-64 bg-white p-4 shadow">
        <h2 className="font-bold mb-4">Filters</h2>

        {/* Category */}
        {categories.map((cat) => (
          <div key={cat._id} className="flex gap-2 mb-2">
            <input
              type="checkbox"
              checked={checked.includes(cat._id)}
              onChange={() => handleCategoryChange(cat._id)}
            />
            <label>{cat.name}</label>
          </div>
        ))}

        {/* Price */}
        <select
          onChange={(e) => setPrice(e.target.value)}
          value={price}
          className="w-full border p-2 mt-3"
        >
          <option value="">All</option>
          <option value="0-1000">0 - 1000</option>
          <option value="1000-5000">1000 - 5000</option>
        </select>
      </div>

      {/*  PRODUCTS */}
      <div className="flex-1 p-3">

        {/* CATEGORY SCROLL MOBILE ONLY */}
        <div className="flex gap-2 overflow-x-auto md:hidden mb-3">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryChange(cat._id)}
              className={`px-3 py-1 rounded-full border border-slate-300 ${
                checked.includes(cat._id)
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Spinner />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center">No products found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Card key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* LOAD MORE */}
        {products.length < totalProducts && (
          <div className="text-center mt-5">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-black text-white rounded-full"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
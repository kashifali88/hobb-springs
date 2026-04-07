import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import { addToCart } from "../redux/cartSlice";

export default function Product() {
  const { slug } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate  = useNavigate();
    const API = import.meta.env.VITE_BACKEND_URL

const handleAddToCart = async() => {
  try {
    if (!currentUser) {
    toast.error("Please login first");
    navigate("/sign-in");
    return;
  }
  const res = await fetch(`${API}/api/cart`, {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials:'include',
    body: JSON.stringify({product: product._id, quantity:1})
  })
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message)
  }
  dispatch(addToCart(product));
  toast.success("Product added to cart");
  } catch (error) {
    toast.error(error.message)
  }
  
};
  // GET SINGLE PRODUCT
  const getProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/products/get-product/${slug}`);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message);
      }

      setProduct(data.product);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [slug]);

  
    
 if (loading) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner />
    </div>
  );
}
  return (
   
    <div className="max-w-6xl mx-auto p-4 min-h-screen">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-lg rounded-xl p-6">

        {/* IMAGE */}
        <div className="overflow-hidden rounded-xl">
          <img
            src={
              product?.productImage
                ? product.productImage
                : "https://via.placeholder.com/500"
            }
            alt={product.name}
            className="w-full h-[400px] object-cover hover:scale-105 transition duration-300"
          />
        </div>

        {/* DETAILS */}
        <div className="flex flex-col gap-4">

          {/* NAME */}
          <h1 className="text-3xl font-bold text-gray-800">
            {product.name}
          </h1>

          {/* PRICE */}
          <p className="text-2xl text-green-600 font-semibold">
            Rs {product.price}
          </p>

          {/* STOCK */}
          {product.quantity > 0 ? (
            product.quantity <= 10 ? (
              <p className="text-red-500 font-medium animate-pulse">
                Only {product.quantity} left 🔥
              </p>
            ) : (
              <p className="text-green-600 font-medium">
                In Stock
              </p>
            )
          ) : (
            <p className="text-red-600 font-semibold">Out of Stock</p>
          )}

          {/* SHIPPING */}
          {product.shipping && (
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm w-fit">
              Free Shipping 🚚
            </span>
          )}

          {/* DESCRIPTION */}
          <div>
            <h2 className="font-semibold text-lg mb-1">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-4">

            <button onClick={handleAddToCart} disabled={!product.quantity} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
              Add to Cart
            </button>

            {currentUser?.role === "admin" && (
              <a
                href={`/dashboard/admin/update-product/${product.slug}`}
                className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition"
              >
                Update Product
              </a>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden group flex flex-col h-full">
      
      {/* IMAGE */}
      <div className="overflow-hidden aspect-[1/1]">
        <img
          src={
            product?.productImage
              ? product.productImage
              : "https://via.placeholder.com/300"
          }
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col justify-between flex-1">

        {/* TOP CONTENT */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm md:text-lg font-semibold line-clamp-1">
            {product.name}
          </h3>

          <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
            {product.description}
          </p>

          <div className="flex justify-between items-center mt-2">
            <span className="text-xl font-bold text-green-600">
              Rs {product.price}
            </span>

            {product.quantity <= 10 && product.quantity > 0 && (
              <p className="text-xs text-red-500 font-medium animate-pulse">
                Only {product.quantity} left 🔥
              </p>
            )}
          </div>

          {product.shipping && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded w-fit">
              Free Shipping
            </span>
          )}
        </div>

        {/* BUTTONS (ALWAYS AT BOTTOM) */}
        <div className="flex flex-col gap-2 mt-4">
          <Link
            to={`/product/${product.slug}`}
            className="bg-black text-white text-center py-2 rounded-lg hover:bg-gray-800 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
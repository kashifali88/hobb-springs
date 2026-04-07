import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {  setCartItems } from "../redux/cartSlice";
import Spinner from "../components/Spinner";
import { useDispatch } from "react-redux";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
 const API = import.meta.env.VITE_BACKEND_URL

const dispatch = useDispatch();
  // FETCH CART FROM BACKEND
  const fetchCart = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/api/cart`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      setCart(data);
      dispatch(setCartItems(data))
    } catch (error) {
      toast.error(error.message);
    }finally {
      setLoading(false)
    }
  };

  //  LOAD CART ON PAGE LOAD
  useEffect(() => {
    fetchCart();
  }, []);

  // UPDATE QUANTITY
  const handleUpdateQuantity = async (id, quantity) => {
    try {
      const res = await fetch(`${API}/api/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      toast.success("Quantity updated");
      fetchCart();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // DELETE ITEM
  const handleRemove = async (id) => {
    try {
      const res = await fetch(`${API}/api/cart/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("Item removed");
      fetchCart(); 
    } catch (error) {
      toast.error(error.message);
    }
  };

  //  TOTAL PRICE
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.product?.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen"><Spinner /></div>
    )
  }
  
  return (
    
    <div className="max-w-5xl mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-red-500 text-center">Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 border border-slate-300 p-3 mb-3 rounded-lg"
            >
              {/*  PRODUCT IMAGE */}
              <img
                src={item.product?.productImage}
                alt=""
                className="w-20 h-20 object-cover"
              />

              <div className="flex-1">
                {/*  PRODUCT DATA */}
                <h2>{item.product?.name}</h2>
                <p>Rs {item.product?.price}</p>

                <p>Quantity:</p>

                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    handleUpdateQuantity(item._id, Number(e.target.value))
                  }
                  className="border p-1 w-16"
                />
              </div>

              <button
                onClick={() => handleRemove(item._id)}
                className="text-red-500 cursor-pointer hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          <h2 className="text-xl font-bold mt-4">
            Total: Rs {totalPrice}
          </h2>

          <Link to="/checkout">
            <button className="mt-4 bg-black text-white px-6 py-2 rounded">
              Checkout
            </button>
          </Link>
        </>
      )}
    </div>

    
  );
}
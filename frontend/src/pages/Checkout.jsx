import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const API = import.meta.env.VITE_BACKEND_URL


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    address: "",
    paymentMethod: "cod",
  });
  const navigate = useNavigate()

  // fetch cart
  const fetchCart = async () => {
    try {
      const res = await fetch(`${API}/api/cart`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCart(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // total price
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.product?.price * item.quantity,
    0
  );

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //  submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.address) return toast.error("Enter address");

    try {
        if (formData.paymentMethod === "stripe") {
  const res = await fetch(`${API}/api/order/stripe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      cartItems: cart,
      shippingInfo: formData,
      totalPrice,
    }),
  });
  const data = await res.json();
  window.location.href = data.url; // redirect to Stripe test page
} else {
  // COD flow
      const res = await fetch(`${API}/api/order/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          cartItems: cart,
          shippingInfo: formData,
          totalPrice,
          paymentMethod: formData.paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Order placed successfully 🎉");
      navigate('/dashboard/user/orders')
      setCart([]);
}
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto p-4 min-h-screen flex flex-col md:flex-row gap-6"
    >

      {/* LEFT SIDE */}
      <div className="flex-1 bg-white shadow-md rounded-xl p-5">
        <h1 className="text-xl font-bold mb-4">Delivery Information</h1>

        <div className="flex gap-3 mb-3">
          <input name="firstName" onChange={handleChange} placeholder="First Name" id='firstName' className="input" />
          <input name="lastName" onChange={handleChange} placeholder="Last Name" id='lastName' className="input" />
        </div>

        <input name="email" onChange={handleChange} placeholder="Email" id='email' className="input mb-3" />

        <div className="flex gap-3 mb-3">
          <input name="city" onChange={handleChange} placeholder="City" id='city' className="input" />
          <input name="state" onChange={handleChange} placeholder="State" id='state' className="input" />
        </div>

        <div className="flex gap-3 mb-3">
          <input name="zipCode" onChange={handleChange} placeholder="Zipcode" id='zipcode' className="input" />
          <input name="phone" onChange={handleChange} placeholder="Phone" id='phone' className="input" />
        </div>

        <textarea
          name="address"
          id='address'
          onChange={handleChange}
          placeholder="Full Address"
          className="input"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 bg-white shadow-md rounded-xl p-5">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        {cart.length === 0 ? (
          <p className="text-red-500">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-3 border p-3 rounded-lg">
                  <img src={item.product?.productImage} className="h-20 w-20 rounded" alt="" />
                  <div>
                    <h2>{item.product?.name}</h2>
                    <p>Rs {item.product?.price}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold mt-4">Total: Rs {totalPrice}</h2>

            {/* PAYMENT */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Payment Method</h3>

              <label className="flex gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  id='cod'
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                />
                COD
              </label>

              <label className="flex gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  id='stripe'
                  value="stripe"
                  checked={formData.paymentMethod === "stripe"}
                  onChange={handleChange}
                />
                Stripe
              </label>
            </div>

            <button
              type="submit"
              className="mt-5 w-full bg-black text-white py-3 rounded-lg"
            >
              Place Order
            </button>
          </>
        )}
      </div>

      {/* reusable class */}
      <style>
        {`
          .input {
            width: 100%;
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 8px;
          }
        `}
      </style>
    </form>
  );
}
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/order/user/orders", {
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      
      if (!res.ok) throw new Error(data.message);

      setOrders(data.orders);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 mb-4 rounded-lg">
            
            <div className="flex justify-between mb-2">
              <span className="font-semibold">
                Order ID: {order._id}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* ITEMS */}
            {order.cartItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <img
                  src={item.image}
                  className="h-16 w-16 rounded"
                  alt=""
                />
                <div>
                  <p>{item.name}</p>
                  <p>Rs {item.price}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}

            {/* TOTAL */}
            <div className="mt-2 font-bold">
              Total: Rs {order.totalPrice}
            </div>

            {/* STATUS */}
            <div className="text-sm mt-1">
              Status: {order.orderStatus}
            </div>

            {/* PAYMENT */}
            <div className="text-sm">
              Payment: {order.paymentMethod} |{" "}
              {order.isPaid ? "Paid " : "Pending"}
            </div>

          </div>
        ))
      )}
    </div>
  );
}
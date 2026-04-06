// pages/OrderSuccess.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful 🎉
      </h1>

      <p className="text-gray-600">
        Session ID: {session_id}
      </p>

      <a
        href="/"
        className="mt-4 bg-black text-white px-6 py-2 rounded"
      >
        Continue Shopping
      </a>
    </div>
  );
}
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault()
try {
    setLoading(true)
    const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    })
    const data = await res.json();
    if (!res.ok || data.success === false) {
toast.error(data.message);
return;
    }
toast.success("Password reset link sent to your email");


} catch (error) {
    toast.error(error.message)
} finally {
    setLoading(false)
}
  }

  return (
    <div className="flex flex-col py-12 max-w-lg mx-auto h-screen">
      
      <h1 className="text-2xl font-semibold my-6 text-center">
        Forgot Password
      </h1>

      <p className="text-sm text-gray-600 text-center mb-6">
        Enter your email and we will send you a password reset link.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mx-auto">

        <input
          className="w-full p-3 outline-none rounded-lg border border-gray-200"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <button className="flex items-center justify-center gap-2 uppercase bg-black text-white p-3 rounded-lg w-full">
          {loading && <Spinner />}
          {loading ? "sending..." : "send reset link"}
        </button>

      </form>

      <div className="w-full mx-auto">
        <p className="text-sm mt-3">
          Remember your password?{" "}
          <Link to="/sign-in" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>

    </div>
  );
}
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams()
    const API = import.meta.env.VITE_BACKEND_URL


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        setError(null);
        if (formData.password !== formData.confirmPassword) {
            setError('Password do not match');
            return;
        }
        const res = await fetch(`${API}/api/auth/reset-password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password: formData.password})
        })
        const data = await res.json();
        if (!res.ok || data.success === false) {
            setError(data.message);
            return;
        }
        toast.success('Reset password successful')
        navigate('/sign-in')
        
    } catch (error) {
        setError(error.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="flex flex-col py-12 max-w-lg mx-auto h-screen">
      
      <h1 className="text-2xl font-semibold my-6 text-center">
        Reset Password
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mx-auto">

        <input
          id="password"
          type="password"
          placeholder="New password"
          onChange={handleChange}
          className="w-full p-3 outline-none rounded-lg border border-gray-200"
        />

        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm password"
          onChange={handleChange}
          className="w-full p-3 outline-none rounded-lg border border-gray-200"
        />

        <button className="flex items-center justify-center gap-2 uppercase bg-black text-white p-3 rounded-lg w-full">
          {loading && <Spinner />}
          {loading ? "updating..." : "reset password"}
        </button>

      </form>

      <div className="w-full mx-auto">
        <p className="text-sm mt-3">
          Back to{" "}
          <Link to="/sign-in" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>

    </div>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/userSlice";
import Spinner from "../components/Spinner";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const navigate= useNavigate();
  const { currentUser, loading, error } = useSelector(((state) => state.user));
  const dispatch =useDispatch()
    const API = import.meta.env.VITE_BACKEND_URL


  // handle input change
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]:e.target.value})
  }
  
// submit form
const handleSubmit = async (e) => {
e.preventDefault();
try {
 dispatch(signInStart())
  if (!formData.username || !formData.email || !formData.password) {
    dispatch(signInFailure('Please fill all required fields'))
    return;
  }
  const res = await fetch(`${API}/api/auth/sign-up`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: "include",
    body: JSON.stringify(formData)
  })
  const data = await res.json();
  if (!res.ok || data.success === false) {
   dispatch(signInFailure(data.message))
    return;
  } 
  dispatch(signInSuccess())
  setFormData({
  username: "",
  email: "",
  password: ""
});
  navigate('/sign-in')

  
} catch (error) {
  signInFailure(error)
}
}
  return (
    <div className="flex flex-col py-12 max-w-lg mx-auto h-screen">
      <h1 className="text-2xl font-semibold my-6 text-center">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mx-auto px-4 sm:px-0">
        <input
        value={formData.username || ""}
        id="username"
          onChange={handleChange}
          className="w-full p-3 outline-none rounded-lg border border-gray-200"
          type="text"
          placeholder="username"
        />

        <input
        value={formData.email || ""}
        id="email"
          onChange={handleChange}
          className="w-full p-3 outline-none rounded-lg border border-gray-200"
          type="email"
          placeholder="email"
        />

        <input
        value={formData.password || ""}
        id="password"
          onChange={handleChange}
          className="w-full p-3 outline-none rounded-lg border border-gray-200"
          type="password"
          placeholder="password"
        />

        <button
          type="submit"
          className="flex items-center justify-center uppercase cursor-pointer bg-black text-white p-3 rounded-lg w-full"
        >
          {loading && <Spinner />}
          { loading ? 'signing up...' : 'sign up'}
        </button>
      </form>
      {/* OAuth outside form */}
      <div className="mt-2 px-4 sm:px-0">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <OAuth />
      </div>

      <div className="w-full  mx-auto px-4 sm:px-0">
        <p className="text-sm mt-3">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

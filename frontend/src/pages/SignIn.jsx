import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/userSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state)=> state.user)
  const location = useLocation();

  // handle input 
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]:e.target.value})

  }

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart())
      if (!formData.login || !formData.password) {
        dispatch(signInFailure('Please fill all required fields'))
        return;
      }
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.login);
      const body = isEmail
  ? { email: formData.login, password: formData.password }
  : { username: formData.login, password: formData.password };

      const res = await fetch('http://localhost:5000/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(body)
      })
      
      const data = await res.json();
      
      
      if (!res.ok || data.success === false) {
        dispatch(signInFailure(data.message))
      }
      if (res.ok) {
       dispatch(signInSuccess(data.userWithoutPassword))
       toast.success('Logged in successfully')
        navigate(location.state || '/')
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }
  return (
    <div className='flex flex-col py-12 max-w-lg mx-auto h-screen'>
      
      <h1 className='text-2xl font-semibold my-6 text-center'>Sign In</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full mx-auto'>
      
        <input
          id='login'
          value={formData.login || ""}
         onChange={handleChange}
          className='w-full p-3 outline-none rounded-lg border border-gray-200'
          type="text"
          placeholder='username or email'
        />

        <input
         value={formData.password || ""}
          id='password'
          onChange={handleChange}
          className='w-full p-3 outline-none rounded-lg border border-gray-200'
          type="password"
          placeholder='password'
        />

        <button
          
          className="flex items-center justify-center gap-2 uppercase bg-black cursor-pointer text-white p-3 rounded-lg w-full"
        >
          {loading && <Spinner />}
          {loading ? 'signing in...' : 'sign in'}
        </button>
      </form>
      {/* OAuth outside form */}
      <div className="mt-2">
        {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
        <OAuth />
      </div>

      <div className='flex justify-between w-full  mx-auto'>
        <p className='text-sm mt-3'>
          New to Hobb Springs?{" "}
          <Link to='/sign-up' className='text-blue-600 hover:underline'>
            Open an Account
          </Link>
        </p>
        <Link to='/forgot-password' className='text-sm mt-3 text-blue-600 hover:underline'>Forgot password?</Link>
      </div>

    </div>
  )
}
import React from 'react'
import { app } from '../firebase'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const [data, setData] = useState({})
  const navigate = useNavigate()
  const API = import.meta.env.VITE_BACKEND_URL

  const handleGoogleClick = async () => {
    const auth = getAuth(app);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({prompt: 'select_account'});
      const result = await signInWithPopup(auth, provider);
      const res = await fetch(`${API}/api/auth/google`, {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
          profileImage: result.user.photoURL
        })
      })
      const data = await res.json();
      if (!res.ok || data.success === false) {
        return new Error(data.message)
      }
      setData(data)
      navigate('/');
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <div>
        <button onClick={handleGoogleClick} className='uppercase w-full p-3 cursor-pointer rounded-lg bg-red-700 text-white'>continue with google</button>
    </div>
  )
}

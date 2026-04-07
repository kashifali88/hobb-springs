import React from 'react'
import { app } from '../firebase'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess, signInFailure } from '../redux/userSlice';


export default function OAuth() {
  const dispatch = useDispatch()
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
        dispatch(signInFailure(data.message || 'Google sign-in failed'))
      } else {
        dispatch(signInSuccess(data.userWithOutPassword))
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      dispatch(signInFailure('Google sign-in failed'))
    }
  }
  return (
    <div>
        <button onClick={handleGoogleClick} className='uppercase w-full p-3 cursor-pointer rounded-lg bg-red-700 text-white'>continue with google</button>
    </div>
  )
}

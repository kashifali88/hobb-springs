import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {  Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function ProtectedRoute() {
 const { currentUser } = useSelector((state) => state.user);
const [count, setCount] = useState(3);
const navigate = useNavigate()
const location = useLocation()

useEffect(() => {
   if (!currentUser) {
      const timer = setInterval(() => {
         setCount((prev) => prev -1)
      },1000)
      const timeOut = setTimeout(() => {
         navigate('/sign-in', {
            state: location.pathname
         })
      },1500);
      return (() => {
         clearInterval(timer)
      clearTimeout(timeOut)
   })
   }
},[navigate, currentUser, location])

if (!currentUser) {
   return (
       <div className="flex flex-col justify-center items-center h-screen text-lg font-semibold gap-2">
        <p>Redirecting to sign in...</p>
        <p className="text-gray-600">{count}</p>
      </div>
   )
}
return <Outlet />

}

import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export default function PublicRoute() {

const { currentUser } = useSelector((state) => state.user)

if (currentUser) {
    return <Navigate to='/' />
}
return <Outlet />

}

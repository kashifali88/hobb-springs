import React from 'react'
import AdminMenu from '../../components/admin/AdminMenu'

export default function AdminOrders() {
  return (
    <div className='min-h-screen flex'>

      {/* SIDEBAR */}
      <div className='w-64 bg-gray-50 border-r-2 border-gray-300 p-4'>
        <AdminMenu />
      </div>

      {/* MAIN CONTENT */}
      <div className='flex-1 p-6'>
        <h1 className='text-2xl font-bold mb-4'>Orders</h1>
      </div>

    </div>
  )
}
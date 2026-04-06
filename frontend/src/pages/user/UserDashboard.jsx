import React from 'react'
import UserMenu from '../../components/user/UserMenu'

export default function UserDashboard() {
  return (
    <div className='min-h-screen flex '>
      <div className='w-64 bg-gray-50 p-4 b-r-2 border-gray-300'>
        <UserMenu />
      </div>
      <div className='flex-1 p-6'></div>
    </div>
  )
}

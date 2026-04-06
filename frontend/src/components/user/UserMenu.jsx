import React from 'react'
import { NavLink } from 'react-router-dom'

export default function UserMenu() {
  const linkStyle =
    "block px-4 py-2 rounded-lg transition duration-200 hover:bg-teal-100";

  const activeStyle = "bg-teal-600 text-white";

  return (
    <div className="sm:h-screen  bg-gray-50">
      
      {/* Title */}
      <h2 className="text-xl font-semibold text-center mb-4 border-b border-gray-300 pb-2">
        User Dashboard
      </h2>

      {/* Menu */}
      <div className="flex flex-col gap-2">

        <NavLink
          to="/dashboard/user/profile"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : "text-gray-700"}`
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="/dashboard/user/orders"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : "text-gray-700"}`
          }
        >
          Orders
        </NavLink>

      </div>
    </div>
  )
}
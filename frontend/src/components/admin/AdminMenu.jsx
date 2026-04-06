import React from 'react'
import { NavLink } from 'react-router-dom'

export default function AdminMenu() {
  const linkStyle =
    "block px-4 py-2 rounded-lg transition duration-200 hover:bg-teal-100";

  const activeStyle = "bg-teal-600 text-white";

  return (
    <div className="sm:h-screen  bg-gray-50">
      
      {/* Title */}
      <h2 className="text-xl font-semibold text-center mb-4 border-b border-gray-300 pb-2">
        Admin Dashboard
      </h2>

      {/* Menu */}
      <div className="flex flex-col gap-2">

        <NavLink
          to="/dashboard/admin/create-category"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : "text-gray-700"}`
          }
        >
          Create Category
        </NavLink>

        <NavLink
          to="/dashboard/admin/create-product"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : "text-gray-700"}`
          }
        >
          Create Product
        </NavLink>
       
        <NavLink
          to="/dashboard/admin/users"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : "text-gray-700"}`
          }
        >
          Users
        </NavLink>
        <NavLink
          to="/dashboard/admin/products"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : "text-gray-700"}`
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/dashboard/admin/orders"
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
import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingBag, FaBars } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/userSlice";

const API = import.meta.env.VITE_BACKEND_URL

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false); // mobile hamburger menu
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('')

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Separate refs for desktop and mobile dropdowns
  const desktopDropdownRef = useRef();
  const mobileDropdownRef = useRef();

  // handle search 
   const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(e.target) &&
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sign out handler
  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch(`${API}/api/auth/signout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess());
      navigate("/sign-in");
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  return (
    <header className="shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <FaShoppingBag className="text-xl" />
          <h1 className="font-semibold text-xl sm:text-2xl">Hobb Springs</h1>
        </Link>

        {/* Search (desktop only) */}
        <form onSubmit={handleSearch} className="hidden md:flex border border-gray-300 rounded-md p-2 items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="outline-none w-full text-sm"
          />
       <button type="submit">
        <FaSearch className="text-gray-500 text-sm" />
      </button>        
      </form>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-6">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>

          {/* Profile dropdown (desktop) */}

          {currentUser ? (
            <div ref={desktopDropdownRef} className="relative">
              <img
                src={currentUser.profileImage}
                alt="profile"
                className="w-9 h-9 border-2 border-gray-400 rounded-full cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              />

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-50 overflow-hidden">
                  {/* User info */}
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold flex items-center gap-1">
                      {currentUser.username}{" "}
                      {currentUser.role === "admin" && "👑"}
                    </p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                        currentUser.role === "admin"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {currentUser.role === "admin" ? "Admin" : "User"}
                    </span>
                  </div>

                  {/* Links */}
                  <div className="flex flex-col">
                    <Link
                      to="/dashboard/user/profile"
                      onClick={() => setProfileOpen(false)}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>

                    {currentUser.role === "admin" ? (
                      <Link
                        to="/dashboard/admin"
                        onClick={() => setProfileOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard/user"
                        onClick={() => setProfileOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        User Dashboard
                      </Link>
                    )}

                    <p
                      onClick={handleSignOut}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                    >
                      Sign out
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/sign-in">Login</NavLink>
          )}

          {/* Cart */}
          <div className="relative">
            <NavLink to="/cart">Cart</NavLink>
            <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {totalQuantity}
            </span>
          </div>
        </ul>

        {/* Mobile menu & profile */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Profile mobile */}
          <p>
            {" "}
            <span className="text-blue-600 uppercase font-bold">
              {currentUser?.username}
            </span>
          </p>
          {currentUser && (
            <div ref={mobileDropdownRef} className="relative">
              <img
                src={currentUser.profileImage}
                alt="profile"
                className="w-8 h-8 rounded-full border-2 border-gray-400 cursor-pointer "
                onClick={() => setProfileOpen(!profileOpen)}
              />

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold flex items-center gap-1">
                      {currentUser.username}{" "}
                      {currentUser.role === "admin" && "👑"}
                    </p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>

                  <Link
                    to="/dashboard/user/profile"
                    onClick={() => setProfileOpen(false)}
                    className="px-4 py-2 block hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  {currentUser.role === "admin" ? (
                    <Link
                      to="/dashboard/admin"
                      onClick={() => setProfileOpen(false)}
                      className="px-4 py-2 block hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard/user"
                      onClick={() => setProfileOpen(false)}
                      className="px-4 py-2 block hover:bg-gray-100"
                    >
                      User Dashboard
                    </Link>
                  )}

                  <p
                    onClick={handleSignOut}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                  >
                    Sign out
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Hamburger */}
          <FaBars
            className="cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>
      </div>

      {/* Mobile hamburger menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t p-4">
          <div className=" flex flex-col gap-4 text-gray-800">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/category">Category</NavLink>
            <NavLink className="relative" to="/cart">
              Cart
              <span className="absolute bottom-3 left-7 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {totalQuantity}
              </span>
            </NavLink>
            {!currentUser && <NavLink to="/sign-in">Login</NavLink>}
          </div>
        </div>
      )}
    </header>
  );
}

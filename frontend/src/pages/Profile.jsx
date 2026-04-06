import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/userSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import UserMenu from "../components/user/UserMenu"; // ✅ ADD THIS

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  const fileRef = useRef();

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [currentUser]);

  // upload image
  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    return result.secure_url;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.oldPassword && !formData.newPassword) {
      dispatch(updateUserFailure("Enter new password"));
      return;
    }
    if (!formData.oldPassword && formData.newPassword) {
      dispatch(updateUserFailure("Enter old password"));
      return;
    }

    try {
      dispatch(updateUserStart());

      let profileImage = currentUser?.profileImage;
      if (file) {
        profileImage = await uploadImage();
      }

      const res = await fetch(`/api/user/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, profileImage }),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data.updatedUser));
      toast.success("Profile updated");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
      toast.success("User deleted");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOutUser = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch(`/api/auth/signout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        dispatch(signOutFailure(data.message));
        return;
      }

      dispatch(signOutSuccess());
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex">

      {/*  SIDEBAR */}
      <div className="w-64 bg-gray-50 border-r border-gray-300 shadow-lg p-4">
        <UserMenu />
      </div>

      {/*  RIGHT CONTENT */}
      <div className="flex-1 flex justify-center items-start p-6">
        <div className="w-full max-w-md">

          <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            <input
              type="file"
              hidden
              ref={fileRef}
              onChange={(e) => setFile(e.target.files[0])}
            />

            <img
              onClick={() => fileRef.current.click()}
              className="w-24 h-24 rounded-full object-cover self-center cursor-pointer border"
              src={file ? URL.createObjectURL(file) : currentUser?.profileImage}
              alt=""
            />

            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg"
              placeholder="Username"
            />

            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-3 rounded-lg border-gray-300"
              placeholder="Email"
            />

            <input
              type="password"
              id="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="border p-3 rounded-lg border-gray-300"
              placeholder="Old Password"
            />

            <input
              type="password"
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="border p-3 rounded-lg border-gray-300"
              placeholder="New Password"
            />

            <button className="bg-teal-600 text-white p-3 rounded-lg">
              {loading ? <Spinner /> : "Update"}
            </button>

            {error && <p className="text-red-500">{error}</p>}
          </form>

          <div className="flex justify-between mt-4">
            <span
              onClick={handleDeleteUser}
              className="text-red-600 cursor-pointer"
            >
              Delete Account
            </span>

            <span
              onClick={handleSignOutUser}
              className="text-red-600 cursor-pointer"
            >
              Sign Out
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
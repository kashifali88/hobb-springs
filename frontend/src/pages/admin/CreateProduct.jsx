import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/admin/AdminMenu";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formdata, setFormData] = useState({});
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const navigate = useNavigate();
    const API = import.meta.env.VITE_BACKEND_URL

  // handle inputs
  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.id]: e.target.value });
  };

  // handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setImageUploading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", import.meta.env.VITE_PRODUCT_UPLOAD_PRESET);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        },
      );
      const result = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error("upload failed");
      }
      setFormData((prev) => ({ ...prev, productImage: result.secure_url }));
      setImageUploading(false);
    } catch (error) {
      toast.error(error.message);
      setImageUploading(false);
    }
  };
  // get AllCategory API
  const getAllCategory = async () => {
    try {
      setError(null);

      const res = await fetch(`${API}/api/category/`);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message);
      } else {
        setCategories(data.category || []);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllCategory();
  }, []);
  // handle create product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      setProductLoading(true);
      if (!formdata.productImage) {
        return toast.error("Please upload product image");
      }
      const res = await fetch(`${API}/api/products/create-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message);
      }
      toast.success("Product created successfully");
      const product = data.products;
      navigate(`/product/${product.slug}`);
      setFormData({
        name: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
        shipping: "",
        productImage: "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProductLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* SIDEBAR */}
      <div className="hidden md:inline w-64 bg-gray-50 border-r-2 border-gray-300 p-4">
        <AdminMenu />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
        <div className="max-w-3xl p-3 mx-auto min-h-screen">
          <h1 className="text-center text-3xl font-semibold my-7">
            Create Product
          </h1>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                onChange={handleChange}
                id="name"
                required
                placeholder="name"
                className="outline-none border border-slate-300  p-2 rounded-lg flex-1"
              />

              <select
                id="category"
                onChange={handleChange}
                className="border border-slate-300 p-2 bg-slate-700  text-white rounded-lg outline-none sm:w-40"
              >
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between border border-slate-300 rounded-lg p-4">
              <input
                onChange={handleImageUpload}
                className="max-w-56 rounded-lg p-2"
                type="file"
                accept="image/*"
              />
              {formdata.productImage && (
                <img
                  src={formdata.productImage}
                  alt="preview"
                  className="w-22 h-22 object-cover rounded-lg mt-2"
                />
              )}

              <p className="text-green-500 text-sm">
                {imageUploading
                  ? "Uploading"
                  : formdata.productImage && "image uploaded successfully"}
              </p>
            </div>
            <input
              type="number"
              onChange={handleChange}
              id="quantity"
              required
              placeholder="Quantity"
              className="outline-none border border-slate-300  p-2 rounded-lg flex-1"
            />
            <input
              type="number"
              onChange={handleChange}
              id="price"
              required
              placeholder="Price"
              className="outline-none border border-slate-300  p-2 rounded-lg flex-1"
            />

            <select
              id="shipping"
              onChange={handleChange}
              className="bg-slate-700 text-white border border-slate-300 p-2 rounded-lg outline-none  sm:w-40"
            >
              <option value="">Shipping</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>

            <textarea
              rows={8}
              onChange={handleChange}
              id="description"
              required
              placeholder="Write something..."
              className=" border border-slate-300 p-2 rounded-lg w-full outline-none"
            />

            <button
              type="button"
              onClick={handleCreateProduct}
              className="disabled:bg-slate-500 bg-slate-700 text-white p-2 rounded-lg mt-2"
            >
              {productLoading ? "Creating..." : "Create Product"}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

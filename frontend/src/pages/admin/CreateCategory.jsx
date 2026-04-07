import React, { useEffect, useState } from 'react';
import AdminMenu from '../../components/admin/AdminMenu';
import Spinner from '../../components/Spinner'
import CategoryForm from '../../components/form/CategoryForm';
import { toast } from 'react-toastify'

export default function CreateCategory() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [name, setName] = useState("")
  const [openEdit, setOpenEdit] = useState(false);
  const [updatedName, setUpdatedName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null);
  const API = import.meta.env.VITE_BACKEND_URL

const handleEditClick = (category) =>  {
  setSelectedCategory(category);
  setUpdatedName(category.name)
  setOpenEdit(true)
}
  // handle update category
  const handleUpdateCategory = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API}/api/category/update-category/${selectedCategory._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentialsL: 'include',
    body: JSON.stringify({ name: updatedName })
      })
      const data = await res.json();
      if (!res.ok || data.success === false) {
        toast.error(data.message);
        return;
      }
      toast.success('Category updated successfully')
      setOpenEdit(false)
      setUpdatedName("")
      setSelectedCategory(null);
      getAllCategory()

    } catch (error) {
      toast.error(error.message)
    }
  }

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
    },[])


  // submit form
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (!name) {
      return toast.error('Category name is required');
    }

    const res = await fetch(`${API}/api/category/create-category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ name })
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      toast.error(data.message);
      return;
    }

    toast.success(`${data.category?.name || name} is created`);

    setName("");

    getAllCategory();

  } catch (error) {
    toast.error(error.message);
  }
};

// handle delete category
const handleDeleteCategory = async (id) => {
  try {
    const res = await fetch(`${API}/api/category/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    const data = await res.json();
    if (!res.ok || data.success === false) {
      toast.error(data.message)
      return;
    } else {
      toast.success('Category deleted successfully')
    }
    getAllCategory();

  } catch (error) {
    console.log(error.message);
    toast.error(error.message)
    
  }
}
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>

      {/* SIDEBAR */}
      <div className='w-full md:w-64 bg-gray-50 border-r border-gray-300 p-4'>
        <AdminMenu />
      </div>

      {/* MAIN */}
      <div className='flex-1  p-4 md:p-6'>
        <h1 className='text-xl md:text-2xl font-bold mb-4'>
          Manage Categories
        </h1>
        <div className='p-3 '>
          <CategoryForm   handleSubmit={handleSubmit} value={name} setValue={setName} />
           </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
          <Spinner />
          </div>

        ) : error ? (
  
          <p className='text-red-500'>{error}</p>

        ) : categories.length === 0 ? (
      
          <div className='flex justify-center items-center h-40'>
            <p className='text-gray-500'>No categories found</p>
          </div>

        ) : (
          
      
          <div className='overflow-x-auto bg-white rounded-xl shadow'>
            <table className='min-w-full text-sm text-left'>

              <thead className='bg-gray-100 text-gray-700 uppercase text-xs'>
                <tr>
                  <th className='px-4 py-3'>#</th>
                  <th className='px-4 py-3'>Category Name</th>
                  <th className='px-4 py-3 text-center'>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category, index) => (
                  <tr
                    key={category._id}
                    className='border-b border-gray-200 hover:bg-gray-50'
                  >
                    <td className='px-4 py-3'>{index + 1}</td>

                    <td className='px-4 py-3 font-medium'>
                      {category.name}
                    </td>

                    <td className='px-4 py-3 flex gap-2 justify-center'>
                     <button
              onClick={() => handleEditClick(category)}
           className='bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600'
         >
            Edit
            </button>
                      <button onClick={() => handleDeleteCategory(category._id)} className='bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600'>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
            {openEdit && (
  <div className="fixed inset-0 flex items-center justify-center  bg-black/30 backdrop-blur-sm  bg-opacity-60 ">
    
    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
      
      <h2 className="text-xl font-bold mb-4 text-center">
        Update Category
      </h2>

      <form onSubmit={handleUpdateCategory} className="flex flex-col gap-4">

        <input
          type="text"
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
          className="border p-3 rounded-lg outline-none"
          placeholder="Enter category name"
        />

        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={() => setOpenEdit(false)}
            className="w-full bg-gray-300 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Update
          </button>
        </div>

      </form>
    </div>
  </div>
)}
          </div>
        )}

      </div>
    </div>
  );
}
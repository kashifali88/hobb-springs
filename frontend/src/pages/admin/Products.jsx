import React, { useEffect, useState } from 'react'
import AdminMenu from '../../components/admin/AdminMenu';
import Spinner from '../../components/Spinner';
import Card from '../../components/Card';
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null);

  // fetch all products
  const getAllProducts = async () => {
    try {
      setLoading(false);
      setError(null);
       const res = await fetch('/api/products/get-products');
    const data = await res.json();
    if (!res.ok || data.success === false) {
      setError(data.message)
    }
    setProducts(data.products)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
   
  }

  useEffect(() => {
    getAllProducts();
  },[])

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>

      {/* SIDEBAR */}
      <div className=' bg-gray-50 h-80 md:h-screen border-r-2 border-gray-300 p-4'>
        <AdminMenu />
      </div>

      {/* MAIN CONTENT */}
      <div className='flex-1 p-6'>
        <h1 className='text-2xl font-bold mb-4'>All Products List</h1>

        {loading ? (
          <div className='flex items-center justify-center'>
            <Spinner />
          </div>
        ): error ? (
          <p className='text-sm text-red-500'>{error}</p>
        ) : (
       <>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {products.map((product) => (
          <Card product={product} key={product._id} />
        ))}
        </div>
        </>

      )}
      </div>

    </div>
  )
}
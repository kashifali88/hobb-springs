import React from 'react'

export default function CategoryForm({handleSubmit, value, setValue}) {
  return (
    <form onSubmit={handleSubmit}>
        <div>
            <input type="text" className='p-2 outline-none rounded-lg border border-gray-300'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder='Enter new category' />
        </div>
        <button type='submit' className='mt-2 px-2 py-1 text-sm rounded-md bg-blue-500 text-white'>Submit</button>
    </form>
  )
}



import { Product } from '@renderer/common/types'
import { ChangeEvent, FormEvent, useRef } from 'react'

interface Props {
  data: Partial<Product>
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleSubmit: (e: FormEvent) => void
  type: 'edit' | 'add'
}
export default function ProductForm({ data, handleChange, handleSubmit, type }: Props) {
  return (
    <form className="flex flex-col gap-2 mt-5" onSubmit={handleSubmit}>
      <div className="flex flex-col border-2 border-solid border-gray-400">
        <label htmlFor="name" className="font-bold">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleChange}
          className="bg-gray-300"
        />
      </div>
      <div className="flex flex-col border-2 border-solid border-gray-400">
        <label htmlFor="description className='font-bold'">Description</label>
        <input
          type="text"
          name="description"
          value={data.description}
          onChange={handleChange}
          className="bg-gray-300"
        />
      </div>
      <div className="flex flex-col border-2 border-solid border-gray-400">
        <label htmlFor="price" className="font-bold">
          Price
        </label>
        <input
          type="number"
          name="price"
          value={data.price}
          onChange={handleChange}
          className="bg-gray-300"
        />
      </div>
      <div className="flex flex-col border-2 border-solid border-gray-400">
        <label htmlFor="showInScreen" className="font-bold">
          Show in screen
        </label>
        <select
          name="showInScreen"
          onChange={handleChange}
          className="bg-gray-300"
          value={data && data.showInScreen !== undefined ? String(data.showInScreen) : ''}
        >
          <option value=""> Select and option</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <button
        className="border-2 border-solid border-black rounded-md p-1 hover:bg-[rgba(0,0,0,.1)]"
        type="submit"
      >
        {type === 'add' ? 'Add product' : 'Edit product'}
      </button>
    </form>
  )
}

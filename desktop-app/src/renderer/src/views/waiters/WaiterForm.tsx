import { Waiter } from '@renderer/common/types'
import { ChangeEvent, FormEvent } from 'react'

interface Props {
  data: Partial<Waiter>
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: FormEvent) => void
  type: 'edit' | 'add'
}
export default function WaiterForm({ data, handleChange, handleSubmit, type }: Props) {
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
        <label htmlFor="lastName" className="font-bold">
          Last name
        </label>
        <input
          type="text"
          name="lastName"
          value={data.lastName}
          onChange={handleChange}
          className="bg-gray-300"
        />
      </div>
      <button
        className="border-2 border-solid border-black rounded-md p-1 hover:bg-[rgba(0,0,0,.1)]"
        type="submit"
      >
        {type === 'add' ? 'Add waiter' : 'Edit waiter'}
      </button>
    </form>
  )
}

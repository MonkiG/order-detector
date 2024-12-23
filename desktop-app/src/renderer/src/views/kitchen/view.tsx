import BackButton from '@renderer/common/components/BackButton'
import NoData from '@renderer/common/components/NoData'
import { useAppContext } from '@renderer/common/context/AppContext'

import useSocket from '@renderer/common/hooks/useSocket'
import { useEffect, useRef, useState } from 'react'

interface Product {
  uiId: string
  id: string

  table: string
  waiter: string
  name: string
  notes: string | null
}

const socketHandler = (
  set: React.Dispatch<React.SetStateAction<Product[]>>,
  data: Product[] | Product
): void => {
  if (Array.isArray(data)) {
    set((prev) => [...prev, ...data])
  } else {
    set((prev) => [...prev, data])
  }
}

export default function KitchenView(): React.JSX.Element {
  const blackList = useRef<string[]>([]).current
  const socketData = useSocket<Product[], Product[]>({
    event: 'kitchen-products',
    defaultData: [],
    handler: socketHandler
  })

  const { getProductById, getWaiterById } = useAppContext()
  const [data, setData] = useState<Product[]>([])

  const handleDelete = (uiId: string) => (): void => {
    setData((prev) => prev.filter((product) => product.uiId !== uiId))
    blackList.push(uiId)
  }

  useEffect(() => {
    setData(socketData.filter((x) => !blackList.includes(x.uiId)))
  }, [socketData])

  const parsedData = data.map((x) => ({
    ...x,
    name: getProductById(x.id)!.name,
    waiter: getWaiterById(x.waiter)!.name
  }))
  return (
    <div className="bg-[#f5c84c] h-screen flex flex-col">
      {/* Header Section */}
      <div className="relative p-5">
        <BackButton className="absolute top-5 left-2 text-white" />
        <h2 className="text-center text-4xl font-bold text-white">Kitchen Orders</h2>
      </div>

      {/* Content Section */}
      <div className="h-full px-5 pb-5 flex flex-col overflow-y-auto">
        {parsedData && parsedData.length > 0 ? (
          parsedData.map((p, i) => (
            <div
              key={p.id + i}
              className="bg-white p-4 rounded-lg shadow-lg mb-4 border border-gray-300"
            >
              <div className="flex justify-between items-start">
                {/* Product Information (Name, Table, Waiter) */}
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-700">
                    {p.name || 'Product name'}
                  </h3>
                  <h4 className="text-lg text-gray-600">Table: {p.table}</h4>
                  <h4 className="text-lg text-gray-600">Waiter: {p.waiter}</h4>
                </div>
                {/* Product ID */}
                <div className="flex flex-col items-center justify-center">
                  <span className="font-bold text-gray-800">ID: {p.id}</span>
                </div>
              </div>

              {/* Notes Section */}
              <div className="mt-2">
                {p.notes && (
                  <p className="text-sm text-gray-500">
                    <strong>Notes:</strong>{' '}
                    {p.notes.length > 100 ? `${p.notes.slice(0, 100)}...` : p.notes}
                  </p>
                )}
              </div>

              {/* Delete Button */}
              <div className="mt-4 text-right">
                <button
                  onClick={handleDelete(p.uiId)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <NoData type="kitchen" dataName="products" className="h-full p-0 my-0" />
        )}
      </div>
    </div>
  )
}

/**
 *  const data = useSocket<Product[]>({
    event: 'kitchen-products',
    defaultData: [],
    handler: socketHandler
  })
 */

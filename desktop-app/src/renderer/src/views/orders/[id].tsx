import ViewLayout from '@renderer/common/layouts/ViewLayout'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'wouter'
import { getOrder } from './services'
import { useAppContext } from '@renderer/common/context/AppContext'
import { Product, Waiter } from '@renderer/common/types'
import { parseDate } from '@renderer/common/utils/date'

export interface OrderDetails {
  id: string
  waiter: string
  table: string
  status: boolean
  createdAt: string
  updatedAt: string
  products: string[]
  open: boolean
  notes: string // Agregado
}

export interface OrderDetailsView {
  id: string
  waiter: Waiter
  table: string
  status: boolean
  createdAt: string
  updatedAt: string
  products: Product[]
  open: boolean
  notes: string // Agregado
}
export default function OrderDetailsView(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<OrderDetailsView>()
  const { getProductById, getWaiterById, state } = useAppContext()

  const parseId = id.slice(-6)

  console.log(id)
  useEffect(() => {
    getOrder(id).then((tuple) => {
      const [err, dbData] = tuple
      if (err) {
        console.log(err)
        return
      }
      const waiter = getWaiterById(dbData.waiter)!
      const products = dbData.products.map((x) => getProductById(x)!)

      console.log(waiter, products, state)
      setData({
        ...dbData,
        waiter,
        products
      })
    })
  }, [])

  const getPartialPrice = useMemo(() => {
    if (!data || !data.products) return 0
    return data.products.reduce((total, product) => (total += Number(product.price)), 0)
  }, [data])

  return (
    <ViewLayout viewTitle={`Order: ${parseId}`}>
      <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500">Id</span>
            <span className="text-lg text-gray-800">{data && data.id}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500">Waiter</span>
            <span className="text-lg text-gray-800">{data && data.waiter.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500">Table</span>
            <span className="text-lg text-gray-800">{data && data.table}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500">Partial</span>
            <span className="text-lg text-gray-800">${data && getPartialPrice}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500">Status</span>
            <span
              className={`text-lg font-medium ${data && data.open ? 'text-green-600' : 'text-red-600'}`}
            >
              {data && data.open ? 'Open' : 'Closed'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500">Notes</span>
            <span className="text-lg text-gray-800"> {data?.notes || 'No notes available'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500">Created At</span>
            <span className="text-lg text-gray-800">{data && parseDate(data.createdAt)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500">Updated At</span>
            <span className="text-lg text-gray-800">{data && parseDate(data.updatedAt)}</span>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Products</h3>
          <div className="max-h-48 overflow-auto border border-gray-200 rounded-md p-2">
            <ul className="list-inside flex flex-wrap max-w-full gap-1">
              {data &&
                data.products.map((product, index) => (
                  <li key={index} className="text-gray-700">
                    <strong>*</strong>
                    {product.name}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </ViewLayout>
  )
}

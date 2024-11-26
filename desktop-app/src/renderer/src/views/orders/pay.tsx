import ViewLayout from '@renderer/common/layouts/ViewLayout'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'wouter'
import { getOrder, payOrder } from './services'
import { useAppContext } from '@renderer/common/context/AppContext'

import { OrderDetailsView } from './[id]'

export default function OrderPayView(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<OrderDetailsView>()
  const { getProductById, getWaiterById } = useAppContext()
  const [, redirect] = useLocation()

  const parseId = id.slice(-6)

  useEffect(() => {
    getOrder(id).then((tuple) => {
      const [err, dbData] = tuple
      if (err) {
        console.log(err)
        return
      }
      setData({
        ...dbData,
        waiter: getWaiterById(dbData.waiter)!,
        products: dbData.products.map((x) => getProductById(x)!)
      })
    })
  }, [id])

  const getPartialPrice = useMemo(() => {
    if (!data || !data.products) return 0
    return data.products.reduce((total, product) => (total += Number(product.price)), 0)
  }, [data])

  const calculateTax = (amount: number): number => amount * 0.1 // Ejemplo de 10% de impuesto
  const calculateTotal = (amount: number, tax: number): number => amount + tax

  const partialPrice = getPartialPrice
  const taxAmount = calculateTax(partialPrice)
  const totalPrice = calculateTotal(partialPrice, taxAmount)

  const handleCancel = (): void => {
    redirect('/orders')
  }

  const handlePay = (): void => {
    payOrder(id).then((tuple) => {
      const [err, data] = tuple
      if (err) {
        console.log(err)
      }
      console.log(data)
      redirect('/orders')
    })
  }
  return (
    <ViewLayout viewTitle={`Pay Order: ${parseId}`}>
      <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Payment</h2>

        {/* Order Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-1">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500">Waiter</span>
            <span className="text-lg text-gray-800">{data && data.waiter.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500">Table</span>
            <span className="text-lg text-gray-800">{data && data.table}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500">Status</span>
            <span
              className={`text-lg font-medium ${data && data.open ? 'text-green-600' : 'text-red-600'}`}
            >
              {data && data.open ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        {/* Products List */}

        <div className="mt-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Products</h3>
          <div className="max-h-20 overflow-auto border border-gray-200 rounded-md p-2">
            <ul className="list-disc list-inside">
              {data &&
                data.products.map((product, index) => (
                  <li key={index} className="text-gray-700">
                    {product.name} - ${product.price.toFixed(2)}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-500">Subtotal</span>
            <span className="text-lg text-gray-800">${partialPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-500">Tax (10%)</span>
            <span className="text-lg text-gray-800">${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-sm font-semibold text-gray-500">Total</span>
            <span className="text-lg font-bold text-gray-800">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Notes */}
        {data && data.notes && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Notes</h3>
            <div className="bg-gray-100 border border-gray-300 rounded-md p-4 max-h-48 overflow-auto">
              <p className="text-gray-700 whitespace-pre-wrap">{data.notes}</p>
            </div>
          </div>
        )}

        {/* Payment Actions */}
        <div className="mt-6 flex justify-between">
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            onClick={handlePay}
          >
            Pay Now
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </ViewLayout>
  )
}

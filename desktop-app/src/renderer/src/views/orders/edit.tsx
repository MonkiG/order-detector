import ViewLayout from '@renderer/common/layouts/ViewLayout'
import { useEffect, useState } from 'react'
import { useParams } from 'wouter'
import { getOrder, updateOrder } from './services'
import { useAppContext } from '@renderer/common/context/AppContext'
import { OrderDetailsView } from './[id]'

export default function OrderEditView(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<OrderDetailsView | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { getProductById, getWaiterById, state } = useAppContext()

  useEffect(() => {
    getOrder(id).then((tuple) => {
      const [err, dbData] = tuple
      if (err) {
        console.error(err)
        return
      }
      const waiter = getWaiterById(dbData.waiter)!
      const products = dbData.products.map((x) => getProductById(x)!)

      setData({
        ...dbData,
        waiter,
        products
      })
    })
  }, [id, getProductById, getWaiterById])

  const handleChange = (field: keyof OrderDetailsView, value: string | boolean): void => {
    setData((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleAddProduct = (productId: string): void => {
    if (!data) return
    const product = getProductById(productId)
    if (!product) return
    setData((prev) => (prev ? { ...prev, products: [...prev.products, product] } : null))
  }

  const handleRemoveProduct = (productId: string): void => {
    if (!data) return
    setData((prev) =>
      prev
        ? { ...prev, products: prev.products.filter((product) => product.id !== productId) }
        : null
    )
  }

  const handleSave = (): Promise<void> | void => {
    if (!data) return
    setIsSaving(true)
    updateOrder(data.id, {
      table: data.table,
      open: data.open,
      notes: data.notes,
      products: data.products.map((product) => product.id) // Guardamos solo los IDs
    }).then((tuple) => {
      const [err] = tuple
      if (err) {
        console.error(err)
      } else {
        alert('Order updated successfully!')
      }
      setIsSaving(false)
    })
  }

  return (
    <ViewLayout viewTitle={`Edit Order: ${id.slice(-6)}`}>
      {data ? (
        <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Order</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-500">Table</label>
              <input
                type="text"
                value={data.table}
                onChange={(e) => handleChange('table', e.target.value)}
                className="text-lg text-gray-800 border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-500">Status</label>
              <select
                value={data.open ? 'open' : 'closed'}
                onChange={(e) => handleChange('open', e.target.value === 'open')}
                className="text-lg text-gray-800 border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-500">Notes</label>
              <textarea
                value={data.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="text-lg text-gray-800 border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Products</h3>
            <div className="max-h-48 overflow-auto border border-gray-200 rounded-md p-2">
              <ul className="list-inside flex flex-wrap max-w-full gap-1">
                {data.products.map((product) => (
                  <li key={product.id} className="text-gray-700 flex items-center gap-2">
                    <strong>*</strong>
                    {product.name}
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-500">Add Product</h4>
              <select
                onChange={(e) => handleAddProduct(e.target.value)}
                className="w-full mt-2 border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="">Select a product</option>
                {state.products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleSave}
              className={`px-4 py-2 text-white rounded-md ${
                isSaving ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </ViewLayout>
  )
}

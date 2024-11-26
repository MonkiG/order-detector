import NoData from '@renderer/common/components/NoData'
import useSocket from '@renderer/common/hooks/useSocket'
import ViewLayout from '@renderer/common/layouts/ViewLayout'
import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { Link } from 'wouter'
import { getAllOrders } from './services'
import { useAppContext } from '@renderer/common/context/AppContext'

export interface Order {
  id: string
  waiter: string
  table: string
  products: string
  notes: string | null
  open: boolean // Se asume que existe este campo
}

const socketHandler = (
  set: React.Dispatch<React.SetStateAction<Order[]>>,
  newOrder: Order
): void => {
  set((prev) => {
    // Buscar si la orden ya existe por ID
    const orderIndex = prev.findIndex((order) => order.id === newOrder.id)

    if (orderIndex !== -1) {
      // Si la orden existe, actualiza la orden con los nuevos datos
      const updatedOrders = [...prev]
      updatedOrders[orderIndex] = newOrder
      return updatedOrders
    } else {
      // Si la orden no existe, la agrega como nueva
      return [...prev, newOrder]
    }
  })
}

export default function OrdersView(): JSX.Element {
  const [data, setData] = useState<Order[]>([])
  const [filterOpen, setFilterOpen] = useState<boolean | null>(true) // Para filtrar por estado `open`
  const { getWaiterById } = useAppContext()

  useEffect(() => {
    getAllOrders().then((tuple) => {
      const [err, data] = tuple
      if (err) {
        console.log(err)
        return
      }
      console.log(data)
      setData(data) // Asignamos los datos iniciales
    })
  }, [])

  // Pasamos el estado `data` al custom hook `useSocket`
  const socketData = useSocket<Order[], Order>({
    event: 'orders',
    defaultData: data, // Inicializamos con los datos cargados
    handler: socketHandler
  })

  // Usamos `socketData` como el conjunto final de datos
  const displayData = [...data, ...socketData]

  const getWaiterNameById = (id: string): string => getWaiterById(id)!.name

  // Filtrar las órdenes según el estado 'open'
  const filteredData =
    filterOpen === null ? displayData : displayData.filter((order) => order.open === filterOpen)

  return (
    <ViewLayout viewTitle="Orders">
      <Toaster richColors position="top-right" closeButton />

      {/* Botones para cambiar el filtro */}
      <div className="mb-1">
        <button
          className={`px-4 py-1 mr-2 text-white rounded-md ${filterOpen === true ? 'bg-blue-500' : 'bg-gray-500'}`}
          onClick={() => setFilterOpen(true)}
        >
          Open Orders
        </button>
        <button
          className={`px-4 py-1  mr-2 text-white rounded-md ${filterOpen === false ? 'bg-red-500' : 'bg-gray-500'}`}
          onClick={() => setFilterOpen(false)}
        >
          Closed Orders
        </button>
        <button
          className={`px-4 py-1 text-white rounded-md ${filterOpen === null ? 'bg-gray-600' : 'bg-gray-500'}`}
          onClick={() => setFilterOpen(null)}
        >
          All Orders
        </button>
      </div>

      {/* Lista de órdenes */}
      {filteredData.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredData.map((o) => (
            <div
              key={o.id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800">Table: {o.table}</h2>
                <p className="text-gray-600">Waiter: {getWaiterNameById(o.waiter)}</p>
              </div>
              <div className="flex justify-between items-center gap-4">
                <Link
                  href={`/order/${o.id}`}
                  className="text-white bg-blue-500 hover:bg-blue-600 transition-colors rounded-md px-4 py-2 text-sm font-medium"
                >
                  See details
                </Link>
                <Link
                  href={`/order/pay/${o.id}`}
                  className="text-white bg-green-500 hover:bg-green-600 transition-colors rounded-md px-6 py-2 text-sm font-medium"
                >
                  Pay
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full">
          <NoData dataName="orders" />
        </div>
      )}
    </ViewLayout>
  )
}

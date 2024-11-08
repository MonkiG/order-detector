import BackButton from '@renderer/common/components/BackButton'
import NoData from '@renderer/common/components/NoData'
import { useEffect, useState } from 'react'
import { socket } from '@renderer/common/utils/socket'

interface Product {
  id: string
  table: string
  waiter: string
  name: string
  amount: number | string
  notes: string | null
}

export default function KitchenView(): React.JSX.Element {
  const [data, setData] = useState<Product[]>([])

  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err)
    })

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
    })

    socket.on('kitchen-products', (data: Product[]) => {
      setData((prev) => [...prev, ...data])
    })

    return (): void => {
      socket.off('connect')
      socket.off('connect_error')
      socket.off('disconnect')
      socket.off('kitchen-products')
      socket.disconnect()
    }
  }, [])
  /**
   * TODO: Arreglar los estilos de esta mamada
   * */
  return (
    <div className="bg-white h-screen flex flex-col justify-between">
      <div className="relative p-5">
        <BackButton className="absolute top-5 left-2" />
        <h2 className="text-center text-4xl font-bold">Products</h2>
      </div>
      <div className="h-full px-5 pb-5 flex flex-col ">
        {data && data.length > 0 ? (
          data.map((p) => (
            <div
              key={p.id}
              className="flex justify-between border-b-2 border-solid border-black p-2"
            >
              <div className="flex flex-col items center justify-center">
                <h2 className="font-semibold">Table: {p.table}</h2>
                <h2 className="font-semibold">Waiter: {p.waiter}</h2>
              </div>
              <div className="flex flex-col items center justify-center">{p.name}</div>
              <div className="flex flex-col items center justify-center">
                <h2 className="font-semibold">Amount: {p.amount}</h2>
                {p.notes && <h2 className="font-semibold">Notes: {p.notes}</h2>}
                {/**TODO: Manejar las notas que son muy largas */}
              </div>
            </div>
          ))
        ) : (
          <NoData dataName="products" className="h-full p-0 my-0" />
        )}
      </div>
    </div>
  )
}

import NoData from '@renderer/common/components/NoData'
//import Table from '@renderer/common/components/Table'
import useSocket from '@renderer/common/hooks/useSocket'
import ViewLayout from '@renderer/common/layouts/ViewLayout'
import { Toaster } from 'sonner'
import { Link } from 'wouter'

export interface Order {
  id: string
  waiter: string
  table: string
  products: string
  details: string
}

const placeholderData: Order[] = [
  {
    id: '1',
    waiter: 'John Doe',
    table: '5',
    products: 'Pizza, Coke',
    details: 'No cheese on the pizza'
  },
  {
    id: '2',
    waiter: 'Jane Smith',
    table: '3',
    products: 'Burger, Fries',
    details: 'Extra ketchup'
  },
  {
    id: '3',
    waiter: 'Mike Johnson',
    table: '8',
    products: 'Salad, Water',
    details: 'Dressing on the side'
  }
]

export default function OrdersView(): JSX.Element {
  const { data } = useSocket<Order>('orders', undefined, placeholderData)
  /**
   * TODO:
   * - Modifcar la tabla para redirigir a editar y ver details
   * - Crear un estado del componente para poder editar la view cuando se edite la orden
   * */
  //const noShow = ['id']

  return (
    <ViewLayout viewTitle="Orders">
      <Toaster richColors position="top-right" closeButton />
      <div className="mt-12">
        {data && data.length > 0 ? (
          data.map((o) => (
            <div
              key={o.id}
              className="border-2 border-solid border-black flex justify-between p-5 my-1"
            >
              <div>
                <h2>Table: {o.table}</h2>
                <h2>Waiter : {o.waiter}</h2>
              </div>
              <div className="flex justify-between items-center gap-5">
                <Link
                  href={`/orders/${o.id}`}
                  className="p-1 px-5 hover:bg-[rgba(0,0,0,0.1)] border-2 border-solid border-black rounded-md"
                >
                  See details
                </Link>
                <Link
                  href={`/orders/pay/${o.id}`}
                  className="p-1 px-12 hover:bg-[rgba(0,0,0,0.1)] border-2 border-solid border-black rounded-md"
                >
                  Pay
                </Link>
              </div>
            </div>
          ))
        ) : (
          <NoData dataName={'orders'} />
        )}
      </div>
    </ViewLayout>
  )
}

/**
 * <Table<Order>
            data={data}
            noShow={noShow as Array<keyof Order>}
            handleDelete={(id: string) => () => {
              console.log('Order eliminada vieja: ' + id)
            }}
            route="orders"
          />
 */

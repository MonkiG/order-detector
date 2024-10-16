import BackButton from '@renderer/common/components/BackButton'
import NoData from '@renderer/common/components/NoData'
import useSocket from '@renderer/common/hooks/useSocket'

interface Product {
  table: string
  waiter: string
  name: string
  amount: number | string
  notes: string
}

const placeHolder: Product[] = [
  {
    table: '1',
    waiter: 'Alice Johnson',
    name: 'Spaghetti Bolognese',
    amount: 2,
    notes: 'Extra sauce, no cheese'
  },
  {
    table: '2',
    waiter: 'Bob Smith',
    name: 'Caesar Salad',
    amount: 1,
    notes: 'No croutons, add chicken'
  },
  {
    table: '3',
    waiter: 'Carla Brown',
    name: 'Margarita Pizza',
    amount: 3,
    notes: 'Extra cheese, half with mushrooms'
  },
  {
    table: '4',
    waiter: 'David Lee',
    name: 'Grilled Salmon',
    amount: '1',
    notes: 'Lemon on the side, no butter'
  },
  {
    table: '5',
    waiter: 'Eva Green',
    name: 'Cheeseburger',
    amount: 2,
    notes: 'No onions, extra pickles'
  }
]
export default function KitchenView() {
  const { data } = useSocket<Product[]>('products', undefined, placeHolder)

  /**
   * TODO: Arreglar los estilos de esta mamada
   * */
  return (
    <div className="bg-white h-screen">
      <div className="relative p-5">
        <BackButton className="absolute top-5 left-2" />
        <h2 className="text-center text-4xl font-bold">Products</h2>
      </div>
      <div>
        {data && data.length > 0 ? (
          data.map((p) => (
            <div className="flex justify-between">
              <div className="flex flex-col items center justify-center">
                <h2>Table: {p.table}</h2>
                <h2>Waiter: {p.waiter}</h2>
              </div>
              <div className="flex flex-col items center justify-center">{p.name}</div>
              <div className="flex flex-col items center justify-center">
                <h2>Amount: {p.amount}</h2>
                <h2> Notes: {p.notes}</h2> {/**TODO: Manejar las notas que son muy largas */}
              </div>
            </div>
          ))
        ) : (
          <NoData dataName="products" />
        )}
      </div>
    </div>
  )
}

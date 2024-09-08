import ViewLayout from '@renderer/common/layouts/ViewLayout'
import Table from './components/Table'
import useProducts from '@renderer/common/hooks/useProducts'
import { Link } from 'wouter'
import { Routes } from '@renderer/common/utils/routes'
import { useState } from 'react'
export default function ProductsView() {
  /**
   * TODO: Add a global state in order to avoid weird stuff 🤮
   */
  const [deleted, setDeleted] = useState(false)
  const { products } = useProducts(deleted)
  const handleDeleted = (state: boolean) => {
    setDeleted(state)
  }

  return (
    <ViewLayout viewTitle="Menu Products">
      <div className="flex justify-end ">
        <Link
          to={Routes.addProduct}
          className="border-2 border-solid border-black rounded-md p-1 hover:bg-[rgba(0,0,0,.1)]"
        >
          Add a new product
        </Link>
      </div>
      {products.length > 0 ? (
        <Table setDeleted={handleDeleted} data={products} />
      ) : (
        <h2>Unable to get products</h2>
      )}
    </ViewLayout>
  )
}

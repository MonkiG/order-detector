import ViewLayout from '@renderer/common/layouts/ViewLayout'
import Table from '@renderer/common/components/Table'
import { Link } from 'wouter'
import { Routes } from '@renderer/common/utils/routes'
import { useAppContext } from '@renderer/common/context/AppContext'
import { toast, Toaster } from 'sonner'
import { Product } from '@renderer/common/types'
import { deleteProductById } from './services'
import NoData from '@renderer/common/components/NoData'

export default function ProductsView(): JSX.Element {
  const { state, dispatch } = useAppContext()

  const handleDelete = (id: string) => (): void => {
    toast.warning('This item would be deleted permantly, do you want to continue?', {
      duration: Infinity,
      action: {
        label: 'Delete',
        onClick: async () => {
          await deleteProductById(id)
          dispatch({ type: 'DELETE_PRODUCT', payload: { id } })
        }
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {}
      }
    })
  }

  const dict = {
    showInScreen: 'Show'
  }
  const noShow = ['id']

  return (
    <ViewLayout viewTitle="Menu Products">
      <Toaster richColors position="top-right" closeButton />

      <div className="flex justify-end ">
        <Link
          to={Routes.addProduct}
          className="border-2 border-solid border-black rounded-md p-1 hover:bg-[rgba(0,0,0,.1)]"
        >
          Add a new product
        </Link>
      </div>
      {state.products.length > 0 ? (
        <Table<Product>
          handleDelete={handleDelete}
          route="products"
          dict={dict}
          noShow={noShow as Array<keyof Product>}
          data={state.products}
        />
      ) : (
        <NoData dataName="products" />
      )}
    </ViewLayout>
  )
}

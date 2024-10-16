import Table from '@renderer/common/components/Table'
import { useAppContext } from '@renderer/common/context/AppContext'
import ViewLayout from '@renderer/common/layouts/ViewLayout'
import { Waiter } from '@renderer/common/types'
import { Routes } from '@renderer/common/utils/routes'
import { toast, Toaster } from 'sonner'
import { Link } from 'wouter'
import { deleteWaiterById } from './services'
import NoData from '@renderer/common/components/NoData'

export default function WaitersView() {
  const { state, dispatch } = useAppContext()

  const dict: Partial<Record<keyof Waiter, string>> = {
    lastName: 'last name',
    createdAt: 'created date',
    updatedAt: 'updated date'
  }

  const noShow = ['id']

  const handleDelete = (id: string) => () => {
    toast.warning('This item would be deleted permantly, do you want to continue?', {
      duration: Infinity,
      action: {
        label: 'Delete',
        onClick: async () => {
          await deleteWaiterById(id)
          dispatch({ type: 'DELETE_WAITER', payload: { id } })
        }
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {}
      }
    })
  }
  return (
    <ViewLayout viewTitle="Restaurant's waiters">
      <Toaster richColors position="top-right" closeButton />
      <div className="flex justify-end ">
        <Link
          to={Routes.addWaiter}
          className="border-2 border-solid border-black rounded-md p-1 hover:bg-[rgba(0,0,0,.1)]"
        >
          Add a new waiter
        </Link>
      </div>
      {state.waiters.length > 0 ? (
        <Table<Waiter>
          data={state.waiters}
          dict={dict}
          route={'waiters'}
          handleDelete={handleDelete}
          noShow={noShow as Array<keyof Waiter>}
        />
      ) : (
        <NoData dataName="waiters" />
      )}
    </ViewLayout>
  )
}

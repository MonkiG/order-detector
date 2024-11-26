import ViewLayout from '@renderer/common/layouts/ViewLayout'
import WaiterForm from '../WaiterForm'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Waiter } from '@renderer/common/types'
import { toast, Toaster } from 'sonner'
import { useAppContext } from '@renderer/common/context/AppContext'
import { useLocation, useParams } from 'wouter'
import { Routes } from '@renderer/common/utils/routes'
import { editWaiterById } from '../services'

export default function EditWaiterView(): JSX.Element {
  const { id } = useParams()
  const [, redirect] = useLocation()
  const [waiter, setWaiter] = useState<Waiter | null>(null)

  const { getWaiterById, dispatch } = useAppContext()

  useEffect(() => {
    if (!id) return

    const waiter = getWaiterById(id)

    if (!waiter) {
      toast.error('Error getting the waiter to edit, try later')
      return
    }

    setWaiter(waiter)
  }, [id])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    const parsedValue = value === 'true' ? true : value === 'false' ? false : value
    setWaiter((prev) => (prev ? { ...prev, [name]: parsedValue } : null))
  }

  const handleSubmit = (e: FormEvent): void => {
    const { id, ...dataToSend } = waiter!
    e.preventDefault()

    if (!waiter) return

    editWaiterById(id!, dataToSend).then((tuple) => {
      const [err, data] = tuple

      if (err && err.message === 'Server error') {
        toast.error('Error editting the waiter, try later!', { duration: Infinity })
        return
      }

      dispatch({ type: 'EDIT_WAITER', payload: { id: id!, waiter: { ...data } } })
      redirect(Routes.waiters)
    })
  }

  return (
    <ViewLayout viewTitle="Edit waiter - ">
      <Toaster closeButton richColors position="top-right" />
      {waiter ? (
        <WaiterForm
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          type="edit"
          data={waiter}
        />
      ) : (
        <h2>Error retrieving the waiter</h2>
      )}
    </ViewLayout>
  )
}

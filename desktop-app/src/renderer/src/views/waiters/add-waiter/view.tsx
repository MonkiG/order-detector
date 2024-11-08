import ViewLayout from '@renderer/common/layouts/ViewLayout'
import WaiterForm from '../WaiterForm'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useLocation } from 'wouter'
import { Routes } from '@renderer/common/utils/routes'
import { toast, Toaster } from 'sonner'
import { useAppContext } from '@renderer/common/context/AppContext'
import { addWaiter } from '../services'

export default function AddWaiterView(): JSX.Element {
  const [, redirect] = useLocation()
  const { dispatch } = useAppContext()
  const [data, setData] = useState({
    name: '',
    lastName: ''
  })

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    const unfilledField = Object.values(data).some((x) => x === '')
    if (unfilledField) {
      toast.warning('You must fill all fields')
      return
    }

    addWaiter(data).then((tuple) => {
      const [err, waiter] = tuple
      if (err) {
        console.log(err)
        toast.error('Error adding the waiter, try later!', { duration: Infinity })
        return
      }

      dispatch({
        type: 'ADD_WAITER',
        payload: {
          waiter: {
            ...data,
            ...waiter
          }
        }
      })
      redirect(Routes.waiters)
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <ViewLayout viewTitle="Add a waiter">
      <Toaster closeButton richColors position="top-right" />
      <WaiterForm handleSubmit={handleSubmit} data={data} type="add" handleChange={handleChange} />
    </ViewLayout>
  )
}

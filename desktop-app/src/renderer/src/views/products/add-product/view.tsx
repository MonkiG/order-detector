import ViewLayout from '@renderer/common/layouts/ViewLayout'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useLocation } from 'wouter'
import { addProduct } from '../services'
import { toast, Toaster } from 'sonner'
import { Routes } from '@renderer/common/utils/routes'
import ProductForm from '../ProductForm'
import { useAppContext } from '@renderer/common/context/AppContext'

export default function AddProductView() {
  const [, redirect] = useLocation()
  const [data, setData] = useState({
    name: '',
    price: 0,
    description: '',
    showInScreen: true
  })

  const { dispatch } = useAppContext()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const unfilledField = Object.values(data).some((x) => x === '' || x === 0)
    if (unfilledField) {
      toast.warning('You must fill all fields')
      return
    }

    addProduct(data).then((tuple) => {
      const [err, product] = tuple
      if (err && err.message === 'Server error') {
        toast.error('Error adding the product, try later!', { duration: Infinity })
        return
      }
      dispatch({ type: 'ADD_PRODUCT', payload: { product: { ...data, id: product.id } } })
      redirect(Routes.products)
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <ViewLayout viewTitle={'Add product'}>
      <Toaster richColors closeButton position="top-right" />
      <ProductForm type="add" data={data} handleChange={handleChange} handleSubmit={handleSubmit} />
    </ViewLayout>
  )
}

import ViewLayout from '@renderer/common/layouts/ViewLayout'
import { useLocation, useParams } from 'wouter'
import { editProductById } from '../services'
import { toast, Toaster } from 'sonner'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import ProductForm from '../ProductForm'
import { Product } from '@renderer/common/types'
import { Routes } from '@renderer/common/utils/routes'
import { useAppContext } from '@renderer/common/context/AppContext'

export default function EditProductView() {
  const { id } = useParams()
  const [, redirect] = useLocation()
  const { getProductById, dispatch } = useAppContext()
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (!id) return

    const product = getProductById(id)

    if (!product) {
      toast.error('Error getting the product to edit, try later')
      return
    }

    setProduct(product)
  }, [id])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProduct((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!product) return

    editProductById(id!, product).then((tuple) => {
      const [err] = tuple
      if (err && err.message === 'Server error') {
        toast.error('Error adding the product, try later!', { duration: Infinity })
        return
      }
      dispatch({ type: 'EDIT_PRODUCT', payload: { id: id!, product: product } })
      redirect(Routes.products)
    })
  }
  return (
    <ViewLayout viewTitle={`Edit product - ${product && product.name}`}>
      <Toaster closeButton richColors position="top-right" />
      {product ? (
        <ProductForm
          type="edit"
          data={product}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      ) : (
        <h2>Error retrieving the product</h2>
      )}
    </ViewLayout>
  )
}

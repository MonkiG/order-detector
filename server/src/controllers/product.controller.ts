import { Router } from 'express'
import isValidId from '../adapters/isValidId'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getById,
  updateProduct
} from '../services/product.services'

const router = Router()

/* Get all items */
router.get('/', async (_, res) => {
  const [err, data] = await getAllProducts()
  if (err)
    return res.status(500).json({ message: 'Server error', error: err.message })

  return res.status(200).json(data)
})

/* Get a single item by ID */
router.get('/:id', async (req, res) => {
  const { id } = req.params
  const [err, parsedId] = isValidId(id)
  if (err)
    return res
      .status(400)
      .json({ message: 'invalid id format, must be an objectId' })

  const [error, product] = await getById(parsedId!)
  if (error && error.message === 'Product not found')
    return res.status(404).json({ message: "Product don't found" })

  return res.status(200).json(product)
})

/* Create a new item */
router.post('/', async (req, res) => {
  const product = req.body
  const [error, data] = await createProduct(product)
  if (
    error &&
    error.message === 'Product intersert but unable to retrieve data'
  )
    return res.status(204).send()

  if (error)
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })

  return res.redirect(`/product/${data!.id}`)
})

/* Update an existing item by ID */
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const productToUpdate = req.body
  const [err, parsedId] = isValidId(id)
  if (err)
    return res
      .status(400)
      .json({ message: 'invalid id format, must be an objectId' })

  const [error, data] = await updateProduct(parsedId!, productToUpdate)
  if (error && error.message === 'Product not found')
    return res.status(404).json({
      message: 'The product that you want to update doesnt exists',
      error: error.message
    })

  if (
    error &&
    error.message === 'Product intersert but unable to retrieve data'
  )
    return res.status(204).send()

  if (error)
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })

  return res.status(200).json(data)
})

/* Delete an item by ID */
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const [err, parsedId] = isValidId(id)
  if (err)
    return res
      .status(400)
      .json({ message: 'invalid id format, must be an objectId' })

  const [error, productDeleted] = await deleteProduct(parsedId!)
  if (error && error.message === 'Product not found')
    return res.status(400).json({ message: 'Product not found' })
  if (error)
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })

  return res.status(200).json(productDeleted)
})

export default router

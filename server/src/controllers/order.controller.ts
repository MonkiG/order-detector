import { Router } from 'express'
import {
  getAllOrders,
  getById,
  getOrderByTable,
  getOrdersByWaiter,
  updateById
} from './../services/order.services'
import toTable from '../adapters/toTable'
import { ObjectId } from 'mongodb'

const router = Router()

/**
 * Should show all the orders
 */
router.get('/', async (_, res) => {
  const [error, orders] = await getAllOrders()

  if (error && error.message === 'Not found')
    return res.status(404).json({ message: error.message, error: null })

  if (error) return res.status(500).json({ message: 'Server error', error })
  return res.status(200).json(orders)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const parsedId = new ObjectId(id)

  const [error, order] = await getById(parsedId)

  if (error && error.message === 'Not found')
    return res.status(404).json({ message: error.message, error: null })

  if (error) return res.status(500).json({ message: 'Server error', error })
  return res.status(200).json(order)
})

router.patch('/:id', async (req, res) => {
  const { id } = req.params // Extraemos el id de la URL
  const dataToUpdate = req.body // Los datos que se van a actualizar vienen del cuerpo de la solicitud

  // Validar que el id sea un ObjectId válido
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid order ID format' })
    return
  }

  try {
    // Convertimos el id en un ObjectId de MongoDB
    const objectId = new ObjectId(id)

    // Llamamos al servicio para actualizar la orden
    const [error, updatedOrder] = await updateById(objectId, dataToUpdate)
    console.log(error, updatedOrder)
    // Si hay un error al actualizar
    if (error) {
      res
        .status(500)
        .json({ error: 'Failed to update order', details: error.message })
      return
    }

    // Si la orden no se encuentra
    if (!updatedOrder) {
      res.status(404).json({ error: 'Order not found' })
      return
    }

    // Si la actualización fue exitosa
    res
      .status(200)
      .json({ message: 'Order updated successfully', updatedOrder })
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while updating the order',
      details: (error as Error).message
    })
  }
})
/**
 * Should show all the orders given the table
 */
router.get('/by-table/:table', async (req, res) => {
  const { table } = req.params
  const [err, tableParsed] = toTable(table)
  if (err) return res.status(400).json({ message: 'Request error', error: err })

  const [error, order] = await getOrderByTable(tableParsed!)

  if (error && error.message === 'Not found')
    return res.status(404).json({ message: error.message, error: null })

  if (error)
    return res
      .status(500)
      .json({ message: error.message, error: error.message })

  return res.status(200).json(order)
})

/**
 * Should show all the orders given the waiter
 */
router.get('/by-waiter/:waiter', async (req, res) => {
  const { waiter } = req.params

  const [error, order] = await getOrdersByWaiter(waiter)
  if (error && error.message === 'Not found')
    return res.status(404).json({ message: error.message, error: null })

  if (error) return res.status(500).json({ message: 'Server error', error })

  return res.status(200).json(order)
})

export default router

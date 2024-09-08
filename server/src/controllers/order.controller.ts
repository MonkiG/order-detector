import { Router } from 'express'
import {
  getAllOrders,
  getOrderByTable,
  getOrdersByWaiter
} from './../services/order.services'
import toTable from '../adapters/toTable'

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

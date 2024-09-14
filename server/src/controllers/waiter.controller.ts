import { Router } from 'express'
import {
  createWaiter,
  deleteWaiter,
  getAllWaiters,
  getById,
  updateWaiter
} from '../services/waiter.services'

import isValidId from '../adapters/isValidId'

const router = Router()

router.get('/', async (_, res) => {
  const [err, data] = await getAllWaiters()
  if (err)
    return res.status(500).json({ message: 'Server error', error: err.message })

  return res.status(200).json(data)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const [err, parsedId] = isValidId(id)
  if (err)
    return res
      .status(400)
      .json({ message: 'invalid id format, must be an objectId' })

  const [error, waiter] = await getById(parsedId!)
  if (error && error.message === 'Waiter not found')
    return res.status(404).json({ message: "Waiter don't found" })

  return res.status(200).json(waiter)
})

router.post('/', async (req, res) => {
  const waiter = req.body
  const [error, data] = await createWaiter({
    ...waiter,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: null
  })
  if (error && error.message === 'Waiter intersert but unable to retrieve data')
    return res.status(204).send()

  if (error)
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })

  return res.redirect(`/waiter/${data!.id}`)
})

router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const waiterToUpdate = req.body
  const [err, parsedId] = isValidId(id)
  if (err)
    return res
      .status(400)
      .json({ message: 'invalid id format, must be an objectId' })

  const [error, data] = await updateWaiter(parsedId!, {
    ...waiterToUpdate,
    updatedAt: new Date().toISOString()
  })
  if (error && error.message === 'Waiter not found')
    return res.status(404).json({
      message: 'The Waiter that you want to update doesnt exists',
      error: error.message
    })

  if (error && error.message === 'Waiter intersert but unable to retrieve data')
    return res.status(204).send()

  if (error)
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })

  return res.status(200).json(data)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const [err, parsedId] = isValidId(id)
  if (err)
    return res
      .status(400)
      .json({ message: 'invalid id format, must be an objectId' })

  const [error, waiterDeleted] = await deleteWaiter(parsedId!)
  if (error && error.message === 'Waiter not found')
    return res.status(400).json({ message: 'Waiter not found' })
  if (error)
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })

  return res.status(200).json(waiterDeleted)
})

export default router

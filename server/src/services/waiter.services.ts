import { ObjectId } from 'mongodb'
import { Waiter } from '../models/Waiter'
import { ReturnTuple } from '../types'
import db from '../utils/db'

const WaiterCollection = db.collection('waiters')

export async function getAllWaiters(): Promise<ReturnTuple<Waiter[]>> {
  try {
    const products = await WaiterCollection.find({}).toArray()
    const productsParsed: Waiter[] = products.map(x => ({
      id: x._id,
      name: x.name.trim(),
      lastName: x.lastName,
      active: x.active,
      createdAt: x.createdAt,
      updatedAt: x.updatedAt
    }))
    return [null, productsParsed]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function getById(
  id: ObjectId
): Promise<ReturnTuple<Waiter | null>> {
  try {
    const result = await WaiterCollection.findOne({ _id: id })
    if (!result) return [new Error('Product not found'), null]

    const { _id, ...rest } = result
    const productParsed = {
      id: _id,
      ...rest
    }
    return [null, productParsed as Waiter]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function createWaiter(
  newWaiter: Omit<Waiter, 'id'>
): Promise<ReturnTuple<Waiter | null>> {
  try {
    const result = await WaiterCollection.insertOne(newWaiter)
    const productCreated = await WaiterCollection.findOne({
      _id: result.insertedId
    })
    if (!productCreated)
      throw new Error('Product intersert but unable to retrieve data')

    const { _id, ...rest } = productCreated
    return [
      null,
      {
        id: _id,
        ...rest
      } as Waiter
    ]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function updateWaiter(
  id: ObjectId,
  updates: Partial<Waiter>
): Promise<ReturnTuple<Waiter | null>> {
  try {
    const result = await WaiterCollection.updateOne(
      { _id: id },
      { $set: updates }
    )

    if (result.matchedCount === 0) {
      throw new Error('Product not found')
    }

    const updatedProduct = await WaiterCollection.findOne({ _id: id })
    if (!updatedProduct) {
      return [new Error('Product intersert but unable to retrieve data'), null]
    }

    const { _id, ...rest } = updatedProduct
    return [null, { id: _id, ...rest } as Waiter]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function deleteWaiter(id: ObjectId): Promise<ReturnTuple<Waiter>> {
  try {
    const productToDelete = await WaiterCollection.findOne({ _id: id })
    if (!productToDelete) return [new Error('Product not found'), null]
    const result = await WaiterCollection.deleteOne({ _id: id })

    if (result.deletedCount === 0) {
      return [new Error('Product not found'), null]
    }
    const { _id, ...rest } = productToDelete
    return [null, { id: _id, ...rest } as Waiter]
  } catch (error) {
    return [error as Error, null]
  }
}

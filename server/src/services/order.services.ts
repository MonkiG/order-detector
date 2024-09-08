import { Order, Table } from '../models/Order'
import { ReturnTuple } from '../types'
import db from '../utils/db'

const OrderCollection = db.collection('orders')

export async function getAllOrders(): Promise<ReturnTuple<Order[]>> {
  try {
    const dbOrders = await OrderCollection.find({}).toArray()
    const parserdOrders: Order[] = dbOrders.map(order => ({
      id: order._id,
      products: order.products,
      waiter: order.waiter,
      partial: order.partial,
      open: order.open,
      table: order.table,
      createdAt: order.createdAt
    }))

    return [null, parserdOrders]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function getOrderByTable(
  table: Table
): Promise<ReturnTuple<Order>> {
  try {
    const dbOrder = await OrderCollection.findOne({ table })
    if (!dbOrder) return [new Error('Not found'), null]

    const orderParsed: Order = {
      id: dbOrder._id,
      products: dbOrder.products,
      waiter: dbOrder.waiter,
      partial: dbOrder.partial,
      open: dbOrder.open,
      table: dbOrder.table,
      createdAt: dbOrder.createdAt
    }

    return [null, orderParsed]
  } catch (e) {
    return [e as Error, null]
  }
}

export async function getOrdersByWaiter(
  waiter: string
): Promise<ReturnTuple<Order[]>> {
  try {
    const dbOrders = await OrderCollection.find({ waiter }).toArray()
    if (!dbOrders) return [new Error('Not found'), null]

    const ordersParsed: Order[] = dbOrders.map(x => ({
      id: x._id,
      products: x.products,
      waiter: x.waiter,
      partial: x.partial,
      open: x.open,
      table: x.table,
      createdAt: x.createdAt
    }))

    return [null, ordersParsed]
  } catch (e) {
    return [e as Error, null]
  }
}

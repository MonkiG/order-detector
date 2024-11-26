// import { ObjectId } from 'mongodb'
import { Collection, ObjectId, PushOperator } from 'mongodb'
import { createOrderDto, Order, Table } from '../models/Order'
import { ReturnTuple } from '../types'
import db from '../utils/db'

const OrderCollection: Collection = db.collection('orders')

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
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }))

    console.log(parserdOrders)

    return [null, parserdOrders]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function getById(id: ObjectId): Promise<ReturnTuple<Order>> {
  try {
    const dbOrder = await OrderCollection.findOne({ _id: id })
    if (!dbOrder) return [new Error('Order not found'), null]
    const order = {
      id: dbOrder._id,
      products: dbOrder.products,
      waiter: dbOrder.waiter,
      partial: dbOrder.partial,
      open: dbOrder.open,
      table: dbOrder.table,
      createdAt: dbOrder.createdAt,
      updatedAt: dbOrder.updatedAt
    }

    return [null, order]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function updateById(
  id: ObjectId,
  data: Partial<Order>
): Promise<ReturnTuple<Partial<Order>>> {
  try {
    // Usamos findOneAndUpdate para hacer la actualización y obtener el documento actualizado
    const updatedOrder = await OrderCollection.findOneAndUpdate(
      { _id: id }, // Filtro para encontrar la orden por id
      { $set: data }, // Actualizamos solo los campos que se pasan en 'data'
      { returnDocument: 'after' } // Devuelve el documento después de la actualización
    )

    // Si no se encontró la orden para actualizar
    if (!updatedOrder) {
      return [new Error('No se encontró ninguna orden para actualizar'), null]
    }

    // Devuelve el resultado como un tuple [error, datos]
    return [null, updatedOrder as Partial<Order>]
  } catch (error) {
    // Manejo de errores
    console.error(error)
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
      createdAt: dbOrder.createdAt,
      updatedAt: dbOrder.updatedAt
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
      createdAt: x.createdAt,
      updatedAt: x.updatedAt
    }))

    return [null, ordersParsed]
  } catch (e) {
    return [e as Error, null]
  }
}

export async function createOrUpdateOrder(
  waiter: string,
  table: Table,
  products: ObjectId[]
): Promise<ReturnTuple<createOrderDto>> {
  try {
    const existingOrder = await OrderCollection.findOne({
      table
    })

    if (existingOrder) {
      // Si existe, actualiza la orden
      const updatedOrder = await OrderCollection.findOneAndUpdate(
        { table, open: true },
        {
          $set: {
            waiter,
            products,
            updatedAt: new Date()
          }
        },
        { sort: { updatedAt: -1 }, returnDocument: 'after' } // Retorna el documento actualizado
      )

      if (!updatedOrder?.value) {
        return [new Error('Failed to update order'), null]
      }

      const parsedOrder: createOrderDto = {
        id: updatedOrder.value._id,
        table: updatedOrder.value.table,
        waiter: updatedOrder.value.waiter,
        products: updatedOrder.value.products,
        createdAt: updatedOrder.value.createdAt,
        updatedAt: updatedOrder.value.updatedAt,
        open: updatedOrder.value.open,
        partial: updatedOrder.value.partial
      }

      return [null, parsedOrder]
    } else {
      const newOrder = {
        table,
        waiter,
        products: products,
        createdAt: new Date(),
        updatedAt: new Date(),
        open: true,
        partial: true
      }

      const result = await OrderCollection.insertOne(newOrder)

      if (!result.acknowledged) {
        return [new Error('Failed to create order'), null]
      }

      return [null, { id: result.insertedId, ...newOrder }]
    }
  } catch (error) {
    return [error as Error, null]
  }
}

export async function getLatestOpenOrder(table: string) {
  const order = await OrderCollection.findOne(
    {
      table,
      open: true
    },
    {
      sort: { createdAt: -1 }
    }
  )

  return order
}

/*eslint-disable @typescript-eslint/no-explicit-any */
export async function updatedOrderById(
  id: ObjectId,
  dataToUpdate: Partial<any>
) {
  const { products, ...rest } = dataToUpdate
  const updatedProducts = Array.isArray(products) ? products : [products]

  const orderUpdated = await OrderCollection.findOneAndUpdate(
    {
      _id: id
    },
    {
      $set: {
        updatedAt: new Date(),
        ...rest
      },
      $push: {
        products: { $each: updatedProducts } // Usa '$push' para agregar los nuevos productos, incluso si ya están
      } as unknown as PushOperator<Document>
    },
    {
      returnDocument: 'after'
    }
  )

  return orderUpdated
}

export async function createOrder(data: any): Promise<any> {
  const orderCreated = await OrderCollection.insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    open: true
  })

  const createdOrder = await OrderCollection.findOne({
    _id: orderCreated.insertedId
  })

  const { _id, ...rest } = createdOrder!

  return { id: _id, ...rest }
}

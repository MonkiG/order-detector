import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import cors from 'cors'
import morgan from 'morgan'

import MenuController from './controllers/menu.controller'
import OrderController from './controllers/order.controller'
import ProductController from './controllers/product.controller'
import WaiterController from './controllers/waiter.controller'
import { AddData } from './types'
import { ORIGIN_URL } from './utils/config'
import {
  createOrder,
  getLatestOpenOrder,
  updatedOrderById
} from './services/order.services'
import { ObjectId } from 'mongodb'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: { origin: ORIGIN_URL }
})

app.use(cors({ origin: [ORIGIN_URL!] }))
app.use(express.json())
app.use(morgan('dev'))

app.use('/menu', MenuController)
app.use('/order', OrderController)
app.use('/product', ProductController)
app.use('/waiter', WaiterController)

io.on('connection', socket => {
  console.log(`User connected: ${socket.id}`)
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })

  /**
   * Aqui se recibiran los productos obtenidos mediante la voz
   */
  socket.on('add', async (order: AddData) => {
    if (!order.data.waiter) return
    let alreadyCreated = false
    const dbOrder = await getLatestOpenOrder(order.data.table)
    const products = order.data.products.flatMap(x =>
      new Array(x.amount).fill(new ObjectId(x.id))
    )

    let orderToSend
    if (dbOrder) {
      alreadyCreated = true
      const parseOrder = {
        ...order.data,
        products,
        waiter: new ObjectId(order.data.waiter.id)
      }
      orderToSend = await updatedOrderById(dbOrder._id, parseOrder)
      console.log('Order', orderToSend)
    } else {
      const parseOrder = {
        ...order.data,
        products,
        waiter: new ObjectId(order.data.waiter.id)
      }
      orderToSend = await createOrder(parseOrder)
    }
    const productsToKitchen = products.map(x => ({
      id: x,
      uiId: crypto.randomUUID(),
      notes: orderToSend!.notes,
      waiter: orderToSend!.waiter,
      table: orderToSend!.table
    }))
    console.log(productsToKitchen)
    io.emit('kitchen-products', productsToKitchen)

    if (!alreadyCreated) {
      io.emit('orders', orderToSend)
    }
  })
})

server.listen(3000, () => {
  console.log('Listening on port: 3000')
})

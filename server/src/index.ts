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

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173' }
})

app.use(cors({ origin: ['http://localhost:5173'] }))
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
  socket.on('add', (products: AddData) => {
    if (!products.data.waiter) return

    const { waiter, table, notes } = products.data

    const productsToKitchen = products.data.products.map(x => {
      return {
        id: crypto.randomUUID(),
        name: x.name,
        amount: x.amount,
        waiter,
        table,
        notes
      }
    })
    console.log(productsToKitchen)
    /**
     * Aquí se van a mandar los productos a la vista de la cocina
     */

    io.emit('kitchen-products', productsToKitchen)

    /**
     * Aquí se van a mandar los productos al orders panel admin
     */
    io.emit('orders', () => {})
  })
})

server.listen(3000, () => {
  console.log('Listening on port: 3000')
})

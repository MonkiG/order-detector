import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import cors from 'cors'

import MenuController from './controllers/menu.controller'
import OrderController from './controllers/order.controller'
import ProductController from './controllers/product.controller'

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(cors({ origin: ['http://localhost:5173'] }))
app.use(express.json())
app.use('/menu', MenuController)
app.use('/order', OrderController)
app.use('/product', ProductController)

io.on('connection', socket => {
  console.log('User connected')
  socket.on('diconnect', () => {
    console.log('User disconnected')
  })

  /**
   * Aqui se recibiran los productos obtenidos mediante la voz
   */
  socket.on('add', products => {
    console.log(products)
    /**
     * Aquí se van a mandar los productos a la app de escritorio
     */
    socket.emit('show', () => {})
  })
})

server.listen(3000, () => {
  console.log('Listening on port: 3000')
})

/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { Server, Socket } from 'socket.io'
import { io as Client, Socket as ClientSocket } from 'socket.io-client'
import { createServer } from 'node:http'
import express from 'express'
import cors from 'cors'

type ServerToClientEvents = {
  show: (products: any[]) => void
}

type ClientToServerEvents = {
  add: (products: any[]) => void
}

let io: Server<ClientToServerEvents, ServerToClientEvents>,
  serverSocket: Socket<ServerToClientEvents, ClientToServerEvents>,
  clientSocket: ClientSocket<ServerToClientEvents, ClientToServerEvents>,
  httpServer: any

beforeAll(async () => {
  const app = express()
  httpServer = createServer(app)
  io = new Server(httpServer)

  app.use(cors({ origin: ['http://localhost:5173'] }))
  app.use(express.json())

  io.on('connection', socket => {
    serverSocket = socket

    socket.on('add', products => {
      console.log('Received from the client' + JSON.stringify(products))
      socket.emit('show', products)
    })
  })

  await new Promise<void>(resolve => {
    httpServer.listen(() => {
      const port = httpServer.address().port
      clientSocket = Client(`http://localhost:${port}`)
      clientSocket.on('connect', resolve)
    })
  })
})

afterAll(() => {
  io.close()
  clientSocket.close()
})

describe('Socket.IO Server', () => {
  it('should receive and emit messages', async () => {
    const testProducts = [{ name: 'Test Product', price: 100 }]

    clientSocket.emit('add', testProducts)

    const products = await new Promise<any[]>(resolve => {
      clientSocket.on('show', product => {
        console.log('Received from the server' + JSON.stringify(product))
        resolve(product)
      })
    })

    expect(products).toEqual(testProducts)
  })

  it('should log "User connected" when a user connects', () => {
    expect(serverSocket).toBeDefined()
  })

  it('should log "User disconnected" when a user disconnects', async () => {
    clientSocket.close()

    await new Promise<void>(resolve => {
      serverSocket.on('disconnect', () => resolve())
    })

    expect(serverSocket.disconnected).toBe(true)
  })
})

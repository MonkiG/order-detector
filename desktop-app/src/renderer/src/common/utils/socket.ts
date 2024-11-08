import { io } from 'socket.io-client'

const socket = io('ws://localhost:3000', { autoConnect: false })
socket.connect()

socket.on('connect', () => {
  console.log('connected')
})

socket.on('connect_error', (err) => {
  console.error('Socket connection error:', err)
})

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason)
})

export default socket

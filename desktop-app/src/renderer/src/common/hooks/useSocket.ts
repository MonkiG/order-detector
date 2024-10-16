import { useEffect, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'

export default function useSocket<T>(
  eventToListen: string,
  options: {
    url: string
    autoConnect: boolean
  } = { url: 'http://localhost:3000/', autoConnect: true },
  placeHolder?: T,
  listener?: (args: T, setData: React.Dispatch<React.SetStateAction<T | undefined>>) => void
) {
  const { url, autoConnect } = options
  const [data, setData] = useState<T | undefined>(placeHolder)
  const socketRef = useRef<Socket>()

  const emitHandler = (event: string, ...args: any[]) => {
    if (!socketRef.current) throw new Error('No socket connected')

    socketRef.current.emit(event, ...args)
  }

  useEffect(() => {
    const socket = io(url, { autoConnect })

    socketRef.current = socket

    const eventListener = (args: T) => {
      setData(args)
      if (listener) {
        listener(args, setData)
      }
    }
    socket.on(eventToListen, eventListener)

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err)
    })

    socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason)
    })

    return () => {
      socket.off(eventToListen, eventListener)
      socket.close()
    }
  }, [eventToListen, url, autoConnect, listener])

  return { data, emitHandler }
}

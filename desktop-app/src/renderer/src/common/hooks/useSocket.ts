import { useEffect, useState } from 'react'
import socket from '../utils/socket'

interface Props<T> {
  event: string
  defaultData: T
  handler: (set: React.Dispatch<React.SetStateAction<T>>, data: T) => void | Promise<void>
}
export default function useSocket<T>({ event, defaultData, handler }: Props<T>): T {
  const [data, setData] = useState<T>(defaultData)

  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }

    socket.on(event, (data: T) => handler(setData, data))

    return (): void => {
      socket.off(event)
    }
  }, [event])

  return data
}

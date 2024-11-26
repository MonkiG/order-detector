import { useEffect, useState } from 'react'
import socket from '../utils/socket'

interface Props<T, U> {
  event: string
  defaultData: T
  handler: (set: React.Dispatch<React.SetStateAction<T>>, data: U) => void | Promise<void>
}
export default function useSocket<T, U>({ event, defaultData, handler }: Props<T, U>): T {
  const [data, setData] = useState<T>(defaultData)

  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }

    socket.on(event, (data: U) => handler(setData, data))

    return (): void => {
      socket.off(event)
    }
  }, [event])

  return data
}

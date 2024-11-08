import { useEffect } from 'react'
import { useLocation } from 'wouter'

export default function useAuth(): void {
  const [, redirect] = useLocation()

  useEffect(() => {
    const role = window.localStorage.getItem('role')
    if (!role) redirect('/login')
    if (role !== 'admin') redirect('/login')
  }, [])
}

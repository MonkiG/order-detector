import { useEffect, useState } from 'react'
import config from '../utils/config'
import httpClient from '../utils/httpClient'
import { Product } from '../types'

const PRODUCTS_ENDPOINT = `${config.API_URL}/product`
export default function useProducts(dependency: any) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const data = await httpClient(PRODUCTS_ENDPOINT, { method: 'GET' })
        setProducts(data.map((x) => x))
      } catch (error) {
        console.log(error)
      }
    })()
  }, [dependency])

  return { products }
}

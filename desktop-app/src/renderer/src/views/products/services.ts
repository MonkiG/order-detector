import { Product, ReturnTuple } from '@renderer/common/types'
import config from '@renderer/common/utils/config'
import httpClient from '@renderer/common/utils/httpClient'

export async function getProductById(id: string): Promise<ReturnTuple<Product>> {
  try {
    const product = await httpClient<Product>(`${config.API_URL}/product/${id}`, { method: 'GET' })
    return [null, product]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function editProductById(
  id: string,
  data: Partial<Product>
): Promise<ReturnTuple<Product>> {
  const parsedData = JSON.stringify(data)
  try {
    const product = await httpClient<Product>(`${config.API_URL}/product/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: parsedData
    })
    return [null, product]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function deleteProductById(id: string): Promise<ReturnTuple<Product>> {
  try {
    const product = await httpClient<Product>(`${config.API_URL}/product/${id}`, {
      method: 'DELETE'
    })
    return [null, product]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function addProduct(productToAdd: Partial<Product>): Promise<ReturnTuple<Product>> {
  const parsedData = JSON.stringify(productToAdd)
  try {
    const product = await httpClient<Product>(`${config.API_URL}/product`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: parsedData
    })
    return [null, product]
  } catch (error) {
    return [error as Error, null]
  }
}

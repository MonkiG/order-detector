import { Product } from '@renderer/common/types'
import config from '@renderer/common/utils/config'
import httpClient from '@renderer/common/utils/httpClient'

export async function getProductById(id: string) {
  try {
    const product = await httpClient(`${config.API_URL}/product/${id}`, { method: 'GET' })
    return [null, product]
  } catch (error) {
    return [error, null]
  }
}

export async function editProductById(id: string, data: Partial<Product>) {
  const parsedData = JSON.stringify(data)
  try {
    const product = await httpClient(`${config.API_URL}/product/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: parsedData
    })
    return [null, product]
  } catch (error) {
    return [error, null]
  }
}

export async function deleteProductById(id: string) {
  try {
    const product = await httpClient(`${config.API_URL}/product/${id}`, { method: 'DELETE' })
    return [null, product]
  } catch (error) {
    return [error, null]
  }
}

export async function addProduct(productToAdd: Partial<Product>) {
  const parsedData = JSON.stringify(productToAdd)
  try {
    const product = await httpClient(`${config.API_URL}/product`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: parsedData
    })
    return [null, product]
  } catch (error) {
    return [error, null]
  }
}

import { ReturnTuple } from '@renderer/common/types'
import { Order } from './view'
import config from '@renderer/common/utils/config'
import httpClient from '@renderer/common/utils/httpClient'
import { OrderDetails } from './[id]'

export async function getAllOrders(): Promise<ReturnTuple<Order[]>> {
  try {
    const orders = await httpClient<Order[]>(`${config.API_URL}/order/`, { method: 'GET' })
    return [null, orders]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function getOrder(id: string): Promise<ReturnTuple<OrderDetails>> {
  try {
    const order = await httpClient<OrderDetails>(`${config.API_URL}/order/${id}`, { method: 'GET' })
    return [null, order]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function payOrder(id: string): Promise<ReturnTuple<unknown>> {
  try {
    const order = await httpClient<OrderDetails>(`${config.API_URL}/order/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ open: false })
    })
    return [null, order]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function updateOrder(id: string, data: unknown): Promise<ReturnTuple<unknown>> {}

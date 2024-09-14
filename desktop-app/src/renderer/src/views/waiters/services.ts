import { Waiter } from '@renderer/common/types'
import httpClient from '@renderer/common/utils/httpClient'
import config from '@renderer/common/utils/config'

export async function getAllWaiters() {
  try {
    const waiters = await httpClient(`${config.API_URL}/waiter`)
    return [null, waiters]
  } catch (error) {
    return [error, null]
  }
}

export async function deleteWaiterById(id: string) {
  try {
    const waiter = await await httpClient(`${config.API_URL}/waiter/${id}`, { method: 'DELETE' })
    return [null, waiter]
  } catch (e) {
    return [e, null]
  }
}

export async function editWaiterById(id: string, waiter: Partial<Waiter>) {
  const parsedData = JSON.stringify(waiter)
  try {
    const waiter = await httpClient(`${config.API_URL}/waiter/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: parsedData
    })
    return [null, waiter]
  } catch (error) {
    return [error, null]
  }
}

export async function addWaiter(waiterToAdd: Partial<Waiter>) {
  const parsedData = JSON.stringify(waiterToAdd)

  try {
    const product = await httpClient(`${config.API_URL}/waiter`, {
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

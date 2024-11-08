import httpClient from '@renderer/common/utils/httpClient'
import config from '@renderer/common/utils/config'
import { Product, ReturnTuple } from '@renderer/common/types'

const MENU_ENDPOINT = `${config.API_URL}/menu`

export async function uploadMenu(formData: FormData): Promise<ReturnTuple<Product[]>> {
  try {
    const data = await httpClient<Product[]>(MENU_ENDPOINT, {
      method: 'POST',
      body: formData
    })

    return [null, data]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function getMenuTemplate(): Promise<ReturnTuple<Blob>> {
  try {
    const blob = await httpClient<Blob>(MENU_ENDPOINT, { method: 'GET' }, 'blob')
    return [null, blob]
  } catch (error) {
    return [error as Error, null]
  }
}

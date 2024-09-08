import httpClient from '@renderer/common/utils/httpClient'
import config from '@renderer/common/utils/config'

const MENU_ENDPOINT = `${config.API_URL}/menu`

export async function uploadMenu(formData: FormData) {
  try {
    const data = await httpClient(MENU_ENDPOINT, {
      method: 'POST',
      body: formData
    })

    return [null, data]
  } catch (error) {
    return [error, null]
  }
}

export async function getMenuTemplate() {
  try {
    const blob = await httpClient(MENU_ENDPOINT, { method: 'GET' }, 'blob')
    return [null, blob]
  } catch (error) {
    return [error, null]
  }
}

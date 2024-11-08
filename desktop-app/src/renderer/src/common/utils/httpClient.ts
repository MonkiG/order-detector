export default async function httpClient<T>(
  url: string,
  config?: RequestInit,
  type?: string
): Promise<T> {
  return await fetch(url, config).then((res) => {
    if (type === 'blob') return res.blob()
    return res.json()
  })
}

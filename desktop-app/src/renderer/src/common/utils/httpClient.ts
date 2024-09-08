export default async function httpClient(url: string, config?: RequestInit, type?: string) {
  return await fetch(url, config).then((res) => {
    if (type === 'blob') return res.blob()
    return res.json()
  })
}

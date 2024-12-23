export function parseDate(dateString: string): string {
  if (!dateString) return 'Invalid date'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date)
}

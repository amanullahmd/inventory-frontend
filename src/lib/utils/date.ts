/**
 * Format number with consistent locale to avoid hydration mismatches.
 * Uses en-US locale which produces comma as thousands separator.
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US')
}

/**
 * Format currency amount with consistent locale to avoid hydration mismatches.
 * Returns formatted number without currency symbol for flexibility.
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('en-US')
}

export function formatDateDMY(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

export function formatDateTime(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

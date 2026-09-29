export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function formatTime12h(time: string): string {
  const [hStr, mStr] = time.split(':')
  const h = parseInt(hStr, 10)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${mStr} ${suffix}`
}

export function timeRange(startTime: string, endTime: string): string {
  return `${formatTime12h(startTime)} – ${formatTime12h(endTime)}`
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Formats an ISO yyyy-mm-dd string without timezone drift. */
export function formatDate(isoDate: string, opts?: { withYear?: boolean }): string {
  const [y, m, d] = isoDate.split('-').map((n) => parseInt(n, 10))
  const withYear = opts?.withYear ?? true
  return `${MONTHS[m - 1]} ${d}, ${withYear ? y : ''}`.trim().replace(/,$/, '')
}

export function todayISO(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function daysBetween(fromISO: string, toISO: string): number {
  const a = new Date(`${fromISO}T00:00:00`)
  const b = new Date(`${toISO}T00:00:00`)
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

export function isEventUpcoming(event: { date: string; status: string }): boolean {
  return (
    (event.status === 'Published' || event.status === 'Draft') &&
    event.date >= todayISO()
  )
}

export function seatsRemaining(event: { maxParticipants: number }, taken: number): number {
  return Math.max(0, event.maxParticipants - taken)
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim())
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[\s-]/g, '')
  return /^[+]?[0-9]{10,14}$/.test(digits)
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

import { useEffect, useState } from 'react'

export interface Countdown {
  ended: boolean
  days: number
  hours: number
  minutes: number
  seconds: number
}

/** Ticks every second while a target exists; returns null when no target given. */
export function useCountdown(targetISO?: string): Countdown | null {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!targetISO) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [targetISO])

  if (!targetISO) return null

  const diff = new Date(targetISO).getTime() - now
  if (diff <= 0) return { ended: true, days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    ended: false,
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  }
}

import { useCallback, useEffect, useState } from 'react'
import { fetchDashboardStats, fetchEvents, fetchRegistrations } from '../services/api'
import type { DashboardStats } from '../services/api'
import type { Event, Registration } from '../data/models'

export interface AdminData {
  stats: DashboardStats | null
  events: Event[]
  registrations: Registration[]
}

/**
 * Loads all admin data (stats, events, registrations) and exposes `reload()`
 * so pages can refresh after create/update/delete operations.
 */
export function useAdminData() {
  const [data, setData] = useState<AdminData>({ stats: null, events: [], registrations: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const reload = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    Promise.all([fetchDashboardStats(), fetchEvents(), fetchRegistrations()])
      .then(([stats, events, registrations]) => {
        if (!active) return
        setData({ stats, events, registrations })
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Something went wrong.')
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [tick])

  return { data, loading, error, reload, retry: reload }
}

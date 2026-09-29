import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { adminLogin, adminLogout, getAdminSession } from '../services/api'
import { DEFAULT_ADMIN } from '../data/seedData'
import type { Admin } from '../data/models'
import AdminLayout from '../layouts/AdminLayout'

interface AdminAuthApi {
  admin: Admin | null
  login: (email: string, password: string) => Promise<Admin>
  logout: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthApi | null>(null)

export function useAdminAuth(): AdminAuthApi {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}

/**
 * Demo session auth backed by localStorage. Replace `adminLogin`/`adminLogout`
 * in services/api.ts with real API calls to swap the auth layer.
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(() =>
    getAdminSession() ? { ...DEFAULT_ADMIN } : null,
  )

  const api = useMemo<AdminAuthApi>(
    () => ({
      admin,
      login: async (email, password) => {
        const a = await adminLogin(email, password)
        setAdmin(a)
        return a
      },
      logout: async () => {
        await adminLogout()
        setAdmin(null)
      },
    }),
    [admin],
  )

  return <AdminAuthContext.Provider value={api}>{children}</AdminAuthContext.Provider>
}

/** Guards all /admin routes; redirects unauthenticated visitors to login. */
export function RequireAdmin() {
  const { admin } = useAdminAuth()
  const location = useLocation()

  if (!admin) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    )
  }
  return <AdminLayout />
}

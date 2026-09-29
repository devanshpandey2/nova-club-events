import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CalendarDays, ClipboardList, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { useAdminAuth } from '../components/AdminAuth'
import { ClubLogo } from '../components/Navbar'
import { cx } from '../utils/helpers'
import { useToast } from '../components/Toast'

const SIDEBAR_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/events', label: 'Events', icon: CalendarDays, end: false },
  { to: '/admin/registrations', label: 'Registrations', icon: ClipboardList, end: false },
]

/** Shell for all /admin pages: fixed sidebar on desktop, drawer on mobile. */
export default function AdminLayout() {
  const { admin, logout } = useAdminAuth()
  const { pathname } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toast = useToast()

  useEffect(() => setDrawerOpen(false), [pathname])

  function handleLogout() {
    toast.info('Logged out. See you soon!')
    void logout()
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-5">
          <ClubLogo />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">Nova Club</p>
            <p className="text-[11px] font-medium text-slate-500">Admin Portal</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin sections">
          {SIDEBAR_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cx(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
              }
            >
              <item.icon className="h-4 w-4" aria-hidden />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <p className="mb-2 px-3 text-xs leading-relaxed text-slate-500">
            Signed in as
            <br />
            <span className="font-medium text-slate-700">{admin?.email}</span>
          </p>
          <button type="button" className="btn-ghost w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4" aria-hidden /> Logout
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Mobile topbar */}
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-icon"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open admin menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <ClubLogo className="h-8 w-8" />
            <span className="text-sm font-semibold text-slate-900">Admin Portal</span>
          </div>
          <button type="button" className="btn-icon" onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
          >
            <div
              className="absolute inset-0 animate-fade-in bg-slate-950/40"
              onMouseDown={() => setDrawerOpen(false)}
              aria-hidden
            />
            <div className="absolute inset-y-0 left-0 w-64 animate-fade-in bg-white shadow-xl">
              <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
                <div className="flex items-center gap-2">
                  <ClubLogo className="h-8 w-8" />
                  <span className="text-sm font-semibold text-slate-900">Admin Portal</span>
                </div>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close admin menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-1 p-3" aria-label="Admin sections">
                {SIDEBAR_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cx(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-slate-600 hover:bg-slate-100',
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" aria-hidden />
                    {item.label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  className="btn-ghost mt-2 w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" aria-hidden /> Logout
                </button>
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

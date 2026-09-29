import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, LayoutDashboard, LogIn } from 'lucide-react'
import { useAdminAuth } from './AdminAuth'
import { cx } from '../utils/helpers'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { admin } = useAdminAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cx(
        'sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow duration-200',
        scrolled ? 'border-slate-200 shadow-soft' : 'border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Nova Club home">
          <ClubLogo />
          <span className="text-lg font-bold text-slate-900">
            Nova <span className="font-medium text-slate-500">Club</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cx(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {admin ? (
            <Link to="/admin" className="btn-secondary btn-sm hidden sm:inline-flex">
              <LayoutDashboard className="h-4 w-4" aria-hidden />
              Dashboard
            </Link>
          ) : (
            <Link to="/admin/login" className="btn-secondary btn-sm hidden sm:inline-flex">
              <LogIn className="h-4 w-4" aria-hidden />
              Admin Login
            </Link>
          )}
          <button
            type="button"
            className="btn-icon md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown navigation */}
      <div
        id="mobile-nav"
        className={cx(
          'overflow-hidden transition-all duration-200 md:hidden',
          menuOpen ? 'max-h-80 border-t border-slate-200 shadow-soft' : 'max-h-0',
        )}
      >
        <nav aria-label="Mobile navigation" className="space-y-1 px-4 py-3">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cx(
                  'block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          {admin ? (
            <Link to="/admin" className="btn-secondary mt-2 w-full sm:hidden">
              <LayoutDashboard className="h-4 w-4" aria-hidden />
              Dashboard
            </Link>
          ) : (
            <Link to="/admin/login" className="btn-secondary mt-2 w-full sm:hidden">
              <LogIn className="h-4 w-4" aria-hidden />
              Admin Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export function ClubLogo({ className = '' }: { className?: string }) {
  return (
    <span
      className={cx(
        'flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm shadow-primary-600/30',
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 32 32"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 22V10l12 12V10" />
      </svg>
    </span>
  )
}

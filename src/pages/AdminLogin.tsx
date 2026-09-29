import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, LogIn, Mail } from 'lucide-react'
import { useAdminAuth } from '../components/AdminAuth'
import { useToast } from '../components/Toast'
import { ClubLogo } from '../components/Navbar'
import { cx } from '../utils/helpers'

export default function AdminLogin() {
  const { login } = useAdminAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? '/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="p-4">
        <Link to="/" className="btn-ghost">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to site
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md animate-scale-in">
          <div className="card p-8">
            <div className="flex flex-col items-center text-center">
              <ClubLogo className="h-12 w-12" />
              <h1 className="mt-4 text-2xl">Admin Portal</h1>
              <p className="mt-1 text-sm text-slate-500">
                Sign in to manage events and registrations
              </p>
            </div>

            {error && (
              <div
                className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
                role="alert"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="admin-email" className="label">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    className="input pl-9"
                    placeholder="admin@novaclub.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-password" className="label">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                  <input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    className={cx('input pl-9')}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? 'Signing in…' : (
                  <>
                    <LogIn className="h-4 w-4" aria-hidden /> Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-500">
              <p className="font-semibold text-slate-600">Demo credentials</p>
              <p className="mt-1">
                Email: <code className="rounded bg-slate-200 px-1 py-0.5">admin@novaclub.edu</code>{' '}
                · Password: <code className="rounded bg-slate-200 px-1 py-0.5">admin123</code>
              </p>
              <p className="mt-1.5 text-slate-400">
                Demo auth only — replace services/api.ts auth functions with a real backend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

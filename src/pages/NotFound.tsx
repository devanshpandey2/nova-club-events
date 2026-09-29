import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <Compass className="h-8 w-8" aria-hidden />
      </span>
      <h1 className="mt-6 text-4xl">Page not found</h1>
      <p className="mt-3 text-slate-600">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className="btn-primary">
          Go home
        </Link>
        <Link to="/events" className="btn-secondary">
          Browse events
        </Link>
      </div>
    </div>
  )
}

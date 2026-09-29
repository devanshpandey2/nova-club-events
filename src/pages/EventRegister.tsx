import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { fetchEventById, registerForEvent } from '../services/api'
import SmartImage from '../components/SmartImage'
import { YEARS } from '../data/models'
import type { Registration, Year } from '../data/models'
import { cx, formatDate, isValidEmail, isValidPhone, timeRange } from '../utils/helpers'

interface FormState {
  name: string
  email: string
  college: string
  year: Year
  phone: string
}

interface FormErrors {
  name?: string
  email?: string
  college?: string
  year?: string
  phone?: string
}

export default function EventRegister() {
  const { id } = useParams<{ id: string }>()
  const eventState = useAsync(() => fetchEventById(id ?? ''), [id])
  const event = eventState.data

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    college: '',
    year: '1st Year',
    phone: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState<Registration | null>(null)

  // Reset success state when the event id changes
  useEffect(() => {
    setSuccess(null)
  }, [id])

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!form.name.trim()) errs.name = 'Full name is required.'
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address.'
    if (!form.college.trim()) errs.college = 'College / university is required.'
    if (!form.phone.trim()) errs.phone = 'Phone number is required.'
    else if (!isValidPhone(form.phone)) errs.phone = 'Enter a valid phone number (10–14 digits).'
    return errs
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    if (!event) return

    setSubmitting(true)
    const result = await registerForEvent({
      eventId: event.id,
      name: form.name,
      email: form.email,
      college: form.college,
      year: form.year,
      phone: form.phone,
    })
    setSubmitting(false)

    if (result.ok) {
      setSuccess(result.registration)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setSubmitError(result.error)
    }
  }

  /* ------------------------------------------------ Success screen */
  if (success && event) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="card animate-scale-in p-8 text-center sm:p-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <CheckCircle2 className="h-9 w-9" aria-hidden />
          </span>
          <h1 className="mt-5 text-3xl">Registration Successful!</h1>
          <p className="mt-2 text-slate-600">
            You're officially registered for this event. A confirmation has been recorded against{' '}
            <span className="font-medium text-slate-900">{success.email}</span>.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Your ticket
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">{event.title}</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-1.5 text-slate-500">
                  <CalendarDays className="h-4 w-4" aria-hidden /> Date
                </dt>
                <dd className="mt-0.5 font-semibold text-slate-900">{formatDate(event.date)}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="h-4 w-4" aria-hidden /> Time
                </dt>
                <dd className="mt-0.5 font-semibold text-slate-900">
                  {timeRange(event.startTime, event.endTime)}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-4 w-4" aria-hidden /> Venue
                </dt>
                <dd className="mt-0.5 font-semibold text-slate-900">{event.venue}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-slate-500">
                  <Mail className="h-4 w-4" aria-hidden /> Registered email
                </dt>
                <dd className="mt-0.5 font-semibold text-slate-900">{success.email}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/events" className="btn-primary">
              Back to Events
            </Link>
            <Link to={`/events/${event.id}`} className="btn-secondary">
              View event details
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ----------------------------------------------------- Form view */
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link to={`/events/${id ?? ''}`} className="btn-ghost -ml-2">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to event
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="animate-fade-up">
          <h1 className="text-3xl sm:text-4xl">Event Registration</h1>
          <p className="mt-2 text-slate-600">
            Reserve your seat in a few quick steps. Fields marked * are required.
          </p>

          {submitError && (
            <div
              className="mt-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
              role="alert"
            >
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <div>
                <p className="font-semibold">Registration failed</p>
                <p className="mt-0.5">{submitError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="card mt-6 p-6 sm:p-8">
            <div className="field-group">
              <label htmlFor="reg-name" className="label">
                Full Name *
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  className={cx('input pl-9', errors.name && 'input-error')}
                  placeholder="e.g. Aarav Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'reg-name-error' : undefined}
                />
              </div>
              {errors.name && (
                <p id="reg-name-error" className="error-text" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="reg-email" className="label">
                Email *
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  className={cx('input pl-9', errors.email && 'input-error')}
                  placeholder="you@student.university.edu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'reg-email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="reg-email-error" className="error-text" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="reg-college" className="label">
                College / University *
              </label>
              <div className="relative">
                <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                <input
                  id="reg-college"
                  type="text"
                  autoComplete="organization"
                  className={cx('input pl-9', errors.college && 'input-error')}
                  placeholder="e.g. Nova Institute of Technology"
                  value={form.college}
                  onChange={(e) => setForm({ ...form, college: e.target.value })}
                  aria-invalid={!!errors.college}
                  aria-describedby={errors.college ? 'reg-college-error' : undefined}
                />
              </div>
              {errors.college && (
                <p id="reg-college-error" className="error-text" role="alert">
                  {errors.college}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field-group">
                <label htmlFor="reg-year" className="label">
                  Year *
                </label>
                <select
                  id="reg-year"
                  className={cx('input', errors.year && 'input-error')}
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value as Year })}
                  aria-invalid={!!errors.year}
                  aria-describedby={errors.year ? 'reg-year-error' : undefined}
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                {errors.year && (
                  <p id="reg-year-error" className="error-text" role="alert">
                    {errors.year}
                  </p>
                )}
              </div>

              <div className="field-group">
                <label htmlFor="reg-phone" className="label">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                  <input
                    id="reg-phone"
                    type="tel"
                    autoComplete="tel"
                    className={cx('input pl-9', errors.phone && 'input-error')}
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
                  />
                </div>
                {errors.phone && (
                  <p id="reg-phone-error" className="error-text" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="reg-event" className="label">
                Event
              </label>
              <input
                id="reg-event"
                type="text"
                className="input bg-slate-50 text-slate-500"
                value={event?.title ?? 'Loading…'}
                readOnly
                disabled
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={submitting || !event}>
              {submitting ? (
                <>
                  <Spinner /> Processing…
                </>
              ) : (
                'Complete Registration'
              )}
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">
              One registration per email per event. Duplicate entries are rejected.
            </p>
          </form>
        </div>

        {/* Event summary sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {event ? (
            <div className="card overflow-hidden">
              <SmartImage
                src={event.image}
                alt={`${event.title} banner`}
                className="h-36 w-full object-cover"
              />
              <div className="p-5">
                <h2 className="text-lg">{event.title}</h2>
                <dl className="mt-4 space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <CalendarDays className="h-4 w-4 text-primary-600" aria-hidden />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4 text-primary-600" aria-hidden />
                    {timeRange(event.startTime, event.endTime)}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-primary-600" aria-hidden />
                    {event.venue}
                  </div>
                </dl>
                <div className="mt-4 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
                  Registration deadline:{' '}
                  <span className="font-semibold text-slate-700">
                    {formatDate(event.registrationDeadline)}
                  </span>
                </div>
              </div>
            </div>
          ) : eventState.loading ? (
            <div className="card h-64 animate-pulse bg-slate-100" aria-hidden />
          ) : (
            <div className="card p-6 text-center text-sm text-slate-500">
              Event details unavailable.
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
      aria-hidden
    />
  )
}

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { fetchEventById, createEvent, updateEvent } from '../services/api'
import { EVENT_CATEGORIES, EVENT_STATUSES } from '../data/models'
import { useToast } from '../components/Toast'
import ErrorState from '../components/ErrorState'
import { cx } from '../utils/helpers'
import type { EventCategory, EventStatus } from '../data/models'

const IMAGE_PRESETS = [
  { label: 'Conference', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=70' },
  { label: 'Coding', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=70' },
  { label: 'Design', url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=70' },
  { label: 'Networking', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=70' },
  { label: 'Hackathon', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=70' },
  { label: 'Workshop', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=70' },
  { label: 'Cultural', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=70' },
  { label: 'Sports', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=70' },
]

const EMPTY = {
  title: '',
  description: '',
  category: 'Technology' as EventCategory,
  date: '',
  startTime: '10:00',
  endTime: '17:00',
  venue: '',
  image: IMAGE_PRESETS[0].url,
  organizer: '',
  registrationDeadline: '',
  maxParticipants: 100,
  status: 'Draft' as EventStatus,
  featured: false,
  rulesText: '',
}

type FormState = typeof EMPTY

interface FormErrors {
  title?: string
  description?: string
  date?: string
  venue?: string
  organizer?: string
  deadline?: string
  participants?: string
  time?: string
  image?: string
}

/** Shared form for /admin/events/new and /admin/events/edit/:id */
export default function EventForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const existing = useAsync(() => (id ? fetchEventById(id) : Promise.resolve(null)), [id])

  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)
  const hydrated = useRef(false)

  // Hydrate form when editing
  useEffect(() => {
    if (isEdit && existing.data && !hydrated.current) {
      const e = existing.data
      setForm({
        title: e.title,
        description: e.description,
        category: e.category,
        date: e.date,
        startTime: e.startTime,
        endTime: e.endTime,
        venue: e.venue,
        image: e.image,
        organizer: e.organizer,
        registrationDeadline: e.registrationDeadline,
        maxParticipants: e.maxParticipants,
        status: e.status,
        featured: e.featured ?? false,
        rulesText: e.rules.join('\n'),
      })
      hydrated.current = true
    }
  }, [isEdit, existing.data])

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!form.title.trim()) errs.title = 'Event name is required.'
    if (!form.description.trim()) errs.description = 'Description is required.'
    if (!form.date) errs.date = 'Date is required.'
    if (!form.venue.trim()) errs.venue = 'Venue is required.'
    if (!form.organizer.trim()) errs.organizer = 'Organizer is required.'
    if (!form.registrationDeadline) errs.deadline = 'Registration deadline is required.'
    if (
      form.registrationDeadline &&
      form.date &&
      form.registrationDeadline > form.date
    ) {
      errs.deadline = 'Deadline must be on or before the event date.'
    }
    const n = Number(form.maxParticipants)
    if (!Number.isFinite(n) || n < 1) errs.participants = 'Maximum participants must be at least 1.'
    // Hackathons run 24h (start == end); only end-before-start is invalid.
    if (form.endTime < form.startTime) errs.time = 'End time must be after start time.'
    if (!form.image.trim()) errs.image = 'Image URL is required.'
    return errs
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      venue: form.venue.trim(),
      image: form.image.trim(),
      organizer: form.organizer.trim(),
      registrationDeadline: form.registrationDeadline,
      maxParticipants: Math.max(1, Math.round(Number(form.maxParticipants))),
      status: form.status,
      featured: form.featured,
      rules: form.rulesText
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
    }

    try {
      if (isEdit && id) {
        await updateEvent(id, payload)
        toast.success(`"${payload.title}" was updated.`)
      } else {
        await createEvent(payload)
        toast.success(`"${payload.title}" was created.`)
      }
      navigate('/admin/events')
    } catch {
      toast.error('Something went wrong while saving. Please try again.')
      setSaving(false)
    }
  }

  if (isEdit && existing.error) {
    return <ErrorState message={existing.error} onRetry={existing.retry} />
  }

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <div className="animate-fade-in">
      <Link to="/admin/events" className="btn-ghost -ml-2">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to events
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl">{isEdit ? 'Edit Event' : 'Add Event'}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isEdit ? 'Update the details of this event.' : 'Fill in the details to publish a new event.'}
          </p>
        </div>
        {isEdit && existing.data && (
          <Link to={`/events/${existing.data.id}`} className="btn-secondary btn-sm">
            View public page
          </Link>
        )}
      </div>

      {isEdit && existing.loading ? (
        <div className="card mt-6 h-96 animate-pulse bg-slate-100" aria-hidden />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="space-y-6">
            <section className="card p-6">
              <h2 className="text-lg">Event details</h2>
              <div className="mt-4">
                <label htmlFor="ev-title" className="label">Event Name *</label>
                <input
                  id="ev-title"
                  type="text"
                  className={cx('input', errors.title && 'input-error')}
                  placeholder="e.g. TechFest 2026"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  aria-invalid={!!errors.title}
                />
                {errors.title && <p className="error-text">{errors.title}</p>}
              </div>

              <div className="mt-4">
                <label htmlFor="ev-desc" className="label">Description *</label>
                <textarea
                  id="ev-desc"
                  rows={5}
                  className={cx('input resize-y', errors.description && 'input-error')}
                  placeholder="What should students expect? Format, tracks, prizes…"
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  aria-invalid={!!errors.description}
                />
                {errors.description && <p className="error-text">{errors.description}</p>}
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ev-category" className="label">Category *</label>
                  <select
                    id="ev-category"
                    className="input"
                    value={form.category}
                    onChange={(e) => set('category', e.target.value as EventCategory)}
                  >
                    {EVENT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="ev-status" className="label">Status *</label>
                  <select
                    id="ev-status"
                    className="input"
                    value={form.status}
                    onChange={(e) => set('status', e.target.value as EventStatus)}
                  >
                    {EVENT_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section className="card p-6">
              <h2 className="text-lg">Schedule &amp; venue</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ev-date" className="label">Date *</label>
                  <input
                    id="ev-date"
                    type="date"
                    className={cx('input', errors.date && 'input-error')}
                    value={form.date}
                    onChange={(e) => set('date', e.target.value)}
                    aria-invalid={!!errors.date}
                  />
                  {errors.date && <p className="error-text">{errors.date}</p>}
                </div>
                <div>
                  <label htmlFor="ev-deadline" className="label">Registration Deadline *</label>
                  <input
                    id="ev-deadline"
                    type="date"
                    className={cx('input', errors.deadline && 'input-error')}
                    value={form.registrationDeadline}
                    onChange={(e) => set('registrationDeadline', e.target.value)}
                    aria-invalid={!!errors.deadline}
                  />
                  {errors.deadline && <p className="error-text">{errors.deadline}</p>}
                </div>
                <div>
                  <label htmlFor="ev-start" className="label">Start Time *</label>
                  <input
                    id="ev-start"
                    type="time"
                    className="input"
                    value={form.startTime}
                    onChange={(e) => set('startTime', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="ev-end" className="label">End Time *</label>
                  <input
                    id="ev-end"
                    type="time"
                    className={cx('input', errors.time && 'input-error')}
                    value={form.endTime}
                    onChange={(e) => set('endTime', e.target.value)}
                    aria-invalid={!!errors.time}
                  />
                  {errors.time && <p className="error-text">{errors.time}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="ev-venue" className="label">Venue *</label>
                  <input
                    id="ev-venue"
                    type="text"
                    className={cx('input', errors.venue && 'input-error')}
                    placeholder="e.g. Main Auditorium"
                    value={form.venue}
                    onChange={(e) => set('venue', e.target.value)}
                    aria-invalid={!!errors.venue}
                  />
                  {errors.venue && <p className="error-text">{errors.venue}</p>}
                </div>
              </div>
            </section>

            <section className="card p-6">
              <h2 className="text-lg">Logistics</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ev-organizer" className="label">Organizer *</label>
                  <input
                    id="ev-organizer"
                    type="text"
                    className={cx('input', errors.organizer && 'input-error')}
                    placeholder="e.g. Nova Tech Team"
                    value={form.organizer}
                    onChange={(e) => set('organizer', e.target.value)}
                    aria-invalid={!!errors.organizer}
                  />
                  {errors.organizer && <p className="error-text">{errors.organizer}</p>}
                </div>
                <div>
                  <label htmlFor="ev-max" className="label">Maximum Participants *</label>
                  <input
                    id="ev-max"
                    type="number"
                    min={1}
                    className={cx('input', errors.participants && 'input-error')}
                    value={form.maxParticipants}
                    onChange={(e) => set('maxParticipants', Number(e.target.value))}
                    aria-invalid={!!errors.participants}
                  />
                  {errors.participants && <p className="error-text">{errors.participants}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="ev-rules" className="label">Event rules / instructions</label>
                <textarea
                  id="ev-rules"
                  rows={4}
                  className="input resize-y"
                  placeholder={'One rule per line, e.g.\nCarry your college ID.\nRegistration closes 4 days before the event.'}
                  value={form.rulesText}
                  onChange={(e) => set('rulesText', e.target.value)}
                />
                <p className="mt-1.5 text-xs text-slate-400">One rule per line.</p>
              </div>
            </section>
          </div>

          {/* Sidebar: image + featured + submit */}
          <aside className="space-y-6">
            <section className="card p-6">
              <h2 className="text-lg">Event image</h2>
              <div className="mt-4">
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <img
                    src={form.image}
                    alt="Event banner preview"
                    className="h-36 w-full object-cover"
                  />
                </div>
                <label htmlFor="ev-image" className="label mt-4">Image URL *</label>
                <input
                  id="ev-image"
                  type="url"
                  className={cx('input', errors.image && 'input-error')}
                  placeholder="https://…"
                  value={form.image}
                  onChange={(e) => set('image', e.target.value)}
                  aria-invalid={!!errors.image}
                />
                {errors.image && <p className="error-text">{errors.image}</p>}
                <p className="mt-3 text-xs font-medium text-slate-500">Or pick a preset:</p>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {IMAGE_PRESETS.map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => set('image', p.url)}
                      title={p.label}
                      className={cx(
                        'overflow-hidden rounded-lg border-2 transition',
                        form.image === p.url ? 'border-primary-500' : 'border-transparent hover:border-slate-300',
                      )}
                    >
                      <img src={p.url} alt={p.label} className="h-12 w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="card p-6">
              <h2 className="text-lg">Visibility</h2>
              <label className="mt-3 flex cursor-pointer items-center justify-between gap-3">
                <span>
                  <span className="text-sm font-medium text-slate-700">Featured event</span>
                  <span className="block text-xs text-slate-500">
                    Highlighted on the home page with a countdown.
                  </span>
                </span>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary-600"
                  checked={form.featured}
                  onChange={(e) => set('featured', e.target.checked)}
                />
              </label>
            </section>

            <div className="card p-6">
              <button type="submit" className="btn-primary w-full" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Saving…
                  </>
                ) : isEdit ? (
                  'Save Changes'
                ) : (
                  'Create Event'
                )}
              </button>
              <Link to="/admin/events" className="btn-secondary mt-3 w-full">
                Cancel
              </Link>
            </div>
          </aside>
        </form>
      )}
    </div>
  )
}

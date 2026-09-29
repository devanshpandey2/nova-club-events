import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  ListChecks,
  MapPin,
  ScrollText,
  User,
  Users,
} from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { useRegistrations } from '../hooks/useRegistrations'
import { fetchEventById, fetchEvents } from '../services/api'
import { formatDate, timeRange, todayISO } from '../utils/helpers'
import { getRegistrationState } from '../utils/eventStatus'
import { CATEGORY_STYLES } from '../components/Badges'
import EventCard from '../components/EventCard'
import SmartImage from '../components/SmartImage'
import ErrorState from '../components/ErrorState'
import { cx } from '../utils/helpers'

export default function EventDetails() {
  const { id } = useParams<{ id: string }>()
  const eventState = useAsync(
    () => fetchEventById(id ?? ''),
    [id],
  )
  const eventsState = useAsync(fetchEvents, [])
  const regsState = useRegistrations()

  const event = eventState.data
  const regs = regsState.data ?? []
  const seatsTaken = event
    ? regs.filter((r) => r.eventId === event.id && r.status !== 'Cancelled').length
    : 0
  const regState = event ? getRegistrationState(event, seatsTaken) : null

  const related = (eventsState.data ?? [])
    .filter(
      (e) =>
        e.id !== event?.id &&
        e.status === 'Published' &&
        e.date >= todayISO() &&
        e.category === event?.category,
    )
    .slice(0, 3)

  if (eventState.loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-72 animate-pulse rounded-3xl bg-slate-200" aria-hidden />
        <div className="mt-8 h-8 w-1/2 animate-pulse rounded bg-slate-200" aria-hidden />
        <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-slate-200" aria-hidden />
      </div>
    )
  }

  if (eventState.error || !event) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState
          message={eventState.error ?? "This event doesn't exist or may have been removed."}
          onRetry={eventState.retry}
        />
        <div className="mt-6 text-center">
          <Link to="/events" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const cat = CATEGORY_STYLES[event.category]

  return (
    <div className="animate-fade-in">
      {/* Banner */}
      <div className="relative h-64 sm:h-80 lg:h-[380px]">
        <SmartImage
          src={event.image}
          alt={`${event.title} banner`}
          loading="eager"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-navy-950/20" aria-hidden />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <span className={cx('badge shadow-sm', cat.badge)}>{event.category}</span>
            <h1 className="mt-3 max-w-3xl text-3xl text-white sm:text-4xl lg:text-5xl">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/events" className="btn-ghost -ml-2 mb-6">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to all events
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Main column */}
          <div>
            <h2 className="text-xl">About this event</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600">
              {event.description}
            </p>

            {event.rules.length > 0 && (
              <div className="card mt-8 p-6">
                <h3 className="flex items-center gap-2 text-lg">
                  <ListChecks className="h-5 w-5 text-primary-600" aria-hidden />
                  Event rules &amp; instructions
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {event.rules.map((rule) => (
                    <li key={rule} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related events */}
            {related.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl">More {event.category} events</h2>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  {related.map((e) => {
                    const taken = regs.filter(
                      (r) => r.eventId === e.id && r.status !== 'Cancelled',
                    ).length
                    return (
                      <EventCard
                        key={e.id}
                        event={e}
                        seatsTaken={taken}
                        registrationState={getRegistrationState(e, taken)}
                      />
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h3 className="sr-only">Event information</h3>
              <dl className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
                  <div>
                    <dt className="font-medium text-slate-500">Date</dt>
                    <dd className="font-semibold text-slate-900">{formatDate(event.date)}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
                  <div>
                    <dt className="font-medium text-slate-500">Time</dt>
                    <dd className="font-semibold text-slate-900">
                      {timeRange(event.startTime, event.endTime)}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
                  <div>
                    <dt className="font-medium text-slate-500">Venue</dt>
                    <dd className="font-semibold text-slate-900">{event.venue}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
                  <div>
                    <dt className="font-medium text-slate-500">Organizer</dt>
                    <dd className="font-semibold text-slate-900">{event.organizer}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ScrollText className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
                  <div>
                    <dt className="font-medium text-slate-500">Registration deadline</dt>
                    <dd className="font-semibold text-slate-900">
                      {formatDate(event.registrationDeadline)}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
                  <div>
                    <dt className="font-medium text-slate-500">Available seats</dt>
                    <dd className="font-semibold text-slate-900">
                      {Math.max(0, event.maxParticipants - seatsTaken)} of {event.maxParticipants}
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-6">
                <span className={cx('badge', regState && getBadgeForTone(regState.tone))}>
                  {regState?.label}
                </span>
              </div>

              {regState?.open ? (
                <Link to={`/register/${event.id}`} className="btn-primary mt-5 w-full">
                  Register for this Event <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ) : (
                <div className="mt-5 rounded-lg bg-slate-100 px-4 py-3 text-center text-sm font-medium text-slate-500">
                  Registration is not open for this event.
                </div>
              )}
            </div>

            {/* Capacity meter */}
            <div className="card p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">Seats filled</span>
                <span className="font-semibold text-slate-900">
                  {seatsTaken}/{event.maxParticipants}
                </span>
              </div>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"
                role="progressbar"
                aria-valuenow={seatsTaken}
                aria-valuemin={0}
                aria-valuemax={event.maxParticipants}
                aria-label="Seats filled"
              >
                <div
                  className="h-full rounded-full bg-primary-600 transition-all"
                  style={{
                    width: `${Math.min(100, (seatsTaken / Math.max(1, event.maxParticipants)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function getBadgeForTone(tone: string): string {
  const map: Record<string, string> = {
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-rose-50 text-rose-700',
    neutral: 'bg-slate-100 text-slate-600',
  }
  return map[tone] ?? map.neutral
}

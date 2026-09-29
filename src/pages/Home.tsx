import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Coffee,
  Cpu,
  Lightbulb,
  MapPin,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import { useEvents } from '../hooks/useEvents'
import { useRegistrations } from '../hooks/useRegistrations'
import { useCountdown } from '../hooks/useCountdown'
import { CLUB_STATS } from '../data/seedData'
import { daysBetween, formatDate, timeRange, todayISO } from '../utils/helpers'
import { getRegistrationState } from '../utils/eventStatus'
import EventCard from '../components/EventCard'
import { EventCardSkeleton } from '../components/Skeletons'
import SmartImage from '../components/SmartImage'
import ErrorState from '../components/ErrorState'
import { ClubLogo } from '../components/Navbar'
import type { Event } from '../data/models'

const ACTIVITIES = [
  { icon: Cpu, label: 'Technical sessions' },
  { icon: Trophy, label: 'Competitions' },
  { icon: Users, label: 'Networking sessions' },
  { icon: Lightbulb, label: 'Workshops' },
  { icon: Zap, label: 'Hackathons' },
  { icon: Sparkles, label: 'Cultural events' },
  { icon: Coffee, label: 'Community activities' },
]

const STATS = [
  { value: CLUB_STATS.totalEvents, suffix: '+', label: 'Events organized' },
  { value: CLUB_STATS.totalStudents, suffix: '+', label: 'Students engaged' },
  { value: CLUB_STATS.workshops, suffix: '+', label: 'Workshops hosted' },
  { value: CLUB_STATS.partners, suffix: '+', label: 'Club partners' },
]

function picksNextUpcoming(events: Event[], count: number): Event[] {
  const today = todayISO()
  return events
    .filter((e) => e.status === 'Published' && e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, count)
}

export default function Home() {
  const eventsState = useEvents()
  const regsState = useRegistrations()
  const loading = eventsState.loading || regsState.loading
  const error = eventsState.error ?? regsState.error

  const events = eventsState.data ?? []
  const regs = regsState.data ?? []
  const featured =
    events
      .filter((e) => e.featured && e.status === 'Published' && e.date >= todayISO())
      .sort((a, b) => a.date.localeCompare(b.date))[0] ??
    picksNextUpcoming(events, 1)[0]
  const upcoming = picksNextUpcoming(events, 4).filter((e) => e.id !== featured?.id).slice(0, 3)

  function seatsTaken(event: Event): number {
    return regs.filter((r) => r.eventId === event.id && r.status !== 'Cancelled').length
  }

  return (
    <>
      {/* -------------------------------------------------- Hero */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-600/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl"
          aria-hidden
        />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28 lg:px-8">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-primary-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {`Next up · ${featured ? featured.title : 'New events announced soon'}`}
            </span>
            <h1 className="mt-6 text-4xl leading-[1.1] text-white sm:text-5xl lg:text-[3.4rem]">
              Where Campus Ideas
              <br />
              Become <span className="text-primary-400">Experiences</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-300">
              Discover events, workshops, competitions and activities organized by our college
              clubs — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/events" className="btn-primary">
                Explore Events <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                to={featured ? `/events/${featured.id}` : '/events'}
                className="btn border border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                View Featured Event
              </Link>
            </div>
          </div>

          {/* Visual: layered event cards + calendar chip */}
          <div className="relative hidden h-[380px] animate-fade-in lg:block" aria-hidden>
            <div className="absolute right-8 top-2 w-72 rotate-2 rounded-2xl border border-white/10 bg-navy-800/90 p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/20 text-primary-300">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Event Calendar</p>
                  <p className="text-xs text-slate-400">October — December 2026</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {['TechFest 2026 · Oct 12', 'CodeSprint · Oct 18', 'Design Day · Oct 24'].map(
                  (row, i) => (
                    <div
                      key={row}
                      className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300"
                    >
                      <span>{row}</span>
                      <span className={i === 0 ? 'text-primary-300' : 'text-slate-500'}>●</span>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="absolute bottom-4 left-2 w-64 -rotate-3 rounded-2xl border border-white/10 bg-white p-5 text-slate-900 shadow-2xl">
              <div className="flex items-center gap-3">
                <ClubLogo />
                <div>
                  <p className="text-sm font-semibold">500+ students</p>
                  <p className="text-xs text-slate-500">active in the community</p>
                </div>
              </div>
              <div className="mt-4 flex gap-1.5" aria-hidden>
                {['bg-primary-500', 'bg-accent-500', 'bg-amber-400', 'bg-emerald-400', 'bg-rose-400', 'bg-violet-400'].map(
                  (c, i) => (
                    <span key={c} className={`h-8 flex-1 rounded-md ${c}`} style={{ opacity: 1 - i * 0.12 }} />
                  ),
                )}
              </div>
            </div>
            <div className="absolute right-24 bottom-24 animate-float rounded-xl border border-white/10 bg-navy-800/90 px-4 py-2.5 text-xs font-medium text-slate-200 shadow-lg">
              ⚡ HackNova · 200 hackers
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------- Club introduction */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
            About our club
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl">More Than Just Events</h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            We are a student-run community that turns classroom curiosity into hands-on
            experience — through workshops, hackathons, cultural events, competitions,
            networking sessions, technical sessions and community activities.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {ACTIVITIES.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-soft transition hover:border-primary-300 hover:text-primary-700"
            >
              <Icon className="h-4 w-4 text-primary-600" aria-hidden />
              {label}
            </span>
          ))}
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map(({ value, suffix, label }) => (
            <div key={label} className="card flex flex-col items-center gap-1 p-6 text-center">
              <dd className="text-3xl font-bold text-slate-900">
                {value}
                <span className="text-primary-600">{suffix}</span>
              </dd>
              <dt className="text-sm font-medium text-slate-500">{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ------------------------------------------ Upcoming events */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                What's next
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl">Upcoming Events</h2>
            </div>
            <Link to="/events" className="btn-secondary">
              View all events <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <EventCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={eventsState.retry} />
            ) : upcoming.length === 0 ? (
              <div className="card p-12 text-center text-slate-500">
                No events available. Check back soon!
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    seatsTaken={seatsTaken(event)}
                    registrationState={getRegistrationState(event, seatsTaken(event))}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------- Featured event */}
      {featured && (
        <FeaturedBanner
          event={featured}
          seatsTaken={seatsTaken(featured)}
          loading={loading}
          error={error}
          onRetry={eventsState.retry}
        />
      )}
    </>
  )
}

function FeaturedBanner({
  event,
  seatsTaken,
  loading,
  error,
  onRetry,
}: {
  event: Event
  seatsTaken: number
  loading: boolean
  error: string | null
  onRetry: () => void
}) {
  const target = `${event.date}T${event.startTime}:00`
  const cd = useCountdown(target) ?? { ended: true, days: 0, hours: 0, minutes: 0, seconds: 0 }

  const daysLeft = daysBetween(todayISO(), event.registrationDeadline)

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      {loading ? (
        <div className="card h-[420px] animate-pulse bg-slate-100" aria-hidden />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-navy-700 bg-navy-900 text-white shadow-xl">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[260px]">
              <SmartImage
                src={event.image}
                alt={`${event.title} banner`}
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy-900/90 lg:bg-gradient-to-r lg:from-navy-900/20 lg:to-navy-900" aria-hidden />
            </div>
            <div className="relative p-8 lg:p-12">
              <span className="badge bg-primary-500/15 text-primary-300">★ Featured Event</span>
              <h2 className="mt-4 text-3xl text-white sm:text-4xl">{event.title}</h2>
              <p className="mt-4 line-clamp-3 leading-relaxed text-slate-300">
                {event.description}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-white/5 p-3">
                  <dt className="text-xs font-medium text-slate-400">Date</dt>
                  <dd className="mt-0.5 font-semibold text-white">{formatDate(event.date)}</dd>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <dt className="text-xs font-medium text-slate-400">Time</dt>
                  <dd className="mt-0.5 font-semibold text-white">
                    {timeRange(event.startTime, event.endTime)}
                  </dd>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <dt className="text-xs font-medium text-slate-400">Venue</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 font-semibold text-white">
                    <MapPin className="h-3.5 w-3.5 text-primary-300" aria-hidden /> {event.venue}
                  </dd>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <dt className="text-xs font-medium text-slate-400">Registration deadline</dt>
                  <dd className="mt-0.5 font-semibold text-white">
                    {formatDate(event.registrationDeadline)}
                    {daysLeft >= 0 && (
                      <span className="ml-1.5 font-normal text-slate-400">
                        · {daysLeft} day{daysLeft === 1 ? '' : 's'} left
                      </span>
                    )}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div aria-label={`Countdown to event`}>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                    Starts in
                  </p>
                  <div className="flex gap-2">
                    {[
                      [cd.days, 'days'],
                      [cd.hours, 'hrs'],
                      [cd.minutes, 'min'],
                      [cd.seconds, 'sec'],
                    ].map(([v, l]) => (
                      <div
                        key={l as string}
                        className="min-w-[52px] rounded-lg border border-white/10 bg-navy-800 px-2 py-1.5 text-center"
                      >
                        <span className="block text-lg font-bold tabular-nums text-white">
                          {String(v).padStart(2, '0')}
                        </span>
                        <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">
                          {l}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  {getRegistrationState(event, seatsTaken).open ? (
                    <Link to={`/register/${event.id}`} className="btn-primary">
                      Register Now <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  ) : (
                    <Link to={`/events/${event.id}`} className="btn-primary">
                      View Details
                    </Link>
                  )}
                  <span className="text-xs text-slate-400">
                    {seatsTaken} registered · {Math.max(0, event.maxParticipants - seatsTaken)} seats
                    left
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

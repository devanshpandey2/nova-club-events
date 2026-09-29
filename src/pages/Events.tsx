import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useEvents } from '../hooks/useEvents'
import { useRegistrations } from '../hooks/useRegistrations'
import { EVENT_CATEGORIES } from '../data/models'
import { todayISO } from '../utils/helpers'
import { getRegistrationState } from '../utils/eventStatus'
import EventCard from '../components/EventCard'
import { EventCardSkeleton } from '../components/Skeletons'
import ErrorState from '../components/ErrorState'
import { cx } from '../utils/helpers'
import type { Event, EventCategory } from '../data/models'

const DATE_FILTERS = [
  { value: 'all', label: 'All dates' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
] as const

type DateFilter = (typeof DATE_FILTERS)[number]['value']

function inRange(event: Event, filter: DateFilter): boolean {
  const today = todayISO()
  if (filter === 'all') return true
  if (filter === 'today') return event.date === today
  const [y, m, d] = today.split('-').map(Number)
  const now = new Date(y, m - 1, d)
  const then = new Date(`${event.date}T00:00:00`)
  const diffDays = Math.round((then.getTime() - now.getTime()) / 86_400_000)
  if (filter === 'week') return diffDays >= 0 && diffDays <= 7
  return diffDays >= 0 && diffDays <= 31
}

export default function Events() {
  const eventsState = useEvents()
  const regsState = useRegistrations()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<EventCategory | 'All'>('All')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')

  const events = eventsState.data ?? []
  const regs = regsState.data ?? []

  const seatsTakenMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const r of regs) {
      if (r.status === 'Cancelled') continue
      map.set(r.eventId, (map.get(r.eventId) ?? 0) + 1)
    }
    return map
  }, [regs])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return events
      .filter((e) => e.status === 'Published')
      .filter((e) => {
        const matchesQuery =
          !q ||
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q)
        const matchesCategory = category === 'All' || e.category === category
        const matchesDate = inRange(e, dateFilter)
        return matchesQuery && matchesCategory && matchesDate
      })
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [events, query, category, dateFilter])

  const loading = eventsState.loading || regsState.loading
  const error = eventsState.error ?? regsState.error

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="animate-fade-up">
        <h1 className="text-3xl sm:text-4xl">Explore Events</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Find workshops, competitions and experiences happening across campus.
        </p>
      </header>

      {/* Search + filter bar */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events..."
            className="input pl-10"
            aria-label="Search events"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          className="input sm:w-44"
          aria-label="Filter by date"
        >
          {DATE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {(['All', ...EVENT_CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
            className={cx(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition',
              category === cat
                ? 'border-primary-600 bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                : 'border-slate-300 bg-white text-slate-600 hover:border-primary-400 hover:text-primary-700',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={eventsState.retry} />
        ) : filtered.length === 0 ? (
          <div className="card mx-auto max-w-md p-10 text-center">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Search className="h-6 w-6" aria-hidden />
            </span>
            <h3 className="text-lg">No events found</h3>
            <p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p>
            <button
              type="button"
              className="btn-secondary mt-5"
              onClick={() => {
                setQuery('')
                setCategory('All')
                setDateFilter('all')
              }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => {
              const taken = seatsTakenMap.get(event.id) ?? 0
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  seatsTaken={taken}
                  registrationState={getRegistrationState(event, taken)}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

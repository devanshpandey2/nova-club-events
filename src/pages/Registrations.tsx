import { useMemo, useState } from 'react'
import { ClipboardList, Search } from 'lucide-react'
import { useAdminData } from '../hooks/useAdminData'
import { updateRegistrationStatus } from '../services/api'
import { YEARS, REGISTRATION_STATUSES } from '../data/models'
import type { Event, Registration, RegistrationStatus } from '../data/models'
import { REGISTRATION_STATUS_BADGE } from '../components/Badges'
import Modal from '../components/Modal'
import ErrorState from '../components/ErrorState'
import { Skeleton } from '../components/Skeletons'
import { useToast } from '../components/Toast'
import { cx, formatDate, timeRange } from '../utils/helpers'

export default function Registrations() {
  const { data, loading, error, reload } = useAdminData()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [eventFilter, setEventFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Registration | null>(null)
  const [updating, setUpdating] = useState(false)

  const eventsById = useMemo(() => {
    const map = new Map<string, Event>()
    data.events.forEach((e) => map.set(e.id, e))
    return map
  }, [data.events])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.registrations
      .filter((r) => {
        const eventName = eventsById.get(r.eventId)?.title ?? ''
        const matchesQuery =
          !q ||
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.college.toLowerCase().includes(q) ||
          eventName.toLowerCase().includes(q)
        const matchesEvent = eventFilter === 'all' || r.eventId === eventFilter
        const matchesYear = yearFilter === 'all' || r.year === yearFilter
        const matchesStatus = statusFilter === 'all' || r.status === statusFilter
        return matchesQuery && matchesEvent && matchesYear && matchesStatus
      })
      .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt))
  }, [data.registrations, eventsById, query, eventFilter, yearFilter, statusFilter])

  async function changeStatus(reg: Registration, status: RegistrationStatus) {
    setUpdating(true)
    try {
      await updateRegistrationStatus(reg.id, status)
      toast.success(`Status updated to ${status} for ${reg.name}.`)
      setSelected(null)
      reload()
    } catch {
      toast.error('Failed to update status. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  if (error) {
    return <ErrorState message={error} onRetry={reload} />
  }

  const hasFilters =
    query || eventFilter !== 'all' || yearFilter !== 'all' || statusFilter !== 'all'

  return (
    <div className="animate-fade-in">
      <div>
        <h1 className="text-2xl">Registrations</h1>
        <p className="mt-1 text-sm text-slate-500">
          {loading ? 'Loading…' : `${data.registrations.length} total registrations across all events.`}
        </p>
      </div>

      {/* Filters */}
      <div className="card mt-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            className="input pl-9"
            placeholder="Search name, email, college, event…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search registrations"
          />
        </div>
        <select
          className="input"
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          aria-label="Filter by event"
        >
          <option value="all">All events</option>
          {data.events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          aria-label="Filter by year"
        >
          <option value="all">All years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          className="input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {REGISTRATION_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card mt-6 overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-slate-300" aria-hidden />
            <h3 className="mt-3 text-lg">No registrations found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {hasFilters ? 'Try changing your search or filters.' : 'Registrations will appear here as students sign up.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="th">Student</th>
                  <th className="th">Email</th>
                  <th className="th">College</th>
                  <th className="th">Year</th>
                  <th className="th">Event</th>
                  <th className="th">Registered</th>
                  <th className="th">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((reg) => {
                  const event = eventsById.get(reg.eventId)
                  const badge = REGISTRATION_STATUS_BADGE[reg.status]
                  return (
                    <tr
                      key={reg.id}
                      onClick={() => setSelected(reg)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelected(reg)
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View details for ${reg.name}`}
                      className="cursor-pointer transition-colors hover:bg-slate-50 focus-visible:bg-primary-50"
                    >
                      <td className="td font-medium text-slate-900">{reg.name}</td>
                      <td className="td">{reg.email}</td>
                      <td className="td max-w-[160px] truncate">{reg.college}</td>
                      <td className="td">{reg.year}</td>
                      <td className="td max-w-[180px] truncate">{event?.title ?? '—'}</td>
                      <td className="td">{formatDate(reg.registeredAt.slice(0, 10))}</td>
                      <td className="td">
                        <span className={cx('badge', badge.badge)}>
                          <span className={cx('h-1.5 w-1.5 rounded-full', badge.dot)} />
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Registration details"
        size="md"
        footer={
          selected && (
            <div className="flex flex-wrap gap-2">
              {REGISTRATION_STATUSES.filter((s) => s !== selected.status).map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={updating}
                  onClick={() => changeStatus(selected, s)}
                  className={s === 'Cancelled' ? 'btn-danger btn-sm' : 'btn-primary btn-sm'}
                >
                  Mark as {s}
                </button>
                ))}
              <button type="button" className="btn-secondary btn-sm" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Student</h3>
                <dl className="mt-2 space-y-1.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Name</dt>
                    <dd className="font-medium text-slate-900">{selected.name}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Email</dt>
                    <dd className="max-w-[190px] truncate font-medium text-slate-900">{selected.email}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Phone</dt>
                    <dd className="font-medium text-slate-900">{selected.phone}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">College</dt>
                    <dd className="max-w-[190px] truncate text-right font-medium text-slate-900">{selected.college}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Year</dt>
                    <dd className="font-medium text-slate-900">{selected.year}</dd>
                  </div>
                </dl>
              </section>
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Event</h3>
                <dl className="mt-2 space-y-1.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Event</dt>
                    <dd className="max-w-[190px] truncate text-right font-medium text-slate-900">
                      {eventsById.get(selected.eventId)?.title ?? '—'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Date</dt>
                    <dd className="font-medium text-slate-900">
                      {(() => {
                        const e = eventsById.get(selected.eventId)
                        return e ? formatDate(e.date) : '—'
                      })()}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Time</dt>
                    <dd className="font-medium text-slate-900">
                      {(() => {
                        const e = eventsById.get(selected.eventId)
                        return e ? timeRange(e.startTime, e.endTime) : '—'
                      })()}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Venue</dt>
                    <dd className="max-w-[190px] truncate text-right font-medium text-slate-900">
                      {eventsById.get(selected.eventId)?.venue ?? '—'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Registered</dt>
                    <dd className="font-medium text-slate-900">{formatDate(selected.registeredAt.slice(0, 10))}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Status</dt>
                    <dd>
                      <span className={cx('badge', REGISTRATION_STATUS_BADGE[selected.status].badge)}>
                        {selected.status}
                      </span>
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs text-slate-400">
                  ID: <code>{selected.id}</code>
                </p>
              </section>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

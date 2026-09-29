import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useAdminData } from '../hooks/useAdminData'
import { useToast } from '../components/Toast'
import { deleteEvent } from '../services/api'
import { EVENT_CATEGORIES } from '../data/models'
import { EVENT_STATUS_BADGE_BY_STATUS } from '../components/Badges'
import ConfirmDialog from '../components/ConfirmDialog'
import SmartImage from '../components/SmartImage'
import ErrorState from '../components/ErrorState'
import { Skeleton } from '../components/Skeletons'
import { cx, formatDate, timeRange } from '../utils/helpers'
import type { Event, EventCategory } from '../data/models'

export default function AdminEvents() {
  const { data, loading, error, reload } = useAdminData()
  const toast = useToast()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<EventCategory | 'All'>('All')
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.events
      .filter((e) => {
        const matchesQuery =
          !q ||
          e.title.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.organizer.toLowerCase().includes(q)
        return matchesQuery && (category === 'All' || e.category === category)
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [data.events, query, category])

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      await deleteEvent(deleteTarget.id)
      toast.success(`"${deleteTarget.title}" was deleted.`)
      setDeleteTarget(null)
      reload()
    } catch {
      toast.error('Failed to delete the event. Please try again.')
    }
  }

  if (error) {
    return <ErrorState message={error} onRetry={reload} />
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl">Manage Events</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, edit and remove club events.
          </p>
        </div>
        <Link to="/admin/events/new" className="btn-primary">
          <Plus className="h-4 w-4" aria-hidden /> Add Event
        </Link>
      </div>

      {/* Search + filter */}
      <div className="card mt-6 flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            className="input pl-9"
            placeholder="Search by name, venue or organizer…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search events"
          />
        </div>
        <select
          className="input sm:w-48"
          value={category}
          onChange={(e) => setCategory(e.target.value as EventCategory | 'All')}
          aria-label="Filter by category"
        >
          <option value="All">All categories</option>
          {EVENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card mt-6 overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-slate-300" aria-hidden />
            <h3 className="mt-3 text-lg">No events found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {query || category !== 'All'
                ? 'Try changing your search or filters.'
                : 'Create your first event to get started.'}
            </p>
            <Link to="/admin/events/new" className="btn-primary mt-5">
              <Plus className="h-4 w-4" aria-hidden /> Add Event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="th">Event</th>
                  <th className="th">Category</th>
                  <th className="th">Date</th>
                  <th className="th">Time</th>
                  <th className="th">Venue</th>
                  <th className="th">Registrations</th>
                  <th className="th">Status</th>
                  <th className="th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((event) => {
                  const regCount = data.registrations.filter(
                    (r) => r.eventId === event.id && r.status !== 'Cancelled',
                  ).length
                  const badge = EVENT_STATUS_BADGE_BY_STATUS[event.status]
                  return (
                    <tr key={event.id} className="transition-colors hover:bg-slate-50">
                      <td className="td">
                        <div className="flex items-center gap-3">
                          <SmartImage
                            src={event.image}
                            alt=""
                            className="h-9 w-14 shrink-0 rounded-md object-cover"
                          />
                          <div className="max-w-[200px]">
                            <p className="truncate font-medium text-slate-900">{event.title}</p>
                            <p className="text-xs text-slate-400">{event.organizer}</p>
                          </div>
                          </div>
                      </td>
                      <td className="td">{event.category}</td>
                      <td className="td">{formatDate(event.date)}</td>
                      <td className="td">{timeRange(event.startTime, event.endTime)}</td>
                      <td className="td max-w-[150px] truncate">{event.venue}</td>
                      <td className="td tabular-nums">
                        {regCount}/{event.maxParticipants}
                        <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-primary-500"
                            style={{
                              width: `${Math.min(100, (regCount / Math.max(1, event.maxParticipants)) * 100)}%`,
                            }}
                          />
                        </div>
                      </td>
                      <td className="td">
                        <span className={cx('badge', badge.badge)}>
                          <span className={cx('h-1.5 w-1.5 rounded-full', badge.dot)} />
                          {event.status}
                        </span>
                      </td>
                      <td className="td text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            className="btn-icon"
                            title="View public page"
                            aria-label={`View ${event.title}`}
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            title="Edit event"
                            aria-label={`Edit ${event.title}`}
                            onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="btn-icon hover:bg-rose-50 hover:text-rose-600"
                            title="Delete event"
                            aria-label={`Delete ${event.title}`}
                            onClick={() => setDeleteTarget(event)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete event?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This also removes its registrations. This action cannot be undone.`}
        confirmLabel="Delete Event"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

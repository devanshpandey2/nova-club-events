import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Eye,
  Pencil,
  Plus,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useAdminData } from '../hooks/useAdminData'
import { useToast } from '../components/Toast'
import { deleteEvent } from '../services/api'
import { EVENT_STATUS_BADGE_BY_STATUS, REGISTRATION_STATUS_BADGE } from '../components/Badges'
import ConfirmDialog from '../components/ConfirmDialog'
import ErrorState from '../components/ErrorState'
import { Skeleton } from '../components/Skeletons'
import { cx, formatDate } from '../utils/helpers'
import type { Event } from '../data/models'

// Newest-first slices for the "Recent" tables below.
const byNewestFirst = (a: { createdAt?: string }, b: { createdAt?: string }) =>
  (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
const byRegisteredAtDesc = (a: { registeredAt: string }, b: { registeredAt: string }) =>
  b.registeredAt.localeCompare(a.registeredAt)

const STAT_CARDS = [
  { key: 'totalEvents', label: 'Total Events', icon: CalendarDays, tone: 'bg-primary-50 text-primary-600' },
  { key: 'upcomingEvents', label: 'Upcoming Events', icon: TrendingUp, tone: 'bg-cyan-50 text-cyan-600' },
  { key: 'totalRegistrations', label: 'Total Registrations', icon: Users, tone: 'bg-emerald-50 text-emerald-600' },
  { key: 'activeEvents', label: 'Active Events', icon: ClipboardList, tone: 'bg-amber-50 text-amber-600' },
] as const

export default function AdminDashboard() {
  const { data, loading, error, reload } = useAdminData()
  const toast = useToast()
  const navigate = useNavigate()
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null)

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

  const { stats, events, registrations } = data

  return (
    <div className="animate-fade-in">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of club events and student registrations.
          </p>
        </div>
        <Link to="/admin/events/new" className="btn-primary">
          <Plus className="h-4 w-4" aria-hidden /> Add Event
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, tone }) => (
          <div key={key} className="card flex items-center gap-4 p-5">
            <span className={cx('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', tone)}>
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              {loading || !stats ? (
                <Skeleton className="h-7 w-14" />
              ) : (
                <p className="text-2xl font-bold tabular-nums text-slate-900">{stats[key]}</p>
              )}
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent events */}
      <section className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg">Recent Events</h2>
          <Link to="/admin/events" className="btn-ghost btn-sm">
            View all <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="th">Event</th>
                  <th className="th">Category</th>
                  <th className="th">Date</th>
                  <th className="th">Venue</th>
                  <th className="th">Registrations</th>
                  <th className="th">Status</th>
                  <th className="th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...events].sort(byNewestFirst).slice(0, 5).map((event) => {
                  const regCount = registrations.filter(
                    (r) => r.eventId === event.id && r.status !== 'Cancelled',
                  ).length
                  const statusBadge = EVENT_STATUS_BADGE_BY_STATUS[event.status]
                  return (
                    <tr key={event.id} className="transition-colors hover:bg-slate-50">
                      <td className="td max-w-[220px] truncate font-medium text-slate-900">
                        {event.title}
                      </td>
                      <td className="td">{event.category}</td>
                      <td className="td">{formatDate(event.date)}</td>
                      <td className="td max-w-[160px] truncate">{event.venue}</td>
                      <td className="td tabular-nums">{regCount}</td>
                      <td className="td">
                        <span className={cx('badge', statusBadge.badge)}>
                          <span className={cx('h-1.5 w-1.5 rounded-full', statusBadge.dot)} />
                          {event.status}
                        </span>
                      </td>
                      <td className="td text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            className="btn-icon"
                            title="View event"
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
                {events.length === 0 && (
                  <tr>
                    <td colSpan={7} className="td py-10 text-center text-slate-500">
                      No events yet. Create your first event.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent registrations */}
      <section className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg">Recent Registrations</h2>
          <Link to="/admin/registrations" className="btn-ghost btn-sm">
            View all <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="th">Student</th>
                  <th className="th">Email</th>
                  <th className="th">Event</th>
                  <th className="th">College</th>
                  <th className="th">Year</th>
                  <th className="th">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...registrations].sort(byRegisteredAtDesc).slice(0, 5).map((reg) => {
                  const event = events.find((e) => e.id === reg.eventId)
                  const badge = REGISTRATION_STATUS_BADGE[reg.status]
                  return (
                    <tr key={reg.id} className="transition-colors hover:bg-slate-50">
                      <td className="td">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-700">
                            {reg.name
                              .split(' ')
                              .map((p) => p[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()}
                          </span>
                          <span className="font-medium text-slate-900">{reg.name}</span>
                          <span className={cx('badge', badge.badge)}>{reg.status}</span>
                        </div>
                      </td>
                      <td className="td">{reg.email}</td>
                      <td className="td max-w-[180px] truncate">{event?.title ?? '—'}</td>
                      <td className="td max-w-[160px] truncate">{reg.college}</td>
                      <td className="td">{reg.year}</td>
                      <td className="td">{formatDate(reg.registeredAt.slice(0, 10))}</td>
                    </tr>
                  )
                })}
                {registrations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="td py-10 text-center text-slate-500">
                      No registrations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

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

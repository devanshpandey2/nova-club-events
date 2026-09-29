import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cx, formatDate, timeRange } from '../utils/helpers'
import { CATEGORY_STYLES, EVENT_STATUS_BADGE } from './Badges'
import SmartImage from './SmartImage'
import type { Event } from '../data/models'
import type { RegistrationState } from '../utils/eventStatus'

interface EventCardProps {
  event: Event
  seatsTaken: number
  registrationState: RegistrationState
  featured?: boolean
}

/** Reusable event card used on Home, Events list and related sections. */
export default function EventCard({
  event,
  seatsTaken,
  registrationState,
  featured = false,
}: EventCardProps) {
  return (
    <article
      className={cx(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover',
        featured && 'ring-2 ring-primary-500/30',
      )}
    >
      {/* Stretched link makes the whole card clickable to details */}
      <Link
        to={`/events/${event.id}`}
        className="focus-visible:outline-none"
        aria-label={`View details for ${event.title}`}
      >
        <span className="absolute inset-0" aria-hidden />
      </Link>

      <div className="relative h-44 overflow-hidden">
        <SmartImage
          src={event.image}
          alt={`${event.title} banner`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent"
          aria-hidden
        />
        <span className={cx('badge absolute left-3 top-3 shadow-sm', CATEGORY_STYLES[event.category].badge)}>
          {event.category}
        </span>
        {featured && (
          <span className="badge absolute right-3 top-3 bg-white/95 text-slate-800 shadow-sm">
            ★ Featured
          </span>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-white/95 px-2.5 py-1.5 shadow-sm">
          <Calendar className="h-3.5 w-3.5 text-primary-600" aria-hidden />
          <span className="text-xs font-semibold text-slate-800">{formatDate(event.date)}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg leading-snug text-slate-900">{event.title}</h3>

        <ul className="space-y-1.5 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            {timeRange(event.startTime, event.endTime)}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            {event.venue}
          </li>
          <li className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            {seatsTaken} registered · {Math.max(0, event.maxParticipants - seatsTaken)} seats left
          </li>
        </ul>

        <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">{event.description}</p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className={cx('badge', EVENT_STATUS_BADGE[registrationState.tone])}>
            {registrationState.label}
          </span>
          <div className="relative z-10 flex items-center gap-2">
            <Link to={`/events/${event.id}`} className="btn-secondary btn-sm">
              View Details
            </Link>
            {registrationState.open ? (
              <Link to={`/register/${event.id}`} className="btn-primary btn-sm">
                Register Now
              </Link>
            ) : (
              <span className="btn btn-sm cursor-not-allowed bg-slate-100 text-slate-400" aria-disabled>
                Closed
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

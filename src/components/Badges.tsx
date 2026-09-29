import type { EventCategory, EventStatus } from '../data/models'

export type Tone =
  | 'indigo'
  | 'cyan'
  | 'amber'
  | 'rose'
  | 'emerald'
  | 'purple'
  | 'slate'
  | 'blue'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral'

export const CATEGORY_STYLES: Record<EventCategory, { badge: string; iconBg: string }> = {
  Technology: { badge: 'bg-indigo-50 text-indigo-700', iconBg: 'bg-indigo-500' },
  Coding: { badge: 'bg-sky-50 text-sky-700', iconBg: 'bg-sky-500' },
  Cultural: { badge: 'bg-fuchsia-50 text-fuchsia-700', iconBg: 'bg-fuchsia-500' },
  Design: { badge: 'bg-violet-50 text-violet-700', iconBg: 'bg-violet-500' },
  Workshop: { badge: 'bg-amber-50 text-amber-700', iconBg: 'bg-amber-500' },
  Networking: { badge: 'bg-teal-50 text-teal-700', iconBg: 'bg-teal-500' },
  Competition: { badge: 'bg-rose-50 text-rose-700', iconBg: 'bg-rose-500' },
  Sports: { badge: 'bg-emerald-50 text-emerald-700', iconBg: 'bg-emerald-500' },
}

/** Badge classes for generic tones; icons/text provide the non-color cue. */
export const EVENT_STATUS_BADGE: Record<Tone, string> = {
  indigo: 'bg-primary-50 text-primary-700',
  cyan: 'bg-cyan-50 text-cyan-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  purple: 'bg-violet-50 text-violet-700',
  slate: 'bg-slate-100 text-slate-600',
  blue: 'bg-sky-50 text-sky-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-rose-50 text-rose-700',
  neutral: 'bg-slate-100 text-slate-600',
}

export const EVENT_STATUS_BADGE_BY_STATUS: Record<EventStatus, { badge: string; dot: string }> = {
  Draft: { badge: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  Published: { badge: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  Completed: { badge: 'bg-sky-50 text-sky-700', dot: 'bg-sky-500' },
  Cancelled: { badge: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500' },
}

export const REGISTRATION_STATUS_BADGE: Record<string, { badge: string; dot: string }> = {
  Registered: { badge: 'bg-primary-50 text-primary-700', dot: 'bg-primary-500' },
  Attended: { badge: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  Cancelled: { badge: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500' },
}

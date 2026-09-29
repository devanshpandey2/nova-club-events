import { todayISO } from './helpers'
import type { Event } from '../data/models'
import type { Tone } from '../components/Badges'

export interface RegistrationState {
  open: boolean
  label: string
  tone: Tone
}

export function getRegistrationState(event: Event, seatsTaken: number): RegistrationState {
  const today = todayISO()
  if (event.status === 'Draft') {
    return { open: false, label: 'Coming soon', tone: 'neutral' }
  }
  if (event.status === 'Cancelled') {
    return { open: false, label: 'Cancelled', tone: 'danger' }
  }
  if (event.status === 'Completed' || event.date < today) {
    return { open: false, label: 'Event over', tone: 'neutral' }
  }
  if (event.registrationDeadline && event.registrationDeadline < today) {
    return { open: false, label: 'Registrations closed', tone: 'neutral' }
  }
  const left = Math.max(0, event.maxParticipants - seatsTaken)
  if (left <= 0) {
    return { open: false, label: 'Fully booked', tone: 'danger' }
  }
  if (left <= Math.max(5, Math.round(event.maxParticipants * 0.1))) {
    return { open: true, label: `Few seats left · ${left}`, tone: 'warning' }
  }
  return { open: true, label: 'Registration open', tone: 'success' }
}

/**
 * Data access layer.
 *
 * All UI code talks to this module through async functions, mirroring a REST
 * API's shape. To move to a real backend (Express / Supabase / Firebase),
 * replace the bodies of these functions with fetch() calls — no component
 * changes required.
 *
 * Storage keys are versioned; bumping SCHEMA_VERSION reseeds demo data.
 */
import { delay, generateId, todayISO } from '../utils/helpers'
import { DEFAULT_ADMIN, SEED_EVENTS, SEED_REGISTRATIONS } from '../data/seedData'
import type {
  Admin,
  Event,
  EventCategory,
  EventStatus,
  Registration,
  RegistrationStatus,
} from '../data/models'

const SCHEMA_VERSION = 6
const EVENTS_KEY = `nova.events.v${SCHEMA_VERSION}`
const REGISTRATIONS_KEY = `nova.registrations.v${SCHEMA_VERSION}`
const SESSION_KEY = `nova.adminSession.v${SCHEMA_VERSION}`

/* ------------------------------------------------------------------ */
/* Low-level storage (localStorage now, HTTP later)                    */
/* ------------------------------------------------------------------ */

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable — ignore for demo purposes.
  }
}

function readEvents(): Event[] {
  const events = readJson<Event[] | null>(EVENTS_KEY, null)
  if (!events) {
    writeJson(EVENTS_KEY, SEED_EVENTS)
    return SEED_EVENTS
  }
  return events
}

function readRegistrations(): Registration[] {
  const regs = readJson<Registration[] | null>(REGISTRATIONS_KEY, null)
  if (!regs) {
    writeJson(REGISTRATIONS_KEY, SEED_REGISTRATIONS)
    return SEED_REGISTRATIONS
  }
  return regs
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

export interface EventInput {
  title: string
  description: string
  category: EventCategory
  date: string
  startTime: string
  endTime: string
  venue: string
  image: string
  organizer: string
  registrationDeadline: string
  maxParticipants: number
  status: EventStatus
  featured?: boolean
  rules: string[]
}

export async function fetchEvents(): Promise<Event[]> {
  await delay(250)
  return readEvents()
}

export async function fetchEventById(id: string): Promise<Event | null> {
  await delay(150)
  return readEvents().find((e) => e.id === id) ?? null
}

export async function createEvent(input: EventInput): Promise<Event> {
  await delay(300)
  const event: Event = {
    ...input,
    id: generateId('evt'),
    createdAt: new Date().toISOString(),
  }
  const events = readEvents()
  writeJson(EVENTS_KEY, [event, ...events])
  return event
}

export async function updateEvent(id: string, input: EventInput): Promise<Event> {
  await delay(300)
  const events = readEvents()
  const idx = events.findIndex((e) => e.id === id)
  if (idx === -1) throw new Error('Event not found')
  const updated: Event = { ...events[idx], ...input }
  events[idx] = updated
  writeJson(EVENTS_KEY, events)
  return updated
}

export async function deleteEvent(id: string): Promise<void> {
  await delay(250)
  writeJson(
    EVENTS_KEY,
    readEvents().filter((e) => e.id !== id),
  )
  // Cascade-delete registrations for this event.
  writeJson(
    REGISTRATIONS_KEY,
    readRegistrations().filter((r) => r.eventId !== id),
  )
}

/* ------------------------------------------------------------------ */
/* Registrations                                                       */
/* ------------------------------------------------------------------ */

export type RegistrationResult =
  | { ok: true; registration: Registration }
  | { ok: false; error: string }

export async function fetchRegistrations(): Promise<Registration[]> {
  await delay(250)
  return readRegistrations()
}

export async function fetchRegistrationsForEvent(eventId: string): Promise<Registration[]> {
  await delay(100)
  return readRegistrations().filter((r) => r.eventId === eventId && r.status !== 'Cancelled')
}

export async function registerForEvent(input: {
  eventId: string
  name: string
  email: string
  college: string
  year: Registration['year']
  phone: string
}): Promise<RegistrationResult> {
  await delay(500)
  const events = readEvents()
  const event = events.find((e) => e.id === input.eventId)
  if (!event) return { ok: false, error: 'Event not found.' }
  if (event.status !== 'Published') {
    return { ok: false, error: 'This event is not open for registration.' }
  }
  if (event.registrationDeadline && event.registrationDeadline < todayISO()) {
    return { ok: false, error: 'Registration deadline has passed for this event.' }
  }

  const regs = readRegistrations()
  const duplicate = regs.find(
    (r) =>
      r.eventId === input.eventId &&
      r.email.trim().toLowerCase() === input.email.trim().toLowerCase() &&
      r.status !== 'Cancelled',
  )
  if (duplicate) {
    return {
      ok: false,
      error: 'This email is already registered for the event.',
    }
  }

  const activeCount = regs.filter(
    (r) => r.eventId === input.eventId && r.status !== 'Cancelled',
  ).length
  if (activeCount >= event.maxParticipants) {
    return { ok: false, error: 'This event is fully booked.' }
  }

  const registration: Registration = {
    id: generateId('reg'),
    eventId: input.eventId,
    name: input.name.trim(),
    email: input.email.trim(),
    college: input.college.trim(),
    year: input.year,
    phone: input.phone.trim(),
    status: 'Registered',
    registeredAt: new Date().toISOString(),
  }
  writeJson(REGISTRATIONS_KEY, [...regs, registration])
  return { ok: true, registration }
}

export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
): Promise<Registration> {
  await delay(200)
  const regs = readRegistrations()
  const idx = regs.findIndex((r) => r.id === id)
  if (idx === -1) throw new Error('Registration not found')
  regs[idx] = { ...regs[idx], status }
  writeJson(REGISTRATIONS_KEY, regs)
  return regs[idx]
}

/* ------------------------------------------------------------------ */
/* Admin auth (demo credentials — swap this section for real auth)     */
/* ------------------------------------------------------------------ */

export async function adminLogin(email: string, password: string): Promise<Admin> {
  await delay(450)
  if (email.trim().toLowerCase() === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    writeJson(SESSION_KEY, { adminId: DEFAULT_ADMIN.id, loggedInAt: new Date().toISOString() })
    return DEFAULT_ADMIN
  }
  throw new Error('Invalid email or password')
}

export async function adminLogout(): Promise<void> {
  await delay(100)
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}

export function getAdminSession(): { adminId: string } | null {
  return readJson<{ adminId: string } | null>(SESSION_KEY, null)
}

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */

export interface DashboardStats {
  totalEvents: number
  upcomingEvents: number
  totalRegistrations: number
  activeEvents: number
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay(200)
  const events = readEvents()
  const regs = readRegistrations()
  const today = todayISO()
  return {
    totalEvents: events.length,
    upcomingEvents: events.filter(
      (e) => (e.status === 'Published' || e.status === 'Draft') && e.date >= today,
    ).length,
    totalRegistrations: regs.filter((r) => r.status !== 'Cancelled').length,
    activeEvents: events.filter((e) => e.status === 'Published' && e.date >= today).length,
  }
}

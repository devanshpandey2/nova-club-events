export const EVENT_CATEGORIES = [
  'Technology',
  'Coding',
  'Cultural',
  'Design',
  'Workshop',
  'Networking',
  'Competition',
  'Sports',
] as const
export type EventCategory = (typeof EVENT_CATEGORIES)[number]

export const EVENT_STATUSES = ['Draft', 'Published', 'Completed', 'Cancelled'] as const
export type EventStatus = (typeof EVENT_STATUSES)[number]

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Other'] as const
export type Year = (typeof YEARS)[number]

export const REGISTRATION_STATUSES = ['Registered', 'Attended', 'Cancelled'] as const
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number]

export interface Event {
  id: string
  title: string
  description: string
  category: EventCategory
  date: string // ISO yyyy-mm-dd
  startTime: string // HH:mm 24h
  endTime: string // HH:mm 24h
  venue: string
  image: string
  organizer: string
  registrationDeadline: string // ISO yyyy-mm-dd
  maxParticipants: number
  status: EventStatus
  featured?: boolean
  rules: string[]
  createdAt: string
}

export interface Registration {
  id: string
  eventId: string
  name: string
  email: string
  college: string
  year: Year
  phone: string
  status: RegistrationStatus
  registeredAt: string
}

export interface Admin {
  id: string
  email: string
  password: string
}

export interface ClubStats {
  totalEvents: number
  totalStudents: number
  workshops: number
  partners: number
}

import { useAsync } from './useAsync'
import { fetchEvents } from '../services/api'
import type { Event } from '../data/models'

export function useEvents() {
  return useAsync<Event[]>(fetchEvents, [])
}

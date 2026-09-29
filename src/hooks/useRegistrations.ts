import { useAsync } from './useAsync'
import { fetchRegistrations } from '../services/api'
import type { Registration } from '../data/models'

export function useRegistrations() {
  return useAsync<Registration[]>(fetchRegistrations, [])
}

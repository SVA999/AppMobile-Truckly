import type { Truck } from './types'

const KEY = 'truckly.fleet.v1'

export function loadTrucks(): Truck[] | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed as Truck[]
  } catch {
    return null
  }
}

export function saveTrucks(trucks: Truck[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(trucks))
  } catch {
  }
}

export function clearTrucks(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
  }
}
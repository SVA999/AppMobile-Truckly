import type { DocumentState } from './types'

export const EXPIRY_WARNING_DAYS = 45

const MS_DAY = 86_400_000

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

export function isoInDays(days: number): string {
  return toISODate(new Date(Date.now() + days * MS_DAY))
}

export function daysUntil(iso: string): number {
  const target = new Date(`${iso}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / MS_DAY)
}

export function documentState(iso: string): DocumentState {
  const d = daysUntil(iso)
  if (d < 0) return 'vencido'
  if (d <= EXPIRY_WARNING_DAYS) return 'proximo'
  return 'vigente'
}

export function isPastDate(iso: string): boolean {
  return daysUntil(iso) < 0
}

export function todayISO(): string {
  return toISODate(new Date())
}

const MONTHS_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

/** "12 Oct" — usado en las tarjetas de la lista de flota. */
export function formatDayMonth(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS_SHORT[d.getMonth()]}`
}

/** "15 Dic 2024" — usado en el perfil del camión. */
export function formatLongDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

/** "12/05/2023" — usado en la pantalla de documentos. */
export function formatSlashDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(
    2,
    '0',
  )}/${d.getFullYear()}`
}

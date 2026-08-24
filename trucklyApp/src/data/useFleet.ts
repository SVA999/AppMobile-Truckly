import { useContext } from 'react'
import { FleetContext, type FleetContextValue } from './FleetContext'

export function useFleet(): FleetContextValue {
  const ctx = useContext(FleetContext)
  if (!ctx) throw new Error('useFleet debe usarse dentro de <FleetProvider>')
  return ctx
}

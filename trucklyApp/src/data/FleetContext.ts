import { createContext } from 'react'
import type { DocumentKind, Truck, TruckEditableFields } from './types'

export interface FleetContextValue {
  trucks: Truck[]
  getTruck: (id: string) => Truck | undefined
  addTruck: (truck: Omit<Truck, 'id'>) => Truck
  updateTruck: (truckId: string, patch: Partial<TruckEditableFields>) => void
  updateDocument: (truckId: string, kind: DocumentKind, expiresOn: string) => void

  clearAllData: () => void
}

export const FleetContext = createContext<FleetContextValue | null>(null)

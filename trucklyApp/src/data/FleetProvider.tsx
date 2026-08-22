import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { FleetContext, type FleetContextValue } from './FleetContext'
import { clearTrucks, loadTrucks, saveTrucks } from './storage'
import type { DocumentKind, Truck, TruckEditableFields } from './types'

function slugifyPlate(plate: string): string {
  return plate.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export function FleetProvider({ children }: { children: ReactNode }) {
  const [trucks, setTrucks] = useState<Truck[]>(() => loadTrucks() ?? [])

  useEffect(() => {
    saveTrucks(trucks)
  }, [trucks])

  const getTruck = useCallback(
    (id: string) => trucks.find((t) => t.id === id),
    [trucks],
  )

  const addTruck = useCallback((draft: Omit<Truck, 'id'>) => {
    const base = slugifyPlate(draft.plate) || 'camion'
    let id = base
    let created!: Truck
    setTrucks((prev) => {
      let n = 2
      while (prev.some((t) => t.id === id)) id = `${base}-${n++}`
      created = { ...draft, id }
      return [created, ...prev]
    })
    return { ...draft, id } as Truck
  }, [])

  const updateTruck = useCallback(
    (truckId: string, patch: Partial<TruckEditableFields>) => {
      setTrucks((prev) =>
        prev.map((t) => (t.id === truckId ? { ...t, ...patch } : t)),
      )
    },
    [],
  )

  const updateDocument = useCallback(
    (truckId: string, kind: DocumentKind, expiresOn: string) => {
      setTrucks((prev) =>
        prev.map((t) => {
          if (t.id !== truckId) return t
          const exists = t.documents.some((d) => d.kind === kind)
          return {
            ...t,
            documents: exists
              ? t.documents.map((d) => (d.kind === kind ? { ...d, expiresOn } : d))
              : [...t.documents, { kind, expiresOn }],
          }
        }),
      )
    },
    [],
  )

  const clearAllData = useCallback(() => {
    clearTrucks()
    setTrucks([])
  }, [])

  const value = useMemo<FleetContextValue>(
    () => ({
      trucks,
      getTruck,
      addTruck,
      updateTruck,
      updateDocument,
      clearAllData,
    }),
    [trucks, getTruck, addTruck, updateTruck, updateDocument, clearAllData],
  )

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>
}

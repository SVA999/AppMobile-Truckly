export type TruckStatus = 'operativo' | 'mantenimiento' | 'inactivo'

export type BodyType = 'Refrigerado' | 'Seco' | 'Cisterna' | 'Furgón' | 'Plataforma'

export type DocumentKind =
  | 'soat'
  | 'tecnomecanica'
  | 'fumigacion'
  | 'manto-termico'
  | 'mercancias'

  
export type DocumentState = 'vigente' | 'proximo' | 'vencido'

export interface TruckDocument {
    kind: DocumentKind
    expiresOn: string    
}

export interface Truck {
  id: string
  plate: string
  brand: string
  model: string

  year: number | null
  capacityTons: number | null
  bodyType: BodyType
  status: TruckStatus
  driverName: string | null
  driverLicense: string | null
  driverPhone: string | null
  odometerKm: number | null

  workshopNote: string | null
  documents: TruckDocument[]
}

export type TruckEditableFields = Pick<
  Truck,
  | 'brand'
  | 'model'
  | 'year'
  | 'capacityTons'
  | 'bodyType'
  | 'status'
  | 'driverName'
  | 'driverLicense'
  | 'driverPhone'
>

export const DOCUMENT_LABELS: Record<DocumentKind, string> = {
  soat: 'SOAT',
  tecnomecanica: 'Tecnomecánica',
  fumigacion: 'Cert. Fumigación',
  'manto-termico': 'Manto. Thermo King',
  mercancias: 'Mercancías P.',
}

export const STATUS_LABELS: Record<TruckStatus, string> = {
  operativo: 'Operativo',
  mantenimiento: 'Mantenimiento',
  inactivo: 'Inactivo',
}

export const BODY_TYPES: BodyType[] = [
  'Refrigerado',
  'Seco',
  'Cisterna',
  'Furgón',
  'Plataforma',
]

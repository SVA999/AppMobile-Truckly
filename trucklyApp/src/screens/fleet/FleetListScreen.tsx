import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { Icon } from '../../components/icons/Icon'
import { Card, Chip, SearchInput, StatusBadge } from '../../components/ui'
import { useFleet } from '../../data/useFleet'
import { documentState, formatDayMonth } from '../../data/dates'
import { DOCUMENT_LABELS, type BodyType, type Truck, type TruckStatus } from '../../data/types'
import './FleetListScreen.css'

type StatusFilter = 'todos' | TruckStatus
type TypeFilter = 'todos' | BodyType

const STATUS_FILTERS: StatusFilter[] = ['operativo', 'mantenimiento', 'inactivo']
const TYPE_FILTERS: TypeFilter[] = ['Refrigerado', 'Seco']

/** Línea inferior de la tarjeta: taller si está en mantenimiento, si no el
 *  documento más urgente. Reproduce las tres variantes del diseño. */
function cardFootnote(truck: Truck) {
  if (truck.workshopNote) {
    return { icon: 'wrench' as const, size: 12, text: `Taller: ${truck.workshopNote}` }
  }
  const urgent = truck.documents
    .map((d) => ({ d, state: documentState(d.expiresOn) }))
    .filter((r) => r.state !== 'vigente')
    .sort((a, b) => a.d.expiresOn.localeCompare(b.d.expiresOn))[0]

  if (!urgent) return null

  return {
    icon: urgent.state === 'vencido' ? ('alert-triangle' as const) : ('document' as const),
    size: urgent.state === 'vencido' ? 13 : 13,
    text: `Venc. ${DOCUMENT_LABELS[urgent.d.kind]}: ${formatDayMonth(urgent.d.expiresOn)}`,
  }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export function FleetListScreen() {
  const { trucks } = useFleet()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('todos')
  const [type, setType] = useState<TypeFilter>('todos')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return trucks.filter((t) => {
      if (status !== 'todos' && t.status !== status) return false
      if (type !== 'todos' && t.bodyType !== type) return false
      if (!q) return true
      return (
        t.plate.toLowerCase().includes(q) ||
        (t.driverName?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [trucks, query, status, type])

  return (
    <AppShell>
      <div className="fleet">
        <h1 className="t-title">Gestión de Flota</h1>

        <div className="fleet__addRow">
          <Link to="/flota/nuevo" className="btn btn--primary btn--block">
            <Icon name="plus" size={11} />
            Agregar Camión
          </Link>
          <Link to="/conductores/nuevo" className="btn btn--secondary btn--block">
            <Icon name="user" size={12} />
            Agregar Conductor
          </Link>
        </div>

        {/* Controles ------------------------------------------------------ */}
        <Card className="fleet__controls">
          <SearchInput
            placeholder="Buscar por placa o conductor"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar por placa o conductor"
          />

          <div className="chip-row">
            <Chip
              active={status === 'todos'}
              caret
              onClick={() => setStatus('todos')}
            >
              Estado: Todos
            </Chip>
            {STATUS_FILTERS.map((s) => (
              <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
                {s[0].toUpperCase() + s.slice(1)}
              </Chip>
            ))}
          </div>

          <div className="chip-row">
            <Chip active={type === 'todos'} caret onClick={() => setType('todos')}>
              Tipo: Todos
            </Chip>
            {TYPE_FILTERS.map((t) => (
              <Chip key={t} active={type === t} onClick={() => setType(t)}>
                {t}
              </Chip>
            ))}
          </div>
        </Card>

        {/* Listado -------------------------------------------------------- */}
        <div className="fleet__list">
          {results.map((truck) => {
            const foot = cardFootnote(truck)
            return (
              <Card
                key={truck.id}
                className="fleet__card"
                role="link"
                tabIndex={0}
                onClick={() => navigate(`/flota/${truck.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    navigate(`/flota/${truck.id}`)
                  }
                }}
              >
                <div className="fleet__cardTop">
                  <div>
                    <p className="fleet__plate">{truck.plate}</p>
                    <p className="t-body t-muted">
                      {truck.brand} {truck.model} • {truck.bodyType}
                    </p>
                  </div>
                  <StatusBadge status={truck.status} />
                </div>

                <div className="fleet__cardGrid">
                  <div>
                    <p className="t-label">Conductor</p>
                    {truck.driverName ? (
                      <p className="fleet__driver">
                        <span className="fleet__avatar" aria-hidden="true">
                          {initials(truck.driverName)}
                        </span>
                        {truck.driverName}
                      </p>
                    ) : (
                      <p className="fleet__unassigned">Sin asignar</p>
                    )}
                  </div>
                </div>

                {foot && (
                  <div className="fleet__cardFoot">
                    <span className="fleet__footNote">
                      <Icon name={foot.icon} size={foot.size} />
                      {foot.text}
                    </span>
                    <Icon name="chevron-right" size={12} />
                  </div>
                )}
              </Card>
            )
          })}

          {results.length === 0 && (
            <Card>
              <p className="t-body t-muted">
                Ningún camión coincide con los filtros aplicados.
              </p>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  )
}

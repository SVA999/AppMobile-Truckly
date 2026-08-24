import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { Icon } from '../../components/icons/Icon'
import { Card, SearchInput, StatusBadge } from '../../components/ui'
import { useFleet } from '../../data/useFleet'
import { documentState, formatLongDate } from '../../data/dates'
import { DOCUMENT_LABELS } from '../../data/types'
import { useMemo, useState } from 'react'
import './DashboardScreen.css'

export function DashboardScreen() {
  const { trucks } = useFleet()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  /** Documentos vencidos o próximos a vencer, los más urgentes primero. */
  const alerts = useMemo(() => {
    return trucks
      .flatMap((t) =>
        t.documents
          .map((d) => ({ truck: t, doc: d, state: documentState(d.expiresOn) }))
          .filter((r) => r.state !== 'vigente'),
      )
      .sort((a, b) => a.doc.expiresOn.localeCompare(b.doc.expiresOn))
  }, [trucks])

  const criticalCount = alerts.filter((a) => a.state === 'vencido').length

  /** Camiones activos = flota realmente operativa ahora mismo. */
  const activeTrucks = useMemo(
    () => trucks.filter((t) => t.status === 'operativo').length,
    [trucks],
  )
  const capacityPct = trucks.length
    ? Math.round((activeTrucks / trucks.length) * 100)
    : 0

  const fleetPreview = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? trucks.filter(
          (t) =>
            t.plate.toLowerCase().includes(q) ||
            (t.driverName?.toLowerCase().includes(q) ?? false),
        )
      : trucks
    return list.slice(0, 5)
  }, [query, trucks])

  return (
    <AppShell>
      <div className="dash">
        {/* Métricas ------------------------------------------------------- */}
        <Card>
          <div className="dash__statHead">
            <span className="t-label dash__statLabel">Camiones activos</span>
            <Icon name="signal" size={14} />
          </div>
          <p className="dash__statValue">
            {activeTrucks}
            <span className="dash__statTotal"> / {trucks.length}</span>
          </p>
          <p className="t-meta">{capacityPct}% de capacidad operativa</p>
        </Card>

        <Card className="card--outlined">
          <div className="dash__statHead">
            <span className="t-label dash__statLabel dash__statLabel--strong">
              Alertas críticas
            </span>
            <Icon name="alert-lg" size={19} />
          </div>
          <p className="dash__statValue">{String(criticalCount).padStart(2, '0')}</p>
          <p className="t-meta">Requieren atención inmediata</p>
        </Card>

        {/* Alertas de documentación --------------------------------------- */}
        <section className="dash__section">
          <div className="dash__sectionHead">
            <div>
              <h2 className="t-title">Alertas de Documentación</h2>
              <p className="t-meta">
                Gestione los trámites legales y técnicos obligatorios.
              </p>
            </div>
            <Link to="/documentos" className="dash__seeAll">
              Ver todo
            </Link>
          </div>

          <div className="dash__table">
            <div className="dash__tableHead">
              <span className="t-label">Placa</span>
              <span className="t-label">Documento</span>
              <span className="t-label">Fecha vencimiento</span>
            </div>
            {alerts.slice(0, 3).map(({ truck, doc, state }) => (
              <Link
                key={`${truck.id}-${doc.kind}`}
                to={`/flota/${truck.id}`}
                className="dash__tableRow"
              >
                <span className="dash__plate">{truck.plate}</span>
                <span className="t-body">{DOCUMENT_LABELS[doc.kind]}</span>
                <span className={state === 'vencido' ? 't-body t-danger' : 't-body'}>
                  {formatLongDate(doc.expiresOn)}
                </span>
              </Link>
            ))}
            {alerts.length === 0 && (
              <p className="dash__empty t-meta">
                Toda la documentación está vigente.
              </p>
            )}
          </div>
        </section>

        {/* Resumen de flota ------------------------------------------------ */}
        <section className="dash__section">
          <div className="dash__sectionHead dash__sectionHead--search">
            <h2 className="t-title">Resumen de Flota</h2>
            <div className="dash__search">
              <SearchInput
                placeholder="Buscar placa o conductor..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Buscar placa o conductor"
              />
            </div>
          </div>

          <div className="dash__activity">
            {fleetPreview.map((truck) => (
              <Card
                key={truck.id}
                className="card--flush dash__actCard"
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
                <div className="dash__actHead">
                  <span className="dash__actPlate">{truck.plate}</span>
                  <StatusBadge status={truck.status} />
                </div>
                <div className="dash__actBody">
                  <div className="dash__actRow">
                    <span className="t-label">Conductor</span>
                    <span className="dash__actValue">
                      {truck.driverName ?? 'Sin asignar'}
                    </span>
                  </div>
                  <div className="dash__actRow">
                    <span className="t-label">Marca / Modelo</span>
                    <span className="dash__actValue">
                      {truck.brand} {truck.model}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
            {fleetPreview.length === 0 && (
              <p className="t-meta">Sin resultados para "{query}".</p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  )
}

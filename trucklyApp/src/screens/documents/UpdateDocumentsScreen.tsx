import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { Icon, type IconName } from '../../components/icons/Icon'
import { Badge, Button, Card } from '../../components/ui'
import { useFleet } from '../../data/useFleet'
import { documentState, formatSlashDate, todayISO } from '../../data/dates'
import { DOCUMENT_LABELS, type DocumentKind, type Truck } from '../../data/types'
import './UpdateDocumentsScreen.css'

const DOC_ICONS: Record<DocumentKind, IconName> = {
  soat: 'shield',
  tecnomecanica: 'wrench-square',
  fumigacion: 'spray',
  'manto-termico': 'snowflake',
  mercancias: 'archive',
}

interface PendingDoc {
  truck: Truck
  kind: DocumentKind
  expiresOn: string
  state: 'proximo' | 'vencido'
}

interface TruckGroup {
  truck: Truck
  docs: PendingDoc[]
  hasExpired: boolean
}

export function UpdateDocumentsScreen() {
  const { trucks, updateDocument } = useFleet()
  const [editing, setEditing] = useState<string | null>(null)
  const [draftDate, setDraftDate] = useState('')

  /** Documentos vencidos o próximos a vencer, agrupados por camión. */
  const groups = useMemo<TruckGroup[]>(() => {
    const list: TruckGroup[] = []
    for (const truck of trucks) {
      const docs = truck.documents
        .map((d) => ({ truck, kind: d.kind, expiresOn: d.expiresOn, state: documentState(d.expiresOn) }))
        .filter((r): r is PendingDoc => r.state !== 'vigente')
        .sort((a, b) => a.expiresOn.localeCompare(b.expiresOn))
      if (docs.length === 0) continue
      list.push({ truck, docs, hasExpired: docs.some((d) => d.state === 'vencido') })
    }
    return list.sort((a, b) => (a.hasExpired === b.hasExpired ? 0 : a.hasExpired ? -1 : 1))
  }, [trucks])

  function startEdit(key: string, current: string) {
    setEditing(key)
    setDraftDate(current)
  }

  function save(truckId: string, kind: DocumentKind) {
    if (draftDate) updateDocument(truckId, kind, draftDate)
    setEditing(null)
  }

  return (
    <AppShell>
      <div className="docs">
        <header className="docs__head">
          <h1 className="t-title">Actualización de Documentos</h1>
          <p className="t-body t-muted">
            Gestione los documentos vencidos o próximos a vencer de la flota.
          </p>
        </header>

        <div className="docs__groups">
          {groups.map(({ truck, docs, hasExpired }) => (
            <Card
              key={truck.id}
              className={hasExpired ? 'docs__truckCard docs__truckCard--danger' : 'docs__truckCard'}
            >
              <div className="docs__truckHead">
                <div>
                  <Link to={`/flota/${truck.id}`} className="docs__truckPlate">
                    {truck.plate}
                  </Link>
                  <p className="t-meta">
                    {truck.brand} {truck.model}
                  </p>
                </div>
                {hasExpired && <Badge variant="solid">Vencido</Badge>}
              </div>

              <div className="docs__docList">
                {docs.map(({ kind, expiresOn, state }) => {
                  const key = `${truck.id}-${kind}`
                  const isEditing = editing === key
                  return (
                    <div
                      key={key}
                      className={
                        state === 'vencido' ? 'docs__doc docs__doc--danger' : 'docs__doc'
                      }
                    >
                      <div className="docs__docHead">
                        <span className="docs__icon">
                          <Icon name={DOC_ICONS[kind]} size={15} />
                        </span>
                        <span className="docs__docName">{DOCUMENT_LABELS[kind]}</span>
                        <Badge variant={state === 'vencido' ? 'solid' : 'outline'}>
                          {state === 'vencido' ? 'Vencido' : 'Próximo a vencer'}
                        </Badge>
                      </div>

                      <div className="docs__row">
                        <span className="t-body t-muted">Vencimiento:</span>
                        <span
                          className={
                            state === 'vencido' ? 'docs__value t-danger' : 'docs__value'
                          }
                        >
                          {formatSlashDate(expiresOn)}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="docs__edit">
                          <label className="docs__editLabel" htmlFor={`d-${key}`}>
                            Nueva Fecha de Vencimiento
                          </label>
                          <input
                            id={`d-${key}`}
                            type="date"
                            min={todayISO()}
                            className="docs__dateInput"
                            value={draftDate}
                            onChange={(e) => setDraftDate(e.target.value)}
                          />
                          <div className="docs__actions">
                            <Button variant="secondary" onClick={() => setEditing(null)}>
                              Cancelar
                            </Button>
                            <Button onClick={() => save(truck.id, kind)}>Guardar</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="docs__footer">
                          <Button onClick={() => startEdit(key, expiresOn)}>
                            {state === 'vencido' ? 'Actualizar' : 'Editar'}
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          ))}

          {groups.length === 0 && (
            <Card>
              <p className="t-body t-muted">
                Toda la documentación de la flota está vigente.
              </p>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  )
}

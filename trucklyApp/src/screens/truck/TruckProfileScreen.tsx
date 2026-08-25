import { useState, type FormEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { Icon, type IconName } from '../../components/icons/Icon'
import { Button, Card, Field, SelectField } from '../../components/ui'
import { useFleet } from '../../data/useFleet'
import { documentState, formatLongDate } from '../../data/dates'
import {
  BODY_TYPES,
  DOCUMENT_LABELS,
  STATUS_LABELS,
  type BodyType,
  type DocumentKind,
  type Truck,
  type TruckStatus,
} from '../../data/types'
import './TruckProfileScreen.css'

const DOC_ICONS: Record<DocumentKind, IconName> = {
  soat: 'shield-lg',
  tecnomecanica: 'wrench-lg',
  fumigacion: 'spray',
  'manto-termico': 'snowflake',
  mercancias: 'archive',
}

const STATUSES: TruckStatus[] = ['operativo', 'mantenimiento', 'inactivo']

/** Sólo letras (con tildes), números y espacios: sin símbolos sueltos. */
const NO_SYMBOLS = /^[\p{L}\p{N} ]+$/u

interface EditForm {
  brand: string
  model: string
  year: string
  capacity: string
  bodyType: string
  status: string
}

function draftFrom(truck: Truck): EditForm {
  return {
    brand: truck.brand,
    model: truck.model,
    year: truck.year != null ? String(truck.year) : '',
    capacity: truck.capacityTons != null ? String(truck.capacityTons) : '',
    bodyType: truck.bodyType,
    status: truck.status,
  }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export function TruckProfileScreen() {
  const { id } = useParams<{ id: string }>()
  const { getTruck, updateTruck } = useFleet()
  const truck = id ? getTruck(id) : undefined

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<EditForm>(() =>
    truck ? draftFrom(truck) : draftFrom({} as Truck),
  )
  const [errors, setErrors] = useState<Partial<Record<keyof EditForm, string>>>({})

  if (!truck) return <Navigate to="/flota" replace />

  const set = (key: keyof EditForm) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  function startEdit() {
    setForm(draftFrom(truck!))
    setErrors({})
    setEditing(true)
  }

  function validate(): boolean {
    const next: Partial<Record<keyof EditForm, string>> = {}
    const currentYear = new Date().getFullYear()

    if (!form.brand.trim()) next.brand = 'Requerido'
    else if (!NO_SYMBOLS.test(form.brand.trim())) next.brand = 'Sin símbolos'

    if (!form.model.trim()) next.model = 'Requerido'
    else if (!NO_SYMBOLS.test(form.model.trim())) next.model = 'Sin símbolos'

    if (form.year) {
      const y = Number(form.year)
      if (!Number.isInteger(y) || y < 1980 || y > currentYear + 1)
        next.year = `Entre 1980 y ${currentYear + 1}`
    }

    if (form.capacity) {
      const c = Number(form.capacity)
      if (Number.isNaN(c) || c <= 0 || c > 80) next.capacity = 'Entre 0.1 y 80 ton'
    }

    if (!form.bodyType) next.bodyType = 'Seleccione un tipo'
    if (!form.status) next.status = 'Seleccione un estado'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    updateTruck(truck!.id, {
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: form.year ? Number(form.year) : null,
      capacityTons: form.capacity ? Number(form.capacity) : null,
      bodyType: form.bodyType as BodyType,
      status: form.status as TruckStatus,
    })
    setEditing(false)
  }

  return (
    <AppShell showBack>
      <div className="truck">
        {/* Hero ----------------------------------------------------------- */}
        <Card className="card--flush">
          <div className="truck__hero">
            <span className="truck__plate">{truck.plate}</span>
          </div>

          <div className="truck__heroBody">
            <div className="truck__statusRow">
              <div>
                <p className="t-label truck__statusLabel">Estado actual</p>
                <span className={`truck__statusPill truck__statusPill--${truck.status}`}>
                  <span className="truck__statusDot" />
                  {STATUS_LABELS[truck.status].toUpperCase()}
                </span>
              </div>
              {!editing && <Button onClick={startEdit}>Editar Datos</Button>}
            </div>
          </div>
        </Card>

        {/* Información básica / edición ------------------------------------ */}
        <Card>
          <div className="truck__sectionHead">
            <Icon name="info-circle" size={20} />
            <h2 className="truck__sectionTitle">
              {editing ? 'Editar Información' : 'Información Básica'}
            </h2>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="truck__editForm" noValidate>
              <Field
                label="Marca"
                value={form.brand}
                onChange={(e) => set('brand')(e.target.value)}
                error={errors.brand}
              />
              <Field
                label="Modelo"
                value={form.model}
                onChange={(e) => set('model')(e.target.value)}
                error={errors.model}
              />
              <Field
                label="Año"
                inputMode="numeric"
                placeholder="Ej. 2022"
                value={form.year}
                onChange={(e) => set('year')(e.target.value)}
                error={errors.year}
              />
              <Field
                label="Capacidad (Toneladas)"
                inputMode="decimal"
                placeholder="Ej. 15.5"
                value={form.capacity}
                onChange={(e) => set('capacity')(e.target.value)}
                error={errors.capacity}
              />
              <SelectField
                label="Tipo de carrocería"
                value={form.bodyType}
                onChange={(e) => set('bodyType')(e.target.value)}
                error={errors.bodyType}
              >
                {BODY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label="Estado"
                value={form.status}
                onChange={(e) => set('status')(e.target.value)}
                error={errors.status}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </SelectField>

              <div className="truck__editActions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar</Button>
              </div>
            </form>
          ) : (
            <dl className="truck__specs">
              <div>
                <dt className="t-meta">Marca</dt>
                <dd className="truck__specValue">{truck.brand}</dd>
              </div>
              <div>
                <dt className="t-meta">Modelo</dt>
                <dd className="truck__specValue">
                  {truck.model}
                  {truck.year ? ` (${truck.year})` : ''}
                </dd>
              </div>
              <div>
                <dt className="t-meta">Capacidad</dt>
                <dd className="truck__specValue">
                  {truck.capacityTons
                    ? `${(truck.capacityTons * 1000).toLocaleString('es-CO')} kg (${truck.capacityTons} Ton)`
                    : '—'}
                </dd>
              </div>
              <div>
                <dt className="t-meta">Tipo de carrocería</dt>
                <dd className="truck__specValue">{truck.bodyType}</dd>
              </div>
            </dl>
          )}
        </Card>

        {/* Control documental --------------------------------------------- */}
        <Card>
          <div className="truck__sectionHead truck__sectionHead--split">
            <div className="truck__sectionHead">
              <Icon name="doc-header" size={18} />
              <h2 className="truck__sectionTitle">Control Documental</h2>
            </div>
            <Link to="/documentos" className="truck__updateLink">
              Actualizar
              <Icon name="refresh" size={10} />
            </Link>
          </div>

          <ul className="truck__docs">
            {truck.documents.map((doc) => {
              const state = documentState(doc.expiresOn)
              return (
                <li key={doc.kind} className="truck__doc">
                  <span className="truck__docIcon">
                    <Icon name={DOC_ICONS[doc.kind]} size={18} />
                  </span>
                  <span className="truck__docText">
                    <span className="truck__docName">{DOCUMENT_LABELS[doc.kind]}</span>
                    <span className="t-meta">
                      Expira: {formatLongDate(doc.expiresOn)}
                    </span>
                  </span>
                  {state === 'vigente' ? (
                    <Icon name="check-circle" size={20} title="Vigente" />
                  ) : (
                    <span className="truck__docAlert">
                      <Icon
                        name="alert-red"
                        size={19}
                        title={state === 'vencido' ? 'Vencido' : 'Próximo a vencer'}
                      />
                    </span>
                  )}
                </li>
              )
            })}
            {truck.documents.length === 0 && (
              <li className="t-meta">Sin documentos registrados.</li>
            )}
          </ul>

          <Link to="/documentos" className="btn btn--primary btn--block truck__docsBtn">
            <Icon name="doc-outline" size={14} />
            Actualizar Documentos
          </Link>
        </Card>

        {/* Conductor ------------------------------------------------------- */}
        <Card>
          <div className="truck__sectionHead">
            <Icon name="nav-profile" size={16} />
            <h2 className="truck__sectionTitle">Conductor</h2>
          </div>

          {truck.driverName ? (
            <>
              <div className="truck__driverBox">
                <span className="truck__driverAvatar" aria-hidden="true">
                  {initials(truck.driverName)}
                </span>
                <p className="truck__driverName">{truck.driverName}</p>
                <p className="t-meta">Licencia: {truck.driverLicense ?? '—'}</p>
                {truck.driverPhone && (
                  <p className="t-meta">Teléfono: {truck.driverPhone}</p>
                )}
              </div>
              {truck.driverPhone && (
                <a
                  href={`tel:${truck.driverPhone}`}
                  className="btn btn--secondary btn--block truck__contact"
                >
                  Llamar al conductor
                </a>
              )}
            </>
          ) : (
            <div className="truck__noDriver">
              <p className="t-body t-muted">
                Este camión no tiene conductor asignado.
              </p>
              <Link
                to={`/conductores/nuevo?truck=${truck.id}`}
                className="btn btn--secondary btn--block"
              >
                <Icon name="user" size={12} />
                Asignar Conductor
              </Link>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  )
}

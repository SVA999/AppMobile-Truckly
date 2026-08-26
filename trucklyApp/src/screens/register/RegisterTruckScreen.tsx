import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { Icon } from '../../components/icons/Icon'
import { Button, Card, Field, SelectField } from '../../components/ui'
import { useFleet } from '../../data/useFleet'
import { isPastDate, todayISO } from '../../data/dates'
import { BODY_TYPES, type BodyType, type DocumentKind } from '../../data/types'
import './RegisterTruckScreen.css'

interface FormState {
  plate: string
  brand: string
  model: string
  year: string
  capacity: string
  bodyType: string
  soat: string
  tecnomecanica: string
  fumigacion: string
  mantoTermico: string
}

const EMPTY: FormState = {
  plate: '',
  brand: '',
  model: '',
  year: '',
  capacity: '',
  bodyType: '',
  soat: '',
  tecnomecanica: '',
  fumigacion: '',
  mantoTermico: '',
}

const DOC_FIELDS: { key: keyof FormState; kind: DocumentKind; label: string }[] = [
  { key: 'soat', kind: 'soat', label: 'Vencimiento SOAT' },
  { key: 'tecnomecanica', kind: 'tecnomecanica', label: 'Vencimiento Tecnomecánica' },
  { key: 'fumigacion', kind: 'fumigacion', label: 'Vencimiento Cert. Fumigación' },
  { key: 'mantoTermico', kind: 'manto-termico', label: 'Vencimiento Manto Termico' },
]

/** Sólo letras (con tildes), números y espacios: sin símbolos sueltos. */
const NO_SYMBOLS = /^[\p{L}\p{N} ]+$/u

export function RegisterTruckScreen() {
  const { addTruck } = useFleet()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const set = (key: keyof FormState) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    const currentYear = new Date().getFullYear()

    if (!/^[A-Za-z]{3}-?\d{3}$/.test(form.plate.trim()))
      next.plate = 'Formato esperado: ABC-123'

    if (!form.brand.trim()) next.brand = 'Requerido'
    else if (!NO_SYMBOLS.test(form.brand.trim())) next.brand = 'Sin símbolos'

    if (!form.model.trim()) next.model = 'Requerido'
    else if (!NO_SYMBOLS.test(form.model.trim())) next.model = 'Sin símbolos'

    if (!form.year.trim()) {
      next.year = 'Requerido'
    } else {
      const y = Number(form.year)
      if (!Number.isInteger(y) || y < 1980 || y > currentYear + 1)
        next.year = `Entre 1980 y ${currentYear + 1}`
    }

    if (!form.capacity.trim()) {
      next.capacity = 'Requerido'
    } else {
      const c = Number(form.capacity)
      if (Number.isNaN(c) || c <= 0 || c > 80) next.capacity = 'Entre 0.1 y 80 ton'
    }

    if (!form.bodyType) next.bodyType = 'Seleccione un tipo'

    for (const f of DOC_FIELDS) {
      const value = form[f.key]
      if (!value) next[f.key] = 'Requerido'
      else if (isPastDate(value)) next[f.key] = 'No puede ser una fecha pasada'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const documents = DOC_FIELDS.map((f) => ({
      kind: f.kind,
      expiresOn: form[f.key] as string,
    }))

    const created = addTruck({
      plate: form.plate.trim().toUpperCase(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: Number(form.year),
      capacityTons: Number(form.capacity),
      bodyType: form.bodyType as BodyType,
      status: 'inactivo',
      driverName: null,
      driverLicense: null,
      driverPhone: null,
      odometerKm: 0,
      workshopNote: null,
      documents,
    })

    navigate(`/flota/${created.id}`, { replace: true })
  }

  return (
    <AppShell
      footer={
        <Button type="submit" form="register-truck" block>
          <Icon name="save" size={16} />
          GUARDAR CAMIÓN
        </Button>
      }
    >
      <div className="register">
        <div className="register__head">
          <button
            type="button"
            className="register__back"
            onClick={() => navigate(-1)}
            aria-label="Volver"
          >
            <Icon name="arrow-left" size={16} />
          </button>
          <h1 className="t-title">Registrar Nuevo Camión</h1>
        </div>

        <form id="register-truck" onSubmit={handleSubmit} noValidate>
          <Card className="card--flush">
            <div className="card__header">
              <h2 className="register__cardTitle">Detalles Técnicos</h2>
            </div>
            <div className="card__body register__fields">
              <Field
                label="Placa"
                placeholder="Ej. ABC-123"
                value={form.plate}
                onChange={(e) => set('plate')(e.target.value)}
                error={errors.plate}
                autoCapitalize="characters"
              />
              <Field
                label="Marca"
                placeholder="Ej. Volvo"
                value={form.brand}
                onChange={(e) => set('brand')(e.target.value)}
                error={errors.brand}
              />
              <Field
                label="Modelo"
                placeholder="Ej. FH16"
                value={form.model}
                onChange={(e) => set('model')(e.target.value)}
                error={errors.model}
              />
              <Field
                label="Año"
                placeholder="Ej. 2022"
                inputMode="numeric"
                value={form.year}
                onChange={(e) => set('year')(e.target.value)}
                error={errors.year}
              />
              <Field
                label="Capacidad (Toneladas)"
                placeholder="Ej. 15.5"
                inputMode="decimal"
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
                <option value="">Seleccione el tipo...</option>
                {BODY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </SelectField>
            </div>
          </Card>

          <Card className="card--flush register__docs">
            <div className="card__header">
              <h2 className="register__cardTitle">Documentación Legal</h2>
            </div>
            <div className="card__body register__fields">
              {DOC_FIELDS.map((f) => (
                <Field
                  key={f.key}
                  label={f.label}
                  type="date"
                  min={todayISO()}
                  value={form[f.key]}
                  onChange={(e) => set(f.key)(e.target.value)}
                  error={errors[f.key]}
                />
              ))}
            </div>
          </Card>
        </form>
      </div>
    </AppShell>
  )
}

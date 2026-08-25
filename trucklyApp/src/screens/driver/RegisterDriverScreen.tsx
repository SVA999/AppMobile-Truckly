import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { Icon } from '../../components/icons/Icon'
import { Button, Card, Field, SelectField } from '../../components/ui'
import { useFleet } from '../../data/useFleet'
import '../register/RegisterTruckScreen.css'

const LICENSE_CATEGORIES = ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'] as const

interface FormState {
  name: string
  license: string
  category: string
  phone: string
  truckId: string
}

const EMPTY: FormState = {
  name: '',
  license: '',
  category: '',
  phone: '',
  truckId: '',
}

/** Sólo letras (con tildes) y espacios: sin símbolos ni números. */
const NAME_PATTERN = /^[\p{L} ]+$/u
/** Sólo letras y números: sin símbolos sueltos. */
const NO_SYMBOLS = /^[\p{L}\p{N}]+$/u
const PHONE_PATTERN = /^\d{7,10}$/

export function RegisterDriverScreen() {
  const { trucks, updateTruck } = useFleet()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselected = searchParams.get('truck') ?? ''

  const availableTrucks = useMemo(
    () => trucks.filter((t) => !t.driverName || t.id === preselected),
    [trucks, preselected],
  )

  const [form, setForm] = useState<FormState>({
    ...EMPTY,
    truckId: availableTrucks.some((t) => t.id === preselected) ? preselected : '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const set = (key: keyof FormState) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}

    if (!form.name.trim()) next.name = 'Requerido'
    else if (!NAME_PATTERN.test(form.name.trim())) next.name = 'Sin símbolos ni números'

    if (!form.license.trim()) next.license = 'Requerido'
    else if (!NO_SYMBOLS.test(form.license.trim())) next.license = 'Sin símbolos'

    if (!form.category) next.category = 'Seleccione una categoría'

    if (form.phone.trim() && !PHONE_PATTERN.test(form.phone.trim()))
      next.phone = 'Entre 7 y 10 dígitos'

    if (!form.truckId) next.truckId = 'Seleccione un camión'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    updateTruck(form.truckId, {
      driverName: form.name.trim(),
      driverLicense: `${form.category} (Vigente)`,
      driverPhone: form.phone.trim() || null,
    })

    navigate(`/flota/${form.truckId}`, { replace: true })
  }

  const noTrucksAtAll = trucks.length === 0
  const noneAvailable = !noTrucksAtAll && availableTrucks.length === 0

  return (
    <AppShell
      footer={
        !noTrucksAtAll && !noneAvailable ? (
          <Button type="submit" form="register-driver" block>
            <Icon name="save" size={16} />
            GUARDAR CONDUCTOR
          </Button>
        ) : undefined
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
          <h1 className="t-title">Registrar Conductor</h1>
        </div>

        {noTrucksAtAll ? (
          <Card>
            <p className="t-body t-muted">
              No hay camiones registrados. Registra un camión antes de asignarle
              un conductor.
            </p>
          </Card>
        ) : noneAvailable ? (
          <Card>
            <p className="t-body t-muted">
              Todos los camiones ya tienen un conductor asignado.
            </p>
          </Card>
        ) : (
          <form id="register-driver" onSubmit={handleSubmit} noValidate>
            <Card className="card--flush">
              <div className="card__header">
                <h2 className="register__cardTitle">Datos del Conductor</h2>
              </div>
              <div className="card__body register__fields">
                <Field
                  label="Nombre completo"
                  placeholder="Ej. Carlos Mendoza"
                  value={form.name}
                  onChange={(e) => set('name')(e.target.value)}
                  error={errors.name}
                />
                <Field
                  label="Número de licencia"
                  placeholder="Ej. 80234567"
                  value={form.license}
                  onChange={(e) => set('license')(e.target.value)}
                  error={errors.license}
                />
                <SelectField
                  label="Categoría"
                  value={form.category}
                  onChange={(e) => set('category')(e.target.value)}
                  error={errors.category}
                >
                  <option value="">Seleccione la categoría...</option>
                  {LICENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </SelectField>
                <Field
                  label="Teléfono (opcional)"
                  placeholder="Ej. 3001234567"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => set('phone')(e.target.value)}
                  error={errors.phone}
                />
              </div>
            </Card>

            <Card className="card--flush register__docs">
              <div className="card__header">
                <h2 className="register__cardTitle">Asignación</h2>
              </div>
              <div className="card__body register__fields">
                <SelectField
                  label="Camión asignado"
                  value={form.truckId}
                  onChange={(e) => set('truckId')(e.target.value)}
                  error={errors.truckId}
                >
                  <option value="">Seleccione un camión...</option>
                  {availableTrucks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.plate} — {t.brand} {t.model}
                    </option>
                  ))}
                </SelectField>
              </div>
            </Card>
          </form>
        )}
      </div>
    </AppShell>
  )
}

import { useState } from 'react'
import { Icon, type IconName } from '../../components/icons/Icon'
import { AppShell } from '../../components/layout/AppShell'
import { Button, Card } from '../../components/ui'
import { useFleet } from '../../data/useFleet'
import './ProfileScreen.css'

interface ProfileOption {
  icon: IconName
  label: string
  hint: string
}

const OPTIONS: ProfileOption[] = [
  { icon: 'doc-outline', label: 'Acerca de Truckly', hint: 'Versión 1.0.0' },
]

export function ProfileScreen() {
  const { clearAllData } = useFleet()
  const [confirming, setConfirming] = useState(false)

  function handleDelete() {
    clearAllData()
    setConfirming(false)
  }

  return (
    <AppShell>
      <div className="profile">
        <h1 className="t-title">Perfil</h1>

        <Card className="profile__owner">
          <span className="profile__avatar" aria-hidden="true">
            <Icon name="nav-profile" size={28} />
          </span>
          <div>
            <p className="profile__name">Propietario de la Flota</p>
            <p className="t-meta">Truckly · Gestión de flota</p>
          </div>
        </Card>

        <Card className="card--flush profile__options">
          {OPTIONS.map((opt) => (
            <div key={opt.label} className="profile__option">
              <span className="profile__optionIcon">
                <Icon name={opt.icon} size={16} />
              </span>
              <div className="profile__optionText">
                <p className="profile__optionLabel">{opt.label}</p>
                <p className="t-meta">{opt.hint}</p>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <p className="t-body t-muted profile__resetHint">
            Esta acción borra permanentemente todos los camiones, conductores y
            documentos guardados en este dispositivo.
          </p>

          {confirming ? (
            <div className="profile__confirm">
              <p className="t-body profile__confirmText">
                ¿Seguro que deseas borrar todos los datos? No se puede deshacer.
              </p>
              <div className="profile__confirmActions">
                <Button variant="secondary" onClick={() => setConfirming(false)}>
                  Cancelar
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Borrar
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="danger" block onClick={() => setConfirming(true)}>
              Borrar todos los datos
            </Button>
          )}
        </Card>
      </div>
    </AppShell>
  )
}

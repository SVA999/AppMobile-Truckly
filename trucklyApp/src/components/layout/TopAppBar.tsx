import { useNavigate } from 'react-router-dom'
import { Icon } from '../icons/Icon'
import './TopAppBar.scss'

interface TopAppBarProps {
  showBack?: boolean
}

export function TopAppBar({ showBack = false }: TopAppBarProps) {
  const navigate = useNavigate()

  return (
    <header className="appbar">
      <div className="appbar__brand">
        {showBack && (
          <button
            type="button"
            className="appbar__back"
            onClick={() => navigate(-1)}
            aria-label="Volver"
          >
            <Icon name="arrow-left" size={16} />
          </button>
        )}
        <span className="appbar__logo">
          <Icon name="logo" size={22} />
        </span>
        <span className="appbar__word">Truckly</span>
      </div>
    </header>
  )
}

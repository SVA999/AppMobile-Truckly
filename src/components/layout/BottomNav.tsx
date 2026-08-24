import { NavLink } from 'react-router-dom'
import { Icon, type IconName } from '../icons/Icon'
import './BottomNav.css'

interface NavItem {
  to: string
  label: string
  icon: IconName
  size: number
}

const ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: 'nav-dashboard', size: 18 },
  { to: '/documentos', label: 'Documentos', icon: 'nav-routes', size: 18 },
  { to: '/flota', label: 'Camiones', icon: 'nav-fleet', size: 18 },
  { to: '/perfil', label: 'Perfil', icon: 'nav-profile', size: 16 },
]

export function BottomNav() {
  return (
    <nav className="bottomnav" aria-label="Navegación principal">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            isActive ? 'bottomnav__link is-active' : 'bottomnav__link'
          }
        >
          <Icon name={item.icon} size={item.size} />
          <span className="bottomnav__label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

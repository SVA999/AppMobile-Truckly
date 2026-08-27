import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { TopAppBar } from './TopAppBar'
import { RouteProgress } from './RouteProgress'
import './AppShell.scss'

interface AppShellProps {
  children: ReactNode
  showBack?: boolean
  /** Contenido fijo sobre la barra inferior (barra de acción de una pantalla). */
  footer?: ReactNode
}

/**
 * Marco común de todas las pantallas: replica el artboard de 390px del diseño,
 * centrado en pantallas grandes.
 */
export function AppShell({ children, showBack, footer }: AppShellProps) {
  const location = useLocation()
  return (
    <div className="shell">
      <RouteProgress />
      <TopAppBar showBack={showBack} />
      <main className="shell__main">
        <div className="shell__page" key={location.pathname}>
          {children}
        </div>
      </main>
      {footer ? <div className="shell__footer">{footer}</div> : null}
      <BottomNav />
    </div>
  )
}

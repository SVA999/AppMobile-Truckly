import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './RouteProgress.css'

/** Barra de progreso breve al cambiar de pantalla: feedback de navegación
 *  instantáneo aunque la app no tenga carga de red real. */
export function RouteProgress() {
  const location = useLocation()
  const [active, setActive] = useState(false)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    setActive(true)
    const timer = setTimeout(() => setActive(false), 260)
    return () => clearTimeout(timer)
  }, [location.pathname])

  if (!active) return null
  return <div className="route-progress" aria-hidden="true" />
}

import { ICON_PATHS, type IconName } from './paths'

export type { IconName }

interface IconProps {
  name: IconName
  /** Alto en px. El ancho se deriva del viewBox para conservar la proporción. */
  size?: number
  className?: string
  /** Texto accesible; si se omite el icono se marca decorativo. */
  title?: string
}

export function Icon({ name, size = 16, className, title }: IconProps) {
  const { viewBox, d } = ICON_PATHS[name]
  const [, , vw, vh] = viewBox.split(/\s+/).map(Number)
  const width = vh ? (vw / vh) * size : size

  return (
    <svg
      className={className}
      viewBox={viewBox}
      width={width}
      height={size}
      fill="none"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d={d} fill="currentColor" />
    </svg>
  )
}

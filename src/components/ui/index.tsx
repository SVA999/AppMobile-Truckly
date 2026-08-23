import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react'
import { Icon } from '../icons/Icon'
import type { TruckStatus } from '../../data/types'
import { STATUS_LABELS } from '../../data/types'
import './ui.css'

/* Card -------------------------------------------------------------------- */

export function Card({
  children,
  className = '',
  ...rest
}: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}

/* Button ------------------------------------------------------------------ */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  block?: boolean
  small?: boolean
}

export function Button({
  variant = 'primary',
  block = false,
  small = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    'btn',
    `btn--${variant}`,
    block ? 'btn--block' : '',
    small ? 'btn--sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}

/* Badge ------------------------------------------------------------------- */

/** Badge de estado del camión: sólido / contorno / apagado según el diseño. */
export function StatusBadge({ status }: { status: TruckStatus }) {
  const variant =
    status === 'operativo' ? 'solid' : status === 'mantenimiento' ? 'outline' : 'muted'
  return (
    <span className={`badge badge--${variant}`}>
      <span className="badge__dot" />
      {STATUS_LABELS[status]}
    </span>
  )
}

export function Badge({
  children,
  variant = 'solid',
}: {
  children: ReactNode
  variant?: 'solid' | 'outline' | 'muted'
}) {
  return <span className={`badge badge--${variant}`}>{children}</span>
}

/* Chip -------------------------------------------------------------------- */

export function Chip({
  active = false,
  caret = false,
  children,
  ...rest
}: { active?: boolean; caret?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={active ? 'chip is-active' : 'chip'}
      aria-pressed={active}
      {...rest}
    >
      {children}
      {caret && <Icon name="chevron-down" size={4} />}
    </button>
  )
}

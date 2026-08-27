import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react'
import { Icon } from '../icons/Icon'
import type { TruckStatus } from '../../data/types'
import { STATUS_LABELS } from '../../data/types'
import './ui.scss'

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

/* Campos ------------------------------------------------------------------ */

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Field({ label, error, id, ...rest }: FieldProps) {
  const inputId = id ?? `f-${label.replace(/\W+/g, '-').toLowerCase()}`
  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className="field__control"
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error ? <span className="field__error">{error}</span> : null}
    </div>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  children: ReactNode
}

export function SelectField({ label, error, id, children, ...rest }: SelectFieldProps) {
  const selectId = id ?? `s-${label.replace(/\W+/g, '-').toLowerCase()}`
  return (
    <div className="field">
      <label className="field__label" htmlFor={selectId}>
        {label}
      </label>
      <div className="field__select-wrap">
        <select
          id={selectId}
          className="field__control"
          aria-invalid={error ? true : undefined}
          {...rest}
        >
          {children}
        </select>
        <span className="field__select-caret">
          <Icon name="caret-down" size={5} />
        </span>
      </div>
      {error ? <span className="field__error">{error}</span> : null}
    </div>
  )
}

export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="search">
      <span className="search__icon">
        <Icon name="search" size={18} />
      </span>
      <input type="search" className="search__input" {...props} />
    </div>
  )
}

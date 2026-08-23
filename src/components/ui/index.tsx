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


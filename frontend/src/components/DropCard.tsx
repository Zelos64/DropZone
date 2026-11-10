import type { Drop } from '../api'
import { formatPrice } from '../format'
import { StatusBadge } from './StatusBadge'

interface DropCardProps {
  drop: Drop
}

export function DropCard({ drop }: DropCardProps) {
  return (
    <article className="drop-card" data-testid="drop-card">
      <a href={`/drops/${drop.id}`} className="drop-card-link">
        <h2>{drop.product}</h2>
      </a>

      <p className="drop-card-price">
        {formatPrice(drop.price_cents)}
      </p>

      <p className="drop-card-stock">
        {drop.remaining} / {drop.stock} paires restantes
      </p>

      <StatusBadge status={drop.status} />
    </article>
  )
}
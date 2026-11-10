import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { DropCard } from './DropCard'
import { makeDrop } from '../test/fixtures'

describe('DropCard', () => {
  it('displays product, price, remaining stock and status', () => {
    const drop = makeDrop({
      id: 42,
      product: 'Air Max 1',
      price_cents: 18000,
      stock: 10,
      remaining: 3,
      status: 'live',
    })

    render(
      <MemoryRouter>
        <DropCard drop={drop} />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('link', { name: 'Air Max 1' }),
    ).toHaveAttribute('href', '/drops/42')

    expect(screen.getByText(/180,00\s*€/)).toBeInTheDocument()
    expect(screen.getByText('3 / 10 paires restantes')).toBeInTheDocument()
    expect(screen.getByText('En vente')).toBeInTheDocument()
  })

  it('displays the upcoming status', () => {
    const drop = makeDrop({ status: 'upcoming' })

    render(
      <MemoryRouter>
        <DropCard drop={drop} />
      </MemoryRouter>,
    )

    expect(screen.getByText('À venir')).toBeInTheDocument()
  })

  it('displays the sold out status', () => {
    const drop = makeDrop({
      remaining: 0,
      status: 'sold_out',
    })

    render(
      <MemoryRouter>
        <DropCard drop={drop} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Épuisé')).toBeInTheDocument()
  })
})
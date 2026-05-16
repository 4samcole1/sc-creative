import { render, screen } from '@testing-library/react'
import Nav from '@/components/layout/Nav'

describe('Nav', () => {
  it('renders the SC Creative logo link', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /sc creative/i })).toBeInTheDocument()
  })

  it('renders the Get My Quote CTA', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /get my quote/i })).toBeInTheDocument()
  })

  it('renders main nav links', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /work/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /insights/i })).toBeInTheDocument()
  })
})

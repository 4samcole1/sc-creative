import { render, screen } from '@testing-library/react'
import Nav from '@/components/layout/Nav'

describe('Nav', () => {
  it('renders the SC Creative logo link', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /sc creative/i })).toBeInTheDocument()
  })

  it('renders the Get In Touch CTA', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /get in touch/i })).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /^work$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^blueprint$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^branding$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^website$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ai solutions/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^growth$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^about$/i })).toBeInTheDocument()
  })
})

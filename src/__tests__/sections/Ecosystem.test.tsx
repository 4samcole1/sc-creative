import { render, screen } from '@testing-library/react'
import Ecosystem from '@/components/sections/Systems'

describe('Ecosystem', () => {
  it('renders the section eyebrow', () => {
    render(<Ecosystem />)
    expect(screen.getByText(/the sc creative ecosystem/i)).toBeInTheDocument()
  })

  it('renders the section headline', () => {
    render(<Ecosystem />)
    expect(screen.getByText(/everything your business needs to grow/i)).toBeInTheDocument()
  })

  it('renders all 5 pillar cards', () => {
    render(<Ecosystem />)
    expect(screen.getByText('Blueprint')).toBeInTheDocument()
    expect(screen.getByText('Branding')).toBeInTheDocument()
    expect(screen.getByText('Website')).toBeInTheDocument()
    expect(screen.getByText('AI Solutions')).toBeInTheDocument()
    expect(screen.getByText('Growth')).toBeInTheDocument()
  })

  it('renders Learn More links for each pillar', () => {
    render(<Ecosystem />)
    const links = screen.getAllByText(/learn more/i)
    expect(links).toHaveLength(5)
  })
})

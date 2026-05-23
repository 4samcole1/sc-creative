import { render, screen } from '@testing-library/react'
import Community from '@/components/sections/Community'

describe('Community', () => {
  it('renders the eyebrow', () => {
    render(<Community />)
    expect(screen.getByText(/rooted in our community/i)).toBeInTheDocument()
  })

  it('renders the headline', () => {
    render(<Community />)
    expect(screen.getByText(/proudly serving jasper/i)).toBeInTheDocument()
  })

  it('renders all location items', () => {
    render(<Community />)
    expect(screen.getByText('Jasper, AL')).toBeInTheDocument()
    expect(screen.getByText('Walker County, AL')).toBeInTheDocument()
    expect(screen.getByText('Greater Birmingham')).toBeInTheDocument()
    expect(screen.getByText('Northwest Alabama')).toBeInTheDocument()
  })

  it('renders the testimonial quote', () => {
    render(<Community />)
    expect(screen.getByText(/sc creative transformed/i)).toBeInTheDocument()
  })

  it('renders the testimonial attribution', () => {
    render(<Community />)
    expect(screen.getByText('Josh T.')).toBeInTheDocument()
  })
})

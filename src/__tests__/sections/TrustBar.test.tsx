import { render, screen } from '@testing-library/react'
import TrustBar from '@/components/sections/StatsBar'

describe('TrustBar', () => {
  it('renders the trusted by label', () => {
    render(<TrustBar />)
    expect(screen.getByText(/trusted by businesses across industries/i)).toBeInTheDocument()
  })

  it('renders 5 logo placeholder slots', () => {
    const { container } = render(<TrustBar />)
    const slots = container.querySelectorAll('[data-logo-slot]')
    expect(slots).toHaveLength(5)
  })
})

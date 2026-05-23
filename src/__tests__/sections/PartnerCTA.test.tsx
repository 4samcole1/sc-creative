import { render, screen } from '@testing-library/react'
import PartnerCTA from '@/components/sections/PartnerCTA'

describe('PartnerCTA', () => {
  it('renders the eyebrow', () => {
    render(<PartnerCTA />)
    expect(screen.getByText(/built for businesses that want more/i)).toBeInTheDocument()
  })

  it('renders the headline', () => {
    render(<PartnerCTA />)
    expect(screen.getByText(/more than a vendor/i)).toBeInTheDocument()
  })

  it('renders the CTA link', () => {
    render(<PartnerCTA />)
    expect(screen.getByRole('link', { name: /let.s talk about your goals/i })).toBeInTheDocument()
  })
})

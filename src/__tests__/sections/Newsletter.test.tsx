import { render, screen } from '@testing-library/react'
import Newsletter from '@/components/sections/Newsletter'

describe('Newsletter', () => {
  it('renders the headline', () => {
    render(<Newsletter />)
    expect(screen.getByText(/stay ahead of the growth game/i)).toBeInTheDocument()
  })

  it('renders the subtext', () => {
    render(<Newsletter />)
    expect(screen.getByText(/insights, systems, and strategies/i)).toBeInTheDocument()
  })

  it('renders the email input', () => {
    render(<Newsletter />)
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument()
  })

  it('renders the subscribe button', () => {
    render(<Newsletter />)
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import Footer from '@/components/layout/Footer'

describe('Footer', () => {
  it('renders the SC Creative brand name', () => {
    render(<Footer />)
    expect(screen.getByText('SC Creative')).toBeInTheDocument()
  })

  it('renders Quick Links column heading', () => {
    render(<Footer />)
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
  })

  it('renders Resources column heading', () => {
    render(<Footer />)
    expect(screen.getByText('Resources')).toBeInTheDocument()
  })

  it('renders contact email', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /info@samcolecreative\.com/i })).toBeInTheDocument()
  })

  it('renders contact phone', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /678.*997.*1106/i })).toBeInTheDocument()
  })

  it('renders Get In Touch CTA', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /get in touch/i })).toBeInTheDocument()
  })

  it('renders Privacy Policy and Terms links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /terms of service/i })).toBeInTheDocument()
  })
})

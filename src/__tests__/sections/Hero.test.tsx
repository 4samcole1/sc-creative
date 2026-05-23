import { render, screen } from '@testing-library/react'
import Hero from '@/components/sections/Hero'

describe('Hero', () => {
  it('renders the main headline', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { name: /strategy\. design\./i })).toBeInTheDocument()
  })

  it('renders the teal accent line', () => {
    render(<Hero />)
    expect(screen.getByText(/all working together/i)).toBeInTheDocument()
  })

  it('renders the Start Your Project CTA', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /start your project/i })).toBeInTheDocument()
  })

  it('renders the Explore Our Process CTA', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /explore our process/i })).toBeInTheDocument()
  })

  it('renders the location badge', () => {
    render(<Hero />)
    expect(screen.getByText(/proudly based in jasper/i)).toBeInTheDocument()
  })

  it('renders the 3 glassmorphism feature cards', () => {
    render(<Hero />)
    expect(screen.getByText('Local Focus')).toBeInTheDocument()
    expect(screen.getByText('Modern Solutions')).toBeInTheDocument()
    expect(screen.getByText('Growth Driven')).toBeInTheDocument()
  })
})

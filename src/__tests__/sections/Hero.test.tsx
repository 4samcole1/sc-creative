import { render, screen } from '@testing-library/react'
import Hero from '@/components/sections/Hero'

describe('Hero', () => {
  it('renders the headline', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { name: /we build the digital/i })).toBeInTheDocument()
  })

  it('renders the Get My Quote button', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /get my custom quote/i })).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'

jest.mock('@/lib/supabase-server', () => ({
  createSupabaseServerClient: jest.fn().mockRejectedValue(new Error('not configured')),
}))

describe('Work', () => {
  it('renders the section eyebrow', async () => {
    const Work = (await import('@/components/sections/Work')).default
    render(await Work())
    expect(screen.getByText(/recent work/i)).toBeInTheDocument()
  })

  it('renders the section headline', async () => {
    const Work = (await import('@/components/sections/Work')).default
    render(await Work())
    expect(screen.getByText(/solutions built for real businesses/i)).toBeInTheDocument()
  })

  it('renders View All Projects link', async () => {
    const Work = (await import('@/components/sections/Work')).default
    render(await Work())
    expect(screen.getByRole('link', { name: /view all projects/i })).toBeInTheDocument()
  })

  it('renders 3 fallback project cards', async () => {
    const Work = (await import('@/components/sections/Work')).default
    render(await Work())
    expect(screen.getByText('Industrial Manufacturing Website')).toBeInTheDocument()
    expect(screen.getByText('Custom E-Commerce Platform')).toBeInTheDocument()
    expect(screen.getByText('Client Portal & Dashboard')).toBeInTheDocument()
  })
})

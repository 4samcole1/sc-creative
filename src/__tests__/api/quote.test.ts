/**
 * @jest-environment node
 */
const mockInsert = jest.fn().mockResolvedValue({ error: null })
jest.mock('@/lib/supabase', () => ({
  supabase: { from: () => ({ insert: mockInsert }) },
}))

import { POST } from '@/app/api/quote/route'

describe('POST /api/quote', () => {
  it('returns 200 and saves lead on valid payload', async () => {
    const body = { first_name: 'John', last_name: 'Smith', email: 'john@smithhvac.com', business: 'Smith HVAC', phone: '(205) 555-0100', service_interest: 'Website', message: '' }
    const req = new Request('http://localhost/api/quote', { method: 'POST', body: JSON.stringify(body) })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ email: 'john@smithhvac.com' }))
  })

  it('returns 400 when required fields are missing', async () => {
    const req = new Request('http://localhost/api/quote', { method: 'POST', body: JSON.stringify({ first_name: 'John' }) })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})

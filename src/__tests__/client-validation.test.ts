import { validateClient } from '@/app/admin/(dashboard)/clients/validation'

const ok = { name: 'Acme', city: 'Jasper', state: 'AL', industry: 'Roofing', lat: '', lng: '' }

describe('validateClient', () => {
  it('returns null when required fields are present', () => {
    expect(validateClient(ok)).toBeNull()
  })
  it('requires name, city, state, industry', () => {
    expect(validateClient({ ...ok, name: '' })).toMatch(/name/i)
    expect(validateClient({ ...ok, city: '' })).toMatch(/city/i)
    expect(validateClient({ ...ok, state: '' })).toMatch(/state/i)
    expect(validateClient({ ...ok, industry: '' })).toMatch(/industry/i)
  })
  it('rejects a non-numeric latitude', () => {
    expect(validateClient({ ...ok, lat: 'abc' })).toMatch(/lat/i)
  })
  it('allows blank coordinates', () => {
    expect(validateClient({ ...ok, lat: '', lng: '' })).toBeNull()
  })
})

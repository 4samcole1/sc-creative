import { rowToClient, selectMapClients, selectTrustBarClients, type ClientRow } from '@/lib/clients-data'

function row(overrides: Partial<ClientRow> = {}): ClientRow {
  return {
    id: '1', name: 'Acme', city: 'Jasper', state: 'AL', lat: 1, lng: 2,
    industry: 'Roofing', website: '', logo_url: '', blurb: '',
    show_trust_bar: true, show_map: true, show_portfolio: false,
    gbp_url: null, needs_review: false, ...overrides,
  }
}

describe('rowToClient', () => {
  it('maps snake_case columns to the nested Client shape', () => {
    const c = rowToClient(row({ logo_url: '/l.png', show_portfolio: true }))
    expect(c.logoUrl).toBe('/l.png')
    expect(c.show).toEqual({ trustBar: true, map: true, portfolio: true })
  })

  it('coerces null optional text to empty string and omits falsy needsReview/gbpUrl', () => {
    const c = rowToClient(row({ gbp_url: null, needs_review: false }))
    expect(c.gbpUrl).toBeUndefined()
    expect(c.needsReview).toBeUndefined()
  })
})

describe('selectMapClients', () => {
  it('excludes show.map=false and null-coordinate clients', () => {
    const a = rowToClient(row({ id: 'a', show_map: true,  lat: 1, lng: 2 }))
    const b = rowToClient(row({ id: 'b', show_map: false, lat: 1, lng: 2 }))
    const c = rowToClient(row({ id: 'c', show_map: true,  lat: null, lng: null }))
    expect(selectMapClients([a, b, c]).map(x => x.id)).toEqual(['a'])
  })
})

describe('selectTrustBarClients', () => {
  it('returns only trust-bar clients, sorted case-insensitively by name', () => {
    const z = rowToClient(row({ id: 'z', name: 'zeta', show_trust_bar: true }))
    const a = rowToClient(row({ id: 'a', name: 'Alpha', show_trust_bar: true }))
    const n = rowToClient(row({ id: 'n', name: 'Hidden', show_trust_bar: false }))
    expect(selectTrustBarClients([z, a, n]).map(x => x.name)).toEqual(['Alpha', 'zeta'])
  })
})

// src/__tests__/buildPopupHtml.test.ts
// Unit tests for the pure buildPopupHtml helper extracted from ClientMapInner.
// We do NOT render Leaflet/jsdom here — pure string output only.
// Import from the pure utility module (no Leaflet imports) — jest/node safe.
// ClientMapInner re-exports buildPopupHtml but also imports react-leaflet (ESM),
// which crashes in jest's CJS environment. The utils module is the clean testable boundary.
import { buildPopupHtml } from '@/components/sections/clientMapUtils'
import type { Client } from '@/lib/clients-data'

function makeClient(overrides: Partial<Client> = {}): Client {
  return {
    id: '1',
    name: 'Jasper Coffee',
    city: 'Jasper',
    state: 'AL',
    lat: 33.83,
    lng: -87.27,
    industry: '',
    website: '',
    logoUrl: '',
    blurb: '',
    show: { trustBar: false, map: true, portfolio: false },
    ...overrides,
  }
}

describe('buildPopupHtml', () => {
  it('includes the client name', () => {
    const html = buildPopupHtml(makeClient({ name: 'Walker Dental' }))
    expect(html).toContain('Walker Dental')
  })

  it('includes city and state', () => {
    const html = buildPopupHtml(makeClient({ city: 'Jasper', state: 'AL' }))
    expect(html).toContain('Jasper')
    expect(html).toContain('AL')
  })

  it('includes website link when website is set', () => {
    const html = buildPopupHtml(makeClient({ website: 'https://example.com' }))
    expect(html).toContain('href="https://example.com"')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener"')
  })

  it('omits website link when website is empty', () => {
    const html = buildPopupHtml(makeClient({ website: '' }))
    expect(html).not.toContain('href=')
  })

  it('includes logo img tag when logoUrl is set', () => {
    const html = buildPopupHtml(makeClient({ logoUrl: 'https://example.com/logos/jasper-coffee.png' }))
    expect(html).toContain('<img')
    expect(html).toContain('https://example.com/logos/jasper-coffee.png')
  })

  it('omits logo img when logoUrl is empty', () => {
    const html = buildPopupHtml(makeClient({ logoUrl: '' }))
    expect(html).not.toContain('<img')
  })

  it('includes industry when set', () => {
    const html = buildPopupHtml(makeClient({ industry: 'Food & Beverage' }))
    expect(html).toContain('Food &amp; Beverage')
  })

  it('omits industry when empty', () => {
    const html = buildPopupHtml(makeClient({ industry: '' }))
    // Should not have an empty span or label for industry
    expect(html).not.toMatch(/industry/i)
  })

  it('includes blurb when set', () => {
    const html = buildPopupHtml(makeClient({ blurb: 'Great local coffee shop' }))
    expect(html).toContain('Great local coffee shop')
  })

  it('omits blurb when empty', () => {
    const html = buildPopupHtml(makeClient({ blurb: '' }))
    // Should not contain a <p> element for blurb, nor any blurb text
    expect(html).not.toContain('<p ')
    expect(html).not.toContain('some text')
  })

  it('uses teal color for website link', () => {
    const html = buildPopupHtml(makeClient({ website: 'https://example.com' }))
    expect(html).toContain('#1cc7c3')
  })

  // Security: XSS via javascript: protocol (I-1 & I-2)
  it('does not render a link for javascript: website URL', () => {
    const html = buildPopupHtml(makeClient({ website: 'javascript:alert(1)' }))
    expect(html).not.toContain('javascript:')
    expect(html).not.toContain('Visit website')
  })

  it('renders href for a valid https website URL', () => {
    const html = buildPopupHtml(makeClient({ website: 'https://example.com' }))
    expect(html).toContain('href="https://example.com"')
  })

  it('does not render an img for javascript: logoUrl', () => {
    const html = buildPopupHtml(makeClient({ logoUrl: 'javascript:alert(1)' }))
    expect(html).not.toContain('<img')
  })
})

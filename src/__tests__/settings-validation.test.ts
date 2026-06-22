import { validateSettings } from '@/app/admin/(dashboard)/settings/validation'

const ok: Record<string, string> = {
  color_primary: '#1cc7c3', color_background: '#070d17',
  color_surface: '#0b1520', color_text: '#e8eef4',
  font_heading: 'poppins', font_body: 'inter',
  h1_size: '64', h1_weight: '800', h2_size: '48', h2_weight: '700',
  h3_size: '32', h3_weight: '700', h4_size: '24', h4_weight: '600',
  body_size: '16', body_weight: '400', body_line_height: '1.6',
}

describe('validateSettings', () => {
  it('returns null for a fully valid config', () => {
    expect(validateSettings(ok)).toBeNull()
  })
  it('rejects a malformed hex color', () => {
    expect(validateSettings({ ...ok, color_primary: 'teal' })).toMatch(/hex/i)
  })
  it('rejects a font outside the safe list', () => {
    expect(validateSettings({ ...ok, font_heading: 'comic-sans' })).toMatch(/heading font/i)
  })
  it('rejects an out-of-range heading size', () => {
    expect(validateSettings({ ...ok, h1_size: '200' })).toMatch(/H1 size/i)
  })
  it('rejects an out-of-range line height', () => {
    expect(validateSettings({ ...ok, body_line_height: '9' })).toMatch(/Line height/i)
  })
  it('accepts the range boundaries', () => {
    expect(validateSettings({ ...ok, h1_size: '24' })).toBeNull()
    expect(validateSettings({ ...ok, h1_size: '128' })).toBeNull()
  })
  it('rejects a social URL without an http(s) scheme', () => {
    expect(validateSettings({ ...ok, facebook_url: 'javascript:alert(1)' })).toMatch(/Facebook URL/i)
  })
  it('accepts empty social URLs and valid https ones', () => {
    expect(validateSettings({ ...ok, facebook_url: '' })).toBeNull()
    expect(validateSettings({ ...ok, instagram_url: 'https://instagram.com/sc' })).toBeNull()
  })
})

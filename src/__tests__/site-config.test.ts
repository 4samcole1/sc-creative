import { rowToSiteConfig, SITE_CONFIG_DEFAULTS } from '@/lib/site-config'

describe('rowToSiteConfig', () => {
  it('returns defaults when row is null', () => {
    expect(rowToSiteConfig(null)).toEqual(SITE_CONFIG_DEFAULTS)
  })

  it('overrides only the provided fields, keeping defaults for the rest', () => {
    const cfg = rowToSiteConfig({ color_primary: '#000000', h1_size: 72 })
    expect(cfg.color_primary).toBe('#000000')
    expect(cfg.h1_size).toBe(72)
    expect(cfg.color_background).toBe(SITE_CONFIG_DEFAULTS.color_background)
  })

  it('falls back to default for null/undefined field values', () => {
    const cfg = rowToSiteConfig({ color_primary: null, tagline: undefined })
    expect(cfg.color_primary).toBe(SITE_CONFIG_DEFAULTS.color_primary)
    expect(cfg.tagline).toBe(SITE_CONFIG_DEFAULTS.tagline)
  })

  it('ignores columns that are not part of SiteConfig (id, updated_at)', () => {
    const cfg = rowToSiteConfig({ id: 1, updated_at: 'x', color_text: '#ffffff' })
    expect((cfg as unknown as Record<string, unknown>).id).toBeUndefined()
    expect(cfg.color_text).toBe('#ffffff')
  })
})

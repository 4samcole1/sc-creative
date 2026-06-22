// Pure, framework-free — safe to import from the server action and from Jest.
export const SAFE_FONTS = ['poppins', 'inter', 'montserrat', 'lato']
const HEX_RE = /^#[0-9a-fA-F]{6}$/

const COLOR_FIELDS: [string, string][] = [
  ['Primary color', 'color_primary'],
  ['Background',     'color_background'],
  ['Surface',       'color_surface'],
  ['Text color',    'color_text'],
]

const SOCIAL_FIELDS: [string, string][] = [
  ['Facebook URL',  'facebook_url'],
  ['Instagram URL', 'instagram_url'],
  ['LinkedIn URL',  'linkedin_url'],
  ['Twitter URL',   'twitter_url'],
  ['YouTube URL',   'youtube_url'],
]

// [label, formKey, min, max, kind]
const NUMERIC_FIELDS: [string, string, number, number, 'int' | 'float'][] = [
  ['H1 size',     'h1_size',          24,  128, 'int'],
  ['H1 weight',   'h1_weight',        100, 900, 'int'],
  ['H2 size',     'h2_size',          20,  100, 'int'],
  ['H2 weight',   'h2_weight',        100, 900, 'int'],
  ['H3 size',     'h3_size',          16,  80,  'int'],
  ['H3 weight',   'h3_weight',        100, 900, 'int'],
  ['H4 size',     'h4_size',          14,  60,  'int'],
  ['H4 weight',   'h4_weight',        100, 900, 'int'],
  ['Body size',   'body_size',        12,  24,  'int'],
  ['Body weight', 'body_weight',      100, 900, 'int'],
  ['Line height', 'body_line_height', 1,   3,   'float'],
]

// Returns an error message, or null if valid.
export function validateSettings(raw: Record<string, string>): string | null {
  for (const [label, key] of COLOR_FIELDS) {
    if (!HEX_RE.test((raw[key] ?? '').trim())) {
      return `${label} must be a 6-digit hex (e.g. #1cc7c3)`
    }
  }
  if (!SAFE_FONTS.includes((raw.font_heading ?? '').trim())) return 'Invalid heading font'
  if (!SAFE_FONTS.includes((raw.font_body ?? '').trim()))    return 'Invalid body font'

  for (const [label, key] of SOCIAL_FIELDS) {
    const v = (raw[key] ?? '').trim()
    if (v && !/^https?:\/\//i.test(v)) return `${label} must start with http:// or https://`
  }

  for (const [label, key, min, max, kind] of NUMERIC_FIELDS) {
    const v = kind === 'int' ? parseInt(raw[key], 10) : parseFloat(raw[key])
    if (Number.isNaN(v) || v < min || v > max) return `${label} is out of range`
  }
  return null
}

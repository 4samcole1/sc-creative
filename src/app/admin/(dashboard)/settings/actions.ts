'use server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { SiteConfig } from '@/lib/site-config'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

const HEX_RE    = /^#[0-9a-fA-F]{6}$/
const SAFE_FONTS = ['poppins', 'inter', 'montserrat', 'lato']

export async function saveSettingsAction(
  _prev: { error: string; success: boolean },
  formData: FormData,
): Promise<{ error: string; success: boolean }> {
  const color_primary    = (formData.get('color_primary')    as string).trim()
  const color_background = (formData.get('color_background') as string).trim()
  const color_surface    = (formData.get('color_surface')    as string).trim()
  const color_text       = (formData.get('color_text')       as string).trim()
  const font_heading     = (formData.get('font_heading')     as string).trim()
  const font_body        = (formData.get('font_body')        as string).trim()

  for (const [label, val] of [
    ['Primary color', color_primary],
    ['Background',    color_background],
    ['Surface',       color_surface],
    ['Text color',    color_text],
  ]) {
    if (!HEX_RE.test(val)) return { error: `${label} must be a 6-digit hex (e.g. #1cc7c3)`, success: false }
  }
  if (!SAFE_FONTS.includes(font_heading)) return { error: 'Invalid heading font', success: false }
  if (!SAFE_FONTS.includes(font_body))    return { error: 'Invalid body font', success: false }

  function int(name: string, min: number, max: number): number | null {
    const v = parseInt(formData.get(name) as string, 10)
    return isNaN(v) || v < min || v > max ? null : v
  }
  function float(name: string, min: number, max: number): number | null {
    const v = parseFloat(formData.get(name) as string)
    return isNaN(v) || v < min || v > max ? null : v
  }

  const h1_size          = int('h1_size',          24, 128)
  const h1_weight        = int('h1_weight',         100, 900)
  const h2_size          = int('h2_size',          20, 100)
  const h2_weight        = int('h2_weight',         100, 900)
  const h3_size          = int('h3_size',          16, 80)
  const h3_weight        = int('h3_weight',         100, 900)
  const h4_size          = int('h4_size',          14, 60)
  const h4_weight        = int('h4_weight',         100, 900)
  const body_size        = int('body_size',         12, 24)
  const body_weight      = int('body_weight',       100, 900)
  const body_line_height = float('body_line_height', 1, 3)

  const invalidField = [
    ['H1 size', h1_size], ['H1 weight', h1_weight],
    ['H2 size', h2_size], ['H2 weight', h2_weight],
    ['H3 size', h3_size], ['H3 weight', h3_weight],
    ['H4 size', h4_size], ['H4 weight', h4_weight],
    ['Body size', body_size], ['Body weight', body_weight],
    ['Line height', body_line_height],
  ].find(([, v]) => v === null)
  if (invalidField) return { error: `${invalidField[0]} is out of range`, success: false }

  const config: Omit<SiteConfig, 'logo_light_url' | 'logo_dark_url'> = {
    business_name:    (formData.get('business_name')    as string).trim(),
    tagline:          (formData.get('tagline')          as string).trim(),
    phone:            (formData.get('phone')            as string).trim(),
    email:            (formData.get('email')            as string).trim(),
    address:          (formData.get('address')          as string).trim(),
    meta_title:       (formData.get('meta_title')       as string).trim(),
    meta_description: (formData.get('meta_description') as string).trim(),
    facebook_url:     (formData.get('facebook_url')     as string).trim(),
    instagram_url:    (formData.get('instagram_url')    as string).trim(),
    linkedin_url:     (formData.get('linkedin_url')     as string).trim(),
    twitter_url:      (formData.get('twitter_url')      as string).trim(),
    youtube_url:      (formData.get('youtube_url')      as string).trim(),
    color_primary, color_background, color_surface, color_text,
    font_heading, font_body,
    h1_size:          h1_size!,
    h1_weight:        h1_weight!,
    h2_size:          h2_size!,
    h2_weight:        h2_weight!,
    h3_size:          h3_size!,
    h3_weight:        h3_weight!,
    h4_size:          h4_size!,
    h4_weight:        h4_weight!,
    body_size:        body_size!,
    body_weight:      body_weight!,
    body_line_height: body_line_height!,
  }

  const { error } = await db()
    .from('site_config')
    .upsert({ id: 1, ...config, updated_at: new Date().toISOString() })

  if (error) return { error: error.message, success: false }

  revalidatePath('/', 'layout')
  return { error: '', success: true }
}

export async function uploadLogoAction(
  field: 'logo_light_url' | 'logo_dark_url',
  _prev: { error: string; url: string },
  formData: FormData,
): Promise<{ error: string; url: string }> {
  const file = formData.get('file') as File
  if (!file || file.size === 0) return { error: 'No file selected', url: _prev.url }

  const allowed = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
  if (!allowed.includes(file.type)) return { error: 'Only PNG, JPG, SVG, or WebP accepted', url: _prev.url }
  if (file.size > 2 * 1024 * 1024) return { error: 'File must be under 2 MB', url: _prev.url }

  const ext      = file.name.split('.').pop()?.toLowerCase() ?? 'png'
  const filename = `${field.replace('_url', '')}-${Date.now()}.${ext}`
  const client   = db()
  const bytes    = await file.arrayBuffer()

  const { error: uploadErr } = await client.storage
    .from('logos')
    .upload(filename, bytes, { contentType: file.type, upsert: true })

  if (uploadErr) return { error: uploadErr.message, url: _prev.url }

  const { data: { publicUrl } } = client.storage.from('logos').getPublicUrl(filename)

  await client
    .from('site_config')
    .upsert({ id: 1, [field]: publicUrl, updated_at: new Date().toISOString() })

  revalidatePath('/', 'layout')
  return { error: '', url: publicUrl }
}

export async function loadSettings(): Promise<SiteConfig | null> {
  try {
    const { data } = await db().from('site_config').select('*').eq('id', 1).single()
    return data as SiteConfig | null
  } catch {
    return null
  }
}

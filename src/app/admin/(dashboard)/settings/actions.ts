'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase-admin'
import { sessionOptions, type SessionData } from '@/lib/session'
import type { SiteConfig } from '@/lib/site-config'
import { validateSettings } from './validation'

async function requireSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  if (!session.isLoggedIn) redirect('/login')
}

// All editable keys except the logo URLs (owned by uploadLogoAction).
const STRING_FIELDS = [
  'business_name', 'tagline', 'phone', 'email', 'address',
  'meta_title', 'meta_description',
  'facebook_url', 'instagram_url', 'linkedin_url', 'twitter_url', 'youtube_url',
  'color_primary', 'color_background', 'color_surface', 'color_text',
  'font_heading', 'font_body', 'google_place_id',
]
const INT_FIELDS = [
  'h1_size', 'h1_weight', 'h2_size', 'h2_weight', 'h3_size', 'h3_weight',
  'h4_size', 'h4_weight', 'body_size', 'body_weight',
]

export async function saveSettingsAction(
  _prev: { error: string; success: boolean },
  formData: FormData,
): Promise<{ error: string; success: boolean }> {
  await requireSession()

  const raw: Record<string, string> = {}
  for (const k of [...STRING_FIELDS, ...INT_FIELDS, 'body_line_height']) {
    raw[k] = ((formData.get(k) as string) ?? '').toString()
  }

  const error = validateSettings(raw)
  if (error) return { error, success: false }

  const payload: Record<string, unknown> = { id: 1, updated_at: new Date().toISOString() }
  for (const k of STRING_FIELDS) payload[k] = raw[k].trim()
  for (const k of INT_FIELDS)    payload[k] = parseInt(raw[k], 10)
  payload.body_line_height = parseFloat(raw.body_line_height)

  const { error: e } = await createAdminClient().from('site_config').upsert(payload)
  if (e) return { error: e.message, success: false }

  revalidatePath('/', 'layout')
  return { error: '', success: true }
}

export async function uploadLogoAction(
  field: 'logo_light_url' | 'logo_dark_url',
  _prev: { error: string; url: string },
  formData: FormData,
): Promise<{ error: string; url: string }> {
  await requireSession()

  const file = formData.get('file') as File
  if (!file || file.size === 0) return { error: 'No file selected', url: _prev.url }

  const allowed = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
  if (!allowed.includes(file.type)) return { error: 'Only PNG, JPG, SVG, or WebP accepted', url: _prev.url }
  if (file.size > 2 * 1024 * 1024)  return { error: 'File must be under 2 MB', url: _prev.url }

  const ext      = file.name.split('.').pop()?.toLowerCase() ?? 'png'
  const filename = `${field.replace('_url', '')}-${Date.now()}.${ext}`
  const client   = createAdminClient()
  const bytes    = await file.arrayBuffer()

  const { error: uploadErr } = await client.storage
    .from('logos')
    .upload(filename, bytes, { contentType: file.type, upsert: true })
  if (uploadErr) return { error: uploadErr.message, url: _prev.url }

  const { data: { publicUrl } } = client.storage.from('logos').getPublicUrl(filename)
  const { error: dbErr } = await client.from('site_config').upsert({ id: 1, [field]: publicUrl, updated_at: new Date().toISOString() })
  if (dbErr) return { error: dbErr.message, url: _prev.url }

  revalidatePath('/', 'layout')
  return { error: '', url: publicUrl }
}

export async function loadSettings(): Promise<SiteConfig | null> {
  await requireSession()
  const { data } = await createAdminClient().from('site_config').select('*').eq('id', 1).single()
  return (data as SiteConfig) ?? null
}

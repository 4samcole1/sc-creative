'use server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export interface SiteConfig {
  // Business
  business_name: string
  tagline: string
  phone: string
  email: string
  address: string
  // SEO
  meta_title: string
  meta_description: string
  // Social
  facebook_url: string
  instagram_url: string
  linkedin_url: string
  twitter_url: string
  youtube_url: string
  // Theme
  color_primary: string
  color_background: string
  color_surface: string
  color_text: string
  font_family: string
  font_size_base: number
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/
const SAFE_FONTS = ['poppins', 'inter', 'montserrat', 'lato']

export async function saveSettingsAction(
  _prev: { error: string; success: boolean },
  formData: FormData,
): Promise<{ error: string; success: boolean }> {
  const color_primary    = (formData.get('color_primary')    as string).trim()
  const color_background = (formData.get('color_background') as string).trim()
  const color_surface    = (formData.get('color_surface')    as string).trim()
  const color_text       = (formData.get('color_text')       as string).trim()
  const font_family      = (formData.get('font_family')      as string).trim()
  const font_size_base   = parseInt(formData.get('font_size_base') as string, 10)

  for (const [name, val] of [['Primary color', color_primary], ['Background', color_background], ['Surface', color_surface], ['Text color', color_text]]) {
    if (!HEX_RE.test(val)) return { error: `${name} must be a 6-digit hex (e.g. #1cc7c3)`, success: false }
  }
  if (!SAFE_FONTS.includes(font_family)) return { error: 'Invalid font selection', success: false }
  if (isNaN(font_size_base) || font_size_base < 12 || font_size_base > 24) {
    return { error: 'Base font size must be between 12 and 24', success: false }
  }

  const config: SiteConfig = {
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
    color_primary,
    color_background,
    color_surface,
    color_text,
    font_family,
    font_size_base,
  }

  const { error } = await db()
    .from('site_config')
    .upsert({ id: 1, ...config, updated_at: new Date().toISOString() })

  if (error) return { error: error.message, success: false }

  revalidatePath('/', 'layout')
  return { error: '', success: true }
}

export async function loadSettings(): Promise<SiteConfig | null> {
  try {
    const { data } = await db().from('site_config').select('*').eq('id', 1).single()
    return data as SiteConfig | null
  } catch {
    return null
  }
}

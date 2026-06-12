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
  business_name: string
  tagline: string
  phone: string
  email: string
  address: string
  meta_title: string
  meta_description: string
  facebook_url: string
  instagram_url: string
  linkedin_url: string
  twitter_url: string
  youtube_url: string
}

export async function saveSettingsAction(
  _prev: { error: string; success: boolean },
  formData: FormData,
): Promise<{ error: string; success: boolean }> {
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
  }

  const { error } = await db()
    .from('site_config')
    .upsert({ id: 1, ...config, updated_at: new Date().toISOString() })

  if (error) return { error: error.message, success: false }

  revalidatePath('/', 'layout')
  return { error: '', success: true }
}

export async function loadSettings(): Promise<SiteConfig | null> {
  const { data } = await db().from('site_config').select('*').eq('id', 1).single()
  return data as SiteConfig | null
}

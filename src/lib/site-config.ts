import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'

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
  // Colors
  color_primary: string
  color_background: string
  color_surface: string
  color_text: string
  // Typography
  font_heading: string
  font_body: string
  h1_size: number
  h1_weight: number
  h2_size: number
  h2_weight: number
  h3_size: number
  h3_weight: number
  h4_size: number
  h4_weight: number
  body_size: number
  body_weight: number
  body_line_height: number
  // Logos
  logo_light_url: string
  logo_dark_url: string
}

export const SITE_CONFIG_DEFAULTS: SiteConfig = {
  business_name:    'SC Creative',
  tagline:          "Walker County's Growth Partner",
  phone:            '(678) 997-1106',
  email:            'info@samcolecreative.com',
  address:          'Jasper, AL',
  meta_title:       "SC Creative — Walker County's Growth Partner",
  meta_description: 'We build the digital systems that grow local businesses in Walker County, AL.',
  facebook_url:     '',
  instagram_url:    '',
  linkedin_url:     '',
  twitter_url:      '',
  youtube_url:      '',
  color_primary:    '#1cc7c3',
  color_background: '#070d17',
  color_surface:    '#0b1520',
  color_text:       '#e8eef4',
  font_heading:     'poppins',
  font_body:        'poppins',
  h1_size:          64,
  h1_weight:        800,
  h2_size:          48,
  h2_weight:        700,
  h3_size:          32,
  h3_weight:        700,
  h4_size:          24,
  h4_weight:        600,
  body_size:        16,
  body_weight:      400,
  body_line_height: 1.6,
  logo_light_url:   '',
  logo_dark_url:    '',
}

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// React cache() deduplicates this across all server components in the same request
export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  try {
    const { data } = await adminClient()
      .from('site_config')
      .select('*')
      .eq('id', 1)
      .single()
    return { ...SITE_CONFIG_DEFAULTS, ...(data ?? {}) }
  } catch {
    return SITE_CONFIG_DEFAULTS
  }
})

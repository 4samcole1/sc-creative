import { createClient } from '@supabase/supabase-js'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export interface PageRecord {
  id: string
  title: string
  slug: string
  parent_id: string | null
  sort_order: number
  content: string
  status: 'draft' | 'published'
  meta_title: string
  meta_description: string
  og_image_url: string
  created_at: string
  updated_at: string
}

export async function getPageBySlug(slug: string): Promise<PageRecord | null> {
  const { data } = await db().from('pages').select('*').eq('slug', slug).single()
  return data as PageRecord | null
}

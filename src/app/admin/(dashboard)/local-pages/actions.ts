'use server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export interface LocalPage {
  id: string
  city: string
  state: string
  slug: string
  content: string
  status: 'draft' | 'published'
  meta_title: string
  meta_description: string
  created_at: string
  updated_at: string
}

export async function getLocalPages(): Promise<LocalPage[]> {
  const { data } = await db().from('local_pages').select('*').order('city', { ascending: true })
  return (data ?? []) as LocalPage[]
}

export async function getLocalPage(id: string): Promise<LocalPage | null> {
  const { data } = await db().from('local_pages').select('*').eq('id', id).single()
  return data as LocalPage | null
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export async function upsertLocalPageAction(
  _prev: { error: string; success: boolean },
  formData: FormData,
): Promise<{ error: string; success: boolean }> {
  const id     = (formData.get('id') as string)?.trim() || null
  const city   = (formData.get('city') as string).trim()
  const state  = (formData.get('state') as string).trim() || 'AL'
  const status = formData.get('status') === 'published' ? 'published' : 'draft'

  // Auto-generate slug if not provided: web-design-[city]-[state]
  let slug = (formData.get('slug') as string).trim()
  if (!slug) slug = slugify(`${city}-${state}`)

  if (!city)  return { error: 'City is required', success: false }
  if (!slug)  return { error: 'Slug is required', success: false }
  if (!/^[a-z0-9-]+$/.test(slug)) return { error: 'Slug may only contain lowercase letters, numbers, and hyphens', success: false }

  const now = new Date().toISOString()
  const payload = {
    city, state, slug, status,
    content:          (formData.get('content')          as string).trim(),
    meta_title:       (formData.get('meta_title')       as string).trim(),
    meta_description: (formData.get('meta_description') as string).trim(),
    updated_at: now,
  }

  if (id) {
    const { error } = await db().from('local_pages').update(payload).eq('id', id)
    if (error) return { error: error.message, success: false }
    revalidatePath('/admin/local-pages')
    revalidatePath(`/${slug}`)
    return { error: '', success: true }
  }

  const { data, error } = await db().from('local_pages').insert({ ...payload, created_at: now }).select('id').single()
  if (error) return { error: error.message, success: false }
  revalidatePath('/admin/local-pages')
  redirect(`/admin/local-pages/${data.id}/edit`)
}

export async function deleteLocalPageAction(id: string) {
  await db().from('local_pages').delete().eq('id', id)
  revalidatePath('/admin/local-pages')
  redirect('/admin/local-pages')
}

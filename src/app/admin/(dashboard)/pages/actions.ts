'use server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export interface Page {
  id: string
  title: string
  slug: string
  content: string
  status: 'draft' | 'published'
  meta_title: string
  meta_description: string
  created_at: string
  updated_at: string
}

export async function getPages(): Promise<Page[]> {
  const { data } = await db().from('pages').select('*').order('created_at', { ascending: false })
  return (data ?? []) as Page[]
}

export async function getPage(id: string): Promise<Page | null> {
  const { data } = await db().from('pages').select('*').eq('id', id).single()
  return data as Page | null
}

export async function upsertPageAction(
  _prev: { error: string; success: boolean },
  formData: FormData,
): Promise<{ error: string; success: boolean }> {
  const id     = (formData.get('id') as string)?.trim() || null
  const title  = (formData.get('title') as string).trim()
  const slug   = (formData.get('slug') as string).trim()
  const status = formData.get('status') === 'published' ? 'published' : 'draft'

  if (!title) return { error: 'Title is required', success: false }
  if (!slug)  return { error: 'Slug is required', success: false }
  if (!/^[a-z0-9-]+$/.test(slug)) return { error: 'Slug may only contain lowercase letters, numbers, and hyphens', success: false }

  const now = new Date().toISOString()
  const payload = {
    title, slug, status,
    content:         (formData.get('content')         as string).trim(),
    meta_title:      (formData.get('meta_title')      as string).trim(),
    meta_description:(formData.get('meta_description') as string).trim(),
    updated_at: now,
  }

  if (id) {
    const { error } = await db().from('pages').update(payload).eq('id', id)
    if (error) return { error: error.message, success: false }
    revalidatePath('/admin/pages')
    revalidatePath(`/${slug}`)
    return { error: '', success: true }
  }

  const { data, error } = await db().from('pages').insert({ ...payload, created_at: now }).select('id').single()
  if (error) return { error: error.message, success: false }
  revalidatePath('/admin/pages')
  redirect(`/admin/pages/${data.id}/edit`)
}

export async function deletePageAction(id: string) {
  await db().from('pages').delete().eq('id', id)
  revalidatePath('/admin/pages')
  redirect('/admin/pages')
}

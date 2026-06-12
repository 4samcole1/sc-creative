'use server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  status: 'draft' | 'published'
  featured_image_url: string
  category: string
  tags: string
  meta_title: string
  meta_description: string
  published_at: string | null
  created_at: string
  updated_at: string
}

export async function getPosts(): Promise<Post[]> {
  const { data } = await db().from('posts').select('*').order('created_at', { ascending: false })
  return (data ?? []) as Post[]
}

export async function getPost(id: string): Promise<Post | null> {
  const { data } = await db().from('posts').select('*').eq('id', id).single()
  return data as Post | null
}

export async function upsertPostAction(
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
    title,
    slug,
    excerpt:            (formData.get('excerpt')            as string).trim(),
    content:            (formData.get('content')            as string).trim(),
    status,
    featured_image_url: (formData.get('featured_image_url') as string).trim(),
    category:           (formData.get('category')           as string).trim(),
    tags:               (formData.get('tags')               as string).trim(),
    meta_title:         (formData.get('meta_title')         as string).trim(),
    meta_description:   (formData.get('meta_description')   as string).trim(),
    published_at:       status === 'published' ? now : null,
    updated_at:         now,
  }

  if (id) {
    const { error } = await db().from('posts').update(payload).eq('id', id)
    if (error) return { error: error.message, success: false }
    revalidatePath('/admin/posts')
    revalidatePath(`/blog/${slug}`)
    return { error: '', success: true }
  }

  const { data, error } = await db().from('posts').insert(payload).select('id').single()
  if (error) return { error: error.message, success: false }
  revalidatePath('/admin/posts')
  redirect(`/admin/posts/${data.id}/edit`)
}

export async function deletePostAction(id: string) {
  await db().from('posts').delete().eq('id', id)
  revalidatePath('/admin/posts')
  redirect('/admin/posts')
}

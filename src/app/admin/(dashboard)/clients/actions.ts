'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase-admin'
import { sessionOptions, type SessionData } from '@/lib/session'
import type { ClientRow } from '@/lib/clients-data'
import { geocode } from '@/lib/geocode'
import { validateClient, type ClientInput } from './validation'

async function requireSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  if (!session.isLoggedIn) redirect('/login')
}

export async function getClientRow(id: string): Promise<ClientRow | null> {
  await requireSession()
  const { data } = await createAdminClient().from('clients').select('*').eq('id', id).single()
  return (data as ClientRow) ?? null
}

export async function upsertClientAction(
  _prev: { error: string; success: boolean },
  formData: FormData,
): Promise<{ error: string; success: boolean }> {
  await requireSession()

  const input: ClientInput = {
    name:     (formData.get('name')     as string) ?? '',
    city:     (formData.get('city')     as string) ?? '',
    state:    (formData.get('state')    as string) ?? '',
    industry: (formData.get('industry') as string) ?? '',
  }

  const error = validateClient(input)
  if (error) return { error, success: false }

  const id = (formData.get('id') as string)?.trim() || null
  const payload: Record<string, unknown> = {
    name:           input.name.trim(),
    city:           input.city.trim(),
    state:          input.state.trim(),
    industry:       input.industry.trim(),
    website:        ((formData.get('website')  as string) ?? '').trim(),
    logo_url:       ((formData.get('logo_url') as string) ?? '').trim(),
    blurb:          ((formData.get('blurb')    as string) ?? '').trim(),
    show_trust_bar: formData.get('show_trust_bar') === 'on',
    show_map:       formData.get('show_map') === 'on',
    show_portfolio: formData.get('show_portfolio') === 'on',
    needs_review:   formData.get('needs_review') === 'on',
    updated_at:     new Date().toISOString(),
  }

  // Derive the map pin from City + State automatically (free OSM geocoding).
  // On success we set the coordinates; on failure we leave them untouched
  // (so an edit keeps any existing pin, and a new client just has no pin yet).
  const geo = await geocode(`${input.city.trim()}, ${input.state.trim()}, USA`)
  if (geo) {
    payload.lat = geo.lat
    payload.lng = geo.lng
  }

  const db = createAdminClient()
  if (id) {
    const { error: e } = await db.from('clients').update(payload).eq('id', id)
    if (e) return { error: e.message, success: false }
    revalidatePath('/')
    revalidatePath('/admin/clients')
    return { error: '', success: true }
  }

  const { data, error: e } = await db.from('clients').insert(payload).select('id').single()
  if (e) return { error: e.message, success: false }
  revalidatePath('/')
  revalidatePath('/admin/clients')
  redirect(`/admin/clients/${data.id}/edit`)
}

export async function deleteClientAction(id: string) {
  await requireSession()
  await createAdminClient().from('clients').delete().eq('id', id)
  revalidatePath('/')
  revalidatePath('/admin/clients')
  redirect('/admin/clients')
}

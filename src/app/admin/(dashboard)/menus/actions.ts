'use server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export interface Menu {
  id: string
  name: string
  location: string
}

export interface MenuItem {
  id: string
  menu_id: string
  label: string
  url: string
  sort_order: number
  opens_new_tab: boolean
}

export async function getMenusWithItems(): Promise<Array<Menu & { items: MenuItem[] }>> {
  const { data: menus } = await db().from('menus').select('*').order('name')
  const { data: items } = await db().from('menu_items').select('*').order('sort_order')
  return (menus ?? []).map((menu: Menu) => ({
    ...menu,
    items: (items ?? []).filter((item: MenuItem) => item.menu_id === menu.id),
  }))
}

export async function addMenuItemAction(
  _prev: { error: string; success: boolean },
  formData: FormData,
): Promise<{ error: string; success: boolean }> {
  const menu_id       = (formData.get('menu_id') as string).trim()
  const label         = (formData.get('label') as string).trim()
  const url           = (formData.get('url') as string).trim()
  const opens_new_tab = formData.get('opens_new_tab') === 'on'

  if (!menu_id) return { error: 'Menu ID missing', success: false }
  if (!label)   return { error: 'Label is required', success: false }
  if (!url)     return { error: 'URL is required', success: false }

  // Get current max sort_order for this menu
  const { data: existing } = await db()
    .from('menu_items')
    .select('sort_order')
    .eq('menu_id', menu_id)
    .order('sort_order', { ascending: false })
    .limit(1)
  const sort_order = ((existing?.[0] as MenuItem | undefined)?.sort_order ?? -1) + 1

  const { error } = await db().from('menu_items').insert({ menu_id, label, url, sort_order, opens_new_tab })
  if (error) return { error: error.message, success: false }
  revalidatePath('/admin/menus')
  return { error: '', success: true }
}

export async function updateMenuItemAction(
  _prev: { error: string; success: boolean },
  formData: FormData,
): Promise<{ error: string; success: boolean }> {
  const id            = (formData.get('id') as string).trim()
  const label         = (formData.get('label') as string).trim()
  const url           = (formData.get('url') as string).trim()
  const opens_new_tab = formData.get('opens_new_tab') === 'on'

  if (!label) return { error: 'Label is required', success: false }
  if (!url)   return { error: 'URL is required', success: false }

  const { error } = await db().from('menu_items').update({ label, url, opens_new_tab }).eq('id', id)
  if (error) return { error: error.message, success: false }
  revalidatePath('/admin/menus')
  return { error: '', success: true }
}

export async function deleteMenuItemAction(id: string) {
  await db().from('menu_items').delete().eq('id', id)
  revalidatePath('/admin/menus')
}

export async function reorderMenuItemAction(id: string, direction: 'up' | 'down') {
  const { data: item } = await db().from('menu_items').select('*').eq('id', id).single()
  if (!item) return

  const mi = item as MenuItem
  const siblingOrder = direction === 'up' ? mi.sort_order - 1 : mi.sort_order + 1
  const { data: siblings } = await db()
    .from('menu_items')
    .select('*')
    .eq('menu_id', mi.menu_id)
    .eq('sort_order', siblingOrder)
    .limit(1)

  const sibling = siblings?.[0] as MenuItem | undefined
  if (!sibling) return

  await db().from('menu_items').update({ sort_order: siblingOrder }).eq('id', mi.id)
  await db().from('menu_items').update({ sort_order: mi.sort_order }).eq('id', sibling.id)
  revalidatePath('/admin/menus')
}

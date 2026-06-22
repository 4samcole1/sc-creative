// src/lib/clients-data.ts
// Single source of truth for clients. Phase-1-frozen interface + accessors,
// now backed by Supabase. Reads fail soft to [] so the public site never crashes.
import { supabase } from '@/lib/supabase'

export interface Client {
  id: string
  name: string
  city: string
  state: string
  lat: number | null
  lng: number | null
  industry: string
  website: string
  logoUrl: string
  blurb: string
  show: { trustBar: boolean; map: boolean; portfolio: boolean }
  gbpUrl?: string
  needsReview?: boolean
}

export interface ClientRow {
  id: string
  name: string
  city: string
  state: string
  lat: number | null
  lng: number | null
  industry: string
  website: string
  logo_url: string
  blurb: string
  show_trust_bar: boolean
  show_map: boolean
  show_portfolio: boolean
  gbp_url: string | null
  needs_review: boolean
}

export function rowToClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    city: row.city ?? '',
    state: row.state ?? '',
    lat: row.lat,
    lng: row.lng,
    industry: row.industry ?? '',
    website: row.website ?? '',
    logoUrl: row.logo_url ?? '',
    blurb: row.blurb ?? '',
    show: {
      trustBar: row.show_trust_bar,
      map: row.show_map,
      portfolio: row.show_portfolio,
    },
    gbpUrl: row.gbp_url ?? undefined,
    needsReview: row.needs_review || undefined,
  }
}

export function selectMapClients(clients: Client[]): Client[] {
  return clients.filter(c => c.show.map && c.lat != null && c.lng != null)
}

export function selectTrustBarClients(clients: Client[]): Client[] {
  return clients
    .filter(c => c.show.trustBar)
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
}

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase.from('clients').select('*').order('name')
  if (error || !data) return []
  return (data as ClientRow[]).map(rowToClient)
}

export async function getMapClients(): Promise<Client[]> {
  return selectMapClients(await getClients())
}

export async function getTrustBarClients(): Promise<Client[]> {
  return selectTrustBarClients(await getClients())
}

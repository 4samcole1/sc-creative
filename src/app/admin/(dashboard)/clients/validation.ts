// Pure, framework-free — safe to import from both the server action and Jest.
export interface ClientInput {
  name: string; city: string; state: string; industry: string
  lat: string; lng: string
}

// Returns an error message, or null if valid.
export function validateClient(p: ClientInput): string | null {
  if (!p.name.trim())     return 'Name is required'
  if (!p.city.trim())     return 'City is required'
  if (!p.state.trim())    return 'State is required'
  if (!p.industry.trim()) return 'Industry is required'
  if (p.lat.trim() && Number.isNaN(Number(p.lat))) return 'Latitude must be a number'
  if (p.lng.trim() && Number.isNaN(Number(p.lng))) return 'Longitude must be a number'
  return null
}

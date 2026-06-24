// src/lib/geocode.ts
// Server-side geocoding via OpenStreetMap Nominatim — free, no API key, and it
// matches the OSM tiles the client map already uses. Returns null on any failure
// so callers can degrade gracefully (a client just won't get a map pin).
export async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  const q = query.trim()
  if (!q) return null

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'sc-creative-admin/1.0 (sam@samcolecreative.com)' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = (await res.json()) as Array<{ lat: string; lon: string }>
    if (!Array.isArray(data) || data.length === 0) return null
    const lat = parseFloat(data[0].lat)
    const lng = parseFloat(data[0].lon)
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null
    return { lat, lng }
  } catch {
    return null
  }
}

# Phase 1 — Client Map & Unified Client List

**Date:** 2026-06-22
**Status:** Approved for spec review
**Project:** SC Creative site (`~/Ai Sites/sc-creative`, Next.js 16 / React 19)

## Overview

Add a **client map** to the home page below the "Modern Business Infrastructure"
(`Systems`) section, repurposing an existing light-themed Leaflet design from a
*service-area* map into a *client* map (one pin per business client).

This is **Phase 1 of three**. The larger goal is a **unified client system**: a
single global client list that is the source of truth for three surfaces — the
top **trust bar**, the home-page **client map**, and (later) a **portfolio** —
where each client carries placement tags controlling where it appears.

- **Phase 1 (this spec):** Global `Client` data model + hardcoded source-of-truth
  list, the map, and rewiring the trust bar to read from the same list.
- **Phase 2 (future spec):** Supabase-backed internal admin module (auth + CRUD +
  tag toggles) to manage the list, including a **"paste GBP URL → auto-import"**
  feature.
- **Phase 3 (future spec):** Portfolio surface driven off the same list.

## Goals

- One source of truth for clients; no duplicated lists.
- Each client renders on exactly the surfaces it's tagged for.
- Map shows real client locations accurately (no guessed pins).
- Data layer is CMS-agnostic so a Supabase swap later is a one-file change.
- Data shape mirrors what a Google Business Profile import will return (Phase 2).

## Non-Goals (deferred)

- The internal admin / CRUD UI (Phase 2).
- GBP URL auto-import logic (Phase 2 — only the `gbpUrl` field is reserved now).
- Portfolio surface (Phase 3).
- Per-client logos for the trust bar (it stays a names-only marquee).
- Supabase wiring (deps exist but stay stubbed this phase).

## Architecture

### Data model — `src/lib/clients-data.ts` (new)

Single source of truth. Mirrors the existing `pages-data.ts` accessor pattern.

```ts
export interface Client {
  id: string
  name: string
  city: string
  state: string
  lat: number | null      // null = not yet geocoded (won't render on map)
  lng: number | null
  industry: string
  website: string         // '' if none
  logoUrl: string         // '' if none — popup degrades gracefully
  blurb: string           // one-line "what we did", '' if none
  show: {
    trustBar: boolean
    map: boolean
    portfolio: boolean
  }
  gbpUrl?: string         // reserved for Phase 2 GBP importer
  needsReview?: boolean   // flags low-confidence seed data
}

const CLIENTS: Client[] = [ /* seed data below */ ]

export function getClients(): Client[] { return CLIENTS }
export function getMapClients(): Client[]
  { return CLIENTS.filter(c => c.show.map && c.lat != null && c.lng != null) }
export function getTrustBarClients(): Client[]
  { return CLIENTS.filter(c => c.show.trustBar) }
```

A client only renders on the map when `show.map === true` **and** it has
coordinates — so trust-bar-only names (no location) never break the map.

### Map — `src/components/sections/ClientMap.tsx` (new)

- Repurposes the existing light Leaflet design: CARTO light tiles, rounded card,
  custom +/- zoom, branded teal pins (`#1cc7c3`).
- **Coverage zones / legend removed** — this is a client map, not a service area.
- Built with `react-leaflet` + `leaflet`. Rendered **client-only** via Next
  `dynamic(() => import(...), { ssr: false })` so Leaflet's `window` access
  doesn't break server rendering.
- **Pin overlap handling:** ~10 clients share near-identical Jasper coordinates.
  Use `leaflet.markercluster` (spiderfy on click) so every client is clickable.
- **Popup per pin:** name, city, industry, website link (new tab), logo (if
  `logoUrl`), blurb (if present). Degrades cleanly when optional fields are empty.
- **Default view:** centered/zoomed on the Jasper–Birmingham–Tuscaloosa cluster;
  far pins (Huntsville, Cumming GA) reachable by zoom-out.
- **Theme:** light card, intentionally contrasting the dark `Systems` section above.
- **Left column:** keep "ROOTED IN OUR COMMUNITY" eyebrow + heading; sub-copy
  shifts to client language; region list replaced with a live client-count /
  cities-served stat derived from `getMapClients()`.

### Trust bar — `src/components/sections/StatsBar.tsx` (modify)

Keep the marquee look exactly. Replace the hardcoded `businesses` array with
`getTrustBarClients().map(c => c.name)` (sorted as today). The 4 stat tiles stay
hardcoded for now.

### Home page — `src/app/(marketing)/page.tsx` (modify)

Insert `<ClientMap />` after `<Systems />` (becomes the last section).

### Dependencies to add

`leaflet`, `react-leaflet`, `leaflet.markercluster` (+ `@types/leaflet`,
`@types/leaflet.markercluster`). Leaflet CSS imported in the map component.

## Seed Data (Phase 1)

**Trust bar:** the existing ~55 names migrate in as `Client` records with
`show.trustBar: true` (location fields blank where unknown).

**Map (`show.map: true`) — 16 businesses → 18 pins:**

| Client | City, State | Confidence |
|--------|-------------|-----------|
| ARS Roofing | Northport, AL | resolved by owner |
| At The Lake Spa & Wellness | Jasper, AL (Curry Hwy) | HIGH |
| Backyard Blessings | Dora, AL | HIGH |
| Glory Fellowship Baptist Church | Jasper, AL | HIGH |
| HaulX Moving | Cumming, GA | owner-set |
| Imago Dei Academy | Jasper, AL (Boldo) | HIGH |
| Loyal Standard | Jasper, AL | HIGH |
| Mann Home Services | Pelham, AL | `needsReview` |
| Walker Medical Diagnostics | Jasper, AL | HIGH |
| Miller Roofing | Jasper, AL | HIGH |
| Sanders Aviation (×3) | Jasper / Huntsville / Tuscaloosa, AL | HIGH |
| Smith Lake Family Care | Jasper, AL | HIGH |
| TaleGate Sports | Jasper, AL | HIGH |
| The Walker Leader | Jasper, AL | HIGH |
| 67 Magazine | Jasper, AL | HIGH |
| Water Extraction Tech | Jasper, AL | HIGH |
| Talladega County Sheriff | Talladega, AL (main only) | HIGH |

Excluded from map: "Jasper AL" (dropped — it's the city, not a client);
Southeastern Construction & 4 Seasons Landscaping (closed — removed entirely).

City-level coordinates are sufficient for this map; exact GBP-pin coords arrive
via the Phase 2 importer.

## Testing

- Unit: `getMapClients()` excludes `show.map: false` and null-coordinate records;
  `getTrustBarClients()` returns trust-bar-tagged names.
- Render: map mounts client-side without SSR errors; popups show only populated
  fields; clustered Jasper pins spiderfy and each is individually clickable.
- Visual: light card renders correctly below the dark `Systems` section;
  responsive layout holds on mobile.

## Risks / Open Items

- `needsReview` clients (Mann Home Services) have approximate locations — acceptable
  for launch, corrected later via importer.
- `react-leaflet` v? must be compatible with React 19 — verify exact versions at
  install time (pin during implementation).

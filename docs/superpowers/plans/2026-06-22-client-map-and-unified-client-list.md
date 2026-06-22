# Client Map & Unified Client List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a client map below the home page's "Modern Business Infrastructure" section, driven by a new unified client list that also feeds the existing trust bar.

**Architecture:** A single hardcoded `Client[]` source of truth in `src/lib/clients-data.ts` exposed through accessor functions. The trust bar marquee and a new Leaflet-based `ClientMap` both read from it; each client carries `show` tags deciding where it appears. The map is a client-only component (dynamic import, `ssr: false`) using `react-leaflet` + `leaflet.markercluster` to keep co-located Jasper pins clickable.

**Tech Stack:** Next.js 16, React 19.2.4, TypeScript, Jest + ts-jest + jsdom, `leaflet` / `react-leaflet` v5 / `leaflet.markercluster`.

## Global Constraints

- Project root: `~/Ai Sites/sc-creative`. NEVER touch `~/Desktop/sc-creative`.
- React 19.2.4 → use `react-leaflet@^5` (v5 supports React 19; v4 does not).
- Data layer stays CMS-agnostic: all reads go through accessor functions, never the raw array.
- Phase 2 (Supabase admin + GBP import) is owned by a separate chat — do NOT add Supabase wiring, auth, or admin UI here. Only reserve the `gbpUrl?` / `needsReview?` fields.
- Brand teal: `#1cc7c3`. Dark section bg: `#070d17`. Reuse `t` from `src/lib/typography.ts` for text styles.
- A client renders on the map ONLY when `show.map === true` AND `lat`/`lng` are non-null.
- Map seed = 16 businesses → 18 pins (Sanders Aviation has 3 location records; only its Jasper record is `show.trustBar: true` so the marquee lists it once).

---

### Task 1: Test harness + unified client data model

**Files:**
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Create: `src/lib/clients-data.ts`
- Test: `src/lib/clients-data.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `interface Client` (see Step 3 for exact shape)
  - `getClients(): Client[]`
  - `getMapClients(): Client[]` — `show.map === true && lat != null && lng != null`
  - `getTrustBarClients(): Client[]` — `show.trustBar === true`

- [ ] **Step 1: Add jest config** (no test runner exists yet)

`jest.config.ts`:
```ts
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
}
export default config
```

`jest.setup.ts`:
```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 2: Write the failing test**

`src/lib/clients-data.test.ts`:
```ts
import { getClients, getMapClients, getTrustBarClients } from './clients-data'

describe('clients-data accessors', () => {
  it('getMapClients returns only map-tagged clients with coordinates', () => {
    const map = getMapClients()
    expect(map.length).toBeGreaterThan(0)
    expect(map.every(c => c.show.map && c.lat != null && c.lng != null)).toBe(true)
  })

  it('getMapClients yields 18 pins (16 businesses, Sanders ×3)', () => {
    expect(getMapClients()).toHaveLength(18)
  })

  it('getTrustBarClients returns only trustBar-tagged clients', () => {
    const tb = getTrustBarClients()
    expect(tb.length).toBeGreaterThan(0)
    expect(tb.every(c => c.show.trustBar)).toBe(true)
  })

  it('lists Sanders Aviation once in the trust bar', () => {
    const sanders = getTrustBarClients().filter(c => c.name === 'Sanders Aviation')
    expect(sanders).toHaveLength(1)
  })

  it('excludes closed businesses entirely', () => {
    const names = getClients().map(c => c.name)
    expect(names).not.toContain('Southeastern Construction')
    expect(names).not.toContain('4 Seasons Landscaping')
  })
})
```

- [ ] **Step 3: Run test, verify it fails**

Run: `npm test -- clients-data`
Expected: FAIL — `Cannot find module './clients-data'`.

- [ ] **Step 4: Implement the data model**

`src/lib/clients-data.ts`:
```ts
// Single source of truth for clients. Mirrors the pages-data.ts accessor pattern.
// Phase 2 (separate effort) swaps the CLIENTS array for a Supabase-backed source
// behind these same accessors. Do not read CLIENTS directly elsewhere.

export interface Client {
  id: string
  name: string
  city: string
  state: string
  lat: number | null
  lng: number | null
  industry: string
  website: string   // '' if none
  logoUrl: string   // '' if none
  blurb: string     // '' if none
  show: { trustBar: boolean; map: boolean; portfolio: boolean }
  gbpUrl?: string       // reserved for Phase 2 GBP importer
  needsReview?: boolean // approximate/low-confidence seed data
}

// Trust-bar-only names migrated from the former StatsBar.tsx array.
// Location fields blank — they appear in the marquee only, never on the map.
const TRUST_BAR_ONLY: string[] = [
  '67 Magazine', 'Always Answered', 'Andrews Mechanical', 'Answer Pro',
  'AOC Connect', 'At The Lake Spa & Wellness', 'Bethlehem Doodles', 'BoatSafe',
  'Brandblueprint.ai', 'Brock Transportation', 'Carson Plumbing', 'Clarry Lane',
  'Color Faux Walls', 'Daybreak Care', 'DirectLine', 'Divergent', 'Ducktown Lodge',
  'Employee Hotlines', 'Expert Language Services', 'GB Construction', 'Gen Growth',
  'Georgia Standard', 'Hallway Healthcare', 'Heritage Home Painting', 'James Health',
  'Mastercraft Plumbing', 'Mayer Landscaping', 'MCM Clothing', 'Mentality',
  'Muncie Rooterman', 'Peak Performance', 'Piece by Peace', 'Precision Bill Review',
  'Roundtable Advisors', 'SHOAlign', 'Soukkala', 'United Physician Group', 'Vote Beaty',
]
// NOTE: names that are ALSO map clients (e.g. ARS Roofing, Backyard Blessings,
// Glory Fellowship, HaulX Moving, Imago Dei Academy, Loyal Standard, Mann Home
// Services, Miller Roofing, Sanders Aviation, Smith Lake Family Care, TaleGate
// Sports, The Walker Leader, Water Extraction Tech, Medical Diagnostics,
// Talladega County Sheriff) are defined as full records below — NOT in this array,
// to avoid duplicates in the marquee. '67 Magazine' & 'At The Lake Spa' kept here
// because they are full map records too; remove them from this list — see Step 5.

const blank = { lat: null, lng: null, industry: '', website: '', logoUrl: '', blurb: '' }

const trustBarRecords: Client[] = TRUST_BAR_ONLY.map((name, i) => ({
  id: `tb-${i}`, name, city: '', state: '', ...blank,
  show: { trustBar: true, map: false, portfolio: false },
}))

// Full map records (16 businesses → 18 pins). City-level coordinates.
const mapRecords: Client[] = [
  { id: 'ars-roofing', name: 'ARS Roofing', city: 'Northport', state: 'AL',
    lat: 33.2290, lng: -87.5772, industry: 'Roofing', website: '', logoUrl: '',
    blurb: '', show: { trustBar: true, map: true, portfolio: false }, needsReview: true },
  { id: 'at-the-lake-spa', name: 'At The Lake Spa & Wellness', city: 'Jasper', state: 'AL',
    lat: 33.9090, lng: -87.2380, industry: 'Spa & Wellness', website: '', logoUrl: '',
    blurb: '', show: { trustBar: true, map: true, portfolio: false } },
  { id: 'backyard-blessings', name: 'Backyard Blessings', city: 'Dora', state: 'AL',
    lat: 33.7320, lng: -87.0920, industry: '', website: '', logoUrl: '',
    blurb: '', show: { trustBar: true, map: true, portfolio: false } },
  { id: 'glory-fellowship', name: 'Glory Fellowship Baptist Church', city: 'Jasper', state: 'AL',
    lat: 33.8200, lng: -87.2960, industry: 'Church', website: '', logoUrl: '',
    blurb: '', show: { trustBar: true, map: true, portfolio: false } },
  { id: 'haulx-moving', name: 'HaulX Moving', city: 'Cumming', state: 'GA',
    lat: 34.2073, lng: -84.1402, industry: 'Moving', website: 'https://haulxmoving.com/',
    logoUrl: '', blurb: '', show: { trustBar: true, map: true, portfolio: false } },
  { id: 'imago-dei', name: 'Imago Dei Academy', city: 'Jasper', state: 'AL',
    lat: 33.9650, lng: -87.1320, industry: 'Education', website: '', logoUrl: '',
    blurb: '', show: { trustBar: true, map: true, portfolio: false } },
  { id: 'loyal-standard', name: 'Loyal Standard', city: 'Jasper', state: 'AL',
    lat: 33.8312, lng: -87.2772, industry: '', website: '', logoUrl: '',
    blurb: '', show: { trustBar: true, map: true, portfolio: false } },
  { id: 'mann-home-services', name: 'Mann Home Services', city: 'Pelham', state: 'AL',
    lat: 33.2857, lng: -86.8097, industry: 'Home Services', website: 'https://mannhomeservices.com/',
    logoUrl: '', blurb: '', show: { trustBar: true, map: true, portfolio: false }, needsReview: true },
  { id: 'walker-medical-diagnostics', name: 'Medical Diagnostics', city: 'Jasper', state: 'AL',
    lat: 33.8780, lng: -87.2550, industry: 'Healthcare', website: '', logoUrl: '',
    blurb: '', show: { trustBar: true, map: true, portfolio: false } },
  { id: 'miller-roofing', name: 'Miller Roofing', city: 'Jasper', state: 'AL',
    lat: 33.8312, lng: -87.2772, industry: 'Roofing', website: '', logoUrl: '',
    blurb: '', show: { trustBar: true, map: true, portfolio: false } },
  { id: 'sanders-jasper', name: 'Sanders Aviation', city: 'Jasper', state: 'AL',
    lat: 33.9008, lng: -87.3144, industry: 'Aviation', website: '', logoUrl: '',
    blurb: 'HQ — Bevill Field', show: { trustBar: true, map: true, portfolio: false } },
  { id: 'sanders-huntsville', name: 'Sanders Aviation', city: 'Huntsville', state: 'AL',
    lat: 34.6372, lng: -86.7751, industry: 'Aviation', website: '', logoUrl: '',
    blurb: '', show: { trustBar: false, map: true, portfolio: false } },
  { id: 'sanders-tuscaloosa', name: 'Sanders Aviation', city: 'Tuscaloosa', state: 'AL',
    lat: 33.2206, lng: -87.6114, industry: 'Aviation', website: '', logoUrl: '',
    blurb: '', show: { trustBar: false, map: true, portfolio: false } },
  { id: 'smith-lake-family-care', name: 'Smith Lake Family Care', city: 'Jasper', state: 'AL',
    lat: 34.0966, lng: -87.2625, industry: 'Healthcare', website: '', logoUrl: '',
    blurb: '', show: { trustBar: true, map: true, portfolio: false } },
  { id: 'talegate-sports', name: 'TaleGate Sports', city: 'Jasper', state: 'AL',
    lat: 33.8312, lng: -87.2772, industry: 'Media', website: '', logoUrl: '',
    blurb: '', show: { trustBar: true, map: true, portfolio: false } },
  { id: 'walker-leader', name: 'The Walker Leader', city: 'Jasper', state: 'AL',
    lat: 33.8312, lng: -87.2772, industry: 'Media', website: '', logoUrl: '',
    blurb: '', show: { trustBar: true, map: true, portfolio: false } },
  { id: '67-magazine', name: '67 Magazine', city: 'Jasper', state: 'AL',
    lat: 33.8312, lng: -87.2772, industry: 'Media', website: '', logoUrl: '',
    blurb: '', show: { trustBar: true, map: true, portfolio: false } },
  { id: 'water-extraction-tech', name: 'Water Extraction Tech', city: 'Jasper', state: 'AL',
    lat: 33.8312, lng: -87.2772, industry: 'Restoration', website: 'https://waterextractiontech.com/',
    logoUrl: '', blurb: '', show: { trustBar: true, map: true, portfolio: false } },
  { id: 'talladega-sheriff', name: 'Talladega County Sheriff', city: 'Talladega', state: 'AL',
    lat: 33.4360, lng: -86.1058, industry: 'Government', website: '', logoUrl: '',
    blurb: '', show: { trustBar: true, map: true, portfolio: false } },
]

const CLIENTS: Client[] = [...trustBarRecords, ...mapRecords]

export function getClients(): Client[] { return CLIENTS }

export function getMapClients(): Client[] {
  return CLIENTS.filter(c => c.show.map && c.lat != null && c.lng != null)
}

export function getTrustBarClients(): Client[] {
  return CLIENTS.filter(c => c.show.trustBar)
}
```

- [ ] **Step 5: Remove duplicate names from `TRUST_BAR_ONLY`**

`67 Magazine` and `At The Lake Spa & Wellness` exist as full map records above, so
delete those two strings from the `TRUST_BAR_ONLY` array (they were in the original
StatsBar list). Verify no name in `TRUST_BAR_ONLY` also appears in `mapRecords`.

- [ ] **Step 6: Run tests, verify they pass**

Run: `npm test -- clients-data`
Expected: PASS (5 tests).

- [ ] **Step 7: Commit**

```bash
git add jest.config.ts jest.setup.ts src/lib/clients-data.ts src/lib/clients-data.test.ts
git commit -m "feat: unified client data model + accessors with test harness"
```

---

### Task 2: Rewire trust bar to the unified list

**Files:**
- Modify: `src/components/sections/StatsBar.tsx:14-72` (replace the hardcoded `businesses` array)
- Test: `src/components/sections/StatsBar.test.tsx`

**Interfaces:**
- Consumes: `getTrustBarClients()` from `src/lib/clients-data.ts`.
- Produces: no new exports (component behavior unchanged visually).

- [ ] **Step 1: Write the failing test**

`src/components/sections/StatsBar.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import TrustBar from './StatsBar'

it('renders client names from the unified list', () => {
  render(<TrustBar />)
  // Names appear twice (marquee duplicates the track); use getAllByText.
  expect(screen.getAllByText('Loyal Standard').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Sanders Aviation').length).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- StatsBar`
Expected: FAIL — names not found (array still hardcoded / import missing).

- [ ] **Step 3: Replace the hardcoded array**

In `src/components/sections/StatsBar.tsx`, add at top:
```tsx
import { getTrustBarClients } from '@/lib/clients-data'
```
Replace the entire `const businesses = [ ... ].sort(...)` block (lines ~14-72) with:
```tsx
// Sorted alphabetically (case-insensitive). Sourced from the unified client list.
const businesses = getTrustBarClients()
  .map(c => c.name)
  .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
```
Leave everything else (stats, marquee markup) untouched.

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -- StatsBar`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/StatsBar.tsx src/components/sections/StatsBar.test.tsx
git commit -m "feat: trust bar reads from unified client list"
```

---

### Task 3: ClientMap component

**Files:**
- Modify: `package.json` (add deps)
- Create: `src/components/sections/ClientMap.tsx` (section wrapper + dynamic import)
- Create: `src/components/sections/ClientMapInner.tsx` (the actual Leaflet map, client-only)
- Test: `src/components/sections/ClientMap.test.tsx`

**Interfaces:**
- Consumes: `getMapClients()`, `Client` from `src/lib/clients-data.ts`; `t` from `src/lib/typography.ts`.
- Produces: `export default function ClientMap()` — a `<section>` rendering the
  left copy column + the lazily-loaded map.

- [ ] **Step 1: Install map dependencies**

```bash
npm install leaflet@^1.9.4 react-leaflet@^5.0.0 leaflet.markercluster@^1.5.3
npm install -D @types/leaflet@^1.9.12 @types/leaflet.markercluster@^1.5.4
```
Expected: installs without peer-dep errors against React 19. If `react-leaflet@^5`
reports a React peer conflict, stop and report — do NOT use `--force`.

- [ ] **Step 2: Write the failing test** (mock react-leaflet so jsdom doesn't load real Leaflet)

`src/components/sections/ClientMap.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import ClientMap from './ClientMap'

// next/dynamic returns the loading state in jsdom; assert the static left column.
it('renders the section eyebrow and heading', () => {
  render(<ClientMap />)
  expect(screen.getByText(/ROOTED IN OUR COMMUNITY/i)).toBeInTheDocument()
  expect(screen.getByText(/cities/i)).toBeInTheDocument() // client-count stat
})
```

- [ ] **Step 3: Run test, verify it fails**

Run: `npm test -- ClientMap`
Expected: FAIL — `Cannot find module './ClientMap'`.

- [ ] **Step 4: Build the inner map (client-only)**

`src/components/sections/ClientMapInner.tsx`:
```tsx
'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { getMapClients } from '@/lib/clients-data'

const TEAL = '#1cc7c3'

// Teal divIcon pin (avoids Leaflet's broken default marker asset paths in bundlers).
const pinIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;border-radius:50% 50% 50% 0;
    background:${TEAL};transform:rotate(-45deg);border:2px solid #fff;
    box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 16],
  popupAnchor: [0, -16],
})

function ClusteredMarkers() {
  const map = useMap()
  useEffect(() => {
    const group = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 40 })
    for (const c of getMapClients()) {
      const link = c.website
        ? `<a href="${c.website}" target="_blank" rel="noopener" style="color:${TEAL}">Visit site →</a>`
        : ''
      const industry = c.industry ? `<div style="color:#64748b;font-size:12px">${c.industry}</div>` : ''
      const blurb = c.blurb ? `<div style="margin-top:4px;font-size:12px">${c.blurb}</div>` : ''
      const logo = c.logoUrl ? `<img src="${c.logoUrl}" alt="${c.name}" style="height:28px;margin-bottom:6px"/><br/>` : ''
      const marker = L.marker([c.lat as number, c.lng as number], { icon: pinIcon })
      marker.bindPopup(
        `<div style="min-width:160px">${logo}<strong>${c.name}</strong>
         <div style="color:#64748b;font-size:12px">${c.city}, ${c.state}</div>
         ${industry}${blurb}<div style="margin-top:6px">${link}</div></div>`
      )
      group.addLayer(marker)
    }
    map.addLayer(group)
    return () => { map.removeLayer(group) }
  }, [map])
  return null
}

export default function ClientMapInner() {
  return (
    <MapContainer
      center={[33.6, -87.1]}   // Jasper–Birmingham–Tuscaloosa cluster
      zoom={8}
      style={{ height: '480px', width: '100%', borderRadius: '16px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OSM &copy; CARTO'
      />
      <ClusteredMarkers />
    </MapContainer>
  )
}
```

- [ ] **Step 5: Build the section wrapper (dynamic import, no SSR)**

`src/components/sections/ClientMap.tsx`:
```tsx
'use client'
import dynamic from 'next/dynamic'
import { t } from '@/lib/typography'
import { getMapClients } from '@/lib/clients-data'

const ClientMapInner = dynamic(() => import('./ClientMapInner'), {
  ssr: false,
  loading: () => <div style={{ height: '480px', borderRadius: '16px', background: '#eef2f6' }} />,
})

export default function ClientMap() {
  const clients = getMapClients()
  const cities = new Set(clients.map(c => `${c.city}, ${c.state}`)).size
  return (
    <section style={{ background: '#070d17', padding: '120px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '42fr 58fr', gap: '72px', alignItems: 'center' }}>
          <div>
            <p style={{ ...t.eyebrow, marginBottom: '20px' }}>Rooted in Our Community</p>
            <h2 style={{ ...t.h2, color: '#f0f4f8', marginBottom: '24px' }}>
              The businesses we&apos;re proud to{' '}
              <span style={{ color: '#1cc7c3' }}>partner with.</span>
            </h2>
            <p style={{ ...t.body, color: '#7a8898', marginBottom: '12px' }}>
              From Walker County to across Alabama and beyond — these are the local
              businesses we help grow, compete, and win online.
            </p>
            <p style={{ ...t.small, color: '#1cc7c3', fontWeight: 700 }}>
              {clients.length} clients across {cities} cities
            </p>
          </div>
          <ClientMapInner />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Run test, verify it passes**

Run: `npm test -- ClientMap`
Expected: PASS (left column renders; map is the dynamic loading placeholder in jsdom).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/components/sections/ClientMap.tsx src/components/sections/ClientMapInner.tsx src/components/sections/ClientMap.test.tsx
git commit -m "feat: client map section with clustered Leaflet pins"
```

---

### Task 4: Mount on the home page + manual verification

**Files:**
- Modify: `src/app/(marketing)/page.tsx:1-43`

**Interfaces:**
- Consumes: `ClientMap` default export from `src/components/sections/ClientMap.tsx`.
- Produces: nothing.

- [ ] **Step 1: Add the import and render it after `<Systems />`**

In `src/app/(marketing)/page.tsx` add to imports:
```tsx
import ClientMap from '@/components/sections/ClientMap'
```
Update the returned JSX so `ClientMap` is last:
```tsx
return (
  <>
    <Hero />
    <TrustBar />
    <Services />
    <Approach />
    <Systems />
    <ClientMap />
  </>
)
```

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 3: Build to confirm no SSR / type errors**

Run: `npm run build`
Expected: build succeeds (the `ssr: false` dynamic import keeps Leaflet out of the server bundle).

- [ ] **Step 4: Manual visual verification** (the real gate for map rendering)

Run: `npm run dev`, open the home page, scroll below "Modern Business Infrastructure". Confirm:
- Light map card renders below the dark Systems section.
- Default view shows the Jasper–Birmingham–Tuscaloosa cluster; zooming out reveals Huntsville and Cumming, GA.
- The Jasper cluster expands (spiderfies) on click and every pin is individually clickable.
- Popups show name, city, industry, and a working website link where present; missing fields don't leave empty gaps.
- Left column shows the client-count / cities stat.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(marketing)/page.tsx"
git commit -m "feat: mount client map on home page below Systems"
```

---

## Self-Review

- **Spec coverage:** Data model + accessors (Task 1) ✓; map below Systems (Tasks 3-4) ✓; clustering for co-located Jasper pins (Task 3) ✓; popup fields with graceful degradation (Task 3) ✓; trust bar rewired (Task 2) ✓; coverage legend removed / client copy (Task 3) ✓; light theme + Jasper-cluster default view (Task 3) ✓; `gbpUrl`/`needsReview` reserved (Task 1) ✓; closed businesses excluded, "Jasper AL" dropped (Task 1) ✓; 16 businesses / 18 pins, Sanders once in trust bar (Task 1 tests) ✓.
- **Placeholder scan:** none — all code is concrete.
- **Type consistency:** `Client`, `show.{trustBar,map,portfolio}`, `getClients`/`getMapClients`/`getTrustBarClients` used identically across Tasks 1-3. `lat`/`lng` typed `number | null`, narrowed with `as number` at the marker call where the accessor guarantees non-null.
- **Phase boundary:** no Supabase/admin work — matches the separate-chat ownership of Phase 2.

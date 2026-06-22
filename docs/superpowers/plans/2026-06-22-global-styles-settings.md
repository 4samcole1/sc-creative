# Global Styles + Settings Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the site's global config (business, SEO, social, colors, typography, logos) editable from `/admin/settings`, backed by a Supabase singleton row, with the public site rewired to read every field.

**Architecture:** A single-row `site_config` table (`id = 1`) holds the full `SiteConfig`. `getSiteConfig()` reads it via the anon client and fails soft to `SITE_CONFIG_DEFAULTS`. A ported, session-gated Settings admin upserts the row via the service-role client and `revalidatePath('/', 'layout')`. The Footer and root-layout metadata are rewired to consume the config.

**Tech Stack:** Next.js 16 (App Router, server actions), React 19, TypeScript, Supabase (Postgres + Storage), iron-session, Jest + ts-jest.

## Global Constraints

- Builds on branch `worktree-phase2-admin-clients` (Phase 2 foundation: auth, AdminUI, `createAdminClient`, `supabase` anon client, `requireSession` pattern).
- `site_config` is a **singleton**: `id int primary key default 1` + `check (id = 1)`; all writes `upsert({ id: 1, ... })`.
- Fonts limited to the 4 already loaded: `poppins`, `inter`, `montserrat`, `lato`.
- Validation ranges (verbatim): h1 size 24–128, h2 20–100, h3 16–80, h4 14–60, body 12–24; all weights 100–900; line-height 1–3; colors must match `^#[0-9a-fA-F]{6}$`.
- Service-role key is server-only (`createAdminClient`, never in a `'use client'` file). Public reads use the anon `supabase` client and must fail soft to `SITE_CONFIG_DEFAULTS`.
- Every mutating action calls `requireSession()` first and `revalidatePath('/', 'layout')` after.
- `saveSettingsAction` must NOT overwrite `logo_light_url`/`logo_dark_url` (those are owned by `uploadLogoAction`).
- Brand defaults: primary `#1cc7c3`, bg `#070d17`, surface `#0b1520`, text `#e8eef4`.
- Tests run with node off the default PATH: prefix `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH"` and run via `./node_modules/.bin/jest` / `./node_modules/.bin/tsc`.
- Commit after every task.

---

### Task 1: `site_config` schema + seed SQL, and the `logos` bucket

**Files:**
- Create: `docs/superpowers/db/2026-06-22-site-config.sql` (run by the user in Supabase; not executed by code)

**Interfaces:**
- Produces: `site_config` singleton table whose columns match the `SiteConfig` interface, seeded with one row (`id = 1`).

- [ ] **Step 1: Write the SQL file**

```sql
-- docs/superpowers/db/2026-06-22-site-config.sql
-- Run once in the Supabase SQL editor.

create table if not exists site_config (
  id   int  primary key default 1,
  business_name    text not null default '',
  tagline          text not null default '',
  phone            text not null default '',
  email            text not null default '',
  address          text not null default '',
  meta_title       text not null default '',
  meta_description text not null default '',
  facebook_url     text not null default '',
  instagram_url    text not null default '',
  linkedin_url     text not null default '',
  twitter_url      text not null default '',
  youtube_url      text not null default '',
  color_primary    text not null default '#1cc7c3',
  color_background text not null default '#070d17',
  color_surface    text not null default '#0b1520',
  color_text       text not null default '#e8eef4',
  font_heading     text not null default 'poppins',
  font_body        text not null default 'poppins',
  h1_size int not null default 64,  h1_weight int not null default 800,
  h2_size int not null default 48,  h2_weight int not null default 700,
  h3_size int not null default 32,  h3_weight int not null default 700,
  h4_size int not null default 24,  h4_weight int not null default 600,
  body_size int not null default 16, body_weight int not null default 400,
  body_line_height numeric not null default 1.6,
  logo_light_url   text not null default '/images/logo-white.png',
  logo_dark_url    text not null default '/images/logo-dark.png',
  google_place_id  text not null default '',
  updated_at       timestamptz not null default now(),
  constraint site_config_singleton check (id = 1)
);

alter table site_config enable row level security;

-- Public site reads the config via the anon key:
create policy "site_config is publicly readable"
  on site_config for select to anon, authenticated using (true);
-- Writes happen only through the service-role key (admin actions), which
-- bypasses RLS — so no insert/update/delete policy is defined.

-- Seed the single row (idempotent):
insert into site_config (id) values (1) on conflict (id) do nothing;
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/db/2026-06-22-site-config.sql
git commit -m "feat(db): site_config singleton schema, RLS, and seed SQL"
```

- [ ] **Step 3 (USER, manual): run SQL + create the bucket**

The user runs this file in the Supabase SQL editor, then creates a **public** Storage bucket named `logos` (Supabase → Storage → New bucket → name `logos` → Public). Verify `site_config` has exactly 1 row in the Table Editor.

---

### Task 2: `getSiteConfig()` reads Supabase + `rowToSiteConfig` mapper

**Files:**
- Modify: `src/lib/site-config.ts`
- Test: `src/__tests__/site-config.test.ts`

**Interfaces:**
- Consumes: `supabase` anon client (`@/lib/supabase`).
- Produces:
  - `rowToSiteConfig(row: Record<string, unknown> | null): SiteConfig`
  - `getSiteConfig(): Promise<SiteConfig>` (unchanged signature; now DB-backed, fail-soft)
  - `SiteConfig` interface and `SITE_CONFIG_DEFAULTS` remain exported and unchanged.

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/site-config.test.ts`:

```ts
import { rowToSiteConfig, SITE_CONFIG_DEFAULTS } from '@/lib/site-config'

describe('rowToSiteConfig', () => {
  it('returns defaults when row is null', () => {
    expect(rowToSiteConfig(null)).toEqual(SITE_CONFIG_DEFAULTS)
  })

  it('overrides only the provided fields, keeping defaults for the rest', () => {
    const cfg = rowToSiteConfig({ color_primary: '#000000', h1_size: 72 })
    expect(cfg.color_primary).toBe('#000000')
    expect(cfg.h1_size).toBe(72)
    expect(cfg.color_background).toBe(SITE_CONFIG_DEFAULTS.color_background)
  })

  it('falls back to default for null/undefined field values', () => {
    const cfg = rowToSiteConfig({ color_primary: null, tagline: undefined })
    expect(cfg.color_primary).toBe(SITE_CONFIG_DEFAULTS.color_primary)
    expect(cfg.tagline).toBe(SITE_CONFIG_DEFAULTS.tagline)
  })

  it('ignores columns that are not part of SiteConfig (id, updated_at)', () => {
    const cfg = rowToSiteConfig({ id: 1, updated_at: 'x', color_text: '#ffffff' })
    expect((cfg as Record<string, unknown>).id).toBeUndefined()
    expect(cfg.color_text).toBe('#ffffff')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && ./node_modules/.bin/jest src/__tests__/site-config.test.ts`
Expected: FAIL — `rowToSiteConfig` is not exported.

- [ ] **Step 3: Implement the change**

In `src/lib/site-config.ts`, add the supabase import at the top (after the existing `import { cache } from 'react'`):

```ts
import { supabase } from '@/lib/supabase'
```

Then replace the final line:

```ts
// Static for now — kept async + cached so call sites don't need to change.
export const getSiteConfig = cache(async (): Promise<SiteConfig> => SITE_CONFIG_DEFAULTS)
```

with:

```ts
// Map a raw DB row onto SiteConfig, defaulting any null/missing field.
export function rowToSiteConfig(row: Record<string, unknown> | null): SiteConfig {
  const cfg: SiteConfig = { ...SITE_CONFIG_DEFAULTS }
  if (!row) return cfg
  for (const key of Object.keys(cfg) as (keyof SiteConfig)[]) {
    const v = row[key as string]
    if (v !== null && v !== undefined) (cfg as Record<string, unknown>)[key] = v
  }
  return cfg
}

// Reads the singleton config row. Cached per-render; fails soft to defaults so
// a Supabase hiccup never blanks or unstyles the site.
export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const { data, error } = await supabase.from('site_config').select('*').eq('id', 1).single()
  if (error || !data) return SITE_CONFIG_DEFAULTS
  return rowToSiteConfig(data as Record<string, unknown>)
})
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && ./node_modules/.bin/jest src/__tests__/site-config.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Typecheck + commit**

Run: `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && ./node_modules/.bin/tsc --noEmit`
Expected: 0 errors.

```bash
git add src/lib/site-config.ts src/__tests__/site-config.test.ts
git commit -m "feat(settings): site-config reads Supabase singleton + rowToSiteConfig mapper"
```

---

### Task 3: Settings validation module + server actions

**Files:**
- Create: `src/app/admin/(dashboard)/settings/validation.ts` (pure)
- Create: `src/app/admin/(dashboard)/settings/actions.ts`
- Test: `src/__tests__/settings-validation.test.ts`

**Interfaces:**
- Consumes: `createAdminClient` (`@/lib/supabase-admin`), `sessionOptions`/`SessionData` (`@/lib/session`), `SiteConfig` (`@/lib/site-config`).
- Produces:
  - `validateSettings(raw: Record<string, string>): string | null` + `SAFE_FONTS` (in `validation.ts`)
  - `saveSettingsAction(prev, formData): Promise<{ error: string; success: boolean }>`
  - `uploadLogoAction(field, prev, formData): Promise<{ error: string; url: string }>`
  - `loadSettings(): Promise<SiteConfig | null>`
  - `export type { SiteConfig }`

> Split rationale (same as the clients module): `actions.ts` is `'use server'` and imports `next/*`, which throws under ts-jest's node env. Keeping `validateSettings` framework-free in `validation.ts` lets the unit test import it in isolation.

- [ ] **Step 1: Write the failing validation test**

Create `src/__tests__/settings-validation.test.ts`:

```ts
import { validateSettings } from '@/app/admin/(dashboard)/settings/validation'

const ok: Record<string, string> = {
  color_primary: '#1cc7c3', color_background: '#070d17',
  color_surface: '#0b1520', color_text: '#e8eef4',
  font_heading: 'poppins', font_body: 'inter',
  h1_size: '64', h1_weight: '800', h2_size: '48', h2_weight: '700',
  h3_size: '32', h3_weight: '700', h4_size: '24', h4_weight: '600',
  body_size: '16', body_weight: '400', body_line_height: '1.6',
}

describe('validateSettings', () => {
  it('returns null for a fully valid config', () => {
    expect(validateSettings(ok)).toBeNull()
  })
  it('rejects a malformed hex color', () => {
    expect(validateSettings({ ...ok, color_primary: 'teal' })).toMatch(/hex/i)
  })
  it('rejects a font outside the safe list', () => {
    expect(validateSettings({ ...ok, font_heading: 'comic-sans' })).toMatch(/heading font/i)
  })
  it('rejects an out-of-range heading size', () => {
    expect(validateSettings({ ...ok, h1_size: '200' })).toMatch(/H1 size/i)
  })
  it('rejects an out-of-range line height', () => {
    expect(validateSettings({ ...ok, body_line_height: '9' })).toMatch(/Line height/i)
  })
  it('accepts the range boundaries', () => {
    expect(validateSettings({ ...ok, h1_size: '24' })).toBeNull()
    expect(validateSettings({ ...ok, h1_size: '128' })).toBeNull()
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && ./node_modules/.bin/jest src/__tests__/settings-validation.test.ts`
Expected: FAIL — cannot find module `.../settings/validation`.

- [ ] **Step 3a: Implement the pure validation module**

Create `src/app/admin/(dashboard)/settings/validation.ts`:

```ts
// Pure, framework-free — safe to import from the server action and from Jest.
export const SAFE_FONTS = ['poppins', 'inter', 'montserrat', 'lato']
const HEX_RE = /^#[0-9a-fA-F]{6}$/

const COLOR_FIELDS: [string, string][] = [
  ['Primary color', 'color_primary'],
  ['Background',     'color_background'],
  ['Surface',       'color_surface'],
  ['Text color',    'color_text'],
]

// [label, formKey, min, max, kind]
const NUMERIC_FIELDS: [string, string, number, number, 'int' | 'float'][] = [
  ['H1 size',     'h1_size',          24,  128, 'int'],
  ['H1 weight',   'h1_weight',        100, 900, 'int'],
  ['H2 size',     'h2_size',          20,  100, 'int'],
  ['H2 weight',   'h2_weight',        100, 900, 'int'],
  ['H3 size',     'h3_size',          16,  80,  'int'],
  ['H3 weight',   'h3_weight',        100, 900, 'int'],
  ['H4 size',     'h4_size',          14,  60,  'int'],
  ['H4 weight',   'h4_weight',        100, 900, 'int'],
  ['Body size',   'body_size',        12,  24,  'int'],
  ['Body weight', 'body_weight',      100, 900, 'int'],
  ['Line height', 'body_line_height', 1,   3,   'float'],
]

// Returns an error message, or null if valid.
export function validateSettings(raw: Record<string, string>): string | null {
  for (const [label, key] of COLOR_FIELDS) {
    if (!HEX_RE.test((raw[key] ?? '').trim())) {
      return `${label} must be a 6-digit hex (e.g. #1cc7c3)`
    }
  }
  if (!SAFE_FONTS.includes((raw.font_heading ?? '').trim())) return 'Invalid heading font'
  if (!SAFE_FONTS.includes((raw.font_body ?? '').trim()))    return 'Invalid body font'

  for (const [label, key, min, max, kind] of NUMERIC_FIELDS) {
    const v = kind === 'int' ? parseInt(raw[key], 10) : parseFloat(raw[key])
    if (Number.isNaN(v) || v < min || v > max) return `${label} is out of range`
  }
  return null
}
```

- [ ] **Step 3b: Implement the server actions**

Create `src/app/admin/(dashboard)/settings/actions.ts`:

```ts
'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase-admin'
import { sessionOptions, type SessionData } from '@/lib/session'
import type { SiteConfig } from '@/lib/site-config'
import { validateSettings } from './validation'

export type { SiteConfig }

async function requireSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  if (!session.isLoggedIn) redirect('/login')
}

// All editable keys except the logo URLs (owned by uploadLogoAction).
const STRING_FIELDS = [
  'business_name', 'tagline', 'phone', 'email', 'address',
  'meta_title', 'meta_description',
  'facebook_url', 'instagram_url', 'linkedin_url', 'twitter_url', 'youtube_url',
  'color_primary', 'color_background', 'color_surface', 'color_text',
  'font_heading', 'font_body', 'google_place_id',
]
const INT_FIELDS = [
  'h1_size', 'h1_weight', 'h2_size', 'h2_weight', 'h3_size', 'h3_weight',
  'h4_size', 'h4_weight', 'body_size', 'body_weight',
]

export async function saveSettingsAction(
  _prev: { error: string; success: boolean },
  formData: FormData,
): Promise<{ error: string; success: boolean }> {
  await requireSession()

  const raw: Record<string, string> = {}
  for (const k of [...STRING_FIELDS, ...INT_FIELDS, 'body_line_height']) {
    raw[k] = ((formData.get(k) as string) ?? '').toString()
  }

  const error = validateSettings(raw)
  if (error) return { error, success: false }

  const payload: Record<string, unknown> = { id: 1, updated_at: new Date().toISOString() }
  for (const k of STRING_FIELDS) payload[k] = raw[k].trim()
  for (const k of INT_FIELDS)    payload[k] = parseInt(raw[k], 10)
  payload.body_line_height = parseFloat(raw.body_line_height)

  const { error: e } = await createAdminClient().from('site_config').upsert(payload)
  if (e) return { error: e.message, success: false }

  revalidatePath('/', 'layout')
  return { error: '', success: true }
}

export async function uploadLogoAction(
  field: 'logo_light_url' | 'logo_dark_url',
  _prev: { error: string; url: string },
  formData: FormData,
): Promise<{ error: string; url: string }> {
  await requireSession()

  const file = formData.get('file') as File
  if (!file || file.size === 0) return { error: 'No file selected', url: _prev.url }

  const allowed = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
  if (!allowed.includes(file.type)) return { error: 'Only PNG, JPG, SVG, or WebP accepted', url: _prev.url }
  if (file.size > 2 * 1024 * 1024)  return { error: 'File must be under 2 MB', url: _prev.url }

  const ext      = file.name.split('.').pop()?.toLowerCase() ?? 'png'
  const filename = `${field.replace('_url', '')}-${Date.now()}.${ext}`
  const client   = createAdminClient()
  const bytes    = await file.arrayBuffer()

  const { error: uploadErr } = await client.storage
    .from('logos')
    .upload(filename, bytes, { contentType: file.type, upsert: true })
  if (uploadErr) return { error: uploadErr.message, url: _prev.url }

  const { data: { publicUrl } } = client.storage.from('logos').getPublicUrl(filename)
  await client.from('site_config').upsert({ id: 1, [field]: publicUrl, updated_at: new Date().toISOString() })

  revalidatePath('/', 'layout')
  return { error: '', url: publicUrl }
}

export async function loadSettings(): Promise<SiteConfig | null> {
  await requireSession()
  const { data } = await createAdminClient().from('site_config').select('*').eq('id', 1).single()
  return (data as SiteConfig) ?? null
}
```

- [ ] **Step 4: Run the validation test to verify it passes**

Run: `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && ./node_modules/.bin/jest src/__tests__/settings-validation.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Typecheck + commit**

Run: `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && ./node_modules/.bin/tsc --noEmit`
Expected: 0 errors.

```bash
git add 'src/app/admin/(dashboard)/settings/validation.ts' 'src/app/admin/(dashboard)/settings/actions.ts' src/__tests__/settings-validation.test.ts
git commit -m "feat(settings): validation module + save/upload/load server actions"
```

---

### Task 4: Settings form + page, and Sidebar entry

**Files:**
- Create: `src/app/admin/(dashboard)/settings/SettingsForm.tsx` (ported verbatim)
- Create: `src/app/admin/(dashboard)/settings/page.tsx` (ported verbatim)
- Modify: `src/app/admin/(dashboard)/Sidebar.tsx`

**Interfaces:**
- Consumes: `saveSettingsAction`, `uploadLogoAction`, `loadSettings`, `SiteConfig` (Task 3); `SITE_CONFIG_DEFAULTS` (`@/lib/site-config`).

- [ ] **Step 1: Port the Settings form verbatim from git history**

```bash
git show '22ed796:src/app/admin/(dashboard)/settings/SettingsForm.tsx' > 'src/app/admin/(dashboard)/settings/SettingsForm.tsx'
```

This 347-line client component imports `{ saveSettingsAction, uploadLogoAction, type SiteConfig } from './actions'` (all provided by Task 3) and renders the Business/SEO/Social/Colors/Typography/Logos sections. Open it and confirm those three imports resolve and it takes `{ config: SiteConfig }`.

- [ ] **Step 2: Port the Settings page verbatim**

```bash
git show '22ed796:src/app/admin/(dashboard)/settings/page.tsx' > 'src/app/admin/(dashboard)/settings/page.tsx'
```

This server component imports `loadSettings` from `./actions` and `SITE_CONFIG_DEFAULTS` from `@/lib/site-config`, merges them, and renders `<SettingsForm config={...} />`. No changes needed.

- [ ] **Step 3: Enable the Settings entry in the Sidebar**

In `src/app/admin/(dashboard)/Sidebar.tsx`, update the imports and `nav` array. Change the lucide import line to add `Settings`:

```tsx
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react'
```

Replace the `nav` array with:

```tsx
const nav = [
  { label: 'Dashboard', href: '/admin',          Icon: LayoutDashboard },
  { label: 'Clients',   href: '/admin/clients',  Icon: Users },
  { label: 'Settings',  href: '/admin/settings', Icon: Settings },
  // Next increment (own spec):
  // { label: 'Blog', href: '/admin/posts', Icon: FileText },
]
```

- [ ] **Step 4: Typecheck**

Run: `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && ./node_modules/.bin/tsc --noEmit`
Expected: 0 errors. (Confirms the ported form/page wire cleanly to Task 3's exports.)

- [ ] **Step 5: Commit**

```bash
git add 'src/app/admin/(dashboard)/settings' 'src/app/admin/(dashboard)/Sidebar.tsx'
git commit -m "feat(settings): admin Settings form + page, Sidebar entry"
```

---

### Task 5: Wire the public consumers (Footer + metadata)

**Files:**
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/app/(marketing)/layout.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `getSiteConfig()` (Task 2), already called in both layouts.

- [ ] **Step 1: Rewire the Footer to read contact + social from props**

In `src/components/layout/Footer.tsx`, delete the hardcoded `socials` array (the `const socials = [ ... ]` block) and replace the component signature + the brand/contact JSX. Change the signature from:

```tsx
export default function Footer({ logoLightUrl }: { logoLightUrl?: string }) {
  const logoSrc = logoLightUrl || '/images/logo-white.png'
```

to:

```tsx
export default function Footer({
  logoLightUrl, phone, email, address,
  facebookUrl, instagramUrl, linkedinUrl, twitterUrl, youtubeUrl,
}: {
  logoLightUrl?: string; phone?: string; email?: string; address?: string
  facebookUrl?: string; instagramUrl?: string; linkedinUrl?: string
  twitterUrl?: string; youtubeUrl?: string
}) {
  const logoSrc = logoLightUrl || '/images/logo-white.png'
  const displayPhone = phone || '(678) 997-1106'
  const displayEmail = email || 'info@samcolecreative.com'
  const displayAddress = address || 'Jasper, AL'
  const socials = [
    { id: 'fb', label: 'Facebook',  href: facebookUrl },
    { id: 'ig', label: 'Instagram', href: instagramUrl },
    { id: 'li', label: 'LinkedIn',  href: linkedinUrl },
    { id: 'tw', label: 'Twitter',   href: twitterUrl },
    { id: 'yt', label: 'YouTube',   href: youtubeUrl },
  ].filter((s): s is { id: string; label: string; href: string } => Boolean(s.href))
```

Then, in the Contact `<ul>`, replace the three hardcoded lines (the `Jasper, AL` `<li>`, the `mailto:` anchor, and the `tel:` anchor) with:

```tsx
              <li className="text-white/50 text-sm">{displayAddress}</li>
              <li>
                <a href={`mailto:${displayEmail}`} className="text-white/50 hover:text-white text-sm transition-colors">
                  {displayEmail}
                </a>
              </li>
              <li>
                <a href={`tel:${displayPhone.replace(/[^0-9+]/g, '')}`} className="text-white/50 hover:text-white text-sm transition-colors">
                  {displayPhone}
                </a>
              </li>
```

(The social `{socials.map(...)}` block already renders from the `socials` variable, so it now reflects only the non-empty URLs.)

- [ ] **Step 2: Pass config fields to the Footer in the marketing layout**

In `src/app/(marketing)/layout.tsx`, replace `<Footer logoLightUrl={cfg.logo_light_url} />` with:

```tsx
      <Footer
        logoLightUrl={cfg.logo_light_url}
        phone={cfg.phone}
        email={cfg.email}
        address={cfg.address}
        facebookUrl={cfg.facebook_url}
        instagramUrl={cfg.instagram_url}
        linkedinUrl={cfg.linkedin_url}
        twitterUrl={cfg.twitter_url}
        youtubeUrl={cfg.youtube_url}
      />
```

- [ ] **Step 3: Generate root metadata from config**

In `src/app/layout.tsx`, remove the static `export const metadata: Metadata = { ... }` block and replace it with a `generateMetadata` function (keep the `import type { Metadata }` and `getSiteConfig` import):

```tsx
export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getSiteConfig()
  return {
    title: {
      default: cfg.meta_title || "SC Creative — Walker County's Growth Partner",
      template: '%s | SC Creative',
    },
    description: cfg.meta_description || 'We build the digital systems that grow local businesses in Walker County, AL.',
    metadataBase: new URL('https://samcolecreative.com'),
  }
}
```

- [ ] **Step 4: Typecheck + full suite**

Run: `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && ./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/jest`
Expected: tsc 0 errors; all suites pass (clients-data, client-validation, site-config, settings-validation).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.tsx 'src/app/(marketing)/layout.tsx' src/app/layout.tsx
git commit -m "feat(settings): wire Footer contact/social + root metadata to site config"
```

---

### Task 6: End-to-end verification (env-gated)

**Files:** none (manual verification).

- [ ] **Step 1: Full test suite**

Run: `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && ./node_modules/.bin/jest`
Expected: all suites pass.

- [ ] **Step 2: Manual (deferred until the user has run Task 1's SQL + created the `logos` bucket, with Supabase env present)**

1. Log into `/admin` → **Settings** appears in the sidebar.
2. Change `color_primary` and `h1_size` → Save → reload the public site → colors/heading restyle.
3. Change phone/email and one social URL → Footer reflects them; clearing a social URL removes that icon.
4. Upload a light logo → it appears in the Footer/Nav.
5. Enter an invalid hex → inline "must be a 6-digit hex" error, no save.
6. Edit `meta_title` → view-source/title tag on the home page reflects it.

---

## Self-Review Notes

- **Spec coverage:** singleton table + seed + bucket (T1); fail-soft DB read + mapper (T2); validation + save/upload/load actions with session-gating + revalidate, logos untouched by save (T3); ported form/page + Sidebar (T4); Footer + metadata wiring (T5); manual e2e (T6). All spec sections map to a task.
- **Deviations:** `page.tsx` reads via `loadSettings` (service-role) rather than `getSiteConfig` — same merged result, and it's the verbatim ported page; acceptable.
- **Env-gated:** Task 1 SQL + `logos` bucket and the Task 6 runtime checks need the user's Supabase project (already wired in Vercel from the Clients work).

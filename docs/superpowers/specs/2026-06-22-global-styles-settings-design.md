# Global Styles + Settings Module Design

**Date:** 2026-06-22
**Status:** Approved for spec review
**Project:** SC Creative site (`~/Ai Sites/sc-creative`, Next.js 16 / React 19 / Tailwind v4 / Supabase)
**Builds on:** the Phase 2 admin foundation (branch `worktree-phase2-admin-clients`) — auth, admin shell, AdminUI, Supabase clients. This module is implemented on that same branch.

## Overview

Make the site's global configuration editable from the admin. The brand-variable
injection pipeline **already exists**: `src/app/layout.tsx` reads `getSiteConfig()`
and injects every `--brand-*` CSS var (colors, fonts, heading sizes/weights, body)
into a hoisted `<style>` that `globals.css` consumes; the marketing layout already
passes `logo_light_url`/`logo_dark_url` to Footer/Nav. The only gaps: `getSiteConfig()`
returns a static stub, there is no admin UI, and the business/SEO/social fields are
hardcoded in the public components.

This module adds a Supabase-backed singleton config, a ported Settings admin, and
rewires the remaining hardcoded consumers — so editing any field changes the live site.

## Scope

**In scope**
- `site_config` singleton table + seed; public Storage bucket `logos`.
- `getSiteConfig()` swap: read the row (anon), fail soft to `SITE_CONFIG_DEFAULTS`.
- `/admin/settings` admin: ported `SettingsForm` (Business, SEO, Social, Colors,
  Typography, Logos) + `saveSettingsAction` + `uploadLogoAction` (Storage). Sidebar entry enabled.
- Consumer wiring: `Footer.tsx` phone/email/social from config; root-layout
  `generateMetadata()` from config.

**Out of scope / non-goals**
- No new fonts beyond the 4 already loaded (poppins, inter, montserrat, lato).
- No live in-form preview pane (save → revalidate → site updates on next load).
- No per-page overrides; this is site-wide config only.
- Nav link management, blog, clients — separate modules.

## Architecture

### Data model — `site_config` (new table)

Single row keyed by a fixed id so reads/writes always target the same record:

```sql
create table if not exists site_config (
  id   text primary key default 'default',
  -- business
  business_name text not null default '',
  tagline text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  -- seo
  meta_title text not null default '',
  meta_description text not null default '',
  -- social
  facebook_url text not null default '',
  instagram_url text not null default '',
  linkedin_url text not null default '',
  twitter_url text not null default '',
  youtube_url text not null default '',
  -- colors
  color_primary text not null default '#1cc7c3',
  color_background text not null default '#070d17',
  color_surface text not null default '#0b1520',
  color_text text not null default '#e8eef4',
  -- typography
  font_heading text not null default 'poppins',
  font_body text not null default 'poppins',
  h1_size int not null default 64,  h1_weight int not null default 800,
  h2_size int not null default 48,  h2_weight int not null default 700,
  h3_size int not null default 32,  h3_weight int not null default 700,
  h4_size int not null default 24,  h4_weight int not null default 600,
  body_size int not null default 16, body_weight int not null default 400,
  body_line_height numeric not null default 1.6,
  -- logos + google
  logo_light_url text not null default '/images/logo-white.png',
  logo_dark_url text not null default '/images/logo-dark.png',
  google_place_id text not null default '',
  updated_at timestamptz not null default now(),
  constraint site_config_singleton check (id = 'default')
);
alter table site_config enable row level security;
create policy "site_config is publicly readable"
  on site_config for select to anon, authenticated using (true);
-- Writes only via service-role (admin), which bypasses RLS — no write policy.
insert into site_config (id) values ('default') on conflict (id) do nothing;
```

Column names map 1:1 to the existing `SiteConfig` interface (snake_case already),
so no field renaming is needed.

### Storage — `logos` bucket

A **public** Supabase Storage bucket named `logos`. `uploadLogoAction` writes the
file there and saves the returned public URL into `site_config.logo_light_url` /
`logo_dark_url`. Bucket creation is a manual Supabase setup step (documented).

### Data layer — `src/lib/site-config.ts` (modify)

Keep the `SiteConfig` interface and `SITE_CONFIG_DEFAULTS` unchanged. Swap the
`getSiteConfig` body to read the singleton via the anon client and fail soft:

```ts
export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const { data, error } = await supabase.from('site_config').select('*').eq('id', 'default').single()
  if (error || !data) return SITE_CONFIG_DEFAULTS
  return rowToSiteConfig(data)   // merges row over defaults; any missing field falls back
})
```

`rowToSiteConfig(row)` maps DB row → `SiteConfig`, defaulting any null/missing
field from `SITE_CONFIG_DEFAULTS`. Both layouts already `await getSiteConfig()`, so
no call-site changes.

### Admin — `/admin/(dashboard)/settings/`

- `SettingsForm.tsx` (`'use client'`, ported): sections Business · SEO · Social ·
  Colors (`<input type="color">` swatches) · Typography (font selects + H1–H4
  size/weight number inputs + body) · Logos (file inputs → `uploadLogoAction`).
- `actions.ts` (`'use server'`, ported): `saveSettingsAction` validates (hex
  colors `^#[0-9a-fA-F]{6}$`, fonts in the safe list, size/weight ranges:
  h1 24–128, h2 20–100, h3 16–80, h4 14–60, body 12–24, weights 100–900,
  line-height 1–3) then **upserts** the `'default'` row via the service-role
  client. `uploadLogoAction` uploads to `logos` and upserts the URL. Both call
  `requireSession()` first and `revalidatePath('/', 'layout')` after.
- `validation.ts` (new, pure): `validateSettings(input)` extracted framework-free
  so Jest can test it (same split rationale as the clients module).
- `page.tsx`: server component, `await getSiteConfig()`, renders `SettingsForm`.
- Sidebar: enable the **Settings** entry (`/admin/settings`).

### Consumer wiring

- `src/components/layout/Footer.tsx`: accept config-derived props (or read passed
  `cfg`) for phone, email, and the `socials` hrefs — replacing the hardcoded
  `mailto:`/`tel:` and the static `socials` array hrefs. The marketing layout
  already fetches `cfg`; pass the needed fields down. A social icon renders only
  when its URL is non-empty.
- `src/app/layout.tsx`: add `export async function generateMetadata()` returning
  `title`/`description` from `cfg.meta_title`/`meta_description` (falling back to
  the current defaults when empty). Remove the static `metadata` export.

## Data flow

1. **Public render:** layouts `await getSiteConfig()` → anon read of the singleton
   → brand vars injected + Footer/metadata populated.
2. **Admin save:** authenticated action → service-role upsert of `'default'` →
   `revalidatePath('/', 'layout')` → next render restyles the whole site.

## Error handling

- `saveSettingsAction` returns `{ error, success }`; `SettingsForm` shows inline
  validation errors (bad hex, out-of-range size, invalid font).
- `getSiteConfig` fails soft to `SITE_CONFIG_DEFAULTS` on any Supabase error, so a
  DB hiccup never blanks or unstyles the site.
- `uploadLogoAction` returns an error string on upload failure; the form surfaces it.
- Auth failure redirects to `/login`.

## Testing

- **Unit:** `rowToSiteConfig` (row→config mapping + per-field default fallback);
  `validateSettings` (hex rejection, font allowlist, each numeric range boundary).
- **Manual:** change a color and a heading size → live site restyles after save;
  change phone/email/a social URL → Footer updates; clear a social URL → that icon
  disappears; upload a logo → it appears in Footer/Nav; bad hex → inline error.

## Risks / Open items

- **Manual Supabase setup:** run the `site_config` SQL once, and create the public
  `logos` Storage bucket — both required before the admin works end to end.
- **Footer is a shared public component;** the other chat's Phase 1 work did not
  touch `Footer.tsx`, so wiring it here is collision-free, but confirm before merge.
- Singleton enforced by a `check (id = 'default')` constraint; all writes upsert
  that id, so the table can never grow a second row.

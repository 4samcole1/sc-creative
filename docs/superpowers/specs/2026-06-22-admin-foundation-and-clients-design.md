# Admin Foundation + Clients Module (Phase 2)

**Date:** 2026-06-22
**Status:** Approved for spec review
**Project:** SC Creative site (`~/Ai Sites/sc-creative`, Next.js 16 / React 19, Tailwind v4, Supabase)
**Relates to:** `2026-06-22-client-map-and-unified-client-list-design.md` (this is **Phase 2** of that plan)

## Overview

Rebuild the admin dashboard (removed during the design-only home-page rebuild,
commit `9f33ca3`) on top of the current site. This spec delivers **two things**:

1. **A shared admin foundation** — login, session auth, Supabase wiring, and an
   admin shell — built once so later modules drop in cheaply.
2. **The Clients module (Phase 2 of the client-system plan)** — a Supabase-backed
   admin to manage the single client list that feeds the home-page map and trust
   bar, plus the **data-layer swap** that moves `clients-data.ts` from a hardcoded
   array to Supabase reads.

Most foundation code is **ported from git history** (the pre-rebuild admin), not
rewritten. The Clients CRUD mirrors the old `posts/` CRUD pattern.

## Scope

**In scope**
- Foundation: `admin_users` auth (bcrypt + iron-session), `/login`, route
  protection middleware, Supabase public + admin clients, admin shell
  (sidebar + `AdminUI` + layout + error boundary).
- Clients module: `clients` table, seed migration, Supabase-backed
  `clients-data.ts` accessors, and `/admin/clients` CRUD.

**Out of scope (own future specs; foundation built to host them)**
- **Blog module** — next increment.
- **Global Styles module** (fonts/colors/headings) — the `--brand-*` CSS-var
  plumbing already exists in `globals.css`; the admin to drive it comes later.

**Non-goals (deferred)**
- GBP URL auto-import / scraping. A `gbp_url` column is kept only to match the
  frozen Phase 1 `Client` interface; it is **not** on the form and is unused.
- Geocoding. `lat`/`lng` are manual, optional inputs.
- Per-client logo upload to Supabase Storage. `logo_url` is a plain URL field.
- `show.portfolio` is stored and toggleable but has no surface yet (Phase 3).

## Coordination with the other chat (two-chat boundary)

Phase 1 is spec'd but **not yet in code** (no `clients-data.ts`, no `ClientMap.tsx`).
To avoid collisions:

- **This chat (Phase 2) owns:** `src/lib/clients-data.ts` (the accessor contract +
  its Supabase-backed implementation + the seed migration) and the entire admin.
- **The other chat owns:** `ClientMap.tsx` and the `StatsBar` trust-bar rewiring —
  both of which only *consume* the accessors.
- **Contract between them:** the frozen Phase 1 `Client` interface and the
  accessor signatures (`getClients`, `getMapClients`, `getTrustBarClients`). The
  other chat builds against that interface and must **not** create
  `clients-data.ts`.

## Architecture

### Part 1 — Foundation

**Auth (`src/lib/session.ts`, `/login`, `src/middleware.ts`) — ported.**
- `admin_users` table keyed on **email**: `id` (uuid), `email` (unique),
  `password_hash` (bcrypt), `name`, `created_at`. Seeded with two users
  (Sam `sam@samcolecreative.com`, Brian) via bcrypt hashes.
- Login server action (`src/app/login/actions.ts`, ported): looks up the user in
  `admin_users` via the service-role client, `bcrypt.compare`, then sets an
  iron-session cookie (`sc_admin_session`, 7-day, httpOnly). Retains the env-var
  fallback admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH`) for bootstrap.
- `src/middleware.ts` (ported) protects `/admin/*`; unauthenticated → `/login`.
  Already guards against a missing `SESSION_SECRET` (commit `75c3ae3`).

**Supabase clients (two, deliberately separated) — ported.**
- `src/lib/supabase.ts` — anon-key client for **public reads** (map, trust bar).
  Backed by an RLS policy allowing `SELECT` on `clients`.
- `src/lib/supabase-admin.ts` — `createAdminClient()` using the **service-role**
  key, imported **only** inside authenticated server actions. Never reaches the
  browser, so the service key stays server-side.

**Admin shell — ported.**
- `/admin/(dashboard)` route group: `layout.tsx`, `Sidebar.tsx`
  (active-state via `usePathname`), `components/AdminUI.tsx` (form fields, table,
  status badge, confirm-delete button, save bar, page header), and
  `src/app/admin/error.tsx` boundary.
- Sidebar ships with a **Clients** entry now; **Blog** and **Global Styles**
  entries are scaffolded/commented for the next increments.

### Part 2 — Clients module (Phase 2)

**`clients` table** — columns map 1:1 to the frozen `Client` interface:

| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | |
| `name` | text | required |
| `city` | text | required |
| `state` | text | required |
| `lat` | float8 null | blank = not on map |
| `lng` | float8 null | blank = not on map |
| `industry` | text | required |
| `website` | text | `''` if none |
| `logo_url` | text | `''` if none |
| `blurb` | text | one-line, `''` if none |
| `show_trust_bar` | bool | placement tag |
| `show_map` | bool | placement tag |
| `show_portfolio` | bool | placement tag (no surface yet) |
| `gbp_url` | text null | reserved, unused |
| `needs_review` | bool | low-confidence seed flag |
| `created_at` / `updated_at` | timestamptz | |

RLS: public `SELECT` allowed; writes only via service-role (admin actions).

**Data-layer swap — `src/lib/clients-data.ts` (this chat owns).**
Keeps the exact Phase 1 signatures; internals now read from Supabase (anon
client). A `rowToClient` mapper converts snake_case columns to the camelCase
`Client` shape (`show.{trustBar,map,portfolio}`).

```ts
export function getClients(): Promise<Client[]>          // all rows → Client[]
export function getMapClients(): Promise<Client[]>       // show.map && lat!=null && lng!=null
export function getTrustBarClients(): Promise<Client[]>  // show.trustBar, sorted by name
```

(Signatures become `Promise`-returning to allow the DB read; the Phase 1 spec
already anticipated a "one-file" CMS swap, and the consuming surfaces are
server components that can `await`.)

**Seed migration.** A one-time script/SQL loads the Phase 1 seed list (the ~55
trust-bar names as `show_trust_bar:true` records, and the 16 businesses → 18 pins
with `show_map:true` + coordinates, `needs_review` where flagged). This preserves
the hardcoded→DB transition with no data loss.

**Admin pages (`/admin/clients`, using `AdminUI`, mirroring old `posts/`):**
- `page.tsx` — list table: name, city/state, industry, three placement badges,
  `needsReview` flag; edit + confirm-delete.
- `new/page.tsx` + `[id]/edit/page.tsx` + `ClientForm.tsx` — all fields above.
  Placement tags = three checkboxes. `lat`/`lng` = optional number inputs with
  helper text "blank = won't show on the map." `logo_url` = URL field.
  `gbp_url` is **not** rendered.
- `actions.ts` — `create`/`update`/`delete` server actions: auth-gated, use
  `createAdminClient()`, validate required fields, then `revalidatePath('/')`
  so the public map + trust bar reflect changes immediately.

## Data flow

- **Public render:** home page (server component) `await getMapClients()` /
  `getTrustBarClients()` → anon Supabase read → `ClientMap` / `StatsBar`
  (other chat's surfaces).
- **Admin write:** authenticated action → `createAdminClient()` write → DB →
  `revalidatePath('/')` → next public render shows the change.

## Error handling

- Server actions return typed `{ ok, error }`; `ClientForm` surfaces validation
  errors inline (required: name, city, state, industry).
- Public accessors **fail soft**: on a Supabase error they return `[]`, so the
  map/trust bar render empty rather than crashing the home page (matches the
  current graceful-degradation posture, commits `025ca5d` / `c64f9ef`).
- Auth failure → redirect to `/login`. `createAdminClient()` throws server-side
  if `SUPABASE_SERVICE_ROLE_KEY` is missing.

## Testing

- **Unit:** `rowToClient` mapping; `getMapClients()` excludes `show_map:false`
  and null-coordinate rows; `getTrustBarClients()` returns tagged names sorted.
- **Action:** create/update/delete enforce auth and required-field validation.
- **Manual:** log in as both users; add/edit/delete a client; confirm the map +
  trust bar update after `revalidatePath`; confirm a `show_map:false` or
  no-coordinate client never appears on the map.

## Risks / Open items

- **Seed credentials needed:** Brian's email and both users' passwords (to
  generate bcrypt hashes) are required before seeding `admin_users`.
- **Local env vars needed at implementation time:** `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`
  (currently only in Vercel) — required to run/test the admin locally.
- **Accessors becoming async** is a contract change vs. a naive hardcoded Phase 1.
  The other chat must `await` them in server components — documented here so the
  map is built accordingly.
- The ported `supabase-admin.ts` references a generated `Database` type; for speed
  we use an untyped client + the hand-written `rowToClient` mapper instead.

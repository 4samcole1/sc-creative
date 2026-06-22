# Admin Foundation + Clients Module (Phase 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the admin dashboard foundation (login + session auth + Supabase wiring + admin shell) and ship the Clients module: a Supabase-backed CRUD admin that is the single source of truth for the home-page map and trust bar.

**Architecture:** Port the proven pre-rebuild admin (auth, shell, CRUD pattern) from git history, adapted to Next 16 / React 19. Clients live in a Supabase `clients` table; `src/lib/clients-data.ts` reads them via the anon client (failing soft to `[]`), and authenticated server actions write via the service-role client. Route protection is enforced at the dashboard layout (iron-session guard) plus a matching `/admin/*` middleware.

**Tech Stack:** Next.js 16 (App Router, server actions), React 19, TypeScript, Supabase (`@supabase/supabase-js`), iron-session, bcryptjs, Jest + ts-jest.

## Global Constraints

- Next.js **16.2.6**, React **19.2.4** — server components `await` data; server actions use `'use server'`.
- Supabase service-role key is **server-only** — never import `supabase-admin` or reference `SUPABASE_SERVICE_ROLE_KEY` from a `'use client'` file.
- The `Client` interface and accessor names (`getClients`, `getMapClients`, `getTrustBarClients`) are **frozen by the Phase 1 spec** — do not rename. Accessors are async (`Promise<Client[]>`).
- This chat owns `src/lib/clients-data.ts` and everything under `src/app/admin/` + `src/app/login/`. Do **not** create `ClientMap.tsx` or modify `StatsBar.tsx` — those are the other chat's surfaces.
- Brand colors: primary `#1cc7c3`, bg `#070d17`, surface `#0b1520`, text `#e8eef4`.
- `SESSION_SECRET` must be ≥32 characters (iron-session requirement).
- Commit after every task.

---

### Task 1: Supabase schema, RLS & seed

**Files:**
- Create: `docs/superpowers/db/2026-06-22-admin-and-clients.sql` (run by the user in the Supabase SQL editor — not executed by code)

**Interfaces:**
- Produces: `admin_users` table (email-keyed, bcrypt) and `clients` table whose columns map 1:1 to the `Client` interface defined in Task 5.

- [ ] **Step 1: Write the SQL file**

```sql
-- docs/superpowers/db/2026-06-22-admin-and-clients.sql
-- Run in Supabase SQL editor.

-- 1. Admin users (email + bcrypt hash) ------------------------------------
create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,
  name          text not null default '',
  created_at    timestamptz not null default now()
);
alter table admin_users enable row level security;
-- No public policies: admin_users is read ONLY via the service-role key
-- (which bypasses RLS). The anon client must never see it.

-- 2. Clients (single source of truth) -------------------------------------
create table if not exists clients (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  city            text not null default '',
  state           text not null default '',
  lat             double precision,
  lng             double precision,
  industry        text not null default '',
  website         text not null default '',
  logo_url        text not null default '',
  blurb           text not null default '',
  show_trust_bar  boolean not null default false,
  show_map        boolean not null default false,
  show_portfolio  boolean not null default false,
  gbp_url         text,
  needs_review    boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
alter table clients enable row level security;

-- Public site reads clients (map + trust bar) via the anon key:
create policy "clients are publicly readable"
  on clients for select
  to anon, authenticated
  using (true);
-- Writes happen only through the service-role key (admin server actions),
-- which bypasses RLS — so no insert/update/delete policy is defined.

-- 3. Seed admin users -----------------------------------------------------
-- Generate each hash locally first (Task 2 documents the command), then paste:
insert into admin_users (email, name, password_hash) values
  ('sam@samcolecreative.com', 'Sam Cole', '<<BCRYPT_HASH_SAM>>'),
  ('<<BRIAN_EMAIL>>',         'Brian',    '<<BCRYPT_HASH_BRIAN>>')
on conflict (email) do nothing;

-- 4. Seed clients ---------------------------------------------------------
-- Trust-bar names (location blank; dropped per Phase 1 spec: "Jasper AL",
-- "Southeastern Construction", "4 Seasons Landscaping").
insert into clients (name, show_trust_bar) values
  ('67 Magazine', true), ('Always Answered', true), ('Andrews Mechanical', true),
  ('Answer Pro', true), ('AOC Connect', true), ('ARS Roofing', true),
  ('At The Lake Spa & Wellness', true), ('Backyard Blessings', true),
  ('Bethlehem Doodles', true), ('BoatSafe', true), ('Brandblueprint.ai', true),
  ('Brock Transportation', true), ('Carson Plumbing', true), ('Clarry Lane', true),
  ('Color Faux Walls', true), ('Daybreak Care', true), ('DirectLine', true),
  ('Divergent', true), ('Ducktown Lodge', true), ('Employee Hotlines', true),
  ('Expert Language Services', true), ('GB Construction', true), ('Gen Growth', true),
  ('Georgia Standard', true), ('Glory Fellowship Baptist Church', true),
  ('Hallway Healthcare', true), ('HaulX Moving', true), ('Heritage Home Painting', true),
  ('Imago Dei Academy', true), ('James Health', true), ('Loyal Standard', true),
  ('Mann Home Services', true), ('Mastercraft Plumbing', true), ('Mayer Landscaping', true),
  ('MCM Clothing', true), ('Medical Diagnostics', true), ('Mentality', true),
  ('Miller Roofing', true), ('Muncie Rooterman', true), ('Peak Performance', true),
  ('Piece by Peace', true), ('Precision Bill Review', true), ('Roundtable Advisors', true),
  ('Sanders Aviation', true), ('SHOAlign', true), ('Smith Lake Family Care', true),
  ('Soukkala', true), ('TaleGate Sports', true), ('Talladega County Sheriff', true),
  ('The Walker Leader', true), ('United Physician Group', true), ('Vote Beaty', true),
  ('Water Extraction Tech', true)
on conflict do nothing;

-- Map clients: set show_map + city-level coords. Update the rows that already
-- exist from the trust-bar seed; insert Sanders Aviation's extra locations and
-- Walker Medical Diagnostics as new map-only rows.
update clients set city='Northport', state='AL', lat=33.2290, lng=-87.5772, show_map=true where name='ARS Roofing';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='At The Lake Spa & Wellness';
update clients set city='Dora',      state='AL', lat=33.7301, lng=-87.0905, show_map=true where name='Backyard Blessings';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='Glory Fellowship Baptist Church';
update clients set city='Cumming',   state='GA', lat=34.2073, lng=-84.1402, show_map=true where name='HaulX Moving';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='Imago Dei Academy';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='Loyal Standard';
update clients set city='Pelham',    state='AL', lat=33.2857, lng=-86.8097, show_map=true, needs_review=true where name='Mann Home Services';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='Miller Roofing';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='Smith Lake Family Care';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='TaleGate Sports';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='The Walker Leader';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='67 Magazine';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='Water Extraction Tech';
update clients set city='Talladega', state='AL', lat=33.4359, lng=-86.1058, show_map=true where name='Talladega County Sheriff';
-- Sanders Aviation: 3 pins. The trust-bar row becomes the Jasper pin; add 2 more.
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='Sanders Aviation';
insert into clients (name, city, state, lat, lng, show_map) values
  ('Sanders Aviation', 'Huntsville',  'AL', 34.7304, -86.5861, true),
  ('Sanders Aviation', 'Tuscaloosa',  'AL', 33.2098, -87.5692, true);
-- Walker Medical Diagnostics (map-only; "Medical Diagnostics" stays as the trust-bar name)
insert into clients (name, city, state, lat, lng, show_map) values
  ('Walker Medical Diagnostics', 'Jasper', 'AL', 33.8312, -87.2772, true);
```

- [ ] **Step 2: Commit the SQL file**

```bash
git add docs/superpowers/db/2026-06-22-admin-and-clients.sql
git commit -m "feat(db): admin_users + clients schema, RLS, and seed SQL"
```

- [ ] **Step 3 (USER, manual): run the SQL in Supabase**

The user runs the file in the Supabase SQL editor after filling the four `<<...>>` placeholders (Task 2 generates the hashes). Verify in the Supabase Table editor that `clients` has ~56 rows and `admin_users` has 2.

---

### Task 2: Environment + Supabase clients + session config

**Files:**
- Create: `src/lib/supabase.ts` (anon client — public reads)
- Create: `src/lib/supabase-admin.ts` (service-role client — server-only writes)
- Create: `src/lib/session.ts` (iron-session config)
- Create: `.env.local.example` (documents required vars)

**Interfaces:**
- Produces: `supabase` (anon client), `createAdminClient()` (service-role client), `sessionOptions` + `SessionData` type.

- [ ] **Step 1: Port the anon Supabase client**

```bash
git show 'c2c28d1:src/lib/supabase.ts' > src/lib/supabase.ts
```

Expected file content:

```ts
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 2: Create the service-role client** (untyped — drop the old `Database` generic per spec)

Create `src/lib/supabase-admin.ts`:

```ts
// src/lib/supabase-admin.ts — SERVER ONLY. Never import from a 'use client' file.
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
```

- [ ] **Step 3: Port the session config**

```bash
git show 'c2c28d1:src/lib/session.ts' > src/lib/session.ts
```

Expected file content:

```ts
import type { SessionOptions } from 'iron-session'

export interface SessionData {
  isLoggedIn: boolean
  email: string
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'sc_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}
```

- [ ] **Step 4: Document env vars**

Create `.env.local.example`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# iron-session cookie encryption (>= 32 chars). Generate: openssl rand -base64 32
SESSION_SECRET=

# Optional bootstrap admin (works without the admin_users table)
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
```

- [ ] **Step 5 (USER, manual): create `.env.local`**

Copy `.env.local.example` to `.env.local` and fill from the Vercel project. Generate bcrypt hashes for Task 1's seed and the optional bootstrap admin:

```bash
node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 10))" 'THE_PASSWORD'
```

- [ ] **Step 6: Verify it typechecks**

Run: `npx tsc --noEmit`
Expected: no errors from the three new `src/lib` files.

- [ ] **Step 7: Commit**

```bash
git add src/lib/supabase.ts src/lib/supabase-admin.ts src/lib/session.ts .env.local.example
git commit -m "feat(admin): Supabase anon + service-role clients and session config"
```

---

### Task 3: Auth — login page, actions, middleware, layout guard

**Files:**
- Create: `src/app/login/page.tsx` (ported)
- Create: `src/app/login/actions.ts` (ported)
- Create: `src/middleware.ts` (new — iron-session, `/admin/*`)
- Create: `src/app/admin/(dashboard)/layout.tsx` (ported guard)

**Interfaces:**
- Consumes: `sessionOptions`, `SessionData` (Task 2).
- Produces: `loginAction`, `logoutAction` (imported by the login page and Sidebar).

- [ ] **Step 1: Port the login server actions**

```bash
git show 'c2c28d1:src/app/login/actions.ts' > src/app/login/actions.ts
```

This file (verified from history) exports `loginAction` and `logoutAction`. It looks the user up in `admin_users` via the service-role key, falls back to `ADMIN_EMAIL`/`ADMIN_PASSWORD_HASH`, `bcrypt.compare`s, sets the iron-session cookie, and `redirect('/admin')` on success / `redirect('/login')` on logout.

- [ ] **Step 2: Port the login page**

```bash
git show 'c2c28d1:src/app/login/page.tsx' > src/app/login/page.tsx
```

Client component using `useActionState(loginAction, { error: '' })` with branded email/password form. No changes needed.

- [ ] **Step 3: Create the `/admin/*` middleware** (iron-session — replaces the stale Supabase-SSR one from history)

Create `src/middleware.ts`:

```ts
// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const session = await getIronSession<SessionData>(request, response, sessionOptions)

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 4: Port the dashboard layout guard**

```bash
mkdir -p 'src/app/admin/(dashboard)'
git show '7889884:src/app/admin/(dashboard)/layout.tsx' > 'src/app/admin/(dashboard)/layout.tsx'
```

This server component re-checks `session.isLoggedIn` (defense in depth) and renders `<Sidebar email={session.email} />` + `<main>` (Sidebar arrives in Task 4).

- [ ] **Step 5: Verify route protection manually**

Run: `npm run dev`, then visit `http://localhost:3000/admin`.
Expected: redirect to `/login`. Log in with a seeded user → land on `/admin` (will error until Task 4 adds the page + Sidebar; the redirect/login behavior is what's verified here).

- [ ] **Step 6: Commit**

```bash
git add src/app/login src/middleware.ts 'src/app/admin/(dashboard)/layout.tsx'
git commit -m "feat(admin): login flow, iron-session, and /admin route protection"
```

---

### Task 4: Admin shell — AdminUI, Sidebar, dashboard page, error boundary

**Files:**
- Create: `src/app/admin/(dashboard)/components/AdminUI.tsx` (ported)
- Create: `src/app/admin/(dashboard)/Sidebar.tsx` (adapted nav)
- Create: `src/app/admin/(dashboard)/page.tsx` (new dashboard landing)
- Create: `src/app/admin/error.tsx` (ported)

**Interfaces:**
- Consumes: `logoutAction` (Task 3), `getClients` (Task 5 — used for a count; import lands when Task 5 exists).
- Produces: `AdminUI` primitives (`FormField`, `FormCard`, `SaveBar`, `AdminTable`, `AdminTableRow`, `AdminTableCell`, `AdminPageHeader`, `NewButton`, `BackLink`, `EmptyState`, `DeleteButton`, `StatusBadge`, `inputStyle`) consumed by Task 7.

- [ ] **Step 1: Port AdminUI primitives**

```bash
git show '7889884:src/app/admin/(dashboard)/components/AdminUI.tsx' > 'src/app/admin/(dashboard)/components/AdminUI.tsx'
```

No changes — these primitives are module-agnostic.

- [ ] **Step 2: Port the error boundary**

```bash
git show '7889884:src/app/admin/error.tsx' > src/app/admin/error.tsx
```

- [ ] **Step 3: Create the Sidebar with a trimmed nav** (only modules that exist; Blog + Global Styles scaffolded as comments)

Create `src/app/admin/(dashboard)/Sidebar.tsx`:

```tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, LogOut } from 'lucide-react'
import { logoutAction } from '@/app/login/actions'

const nav = [
  { label: 'Dashboard', href: '/admin',         Icon: LayoutDashboard },
  { label: 'Clients',   href: '/admin/clients',  Icon: Users },
  // Next increments (own specs):
  // { label: 'Blog',          href: '/admin/posts',   Icon: FileText },
  // { label: 'Global Styles', href: '/admin/styles',  Icon: Palette },
]

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside
      style={{
        width: '220px', flexShrink: 0, background: '#0b1520',
        borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex',
        flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0,
      }}
    >
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" target="_blank" style={{ lineHeight: 0, display: 'inline-block' }}>
          <Image src="/images/logo-white.png" alt="SC Creative" width={130} height={19} style={{ height: '19px', width: 'auto' }} />
        </Link>
        <p style={{ fontSize: '10px', fontWeight: 600, color: '#2a4a5a', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '8px' }}>
          Admin
        </p>
      </div>

      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {nav.map(({ label, href, Icon }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 20px',
                fontSize: '13px', fontWeight: active ? 600 : 500,
                color: active ? '#c0d8e8' : '#4a6a7a', textDecoration: 'none',
                background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                borderLeft: `2px solid ${active ? '#1cc7c3' : 'transparent'}`,
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize: '11px', color: '#2a4a5a', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {email}
        </p>
        <form action={logoutAction}>
          <button type="submit"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#4a5a6a', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
```

- [ ] **Step 4: Create the dashboard landing page**

Create `src/app/admin/(dashboard)/page.tsx`:

```tsx
import Link from 'next/link'
import { getClients } from '@/lib/clients-data'
import { AdminPageHeader } from './components/AdminUI'

export default async function DashboardPage() {
  const clients = await getClients()
  const onMap = clients.filter(c => c.show.map).length
  const onTrustBar = clients.filter(c => c.show.trustBar).length

  return (
    <>
      <AdminPageHeader title="Dashboard" subtitle="SC Creative admin" />
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total clients', value: clients.length, href: '/admin/clients' },
          { label: 'On the map', value: onMap, href: '/admin/clients' },
          { label: 'On the trust bar', value: onTrustBar, href: '/admin/clients' },
        ].map(card => (
          <Link key={card.label} href={card.href}
            style={{ flex: '1 1 180px', background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px', textDecoration: 'none' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1cc7c3' }}>{card.value}</div>
            <div style={{ fontSize: '13px', color: '#4a6a7a', marginTop: '4px' }}>{card.label}</div>
          </Link>
        ))}
      </div>
    </>
  )
}
```

- [ ] **Step 5: Verify the shell renders** (after Task 5 provides `getClients`; if running this task first, temporarily stub `const clients: never[] = []`)

Run: `npm run dev`, log in, visit `/admin`.
Expected: sidebar with Dashboard + Clients; three stat cards render.

- [ ] **Step 6: Commit**

```bash
git add 'src/app/admin'
git commit -m "feat(admin): shell — AdminUI, Sidebar, dashboard, error boundary"
```

---

### Task 5: Clients data layer (`clients-data.ts`) + unit tests

**Files:**
- Create: `src/lib/clients-data.ts`
- Test: `src/__tests__/clients-data.test.ts`

**Interfaces:**
- Consumes: `supabase` anon client (Task 2).
- Produces:
  - `interface Client` (frozen shape) and `interface ClientRow` (DB shape)
  - `rowToClient(row: ClientRow): Client`
  - `selectMapClients(clients: Client[]): Client[]`
  - `selectTrustBarClients(clients: Client[]): Client[]`
  - `getClients(): Promise<Client[]>`
  - `getMapClients(): Promise<Client[]>`
  - `getTrustBarClients(): Promise<Client[]>`

- [ ] **Step 0: Create the Jest config** (none exists yet — required before any test runs)

Create `jest.config.js` at the repo root:

```js
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.test.tsx'],
}
```

Verify it loads: `npx jest --listTests` → exits cleanly (no tests yet is fine).

- [ ] **Step 1: Write failing unit tests for the pure helpers**

Create `src/__tests__/clients-data.test.ts`:

```ts
import { rowToClient, selectMapClients, selectTrustBarClients, type ClientRow } from '@/lib/clients-data'

function row(overrides: Partial<ClientRow> = {}): ClientRow {
  return {
    id: '1', name: 'Acme', city: 'Jasper', state: 'AL', lat: 1, lng: 2,
    industry: 'Roofing', website: '', logo_url: '', blurb: '',
    show_trust_bar: true, show_map: true, show_portfolio: false,
    gbp_url: null, needs_review: false, ...overrides,
  }
}

describe('rowToClient', () => {
  it('maps snake_case columns to the nested Client shape', () => {
    const c = rowToClient(row({ logo_url: '/l.png', show_portfolio: true }))
    expect(c.logoUrl).toBe('/l.png')
    expect(c.show).toEqual({ trustBar: true, map: true, portfolio: true })
  })

  it('coerces null optional text to empty string and omits falsy needsReview/gbpUrl', () => {
    const c = rowToClient(row({ gbp_url: null, needs_review: false }))
    expect(c.gbpUrl).toBeUndefined()
    expect(c.needsReview).toBeUndefined()
  })
})

describe('selectMapClients', () => {
  it('excludes show.map=false and null-coordinate clients', () => {
    const a = rowToClient(row({ id: 'a', show_map: true,  lat: 1, lng: 2 }))
    const b = rowToClient(row({ id: 'b', show_map: false, lat: 1, lng: 2 }))
    const c = rowToClient(row({ id: 'c', show_map: true,  lat: null, lng: null }))
    expect(selectMapClients([a, b, c]).map(x => x.id)).toEqual(['a'])
  })
})

describe('selectTrustBarClients', () => {
  it('returns only trust-bar clients, sorted case-insensitively by name', () => {
    const z = rowToClient(row({ id: 'z', name: 'zeta', show_trust_bar: true }))
    const a = rowToClient(row({ id: 'a', name: 'Alpha', show_trust_bar: true }))
    const n = rowToClient(row({ id: 'n', name: 'Hidden', show_trust_bar: false }))
    expect(selectTrustBarClients([z, a, n]).map(x => x.name)).toEqual(['Alpha', 'zeta'])
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx jest src/__tests__/clients-data.test.ts`
Expected: FAIL — cannot find module `@/lib/clients-data`.

- [ ] **Step 3: Implement `clients-data.ts`**

Create `src/lib/clients-data.ts`:

```ts
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx jest src/__tests__/clients-data.test.ts`
Expected: PASS (3 suites, all green).

- [ ] **Step 5: Commit**

```bash
git add jest.config.js src/lib/clients-data.ts src/__tests__/clients-data.test.ts
git commit -m "feat(clients): Supabase-backed clients-data accessors + unit tests"
```

---

### Task 6: Clients server actions + validation

**Files:**
- Create: `src/app/admin/(dashboard)/clients/validation.ts` (pure — no framework imports, so Jest can import it directly)
- Create: `src/app/admin/(dashboard)/clients/actions.ts`
- Test: `src/__tests__/client-validation.test.ts`

**Interfaces:**
- Consumes: `createAdminClient` (Task 2), `sessionOptions`/`SessionData` (Task 2).
- Produces:
  - `validateClient(payload: ClientInput): string | null` + `interface ClientInput` (in `validation.ts`; pure, `null` = valid)
  - `getClientRow(id: string): Promise<ClientRow | null>`
  - `upsertClientAction(prev, formData): Promise<{ error: string; success: boolean }>`
  - `deleteClientAction(id: string): Promise<void>`

> Why split `validation.ts` out: a `'use server'` module pulls in `next/headers`/`next/navigation` at import time, which throws under ts-jest's node environment. Keeping `validateClient` framework-free lets the unit test import it in isolation.

- [ ] **Step 1: Write failing validation tests**

Create `src/__tests__/client-validation.test.ts`:

```ts
import { validateClient } from '@/app/admin/(dashboard)/clients/validation'

const ok = { name: 'Acme', city: 'Jasper', state: 'AL', industry: 'Roofing', lat: '', lng: '' }

describe('validateClient', () => {
  it('returns null when required fields are present', () => {
    expect(validateClient(ok)).toBeNull()
  })
  it('requires name, city, state, industry', () => {
    expect(validateClient({ ...ok, name: '' })).toMatch(/name/i)
    expect(validateClient({ ...ok, city: '' })).toMatch(/city/i)
    expect(validateClient({ ...ok, state: '' })).toMatch(/state/i)
    expect(validateClient({ ...ok, industry: '' })).toMatch(/industry/i)
  })
  it('rejects a non-numeric latitude', () => {
    expect(validateClient({ ...ok, lat: 'abc' })).toMatch(/lat/i)
  })
  it('allows blank coordinates', () => {
    expect(validateClient({ ...ok, lat: '', lng: '' })).toBeNull()
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npx jest src/__tests__/client-validation.test.ts`
Expected: FAIL — cannot find module `.../clients/validation`.

- [ ] **Step 3a: Implement the pure validation module**

Create `src/app/admin/(dashboard)/clients/validation.ts`:

```ts
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
```

- [ ] **Step 3b: Implement the actions**

Create `src/app/admin/(dashboard)/clients/actions.ts`:

```ts
'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase-admin'
import { sessionOptions, type SessionData } from '@/lib/session'
import type { ClientRow } from '@/lib/clients-data'
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
    lat:      (formData.get('lat')      as string) ?? '',
    lng:      (formData.get('lng')      as string) ?? '',
  }

  const error = validateClient(input)
  if (error) return { error, success: false }

  const id = (formData.get('id') as string)?.trim() || null
  const payload = {
    name:           input.name.trim(),
    city:           input.city.trim(),
    state:          input.state.trim(),
    industry:       input.industry.trim(),
    lat:            input.lat.trim() ? Number(input.lat) : null,
    lng:            input.lng.trim() ? Number(input.lng) : null,
    website:        ((formData.get('website')  as string) ?? '').trim(),
    logo_url:       ((formData.get('logo_url') as string) ?? '').trim(),
    blurb:          ((formData.get('blurb')    as string) ?? '').trim(),
    show_trust_bar: formData.get('show_trust_bar') === 'on',
    show_map:       formData.get('show_map') === 'on',
    show_portfolio: formData.get('show_portfolio') === 'on',
    needs_review:   formData.get('needs_review') === 'on',
    updated_at:     new Date().toISOString(),
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
```

- [ ] **Step 4: Run to verify the validation tests pass**

Run: `npx jest src/__tests__/client-validation.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add 'src/app/admin/(dashboard)/clients/validation.ts' 'src/app/admin/(dashboard)/clients/actions.ts' src/__tests__/client-validation.test.ts
git commit -m "feat(clients): create/update/delete server actions + validation"
```

---

### Task 7: Clients admin pages — list, form, new, edit

**Files:**
- Create: `src/app/admin/(dashboard)/clients/page.tsx` (list)
- Create: `src/app/admin/(dashboard)/clients/ClientForm.tsx` (shared form)
- Create: `src/app/admin/(dashboard)/clients/new/page.tsx`
- Create: `src/app/admin/(dashboard)/clients/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `getClients` / `Client` (Task 5); `upsertClientAction` / `deleteClientAction` / `getClientRow` (Task 6); `rowToClient` (Task 5); AdminUI primitives (Task 4).

- [ ] **Step 1: Create the shared form** (`ClientForm.tsx`)

```tsx
'use client'
import { useActionState } from 'react'
import { upsertClientAction } from './actions'
import { FormCard, FormField, SaveBar } from '../components/AdminUI'
import type { Client } from '@/lib/clients-data'

const checkboxRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#c0d0e0' }

export function ClientForm({ client }: { client?: Client }) {
  const [state, formAction, isPending] = useActionState(upsertClientAction, { error: '', success: false })

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '640px' }}>
      {client && <input type="hidden" name="id" defaultValue={client.id} />}

      <FormCard title="Business">
        <FormField label="Name"     name="name"     value={client?.name}     required />
        <FormField label="Industry" name="industry" value={client?.industry} required />
        <FormField label="City"     name="city"     value={client?.city}     required />
        <FormField label="State"    name="state"    value={client?.state}    required placeholder="AL" />
        <FormField label="Website"  name="website"  value={client?.website}  placeholder="https://…" />
        <FormField label="Logo URL" name="logo_url" value={client?.logoUrl}  placeholder="https://…" />
        <FormField label="Blurb"    name="blurb"    value={client?.blurb}    type="textarea" hint="One line: what we did." />
      </FormCard>

      <FormCard title="Map coordinates">
        <FormField label="Latitude"  name="lat" value={client?.lat?.toString() ?? ''} hint="Blank = won't show on the map." />
        <FormField label="Longitude" name="lng" value={client?.lng?.toString() ?? ''} hint="Blank = won't show on the map." />
      </FormCard>

      <FormCard title="Placement">
        <label style={checkboxRow}>
          <input type="checkbox" name="show_trust_bar" defaultChecked={client?.show.trustBar} /> Trust bar
        </label>
        <label style={checkboxRow}>
          <input type="checkbox" name="show_map" defaultChecked={client?.show.map} /> Map
        </label>
        <label style={checkboxRow}>
          <input type="checkbox" name="show_portfolio" defaultChecked={client?.show.portfolio} /> Portfolio (no surface yet)
        </label>
        <label style={checkboxRow}>
          <input type="checkbox" name="needs_review" defaultChecked={client?.needsReview} /> Needs review
        </label>
      </FormCard>

      <SaveBar isPending={isPending} success={state.success} error={state.error} />
    </form>
  )
}
```

- [ ] **Step 2: Create the list page** (`page.tsx`)

```tsx
import Link from 'next/link'
import { getClients } from '@/lib/clients-data'
import { deleteClientAction } from './actions'
import {
  AdminPageHeader, NewButton, AdminTable, AdminTableRow, AdminTableCell,
  EmptyState, DeleteButton,
} from '../components/AdminUI'

export default async function ClientsPage() {
  const clients = await getClients()

  const tag = (on: boolean, label: string) => (
    <span style={{ fontSize: '10px', fontWeight: 700, marginRight: '6px', padding: '2px 6px', borderRadius: '4px',
      background: on ? 'rgba(28,199,195,0.12)' : 'rgba(74,106,122,0.12)',
      color: on ? '#1cc7c3' : '#2a4a5a' }}>{label}</span>
  )

  return (
    <>
      <AdminPageHeader title="Clients" subtitle={`${clients.length} total`}
        action={<NewButton href="/admin/clients/new" label="New client" />} />

      {clients.length === 0 ? (
        <EmptyState message="No clients yet. Add your first one." />
      ) : (
        <AdminTable headers={['Name', 'Location', 'Industry', 'Placement', '']}>
          {clients.map((c, i) => (
            <AdminTableRow key={c.id} last={i === clients.length - 1}>
              <AdminTableCell>
                <Link href={`/admin/clients/${c.id}/edit`} style={{ color: '#c0d8e8', textDecoration: 'none', fontWeight: 600 }}>
                  {c.name}{c.needsReview && <span style={{ color: '#c8921a', marginLeft: '6px', fontSize: '11px' }}>⚠ review</span>}
                </Link>
              </AdminTableCell>
              <AdminTableCell muted>{[c.city, c.state].filter(Boolean).join(', ') || '—'}</AdminTableCell>
              <AdminTableCell muted>{c.industry || '—'}</AdminTableCell>
              <AdminTableCell>{tag(c.show.trustBar, 'TRUST')}{tag(c.show.map, 'MAP')}{tag(c.show.portfolio, 'PORTFOLIO')}</AdminTableCell>
              <AdminTableCell><DeleteButton action={deleteClientAction.bind(null, c.id)} noun="client" /></AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}
    </>
  )
}
```

- [ ] **Step 3: Create the new-client page**

Create `src/app/admin/(dashboard)/clients/new/page.tsx`:

```tsx
import { ClientForm } from '../ClientForm'
import { AdminPageHeader, BackLink } from '../../components/AdminUI'

export default function NewClientPage() {
  return (
    <>
      <BackLink href="/admin/clients" label="Back to clients" />
      <AdminPageHeader title="New client" />
      <ClientForm />
    </>
  )
}
```

- [ ] **Step 4: Create the edit-client page**

Create `src/app/admin/(dashboard)/clients/[id]/edit/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import { ClientForm } from '../../ClientForm'
import { getClientRow } from '../../actions'
import { rowToClient } from '@/lib/clients-data'
import { AdminPageHeader, BackLink } from '../../../components/AdminUI'

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const row = await getClientRow(id)
  if (!row) notFound()
  const client = rowToClient(row)

  return (
    <>
      <BackLink href="/admin/clients" label="Back to clients" />
      <AdminPageHeader title="Edit client" subtitle={client.name} />
      <ClientForm client={client} />
    </>
  )
}
```

- [ ] **Step 5: Build and verify the whole module compiles**

Run: `npm run build`
Expected: build succeeds; `/admin/clients`, `/admin/clients/new`, `/admin/clients/[id]/edit` appear in the route list.

- [ ] **Step 6: Commit**

```bash
git add 'src/app/admin/(dashboard)/clients'
git commit -m "feat(clients): admin list, form, new, and edit pages"
```

---

### Task 8: End-to-end verification

**Files:** none (manual verification + final commit if any touch-ups).

- [ ] **Step 1: Run the full test suite**

Run: `npx jest`
Expected: all suites pass (clients-data + client-validation).

- [ ] **Step 2: Manual end-to-end (dev server, both users)**

Run: `npm run dev`. Then verify:
1. `/admin` while logged out → redirects to `/login`.
2. Log in as Sam, then as Brian (separate session) → both reach `/admin`.
3. `/admin/clients` lists the seeded clients with TRUST/MAP/PORTFOLIO tags.
4. Create a new client (map placement + coords) → redirects to its edit page; appears in the list.
5. Edit a client's blurb → "✓ Saved".
6. A client with `show_map` off OR blank coordinates does **not** satisfy `getMapClients()` (confirm via the dashboard "On the map" count).
7. Delete a test client → confirm dialog → removed from the list.
8. Sign out → `/admin` redirects to `/login` again.

- [ ] **Step 3: Confirm the public contract is intact**

Confirm `getMapClients()` / `getTrustBarClients()` keep their Phase-1 signatures so the other chat's `ClientMap` + `StatsBar` can consume them unchanged:

Run: `grep -n "export async function get" src/lib/clients-data.ts`
Expected: `getClients`, `getMapClients`, `getTrustBarClients` all present and `Promise`-returning.

- [ ] **Step 4: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "test(clients): end-to-end verification fixes"
```

---

## Self-Review Notes

- **Spec coverage:** foundation auth (T2–T4), Supabase clients (T2), admin shell (T4), `clients` table + RLS + seed (T1), data-layer swap with frozen signatures (T5), manual CRUD with placement tags + optional coords + `logo_url` URL field, no `gbp_url` on form (T6–T7), fail-soft public reads (T5), revalidation (T6). All spec sections map to a task.
- **Deferred per spec:** Blog + Global Styles (Sidebar scaffolds them as comments); GBP import (column exists, no UI); geocoding (manual lat/lng); logo upload (URL field).
- **Open dependencies (user-supplied):** Supabase keys + `SESSION_SECRET` in `.env.local`; Brian's email + both bcrypt hashes for the Task 1 seed.

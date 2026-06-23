# Hero Onboarding / Quote Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero's right-column feature cards with a 4-step "Start your project / Get a quote" form that saves to a Supabase `leads` table and is viewable at `/admin/leads`.

**Architecture:** A `'use client'` `OnboardingForm` collects answers in React state across 4 steps and, on submit, calls a public `submitLeadAction` (server action) that validates via a pure `validateLead` module and inserts through the service-role client. A session-gated `/admin/leads` page reads them back. `Hero.tsx` gets a one-block swap.

**Tech Stack:** Next.js 16 (App Router, server actions, `useActionState`), React 19, TypeScript, Supabase, Jest + ts-jest.

## Global Constraints

- Builds on the consolidated branch (Phase 2 foundation + map + homepage). Reuses `createAdminClient` (`@/lib/supabase-admin`), `AdminUI` primitives, and the dashboard layout's session guard.
- `leads` table is RLS-enabled with **no public policies** — writes (public submit action) and reads (admin) both go through the **service-role** client. The anon client can neither read nor insert.
- Honeypot field is named `company_website`; real users never fill it. A non-empty honeypot is rejected.
- Email regex: `/^[^@\s]+@[^@\s]+\.[^@\s]+$/`. Email + non-empty challenge are the only required fields.
- `services` is a multi-select stored as Postgres `text[]`.
- The public submit action is NOT session-gated (the form is public). The admin page IS (via the dashboard layout guard).
- `validateLead` must live in a NON-`'use server'` module so Jest can import it and so the build doesn't reject a non-async export from a server-action file.
- Hero theme is light (`#f4f7fb`); the form is a white card with teal (`#1cc7c3` / `#13a9a6`) accents.
- Node off default PATH: prefix `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH"`; run `./node_modules/.bin/jest` and `./node_modules/.bin/tsc`.
- Commit only the files each task lists, by explicit path (other efforts share this worktree — never `git add -A`/`.`).

---

### Task 1: `leads` table SQL

**Files:**
- Create: `docs/superpowers/db/2026-06-22-leads.sql` (run by the user; not executed by code)

**Interfaces:**
- Produces: a `leads` table whose columns match the `LeadInput` fields (Task 2) plus `id`, `status`, `created_at`.

- [ ] **Step 1: Write the SQL file**

```sql
-- docs/superpowers/db/2026-06-22-leads.sql
-- Run once in the Supabase SQL editor.

create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  challenge     text   not null default '',
  services      text[] not null default '{}',
  industry      text   not null default '',
  stage         text   not null default '',
  budget        text   not null default '',
  timeline      text   not null default '',
  has_website   text   not null default '',
  name          text   not null default '',
  business_name text   not null default '',
  email         text   not null default '',
  phone         text   not null default '',
  notes         text   not null default '',
  status        text   not null default 'new',
  created_at    timestamptz not null default now()
);

-- Reconcile a pre-existing leads table from the prior build (non-destructive):
alter table leads add column if not exists challenge     text   not null default '';
alter table leads add column if not exists services      text[] not null default '{}';
alter table leads add column if not exists industry      text   not null default '';
alter table leads add column if not exists stage         text   not null default '';
alter table leads add column if not exists budget        text   not null default '';
alter table leads add column if not exists timeline      text   not null default '';
alter table leads add column if not exists has_website   text   not null default '';
alter table leads add column if not exists name          text   not null default '';
alter table leads add column if not exists business_name text   not null default '';
alter table leads add column if not exists email         text   not null default '';
alter table leads add column if not exists phone         text   not null default '';
alter table leads add column if not exists notes         text   not null default '';
alter table leads add column if not exists status        text   not null default 'new';

alter table leads enable row level security;
-- No policies: leads are written by the public submit action and read by the admin,
-- both via the service-role key (which bypasses RLS). The anon client gets nothing.
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/db/2026-06-22-leads.sql
git commit -m "feat(db): leads table schema + RLS (service-role only)"
```

- [ ] **Step 3 (USER, manual): run the SQL**

User runs the file in the Supabase SQL editor. Verify the `leads` table exists (Table Editor), empty.

---

### Task 2: Lead validation module + submit action

**Files:**
- Create: `src/components/sections/lead-validation.ts` (pure)
- Create: `src/components/sections/lead-actions.ts` (`'use server'`)
- Test: `src/__tests__/lead-validation.test.ts`

**Interfaces:**
- Consumes: `createAdminClient` (`@/lib/supabase-admin`).
- Produces:
  - `interface LeadInput` (in `lead-validation.ts`)
  - `validateLead(input: LeadInput): string | null`
  - `submitLeadAction(prev: { ok: boolean; error: string }, input: LeadInput): Promise<{ ok: boolean; error: string }>`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/lead-validation.test.ts`:

```ts
import { validateLead, type LeadInput } from '@/components/sections/lead-validation'

function input(overrides: Partial<LeadInput> = {}): LeadInput {
  return {
    challenge: 'Not enough leads/customers',
    services: ['Website'],
    industry: 'Roofing', stage: 'Established, growing',
    budget: '$2–5k', timeline: 'ASAP', has_website: 'Yes',
    name: 'Sam', business_name: 'Acme', email: 'sam@acme.com',
    phone: '', notes: '', company_website: '', ...overrides,
  }
}

describe('validateLead', () => {
  it('returns null for a valid submission', () => {
    expect(validateLead(input())).toBeNull()
  })
  it('rejects when the honeypot is filled', () => {
    expect(validateLead(input({ company_website: 'http://spam.test' }))).toMatch(/invalid/i)
  })
  it('requires a challenge', () => {
    expect(validateLead(input({ challenge: '' }))).toMatch(/challenge/i)
  })
  it('requires an email', () => {
    expect(validateLead(input({ email: '' }))).toMatch(/email is required/i)
  })
  it('rejects a malformed email', () => {
    expect(validateLead(input({ email: 'not-an-email' }))).toMatch(/valid email/i)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && ./node_modules/.bin/jest src/__tests__/lead-validation.test.ts`
Expected: FAIL — cannot find module `.../lead-validation`.

- [ ] **Step 3a: Implement the pure validation module**

Create `src/components/sections/lead-validation.ts`:

```ts
// Pure, framework-free — safe to import from the server action and from Jest.
export interface LeadInput {
  challenge: string
  services: string[]
  industry: string
  stage: string
  budget: string
  timeline: string
  has_website: string
  name: string
  business_name: string
  email: string
  phone: string
  notes: string
  company_website: string // honeypot — real users leave this blank
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

// Returns an error message, or null if valid.
export function validateLead(input: LeadInput): string | null {
  if (input.company_website.trim() !== '') return 'Invalid submission'
  if (!input.challenge.trim()) return 'Please select your biggest challenge'
  const email = input.email.trim()
  if (!email) return 'Email is required'
  if (!EMAIL_RE.test(email)) return 'Please enter a valid email address'
  return null
}
```

- [ ] **Step 3b: Implement the submit action**

Create `src/components/sections/lead-actions.ts`:

```ts
'use server'
import { createAdminClient } from '@/lib/supabase-admin'
import { validateLead, type LeadInput } from './lead-validation'

export async function submitLeadAction(
  _prev: { ok: boolean; error: string },
  input: LeadInput,
): Promise<{ ok: boolean; error: string }> {
  const error = validateLead(input)
  if (error) return { ok: false, error }

  const { error: e } = await createAdminClient().from('leads').insert({
    challenge:     input.challenge.trim(),
    services:      input.services,
    industry:      input.industry.trim(),
    stage:         input.stage.trim(),
    budget:        input.budget.trim(),
    timeline:      input.timeline.trim(),
    has_website:   input.has_website.trim(),
    name:          input.name.trim(),
    business_name: input.business_name.trim(),
    email:         input.email.trim(),
    phone:         input.phone.trim(),
    notes:         input.notes.trim(),
  })
  if (e) return { ok: false, error: 'Something went wrong — please try again.' }
  return { ok: true, error: '' }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && ./node_modules/.bin/jest src/__tests__/lead-validation.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Typecheck + commit**

Run: `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && ./node_modules/.bin/tsc --noEmit`
Expected: 0 errors (ignore any errors confined to `src/components/sections/ClientMap*`/`MapCanvas`/`clientMapUtils` if present — different effort).

```bash
git add src/components/sections/lead-validation.ts src/components/sections/lead-actions.ts src/__tests__/lead-validation.test.ts
git commit -m "feat(leads): validateLead + public submitLeadAction"
```

---

### Task 3: OnboardingForm component (4-step)

**Files:**
- Create: `src/components/sections/OnboardingForm.tsx` (`'use client'`)

**Interfaces:**
- Consumes: `submitLeadAction` + `LeadInput` (Task 2).
- Produces: `default export OnboardingForm` (no props) — consumed by `Hero.tsx` (Task 5).

- [ ] **Step 1: Create the component**

Create `src/components/sections/OnboardingForm.tsx`:

```tsx
'use client'
import { useActionState, useState } from 'react'
import type { CSSProperties } from 'react'
import { submitLeadAction } from './lead-actions'
import type { LeadInput } from './lead-validation'

const CHALLENGES = [
  'Not enough leads/customers',
  'Outdated or no website',
  'Weak/inconsistent branding',
  'Manual work eating my time (AI/automation)',
  'Launching something new',
  'Other',
]
const SERVICES  = ['Strategy/Blueprint', 'Branding', 'Website', 'AI Systems', 'Growth/Marketing']
const STAGES    = ['Just starting', 'Established, growing', 'Scaling']
const BUDGETS   = ['<$2k', '$2–5k', '$5–10k', '$10k+', 'Not sure']
const TIMELINES = ['ASAP', '1–3 months', 'Just exploring']
const WEBSITES  = ['Yes', 'No', 'Needs rebuild']

const TEAL = '#1cc7c3'
const INK  = '#0b1520'

const card: CSSProperties = {
  background: '#ffffff', border: '1px solid rgba(13,21,32,0.08)', borderTop: `3px solid ${TEAL}`,
  borderRadius: '18px', padding: '28px 26px', boxShadow: '0 18px 50px rgba(13,21,32,0.10)',
}
const label: CSSProperties = { fontSize: '13px', fontWeight: 700, color: INK, marginBottom: '12px', display: 'block' }
const input: CSSProperties = {
  width: '100%', background: '#f7f9fc', border: '1px solid rgba(13,21,32,0.12)', borderRadius: '10px',
  padding: '11px 13px', fontSize: '14px', color: INK, outline: 'none', boxSizing: 'border-box',
}
const pill = (active: boolean): CSSProperties => ({
  textAlign: 'left', width: '100%', cursor: 'pointer', padding: '11px 14px', borderRadius: '10px', fontSize: '13.5px',
  border: `1px solid ${active ? TEAL : 'rgba(13,21,32,0.12)'}`,
  background: active ? 'rgba(28,199,195,0.10)' : '#ffffff',
  color: active ? '#0e7a78' : '#46566a', fontWeight: active ? 700 : 500, transition: 'all 0.15s ease',
})

const EMPTY: LeadInput = {
  challenge: '', services: [], industry: '', stage: '', budget: '', timeline: '',
  has_website: '', name: '', business_name: '', email: '', phone: '', notes: '', company_website: '',
}

export default function OnboardingForm() {
  const [step, setStep] = useState(1)
  const [a, setA] = useState<LeadInput>(EMPTY)
  const [stepError, setStepError] = useState('')
  const [state, submit, isPending] = useActionState(submitLeadAction, { ok: false, error: '' })

  const set = (patch: Partial<LeadInput>) => setA(prev => ({ ...prev, ...patch }))
  const toggleService = (s: string) =>
    set({ services: a.services.includes(s) ? a.services.filter(x => x !== s) : [...a.services, s] })

  function next() {
    if (step === 1 && !a.challenge) { setStepError('Pick the option that fits best.'); return }
    setStepError(''); setStep(s => Math.min(4, s + 1))
  }
  function back() { setStepError(''); setStep(s => Math.max(1, s - 1)) }

  function onSubmit() {
    const email = a.email.trim()
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setStepError('Enter a valid email so we can reach you.'); return }
    setStepError(''); submit(a)
  }

  if (state.ok) {
    return (
      <div style={card}>
        <div style={{ fontSize: '15px', fontWeight: 800, color: INK, marginBottom: '8px' }}>Thanks{a.name ? `, ${a.name.split(' ')[0]}` : ''} — request received.</div>
        <p style={{ fontSize: '13.5px', color: '#5a6a7a', lineHeight: 1.6 }}>
          We&apos;ll review what you shared and reach out within 1 business day to talk through your project and a quote.
        </p>
      </div>
    )
  }

  return (
    <div style={card}>
      {/* progress */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEAL }}>Start your project</span>
          <span style={{ fontSize: '11px', color: '#8a98a6' }}>Step {step} of 4</span>
        </div>
        <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(13,21,32,0.08)' }}>
          <div style={{ height: '100%', width: `${(step / 4) * 100}%`, borderRadius: '2px', background: TEAL, transition: 'width 0.25s ease' }} />
        </div>
      </div>

      {step === 1 && (
        <div>
          <label style={label}>What&apos;s your biggest challenge right now?</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CHALLENGES.map(c => (
              <button key={c} type="button" style={pill(a.challenge === c)} onClick={() => set({ challenge: c })}>{c}</button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={label}>Which services are you interested in?</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SERVICES.map(s => (
                <button key={s} type="button" style={{ ...pill(a.services.includes(s)), width: 'auto' }} onClick={() => toggleService(s)}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={label}>What does your business do?</label>
            <input style={input} value={a.industry} onChange={e => set({ industry: e.target.value })} placeholder="e.g. Roofing, dental, restaurant…" />
          </div>
          <div>
            <label style={label}>Where are you at?</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {STAGES.map(s => (
                <button key={s} type="button" style={{ ...pill(a.stage === s), width: 'auto' }} onClick={() => set({ stage: s })}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={label}>Rough budget?</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {BUDGETS.map(b => (
                <button key={b} type="button" style={{ ...pill(a.budget === b), width: 'auto' }} onClick={() => set({ budget: b })}>{b}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={label}>Timeline?</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {TIMELINES.map(tline => (
                <button key={tline} type="button" style={{ ...pill(a.timeline === tline), width: 'auto' }} onClick={() => set({ timeline: tline })}>{tline}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={label}>Do you have a website now?</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {WEBSITES.map(w => (
                <button key={w} type="button" style={{ ...pill(a.has_website === w), width: 'auto' }} onClick={() => set({ has_website: w })}>{w}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div><label style={label}>Your name</label><input style={input} value={a.name} onChange={e => set({ name: e.target.value })} placeholder="Full name" /></div>
          <div><label style={label}>Business name</label><input style={input} value={a.business_name} onChange={e => set({ business_name: e.target.value })} placeholder="Business name" /></div>
          <div><label style={label}>Email *</label><input style={input} type="email" value={a.email} onChange={e => set({ email: e.target.value })} placeholder="you@business.com" /></div>
          <div><label style={label}>Phone (optional)</label><input style={input} value={a.phone} onChange={e => set({ phone: e.target.value })} placeholder="(555) 555-5555" /></div>
          <div><label style={label}>Anything else?</label><textarea style={{ ...input, minHeight: '64px', resize: 'vertical' }} value={a.notes} onChange={e => set({ notes: e.target.value })} placeholder="Tell us a bit more…" /></div>
          {/* honeypot — visually hidden, off-screen, not tab-focusable */}
          <input
            type="text" name="company_website" tabIndex={-1} autoComplete="off"
            value={a.company_website} onChange={e => set({ company_website: e.target.value })}
            aria-hidden style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
          />
        </div>
      )}

      {(stepError || state.error) && (
        <p style={{ fontSize: '12.5px', color: '#d4574e', marginTop: '12px', marginBottom: 0 }}>{stepError || state.error}</p>
      )}

      {/* nav */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
        {step > 1 && (
          <button type="button" onClick={back} disabled={isPending}
            style={{ flex: '0 0 auto', padding: '12px 18px', borderRadius: '10px', border: '1px solid rgba(13,21,32,0.14)', background: '#fff', color: '#46566a', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            Back
          </button>
        )}
        {step < 4 ? (
          <button type="button" onClick={next}
            style={{ flex: 1, padding: '12px 18px', borderRadius: '10px', border: 'none', background: TEAL, color: '#06201f', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>
            Continue →
          </button>
        ) : (
          <button type="button" onClick={onSubmit} disabled={isPending}
            style={{ flex: 1, padding: '12px 18px', borderRadius: '10px', border: 'none', background: isPending ? 'rgba(28,199,195,0.6)' : TEAL, color: '#06201f', fontWeight: 800, fontSize: '14px', cursor: isPending ? 'not-allowed' : 'pointer' }}>
            {isPending ? 'Sending…' : 'Request My Quote'}
          </button>
        )}
      </div>

      <p style={{ fontSize: '11.5px', color: '#8a98a6', textAlign: 'center', marginTop: '14px', marginBottom: 0 }}>
        🔒 No spam — just a real conversation. Takes about a minute.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && ./node_modules/.bin/tsc --noEmit`
Expected: 0 errors (ignore any pre-existing `ClientMap*`/`MapCanvas` errors from the other effort).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/OnboardingForm.tsx
git commit -m "feat(leads): 4-step OnboardingForm with progress + honeypot"
```

---

### Task 4: Admin Leads page + Sidebar entry

**Files:**
- Create: `src/app/admin/(dashboard)/leads/page.tsx`
- Modify: `src/app/admin/(dashboard)/Sidebar.tsx`

**Interfaces:**
- Consumes: `createAdminClient`; `AdminUI` primitives.

- [ ] **Step 1: Create the Leads page**

Create `src/app/admin/(dashboard)/leads/page.tsx`:

```tsx
import { createAdminClient } from '@/lib/supabase-admin'
import {
  AdminPageHeader, AdminTable, AdminTableRow, AdminTableCell, EmptyState,
} from '../components/AdminUI'

interface LeadRow {
  id: string
  challenge: string
  services: string[]
  budget: string
  timeline: string
  name: string
  business_name: string
  email: string
  notes: string
  created_at: string
}

async function getLeads(): Promise<LeadRow[]> {
  const { data } = await createAdminClient().from('leads').select('*').order('created_at', { ascending: false })
  return (data ?? []) as LeadRow[]
}

export default async function LeadsPage() {
  let leads: LeadRow[] = []
  let dbError = false
  try { leads = await getLeads() } catch { dbError = true }

  return (
    <>
      <AdminPageHeader title="Leads" subtitle={`${leads.length} total`} />

      {dbError && (
        <div style={{ background: 'rgba(240,160,32,0.08)', border: '1px solid rgba(240,160,32,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#f0a020' }}>
          ⚠ Could not load leads — the leads table may not exist yet.
        </div>
      )}

      {!dbError && leads.length === 0 ? (
        <EmptyState message="No leads yet. Submissions from the homepage form will appear here." />
      ) : (
        <AdminTable headers={['Name', 'Business', 'Email', 'Challenge', 'Services', 'Budget', 'Timeline', 'When']}>
          {leads.map((l, i) => (
            <AdminTableRow key={l.id} last={i === leads.length - 1}>
              <AdminTableCell>{l.name || '—'}</AdminTableCell>
              <AdminTableCell muted>{l.business_name || '—'}</AdminTableCell>
              <AdminTableCell muted>{l.email || '—'}</AdminTableCell>
              <AdminTableCell muted>{l.challenge || '—'}</AdminTableCell>
              <AdminTableCell muted>{(l.services ?? []).join(', ') || '—'}</AdminTableCell>
              <AdminTableCell muted>{l.budget || '—'}</AdminTableCell>
              <AdminTableCell muted>{l.timeline || '—'}</AdminTableCell>
              <AdminTableCell muted>{new Date(l.created_at).toLocaleDateString()}</AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}
    </>
  )
}
```

- [ ] **Step 2: Add the Leads entry to the Sidebar**

In `src/app/admin/(dashboard)/Sidebar.tsx`, add `Inbox` to the lucide import:

```tsx
import { LayoutDashboard, Users, Settings, Inbox, LogOut } from 'lucide-react'
```

and add the Leads entry to the `nav` array (after Clients):

```tsx
  { label: 'Leads',    href: '/admin/leads',    Icon: Inbox },
```

- [ ] **Step 3: Typecheck + commit**

Run: `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && ./node_modules/.bin/tsc --noEmit`
Expected: 0 errors (ignore pre-existing `ClientMap*`/`MapCanvas` errors if present).

```bash
git add 'src/app/admin/(dashboard)/leads/page.tsx' 'src/app/admin/(dashboard)/Sidebar.tsx'
git commit -m "feat(leads): admin /admin/leads list + Sidebar entry"
```

---

### Task 5: Swap the form into the Hero

**Files:**
- Modify: `src/components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `OnboardingForm` (Task 3).

- [ ] **Step 1: Import the form and remove the unused card imports**

In `src/components/sections/Hero.tsx`, change the top imports. Replace:

```tsx
import Link from 'next/link'
import { MapPin, Settings, TrendingUp } from 'lucide-react'
import HeroNetwork from './HeroNetwork'
import Btn from '@/components/ui/Btn'
import { t } from '@/lib/typography'
```

with (drop `Link` and the three card icons; add `OnboardingForm`):

```tsx
import HeroNetwork from './HeroNetwork'
import Btn from '@/components/ui/Btn'
import OnboardingForm from './OnboardingForm'
import { t } from '@/lib/typography'
```

- [ ] **Step 2: Delete the `cards` array**

Remove the entire `const cards = [ ... ]` block (the array of three `{ Icon, title, tagline, desc, href, delay }` objects) near the top of the file. Nothing else references it after Step 3.

- [ ] **Step 3: Replace the right-column JSX with the form**

Replace the whole right-column block — the `{/* ── Right column — 3 stacked feature cards ── */}` `<div>` that maps over `cards` (from its opening `<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>` through its matching closing `</div>`) — with:

```tsx
          {/* ── Right column — onboarding / quote form ── */}
          <OnboardingForm />
```

Leave the grid wrapper (`gridTemplateColumns: '65fr 35fr'`), the left column, and everything else unchanged.

- [ ] **Step 4: Production build to verify the whole page compiles + renders**

Run:
```bash
export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && \
NEXT_PUBLIC_SUPABASE_URL="https://dummy.supabase.co" NEXT_PUBLIC_SUPABASE_ANON_KEY="dummy" \
SUPABASE_SERVICE_ROLE_KEY="dummy" SESSION_SECRET="dummy_session_secret_at_least_32_chars_long_xx" \
./node_modules/.bin/next build
```
Expected: build succeeds; `/admin/leads` appears in the route list; no "unused variable" / missing-import errors from `Hero.tsx`.

- [ ] **Step 5: Run the full test suite**

Run: `export PATH="/Users/samueldempsey/.nvm/versions/node/v24.15.0/bin:$PATH" && ./node_modules/.bin/jest`
Expected: all suites pass (including the new `lead-validation` suite).

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat(hero): replace right-column cards with OnboardingForm"
```

---

### Task 6: End-to-end verification (env-gated)

**Files:** none (manual).

- [ ] **Step 1: Full suite + build** (already green from Task 5) — re-confirm `./node_modules/.bin/jest` and the build command above both pass.

- [ ] **Step 2: Manual (after the user has run Task 1's SQL, with real Supabase env)**

1. Load the homepage → the hero's right column shows the 4-step form with the progress bar.
2. Try to advance Step 1 without choosing → inline "Pick the option…" error.
3. Complete all 4 steps, submit with a valid email → success state ("request received").
4. Open `/admin/leads` → the submission appears with its services, budget, timeline, and contact info.
5. Submit a second lead with the hidden `company_website` honeypot filled (via devtools) → rejected, no new row.

---

## Self-Review Notes

- **Spec coverage:** `leads` table + RLS + reconcile (T1); pure `validateLead` + public `submitLeadAction` via service-role (T2); 4-step form with progress, honeypot, success state (T3); session-gated `/admin/leads` + Sidebar (T4); minimal `Hero.tsx` swap (T5); manual e2e (T6). All spec sections map to a task.
- **Honeypot/spam:** `company_website` non-empty → `validateLead` returns "Invalid submission"; the action returns `{ ok:false }` and never inserts.
- **Non-`'use server'` validation:** `validateLead` lives in `lead-validation.ts` so Jest can import it and the Turbopack build doesn't reject a non-async export from the action file.
- **Env-gated:** Task 1 SQL + the Task 6 runtime checks need the user's Supabase project (already wired in Vercel).
- **Coordination:** `Hero.tsx` (T5) is the other chat's file — the change is import cleanup + one block swap + deleting the dead `cards` array.

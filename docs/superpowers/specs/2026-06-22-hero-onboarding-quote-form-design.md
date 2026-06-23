# Hero Onboarding / Quote Form Design

**Date:** 2026-06-22
**Status:** Approved for spec review
**Project:** SC Creative site (`~/Ai Sites/sc-creative`, Next.js 16 / React 19 / Tailwind v4 / Supabase)
**Builds on:** the Phase 2 admin foundation (auth, AdminUI, `createAdminClient`, session-gating). Implemented on the consolidated branch / `main`.

## Overview

Replace the hero section's right column (the 3 stacked feature cards — "Local Focus",
"Modern Solutions", "Growth Driven") with a **4-step "Start your project / Get a quote"
form**. Submissions persist to a Supabase `leads` table and are viewable in a new
session-gated `/admin/leads` page. Framing is direct ("request a quote / start
project"); the multi-step flow keeps per-screen friction low.

## Goals

- Capture enough to **scope a quote**: the challenge, the services wanted, and the
  qualifiers (budget, timeline, current website) — plus contact details.
- One clean home for submissions (Supabase `leads`) surfaced in the admin.
- Minimal footprint on `Hero.tsx` (the other chat's file): a single-line swap.

## Non-Goals (deferred)

- Email/Slack notifications on submit (DB + admin only for now).
- Lead status workflow beyond a default `status='new'` column (no contacted/won pipeline yet).
- Spam protection beyond a honeypot + server validation (no captcha/rate-limit service).
- Editing/deleting leads in the admin (read-only list this phase).

## Architecture

### Component — `src/components/sections/OnboardingForm.tsx` (new, `'use client'`)

Light/white card matching the hero's light theme (teal accents, rounded inputs,
teal primary button), with a **"Step X of 4"** progress indicator. Local React
state holds the current step + all answers. Steps:

1. **Challenge** (single-select buttons): Not enough leads/customers · Outdated or
   no website · Weak/inconsistent branding · Manual work eating my time (AI/automation)
   · Launching something new · Other.
2. **Scope:** services wanted (multi-select chips → `string[]`): Strategy/Blueprint ·
   Branding · Website · AI Systems · Growth/Marketing. Plus industry (text) and
   stage (Just starting / Established, growing / Scaling).
3. **Qualifiers:** budget (range buttons: `<$2k` · `$2–5k` · `$5–10k` · `$10k+` ·
   `Not sure`), timeline (ASAP · 1–3 months · Just exploring), has-website (Yes ·
   No · Needs rebuild).
4. **Contact:** name · business name · email (required) · phone (optional) · notes.
   Plus a hidden **honeypot** input (`company_website`) that real users never fill.

Navigation: Next/Back. Per-step gating — Step 1 requires a challenge selection to
advance; the final Submit requires a valid email. On submit, calls `submitLeadAction`
with the collected answers; on `{ ok: true }` it swaps the card to a **success state**
("Thanks — we'll be in touch within 1 business day."). A "🔒 No spam." trust line and
a "Takes less than a minute" note mirror the reference mockup.

### Data model — `leads` table (new)

```sql
create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  challenge     text not null default '',
  services      text[] not null default '{}',
  industry      text not null default '',
  stage         text not null default '',
  budget        text not null default '',
  timeline      text not null default '',
  has_website   text not null default '',
  name          text not null default '',
  business_name text not null default '',
  email         text not null default '',
  phone         text not null default '',
  notes         text not null default '',
  status        text not null default 'new',
  created_at    timestamptz not null default now()
);
alter table leads enable row level security;
-- No policies: leads are written ONLY by the public submit server action and read
-- ONLY by the admin — both use the service-role key, which bypasses RLS. The anon
-- client can neither read nor insert, so the public can't scrape or spam the table.
```

### Submit action — `src/components/sections/lead-actions.ts` (new)

- `validateLead(input)` — **pure**, framework-free (own module so Jest can test it):
  rejects when the honeypot is non-empty, when email is missing/!`/^[^@\s]+@[^@\s]+\.[^@\s]+$/`,
  or when challenge is empty. Returns an error string or `null`.
- `submitLeadAction(prev, input)` — **public** server action (`'use server'`, NOT
  session-gated; the form is public). Runs `validateLead`; on pass, inserts via
  `createAdminClient()` into `leads`. Returns `{ ok: boolean; error: string }`.
  No `revalidatePath` needed (nothing public renders leads).

Why a server action + service-role rather than an anon insert: keeps the table fully
private (no public read/insert surface) while still letting an unauthenticated visitor
submit. The honeypot + required-field validation are the spam floor.

### Admin — `src/app/admin/(dashboard)/leads/page.tsx` (new) + Sidebar entry

Session-gated (under the dashboard layout guard). Reads via `createAdminClient()`
ordered by `created_at desc`, renders `AdminTable` with columns: name · business ·
email · challenge · budget · timeline · created. `services` shown as a compact joined
list; `notes` available per row (inline or truncated). Fails soft (try/catch → empty +
a notice) like the old Leads module. Sidebar gains a **Leads** entry.

### Hero — `src/components/sections/Hero.tsx` (modify, minimal)

Replace the right-column `<div>{cards.map(...)}</div>` block with `<OnboardingForm />`,
and remove the now-unused `cards` array plus the imports only it used (`Link`, `MapPin`,
`Settings`, `TrendingUp`). `Btn` stays (left-column CTAs still use it). The grid columns
(`65fr 35fr`) and everything else in the hero are untouched.

## Data flow

1. **Submit:** visitor completes 4 steps → `submitLeadAction` validates → service-role
   insert into `leads` → success state.
2. **Review:** admin opens `/admin/leads` → service-role read → table of submissions.

## Error handling

- Client: per-step validation messages inline; Submit disabled while pending; on
  `{ ok:false }` the action's error renders above the button.
- `validateLead` rejects bad email / empty challenge / filled honeypot before any DB write.
- `submitLeadAction` returns the Supabase error message on insert failure (the form
  shows "Something went wrong — please try again").
- `/admin/leads` read wrapped in try/catch → empty state + "table may not exist yet" notice.

## Testing

- **Unit:** `validateLead` — valid input → null; missing/garbled email → error; empty
  challenge → error; non-empty honeypot → error (treated as spam).
- **Manual:** complete all 4 steps and submit → success state shows → row appears in
  `/admin/leads` with the selected services, budget, timeline, and contact info; a
  submission with a filled honeypot is rejected.

## Risks / Open items

- **`Hero.tsx` is the other chat's file.** The change is one block swap + dead-code
  removal; coordinate so we don't both edit it simultaneously. Low conflict surface.
- **Manual Supabase setup:** run the `leads` SQL once (same pattern as the other modules).
- **Public server action surface:** mitigated by honeypot + validation; a captcha or
  rate-limit can be added later if spam appears (noted, not built now).
- Reusing the table name `leads` — the prior build had a `leads` table; this schema is
  the authoritative one. The implementation SQL will follow `create table if not exists`
  with `alter table leads add column if not exists ...` for each column, so a pre-existing
  differently-shaped `leads` table is reconciled non-destructively (mirrors the
  admin_users reconcile from the Clients module).

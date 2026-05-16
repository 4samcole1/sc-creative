# SC Creative — Plan 1: Foundation + Homepage

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the project foundation (Supabase schema, types, auth middleware, layout) and convert homepage-v5.html into fully data-driven React components, producing a live, deployable homepage.

**Architecture:** Single Next.js 16 App Router app. `(marketing)` route group wraps public pages with Nav + Footer. Homepage sections are a mix of server components (data-fetching) and client components (animations/interactivity). Supabase provides the DB; `@supabase/ssr` handles server-side auth and queries.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, Supabase (`@supabase/supabase-js`, `@supabase/ssr`), Jest, React Testing Library

---

## Important: Next.js 16 conventions

- `params` in dynamic routes is a **Promise**: always `const { slug } = await params`
- Tailwind v4: no `tailwind.config.js` — use `@theme inline` in `globals.css`
- Server Components are the default — only add `'use client'` when you need state, effects, or browser APIs
- `use cache` directive for opt-in caching (replaces `fetch` cache options)
- AGENTS.md: check `node_modules/next/dist/docs/` before writing any route code

---

## Task 1: Install testing dependencies

**Files:**
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Modify: `package.json`

- [ ] **Step 1: Install deps**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest @types/jest
```

Expected: packages added to devDependencies

- [ ] **Step 2: Create jest.config.ts**

```ts
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 3: Create jest.setup.ts**

```ts
// jest.setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Add test script to package.json**

In `package.json` scripts, add:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 5: Verify setup**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npm test -- --passWithNoTests
```

Expected: `Test Suites: 0 passed`

- [ ] **Step 6: Commit**

```bash
cd /Users/samueldempsey/Desktop/sc-creative
git add jest.config.ts jest.setup.ts package.json package-lock.json
git commit -m "chore: add Jest + React Testing Library"
```

---

## Task 2: Configure brand tokens (Tailwind v4)

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace globals.css**

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme inline {
  --color-navy-darkest: #071829;
  --color-navy-dark: #0d1f35;
  --color-navy: #1a3557;
  --color-navy-mid: #0d2a40;
  --color-teal: #00b5a5;
  --color-teal-dark: #009d8f;
  --color-teal-light: #4dd6c9;
  --color-gold: #c8921a;
  --color-cream: #f5f3ef;
  --color-cream-dark: #ece8e2;

  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
}

html { scroll-behavior: smooth; }
body { overflow-x: hidden; }
```

- [ ] **Step 2: Verify dev server compiles**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npm run build 2>&1 | tail -5
```

Expected: `✓ Compiled successfully` or similar — no Tailwind errors

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: configure brand tokens via Tailwind v4 @theme inline"
```

---

## Task 3: Supabase schema

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Create migrations directory**

```bash
mkdir -p /Users/samueldempsey/Desktop/sc-creative/supabase/migrations
```

- [ ] **Step 2: Create migration file**

```sql
-- supabase/migrations/001_initial_schema.sql

create extension if not exists "uuid-ossp";

-- Posts (blog / insights)
create table posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  content text,
  excerpt text,
  cover_image text,
  published_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

-- Projects (portfolio)
create table projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  client text,
  services text[] default '{}',
  cover_image text,
  gallery text[] default '{}',
  summary text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int default 0,
  created_at timestamptz not null default now()
);

-- Case studies
create table case_studies (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  client text,
  project_id uuid references projects(id) on delete set null,
  content text,
  results text[] default '{}',
  cover_image text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- Testimonials
create table testimonials (
  id uuid primary key default uuid_generate_v4(),
  author text not null,
  company text,
  quote text not null,
  avatar text,
  visible boolean not null default true,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

-- Leads (quote form submissions)
create table leads (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  business text,
  phone text,
  email text not null,
  service_interest text,
  message text,
  created_at timestamptz not null default now()
);

-- Industry pages
create table industry_pages (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  headline text,
  content text,
  services text[] default '{}',
  hero_image text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

-- Service area pages
create table service_area_pages (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  city text not null,
  county text not null default 'Walker County',
  content text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

-- RLS: enable on all tables, allow public read of published content
alter table posts enable row level security;
alter table projects enable row level security;
alter table case_studies enable row level security;
alter table testimonials enable row level security;
alter table leads enable row level security;
alter table industry_pages enable row level security;
alter table service_area_pages enable row level security;

-- Public can read published rows
create policy "public read published posts" on posts for select using (status = 'published');
create policy "public read published projects" on projects for select using (status = 'published');
create policy "public read published case_studies" on case_studies for select using (status = 'published');
create policy "public read visible testimonials" on testimonials for select using (visible = true);
create policy "public read published industry_pages" on industry_pages for select using (status = 'published');
create policy "public read published service_area_pages" on service_area_pages for select using (status = 'published');

-- Authenticated users (admin) can do everything
create policy "admin all posts" on posts for all using (auth.role() = 'authenticated');
create policy "admin all projects" on projects for all using (auth.role() = 'authenticated');
create policy "admin all case_studies" on case_studies for all using (auth.role() = 'authenticated');
create policy "admin all testimonials" on testimonials for all using (auth.role() = 'authenticated');
create policy "admin all leads" on leads for all using (auth.role() = 'authenticated');
create policy "admin all industry_pages" on industry_pages for all using (auth.role() = 'authenticated');
create policy "admin all service_area_pages" on service_area_pages for all using (auth.role() = 'authenticated');

-- Leads: allow anonymous inserts (quote form)
create policy "anon insert leads" on leads for insert with check (true);
```

- [ ] **Step 3: Run migration in Supabase**

Go to your Supabase project → **SQL Editor** → paste the contents of `supabase/migrations/001_initial_schema.sql` → click **Run**.

Expected: all tables created with no errors.

- [ ] **Step 4: Commit**

```bash
git add supabase/
git commit -m "feat: add initial Supabase schema with RLS policies"
```

---

## Task 4: TypeScript database types

**Files:**
- Create: `src/lib/types.ts`

- [ ] **Step 1: Create types.ts**

```ts
// src/lib/types.ts

export type Status = 'draft' | 'published'

export interface Post {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  cover_image: string | null
  published_at: string | null
  status: Status
  created_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  client: string | null
  services: string[]
  cover_image: string | null
  gallery: string[]
  summary: string | null
  status: Status
  sort_order: number
  created_at: string
}

export interface CaseStudy {
  id: string
  title: string
  slug: string
  client: string | null
  project_id: string | null
  content: string | null
  results: string[]
  cover_image: string | null
  status: Status
  published_at: string | null
  created_at: string
}

export interface Testimonial {
  id: string
  author: string
  company: string | null
  quote: string
  avatar: string | null
  visible: boolean
  sort_order: number
  created_at: string
}

export interface Lead {
  id: string
  first_name: string
  last_name: string
  business: string | null
  phone: string | null
  email: string
  service_interest: string | null
  message: string | null
  created_at: string
}

export interface IndustryPage {
  id: string
  title: string
  slug: string
  headline: string | null
  content: string | null
  services: string[]
  hero_image: string | null
  status: Status
  created_at: string
}

export interface ServiceAreaPage {
  id: string
  title: string
  slug: string
  city: string
  county: string
  content: string | null
  status: Status
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      posts: { Row: Post; Insert: Omit<Post, 'id' | 'created_at'>; Update: Partial<Omit<Post, 'id' | 'created_at'>> }
      projects: { Row: Project; Insert: Omit<Project, 'id' | 'created_at'>; Update: Partial<Omit<Project, 'id' | 'created_at'>> }
      case_studies: { Row: CaseStudy; Insert: Omit<CaseStudy, 'id' | 'created_at'>; Update: Partial<Omit<CaseStudy, 'id' | 'created_at'>> }
      testimonials: { Row: Testimonial; Insert: Omit<Testimonial, 'id' | 'created_at'>; Update: Partial<Omit<Testimonial, 'id' | 'created_at'>> }
      leads: { Row: Lead; Insert: Omit<Lead, 'id' | 'created_at'>; Update: Partial<Omit<Lead, 'id' | 'created_at'>> }
      industry_pages: { Row: IndustryPage; Insert: Omit<IndustryPage, 'id' | 'created_at'>; Update: Partial<Omit<IndustryPage, 'id' | 'created_at'>> }
      service_area_pages: { Row: ServiceAreaPage; Insert: Omit<ServiceAreaPage, 'id' | 'created_at'>; Update: Partial<Omit<ServiceAreaPage, 'id' | 'created_at'>> }
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add TypeScript database types"
```

---

## Task 5: Server-side Supabase client

**Files:**
- Modify: `src/lib/supabase.ts`
- Create: `src/lib/supabase-server.ts`

- [ ] **Step 1: Update browser client to use Database type**

```ts
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 2: Create server-side client**

```ts
// src/lib/supabase-server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // called from a Server Component — cookies are read-only
          }
        },
      },
    }
  )
}
```

- [ ] **Step 3: Verify types compile**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx tsc --noEmit 2>&1
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase.ts src/lib/supabase-server.ts
git commit -m "feat: add typed Supabase clients (browser + server)"
```

---

## Task 6: Auth middleware

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create middleware**

```ts
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

- [ ] **Step 2: Write test**

```ts
// src/__tests__/middleware.test.ts
import { NextRequest } from 'next/server'

describe('middleware config', () => {
  it('matches dashboard paths', () => {
    const { config } = require('@/middleware')
    expect(config.matcher).toContain('/dashboard/:path*')
  })
})
```

- [ ] **Step 3: Run test**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npm test -- src/__tests__/middleware.test.ts
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/middleware.ts src/__tests__/middleware.test.ts
git commit -m "feat: add auth middleware to protect /dashboard routes"
```

---

## Task 7: Root layout + (marketing) route group

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/(marketing)/layout.tsx`
- Create: `src/app/(marketing)/page.tsx` (stub)

- [ ] **Step 1: Update root layout**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: { default: 'SC Creative — Walker County\'s Growth Partner', template: '%s | SC Creative' },
  description: 'We build the digital systems that grow local businesses in Walker County, AL.',
  metadataBase: new URL('https://samcolecreative.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#1a3557]">{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Create (marketing) layout with Nav + Footer stubs**

```tsx
// src/app/(marketing)/layout.tsx
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Create stub Nav**

```bash
mkdir -p /Users/samueldempsey/Desktop/sc-creative/src/components/layout
```

```tsx
// src/components/layout/Nav.tsx
export default function Nav() {
  return <nav className="bg-[#0d1f35] h-[68px] sticky top-0 z-50" />
}
```

- [ ] **Step 4: Create stub Footer**

```tsx
// src/components/layout/Footer.tsx
export default function Footer() {
  return <footer className="bg-[#0d1f35] py-12" />
}
```

- [ ] **Step 5: Create (marketing) homepage stub**

```tsx
// src/app/(marketing)/page.tsx
export default function HomePage() {
  return <div />
}
```

- [ ] **Step 6: Delete the default app/page.tsx that conflicts**

```bash
rm /Users/samueldempsey/Desktop/sc-creative/src/app/page.tsx
```

- [ ] **Step 7: Build check**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npm run build 2>&1 | tail -10
```

Expected: compiles without errors

- [ ] **Step 8: Commit**

```bash
git add src/app/layout.tsx src/app/(marketing)/ src/components/layout/
git commit -m "feat: root layout, marketing route group, Nav/Footer stubs"
```

---

## Task 8: Nav component

**Files:**
- Modify: `src/components/layout/Nav.tsx`
- Create: `src/__tests__/components/Nav.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/__tests__/components/Nav.test.tsx
import { render, screen } from '@testing-library/react'
import Nav from '@/components/layout/Nav'

describe('Nav', () => {
  it('renders the SC Creative logo link', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /sc creative/i })).toBeInTheDocument()
  })

  it('renders the Get My Quote CTA', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /get my quote/i })).toBeInTheDocument()
  })

  it('renders main nav links', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /work/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /insights/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to confirm it fails**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npm test -- src/__tests__/components/Nav.test.tsx 2>&1 | tail -10
```

Expected: FAIL

- [ ] **Step 3: Implement Nav**

```tsx
// src/components/layout/Nav.tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'

const services = [
  { label: 'Brand Blueprint', href: '/services/brand-blueprint' },
  { label: 'Visual Branding', href: '/services/visual-branding' },
  { label: 'Website Design', href: '/services/website-design' },
  { label: 'AI Systems', href: '/services/ai-systems' },
  { label: 'Growth', href: '/services/growth' },
]

const industries = [
  { label: 'Home & Trade Services', href: '/industries/home-trade' },
  { label: 'Medical & Dental', href: '/industries/medical-dental' },
  { label: 'Legal & Professional', href: '/industries/legal-professional' },
  { label: 'Construction & Contractors', href: '/industries/construction' },
  { label: 'Financial & Accounting', href: '/industries/financial' },
  { label: 'Automotive', href: '/industries/automotive' },
  { label: 'Senior Care & Wellness', href: '/industries/senior-care' },
  { label: 'Real Estate', href: '/industries/real-estate' },
]

const serviceAreas = [
  { label: 'Walker County', href: '/service-area' },
  { label: 'Jasper', href: '/service-area/jasper' },
  { label: 'Cordova', href: '/service-area/cordova' },
  { label: 'Sumiton', href: '/service-area/sumiton' },
  { label: 'Dora', href: '/service-area/dora' },
  { label: 'Parrish', href: '/service-area/parrish' },
  { label: 'Carbon Hill', href: '/service-area/carbon-hill' },
  { label: 'Oakman', href: '/service-area/oakman' },
]

function Dropdown({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="text-white/75 hover:text-white text-sm font-medium flex items-center gap-1 py-1">
        {label} <span className="text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 bg-[#0d1f35] border border-white/10 rounded-lg py-2 min-w-[220px] shadow-xl z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-white/75 hover:text-white hover:bg-white/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Nav() {
  return (
    <nav className="bg-[#0d1f35] sticky top-0 z-50 border-b border-white/[0.06]">
      <div className="max-w-[1240px] mx-auto px-[60px] flex items-center h-[68px] gap-8">
        <Link href="/" className="font-extrabold text-white text-sm tracking-widest uppercase" aria-label="SC Creative">
          SC Creative
        </Link>
        <div className="flex items-center gap-6 flex-1">
          <Link href="/work" className="text-white/75 hover:text-white text-sm font-medium">Work</Link>
          <Dropdown label="Services" items={services} />
          <Dropdown label="Industries" items={industries} />
          <Dropdown label="Service Area" items={serviceAreas} />
          <Link href="/about" className="text-white/75 hover:text-white text-sm font-medium">About</Link>
          <Link href="/insights" className="text-white/75 hover:text-white text-sm font-medium">Insights</Link>
        </div>
        <Link
          href="/quote"
          className="ml-auto bg-[#00b5a5] text-white text-[13px] font-bold px-[22px] py-[9px] rounded-[5px] hover:opacity-90 transition-opacity"
        >
          Get My Quote →
        </Link>
      </div>
    </nav>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npm test -- src/__tests__/components/Nav.test.tsx
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Nav.tsx src/__tests__/components/Nav.test.tsx
git commit -m "feat: Nav component with dropdowns"
```

---

## Task 9: Footer component

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Implement Footer**

```tsx
// src/components/layout/Footer.tsx
import Link from 'next/link'

const serviceLinks = [
  { label: 'Brand Blueprint', href: '/services/brand-blueprint' },
  { label: 'Visual Branding', href: '/services/visual-branding' },
  { label: 'Website Design', href: '/services/website-design' },
  { label: 'AI Systems', href: '/services/ai-systems' },
  { label: 'Growth', href: '/services/growth' },
]

const companyLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Our Process', href: '/process' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
  { label: 'Get My Quote', href: '/quote' },
]

const cities = ['Jasper', 'Cordova', 'Sumiton', 'Dora', 'Parrish', 'Carbon Hill', 'Oakman']

export default function Footer() {
  return (
    <footer className="bg-[#0d1f35] text-white pt-16 pb-8">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="grid grid-cols-4 gap-12 mb-12">
          <div>
            <div className="font-extrabold text-sm tracking-widest uppercase mb-3">SC Creative</div>
            <p className="text-white/50 text-sm leading-relaxed">
              Walker County&apos;s growth partner. Brand, website, AI, and local SEO — built as one system.
            </p>
            <div className="text-white/40 text-xs mt-4">Based in Cordova, AL</div>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-[.1em] uppercase text-white/40 mb-3">Services</div>
            <ul className="space-y-2">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-white text-sm transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-[.1em] uppercase text-white/40 mb-3">Company</div>
            <ul className="space-y-2">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-white text-sm transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-[.1em] uppercase text-white/40 mb-3">Service Area</div>
            <ul className="space-y-2">
              {cities.map((city) => (
                <li key={city}>
                  <Link href={`/service-area/${city.toLowerCase().replace(' ', '-')}`} className="text-white/60 hover:text-white text-sm transition-colors">{city}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex items-center justify-between text-white/30 text-xs">
          <span>© {new Date().getFullYear()} SC Creative. All rights reserved.</span>
          <span>Walker County, Alabama</span>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: Footer component with nav links and service areas"
```

---

## Task 10: Hero section

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Create: `src/components/sections/HeroDemo.tsx` (client — animated panels)

- [ ] **Step 1: Create sections directory**

```bash
mkdir -p /Users/samueldempsey/Desktop/sc-creative/src/components/sections
```

- [ ] **Step 2: Write test**

```tsx
// src/__tests__/sections/Hero.test.tsx
import { render, screen } from '@testing-library/react'
import Hero from '@/components/sections/Hero'

describe('Hero', () => {
  it('renders the headline', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { name: /we build the digital/i })).toBeInTheDocument()
  })

  it('renders the Get My Quote button', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /get my custom quote/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run to confirm it fails**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npm test -- src/__tests__/sections/Hero.test.tsx 2>&1 | tail -5
```

Expected: FAIL

- [ ] **Step 4: Create HeroDemo (animated 5-panel client component)**

```tsx
// src/components/sections/HeroDemo.tsx
'use client'
import { useEffect, useRef, useState } from 'react'

const TABS = ['Blueprint', 'Branding', 'Website', 'AI Leads', 'Growth']
const TAB_DURATION = 4000

export default function HeroDemo() {
  const [active, setActive] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function goTo(i: number) {
    setActive(i)
    if (progressRef.current) {
      progressRef.current.style.transition = 'none'
      progressRef.current.style.width = '0%'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (progressRef.current) {
            progressRef.current.style.transition = `width ${TAB_DURATION}ms linear`
            progressRef.current.style.width = '100%'
          }
        })
      })
    }
  }

  useEffect(() => {
    goTo(0)
    const tick = () => {
      setActive((prev) => {
        const next = (prev + 1) % TABS.length
        goTo(next)
        return next
      })
    }
    timerRef.current = setInterval(tick, TAB_DURATION)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1.5 mb-3">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => { if (timerRef.current) clearInterval(timerRef.current); goTo(i) }}
            className={`text-[10px] font-bold tracking-[.08em] uppercase px-3 py-1.5 rounded-full border transition-all ${
              active === i
                ? 'bg-[#00b5a5] text-white border-[#00b5a5]'
                : 'text-white/40 border-white/20 hover:text-white/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="relative w-full h-[320px] rounded-[14px] bg-[#071829] border border-white/10 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,.65)]">
        {/* Panel 1: Brand Blueprint */}
        <div className={`absolute inset-0 p-4 transition-opacity duration-500 ${active === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white h-full rounded-lg overflow-hidden flex flex-col">
            <div className="bg-gradient-to-br from-[#1a3557] to-[#0d2a40] p-3 rounded-t-lg">
              <div className="text-[9px] font-bold tracking-widest uppercase text-[#00b5a5] mb-1">Brand Blueprint</div>
              <div className="text-[13px] font-extrabold text-white">Walker County HVAC</div>
              <div className="text-[10px] text-white/50">Generated just now</div>
            </div>
            <div className="p-4 flex-1 space-y-3">
              {['Executive Summary', 'Target Market Analysis', 'Brand Messaging', 'Sales Toolkit', 'Implementation Guide'].map((item, i) => (
                <div key={item} className="flex items-center gap-2 text-[11px] text-gray-600 border-b border-gray-100 pb-2">
                  <span className="text-[#00b5a5] font-bold">✓</span>
                  {item}
                  <span className="ml-auto text-[10px] text-[#00b5a5] font-bold">{i < 3 ? 'Done' : 'Ready'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2: Visual Branding */}
        <div className={`absolute inset-0 p-4 transition-opacity duration-500 ${active === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white h-full rounded-lg overflow-hidden grid grid-cols-2">
            <div className="bg-[#e8f0f8] flex flex-col items-center justify-center p-4 border-r border-gray-200">
              <svg viewBox="0 0 90 80" className="w-16 h-14 mb-2">
                <polygon points="0,2 36,2 50,40 14,40" fill="#1a5f8a"/>
                <polygon points="54,2 90,2 76,40 40,40" fill="#00b5a5"/>
                <polygon points="14,40 50,40 36,78 0,78" fill="#c8921a"/>
                <polygon points="40,40 76,40 90,78 54,78" fill="#1a3557"/>
              </svg>
              <div className="text-[10px] font-extrabold tracking-widest uppercase text-[#1a3557]">Cedar Vale</div>
              <div className="text-[7px] tracking-widest uppercase text-[#1a3557]/50 mt-1">Builders</div>
              <div className="flex gap-1.5 mt-3">
                {['#1a3557','#00b5a5','#c8921a'].map((c) => (
                  <div key={c} className="w-5 h-5 rounded-full" style={{ background: c }} />
                ))}
              </div>
            </div>
            <div className="p-3 flex flex-col justify-center">
              <div className="text-[7px] font-bold tracking-widest uppercase text-gray-300 mb-1">Typography</div>
              <div className="text-[40px] font-extrabold text-[#1a3557] leading-none">Aa</div>
              <div className="text-[8px] text-gray-400 mt-1 mb-3">Montserrat · Bold / Regular</div>
              <div className="text-[11px] font-extrabold text-[#1a3557] mb-1">Building Excellence</div>
              <div className="text-[9px] text-gray-400 leading-relaxed">Residential · Commercial · Est. 2011</div>
              <div className="mt-3 bg-[#f0fdfb] border border-[#00b5a5] rounded px-2 py-1 text-[9px] font-bold text-[#00b5a5] text-center">✓ Brand Identity Complete</div>
            </div>
          </div>
        </div>

        {/* Panel 3: Website */}
        <div className={`absolute inset-0 flex flex-col p-4 transition-opacity duration-500 ${active === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white h-full rounded-lg overflow-hidden p-4 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#00b5a5]">Website Launch</span>
              <span className="text-[10px] text-gray-400 font-mono">smithhvac.com</span>
            </div>
            {[
              { icon: '🎨', label: 'Design Complete', score: 'Complete' },
              { icon: '📱', label: 'Mobile Optimized', score: 'Complete' },
              { icon: '⚡', label: 'PageSpeed Score', score: '98/100' },
              { icon: '🔐', label: 'SSL Certificate', score: 'Secured' },
              { icon: '🗺️', label: 'Sitemap Submitted', score: 'Active' },
            ].map(({ icon, label, score }) => (
              <div key={label} className="flex items-center gap-2 py-2 border-b border-gray-100 text-[11px] text-gray-700">
                <span>{icon}</span>
                <span className="flex-1">{label}</span>
                <span className="text-[#00b5a5] font-bold text-[10px]">✓ {score}</span>
              </div>
            ))}
            <div className="mt-auto flex items-center gap-2 bg-[rgba(0,181,165,.1)] border border-[rgba(0,181,165,.3)] rounded p-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-[#00897f]">Site is Live</span>
            </div>
          </div>
        </div>

        {/* Panel 4: AI Leads */}
        <div className={`absolute inset-0 grid grid-cols-[56%_44%] transition-opacity duration-500 ${active === 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white p-3 border-r border-gray-100 flex flex-col gap-1 overflow-hidden">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[9px] font-bold tracking-widest uppercase text-[#00b5a5]">AI Chat Active</span>
            </div>
            {[
              { type: 'user', text: 'Hey, need HVAC service in Jasper' },
              { type: 'ai', text: 'Happy to help! Is this repair or a new install?' },
              { type: 'user', text: 'AC replacement — 2,400 sqft home' },
              { type: 'ai', text: "Perfect. Can I get your name to prep a quote?" },
            ].map((m, i) => (
              <div key={i} className={`text-[9px] px-2 py-1.5 rounded-lg max-w-[90%] leading-snug ${m.type === 'user' ? 'bg-[rgba(0,181,165,.1)] border border-[rgba(0,181,165,.3)] text-[#006b62] ml-auto' : 'bg-[#eef2f7] text-gray-700'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="bg-[#f8fafc] p-3 flex flex-col gap-2">
            <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 pb-1 border-b border-gray-200">Lead Captured</div>
            {[['Name', 'David Park'], ['City', 'Jasper, AL'], ['Job', 'AC Replacement']].map(([k, v]) => (
              <div key={k}>
                <div className="text-[8px] uppercase tracking-wider text-gray-400">{k}</div>
                <div className="text-[10px] font-semibold text-[#1a3557]">{v}</div>
              </div>
            ))}
            <div className="bg-[rgba(0,181,165,.1)] border border-[rgba(0,181,165,.3)] rounded p-2 mt-1">
              <div className="text-[8px] text-[#00b5a5] uppercase tracking-wider mb-1">Score</div>
              <div className="text-[20px] font-extrabold text-[#00b5a5] leading-none">94 <span className="text-[8px] font-bold bg-red-100 text-red-600 border border-red-200 rounded px-1">🔥 Hot</span></div>
            </div>
          </div>
        </div>

        {/* Panel 5: Growth */}
        <div className={`absolute inset-0 bg-[#f5f7fa] p-4 transition-opacity duration-500 ${active === 4 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[['↑147%', 'Organic Traffic'], ['23', 'Leads / Month'], ['4.9★', 'Google Rating'], ['#1', 'Local Rank']].map(([val, label]) => (
              <div key={label} className="bg-white border border-[#e0ecf4] rounded-lg p-2 text-center">
                <div className="text-[20px] font-extrabold text-[#00b5a5] leading-none">{val}</div>
                <div className="text-[8px] text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
          <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 mb-2">Live Leads</div>
          <div className="space-y-1.5">
            {[['David P. — Jasper · AC Replacement', 'just now'], ['Lisa K. — Cordova · Kitchen Remodel', '2m ago'], ['Sunrise Homes — Commercial Build', '5m ago']].map(([info, time]) => (
              <div key={info} className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                <span className="text-[9px] text-gray-700 flex-1">{info}</span>
                <span className="text-[8px] text-gray-400">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-white/10 rounded-full mt-2 overflow-hidden">
        <div ref={progressRef} className="h-full bg-[#00b5a5] rounded-full w-0" />
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create Hero**

```tsx
// src/components/sections/Hero.tsx
import Link from 'next/link'
import HeroDemo from './HeroDemo'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#0b1e35] via-[#112b4e] to-[#0d2a40] pt-[100px] pb-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px] grid grid-cols-[0.9fr_1.1fr] gap-12 items-center">
        <div>
          <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3.5">
            Walker County&apos;s Growth Partner
          </div>
          <h1 className="text-[clamp(28px,3vw,44px)] font-extrabold text-white leading-[1.2] mb-4">
            We Build the Digital<br />Systems That Grow<br />Local Businesses
          </h1>
          <p className="text-[15px] text-white/60 leading-[1.65] mb-8 max-w-[400px]">
            Brand, website, AI systems, and local SEO — built as one integrated system for established Walker County businesses ready to dominate their market.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/quote" className="bg-[#00b5a5] text-white text-sm font-bold px-7 py-3 rounded-[5px] hover:opacity-90 transition-opacity">
              Get My Custom Quote →
            </Link>
            <Link href="/work" className="border border-white/30 text-white/80 text-sm font-medium px-6 py-3 rounded-[5px] hover:border-white/60 hover:text-white transition-all">
              See Our Work
            </Link>
          </div>
        </div>
        <HeroDemo />
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Run tests**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npm test -- src/__tests__/sections/Hero.test.tsx
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/sections/HeroDemo.tsx src/__tests__/sections/Hero.test.tsx
git commit -m "feat: Hero section with animated 5-panel demo"
```

---

## Task 11: Systems section (interactive slider)

**Files:**
- Create: `src/components/sections/Systems.tsx`

- [ ] **Step 1: Create Systems (client component)**

```tsx
// src/components/sections/Systems.tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'

const MAX_HRS = 20

function getMetrics(hrs: number) {
  const bizPct = Math.round(100 - hrs * 3.5)
  const mktPct = Math.round(hrs * 5)
  const callout =
    hrs === 0
      ? 'Drag the slider to see where your time really goes.'
      : hrs < 5
      ? `${hrs} hours a week on marketing barely moves the needle — and pulls you away from the work that pays.`
      : hrs < 10
      ? `${hrs} hours is real effort. But without a system, it’s inconsistent and hard to scale.`
      : `${hrs} hours a week on marketing is a serious commitment — is it producing serious results?`
  return { bizPct, mktPct, callout }
}

export default function Systems() {
  const [hrs, setHrs] = useState(0)
  const { bizPct, mktPct, callout } = getMetrics(hrs)

  return (
    <section id="systems" className="bg-[#f5f3ef] py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-center max-w-[900px] mx-auto mb-16">
          <div className="text-[11px] font-bold tracking-[.14em] uppercase text-[#00b5a5] mb-4">The Real Cost</div>
          <h2 className="text-[clamp(28px,2.8vw,42px)] font-extrabold text-[#1a3557] leading-[1.2] mb-4">
            Stop Trading Time for <span className="text-[#00b5a5]">Inconsistent Results</span>
          </h2>
          <p className="text-[16px] text-[#5a6e84] leading-[1.7]">
            Most local business owners try to handle marketing themselves. See what that actually costs — then see what a system changes.
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(26,53,87,.08)]">
          {/* Left: DIY panel */}
          <div className="p-10">
            <div className="text-[10px] font-bold tracking-[.14em] uppercase text-[#a0aec0] mb-7">Without SC Creative</div>

            <div className="mb-8">
              <div className="text-[13px] text-[#4a5568] mb-3 font-medium">Hours spent on marketing per week:</div>
              <input
                type="range"
                min={0}
                max={MAX_HRS}
                value={hrs}
                onChange={(e) => setHrs(Number(e.target.value))}
                className="w-full h-1 rounded-full bg-[#e2e8f0] outline-none cursor-pointer accent-[#00b5a5]"
              />
              <div className="text-[13px] text-[#a0aec0] mt-2.5">
                <span className="text-[22px] font-extrabold text-[#1a3557]">{hrs}</span> hrs / week
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <div className="text-[12px] text-[#718096] font-medium mb-2">Time on core business</div>
                <div className="h-2 bg-[#edf2f7] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#e05c5c] to-[#f08040] transition-all duration-300" style={{ width: `${bizPct}%` }} />
                </div>
                <div className="flex justify-end mt-1.5">
                  <span className="text-[12px] font-bold text-[#a0aec0]">{bizPct}%</span>
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[#718096] font-medium mb-2">Time on marketing</div>
                <div className="h-2 bg-[#edf2f7] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#cbd5e0] transition-all duration-300" style={{ width: `${mktPct}%` }} />
                </div>
                <div className="flex justify-end mt-1.5">
                  <span className="text-[12px] font-bold text-[#a0aec0]">{mktPct}%</span>
                </div>
              </div>
            </div>

            <div className={`mt-7 p-4 rounded-lg text-[13px] leading-relaxed min-h-[64px] transition-all border-l-[3px] ${hrs > 0 ? 'bg-[#f7fafc] border-[#e05c5c] text-[#4a5568]' : 'bg-[#f7fafc] border-[#e2e8f0] text-[#a0aec0]'}`}>
              {callout}
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-[#e2e8f0] flex items-center justify-center">
            <span className="bg-white border border-[#e2e8f0] text-[#a0aec0] text-[10px] font-bold tracking-widest px-3 py-2 rounded-full">OR</span>
          </div>

          {/* Right: SC Creative panel */}
          <div className="p-10">
            <div className="text-[10px] font-bold tracking-[.14em] uppercase text-[#00b5a5] mb-7">With SC Creative</div>

            <div className="flex flex-col gap-5 mb-7">
              <div>
                <div className="text-[12px] text-[#718096] font-medium mb-2">Time on core business</div>
                <div className="h-2 bg-[#edf2f7] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#00b5a5] to-[#00d4c0]" style={{ width: '95%' }} />
                </div>
                <div className="flex justify-end mt-1.5">
                  <span className="text-[12px] font-bold text-[#00b5a5]">95%</span>
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[#718096] font-medium mb-2">Marketing (handled for you)</div>
                <div className="h-2 bg-[#edf2f7] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#00b5a5] to-[#00d4c0]" style={{ width: '100%' }} />
                </div>
                <div className="flex justify-end mt-1.5">
                  <span className="text-[12px] font-bold text-[#00b5a5]">100%</span>
                </div>
              </div>
            </div>

            <div className="text-[13px] text-[#5a6e84] leading-relaxed p-4 bg-[rgba(0,181,165,.06)] rounded-lg border-l-[3px] border-[#00b5a5] mb-7">
              Your brand, website, AI, and SEO run as one integrated system — while you focus entirely on doing the work you&apos;re great at.
            </div>

            <Link
              href="/quote"
              className="inline-block bg-[#00b5a5] text-white text-[13px] font-bold px-6 py-3 rounded-md hover:bg-[#009d8f] transition-colors tracking-[.04em]"
            >
              Get My Custom Quote →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Systems.tsx
git commit -m "feat: Systems section with interactive marketing slider"
```

---

## Task 12: Process, Problem, Services sections (static)

**Files:**
- Create: `src/components/sections/Process.tsx`
- Create: `src/components/sections/Problem.tsx`
- Create: `src/components/sections/Services.tsx`

- [ ] **Step 1: Create Process**

```tsx
// src/components/sections/Process.tsx
const steps = [
  { num: '01', name: 'Brand Blueprint', desc: 'Strategy & messaging foundation' },
  { num: '02', name: 'Visual Branding', desc: 'Logo, identity & usage system' },
  { num: '03', name: 'Website', desc: 'Performance-built, converting site' },
  { num: '04', name: 'AI Systems', desc: 'Automation & smart tools' },
  { num: '05', name: 'Growth', desc: 'SEO · GBP · Ads · Backlinking' },
]

export default function Process() {
  return (
    <section id="process" className="bg-[#0d1f35] py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">How We Work</div>
        <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-white leading-[1.2] mb-4">The SC Creative Process</h2>
        <p className="text-[15px] text-white/55 leading-[1.7] max-w-[520px] mb-12">
          Five integrated stages that build on each other — from brand clarity to measurable growth.
        </p>
        <div className="grid grid-cols-5 gap-4">
          {steps.map((s) => (
            <div key={s.num} className="bg-white/5 border border-white/[0.08] rounded-[10px] p-5 text-center hover:border-[rgba(0,181,165,.5)] transition-colors">
              <div className="text-[28px] font-extrabold text-[#00b5a5] leading-none mb-2">{s.num}</div>
              <div className="text-[12px] font-bold text-white mb-1">{s.name}</div>
              <div className="text-[10px] text-white/45 leading-[1.5]">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create Problem**

```tsx
// src/components/sections/Problem.tsx
const problems = [
  { icon: '🌐', title: 'Scattered Marketing', desc: 'Disconnected tools that don\'t talk to each other or tell a consistent story.' },
  { icon: '👻', title: 'Invisible Online', desc: 'Competitors showing up first on Google while you\'re nowhere to be found.' },
  { icon: '📉', title: 'Outdated Brand', desc: 'A logo and website that no longer reflect how good you actually are.' },
  { icon: '⏰', title: 'No Time to Fix It', desc: 'You\'re running the business — there\'s no bandwidth to solve the marketing too.' },
]

const solutions = [
  { icon: '🎯', title: 'One Integrated System', desc: 'Every piece built together — brand, site, AI, and growth working as one.' },
  { icon: '📍', title: 'Local-First SEO', desc: 'We know Walker County and build search strategies that win locally.' },
  { icon: '✨', title: 'Premium Brand Identity', desc: 'A complete brand system that positions you as the clear market leader.' },
  { icon: '🤖', title: 'AI That Works for You', desc: 'Systems that follow up, qualify, and convert leads while you sleep.' },
]

export default function Problem() {
  return (
    <section id="problem" className="bg-white py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-center mb-12">
          <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">The Problem We Solve</div>
          <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-[#1a3557] leading-[1.2]">
            Most Local Businesses Leave Growth on the Table
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-4">
            {problems.map((p) => (
              <div key={p.title} className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-base flex-shrink-0">{p.icon}</div>
                <div>
                  <h4 className="text-sm font-bold text-[#1a3557] mb-1">{p.title}</h4>
                  <p className="text-[13px] text-[#666] leading-[1.5]">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[12px] font-bold tracking-[.1em] uppercase text-[#00b5a5] mb-4">The SC Creative Solution</div>
            <div className="flex flex-col gap-4">
              {solutions.map((s) => (
                <div key={s.title} className="flex gap-3.5 items-start">
                  <div className="w-9 h-9 rounded-lg bg-[#f0fdfb] flex items-center justify-center text-base flex-shrink-0">{s.icon}</div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1a3557] mb-1">{s.title}</h4>
                    <p className="text-[13px] text-[#666] leading-[1.5]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create Services**

```tsx
// src/components/sections/Services.tsx
import Link from 'next/link'

const services = [
  {
    num: '01', slug: 'brand-blueprint', name: 'Strategy & Messaging', desc: 'We start every engagement by building the strategic foundation — target market, voice, positioning, and messaging that makes everything else work harder.',
    tags: ['Brand Strategy', 'Messaging', 'Positioning'], featured: false,
    visual: <div className="bg-[rgba(0,181,165,.1)] border border-[rgba(0,181,165,.3)] rounded-lg p-4 w-full"><div className="text-[9px] font-bold text-[#00b5a5] tracking-widest mb-2">BRAND BLUEPRINT</div><div className="space-y-1.5"><div className="h-1 bg-[rgba(0,181,165,.5)] rounded-full w-[70%]"/><div className="h-1 bg-white/15 rounded-full w-[90%]"/><div className="h-1 bg-white/15 rounded-full w-[55%]"/></div></div>,
  },
  {
    num: '02', slug: 'visual-branding', name: 'Logo & Brand Identity', desc: 'A complete visual identity system — logo, color palette, typography, and brand guidelines — built to position you as the premium option in your market.',
    tags: ['Logo Design', 'Identity System', 'Brand Guide'], featured: false,
    visual: <div className="text-center"><svg viewBox="0 0 90 80" className="w-16 h-14 mx-auto mb-2"><polygon points="0,2 36,2 50,40 14,40" fill="#1a5f8a"/><polygon points="54,2 90,2 76,40 40,40" fill="#00b5a5"/><polygon points="14,40 50,40 36,78 0,78" fill="#c8921a"/><polygon points="40,40 76,40 90,78 54,78" fill="#1a3557"/></svg><div className="text-[11px] font-extrabold tracking-widest uppercase text-white">SC Creative</div></div>,
  },
  {
    num: '03', slug: 'website-design', name: 'Performance Websites That Convert', desc: 'Fast, responsive, and built to generate leads — not just look good. Every site we build is engineered to rank, convert, and represent your brand at its best.',
    tags: ['Web Design', 'Development', 'CRO', 'Mobile-First'], featured: true,
    visual: null,
  },
  {
    num: '04', slug: 'ai-systems', name: 'Automation & Smart Tools', desc: 'Custom AI systems that handle lead intake, follow-up, and qualification — so you\'re responsive 24/7 without adding headcount.',
    tags: ['Lead Automation', 'AI Chat', 'CRM Integration'], featured: false,
    visual: <div className="bg-[#111827] rounded p-2.5 h-full overflow-hidden"><div className="text-[8px] font-bold text-[#00b5a5] tracking-widest mb-2">AI LEAD SYSTEM</div><div className="text-[8px] bg-[#1e293b] rounded px-2 py-1.5 text-white/70 mb-1.5">New inquiry from Jasper, AL…</div><div className="text-[8px] bg-[rgba(0,181,165,.12)] border border-[rgba(0,181,165,.3)] rounded px-2 py-1.5 text-[#4dd6c9]">Routing to sequence #3. Follow-up queued.</div></div>,
  },
  {
    num: '05', slug: 'growth', name: 'SEO, GBP & Local Ads', desc: 'Comprehensive local growth — Google Business Profile optimization, SEO, targeted ads, and backlinking — all focused on ranking #1 in Walker County.',
    tags: ['Local SEO', 'Google Ads', 'GBP', 'Backlinking'], featured: false,
    visual: <div className="flex gap-6 items-center justify-center">{[['↑147%','Organic Traffic'],['4.9★','Google Rating'],['#1','Local Rank']].map(([v,l],i) => <div key={l} className="text-center">{i>0&&<div className="absolute -left-3 top-1/2 -translate-y-1/2 w-px h-10 bg-white/15"/>}<div className="text-[24px] font-extrabold text-[#00b5a5]">{v}</div><div className="text-[8px] text-white/50">{l}</div></div>)}</div>,
  },
]

export default function Services() {
  return (
    <section id="services" className="bg-[#f5f3ef] py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">What We Build</div>
        <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-[#1a3557] leading-[1.2] mb-3">Five Services. One Cohesive System.</h2>
        <p className="text-[15px] text-[#666] leading-[1.7] mb-10">Each service is designed to integrate with the others — so your brand, site, and marketing amplify each other.</p>
        <div className="grid grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.slug} className={`bg-white rounded-xl overflow-hidden border border-[#ece8e2] ${s.featured ? 'col-span-2' : ''}`}>
              <div className={`relative overflow-hidden ${s.featured ? 'h-[220px]' : 'h-[180px]'} bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center p-5`}>
                {s.visual}
              </div>
              <div className="p-5">
                <div className="text-[10px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-1.5">{s.num} — {s.slug.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
                <div className="text-[17px] font-extrabold text-[#1a3557] mb-1.5">{s.name}</div>
                <p className="text-[13px] text-[#666] leading-[1.6] mb-3.5">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map((t) => <span key={t} className="text-[10px] font-semibold bg-[#f0fdfb] text-[#00b5a5] px-2.5 py-1 rounded-full border border-[#c8f5f0]">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Process.tsx src/components/sections/Problem.tsx src/components/sections/Services.tsx
git commit -m "feat: Process, Problem, and Services sections"
```

---

## Task 13: Industries, Work, Testimonials sections (data-driven)

**Files:**
- Create: `src/components/sections/Industries.tsx`
- Create: `src/components/sections/Work.tsx`
- Create: `src/components/sections/Testimonials.tsx`

- [ ] **Step 1: Create Industries (server component — links to dynamic pages)**

```tsx
// src/components/sections/Industries.tsx
import Link from 'next/link'

const industries = [
  { icon: '🔧', name: 'Home & Trade', desc: 'HVAC, Plumbing, Electrical', slug: 'home-trade' },
  { icon: '🩺', name: 'Medical & Dental', desc: 'Clinics & practices', slug: 'medical-dental' },
  { icon: '⚖️', name: 'Legal & Professional', desc: 'Attorneys & consultants', slug: 'legal-professional' },
  { icon: '🏗️', name: 'Construction', desc: 'Contractors & builders', slug: 'construction' },
  { icon: '💰', name: 'Financial', desc: 'Accountants & advisors', slug: 'financial' },
  { icon: '🚗', name: 'Automotive', desc: 'Dealers & service shops', slug: 'automotive' },
  { icon: '🏠', name: 'Senior Care', desc: 'Care homes & wellness', slug: 'senior-care' },
  { icon: '🏢', name: 'Real Estate', desc: 'Agents & developers', slug: 'real-estate' },
]

export default function Industries() {
  return (
    <section id="industries" className="bg-white py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">Who We Work With</div>
        <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-[#1a3557] leading-[1.2] mb-10">
          Built for Established Walker County Businesses
        </h2>
        <div className="grid grid-cols-4 gap-3.5">
          {industries.map((ind) => (
            <Link
              key={ind.slug}
              href={`/industries/${ind.slug}`}
              className="bg-[#f8f7f5] border border-[#e8e4de] rounded-[10px] p-5 text-center hover:border-[#00b5a5] hover:bg-[#f0fdfb] transition-all"
            >
              <div className="text-2xl mb-2">{ind.icon}</div>
              <div className="text-[13px] font-bold text-[#1a3557] mb-0.5">{ind.name}</div>
              <div className="text-[11px] text-[#888]">{ind.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create Work (server component — fetches from Supabase)**

```tsx
// src/components/sections/Work.tsx
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export default async function Work() {
  const supabase = await createSupabaseServerClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, slug, client, services, cover_image')
    .eq('status', 'published')
    .order('sort_order')
    .limit(3)

  const items = projects ?? []

  return (
    <section id="work" className="bg-[#0d1f35] py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">Featured Work</div>
        <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-white leading-[1.2] mb-10">
          Real Results for Real Businesses
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {items.length > 0
            ? items.map((p) => (
                <Link
                  key={p.id}
                  href={`/work/${p.slug}`}
                  className="bg-white/5 border border-white/[0.08] rounded-xl overflow-hidden hover:border-[rgba(0,181,165,.4)] transition-colors"
                >
                  <div className="h-[140px] bg-gradient-to-br from-[#1a3a5c] to-[#0d2a40] flex items-center justify-center">
                    {p.cover_image
                      ? <img src={p.cover_image} alt={p.client ?? p.title} className="w-full h-full object-cover" />
                      : <div className="w-[80%] h-[60%] bg-white/5 rounded" />
                    }
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-bold text-white mb-1">{p.client ?? p.title}</div>
                    <div className="text-[11px] text-white/40">{p.services.join(' · ')}</div>
                  </div>
                </Link>
              ))
            : /* placeholder cards when no projects exist yet */
              [
                { client: 'Ascon Paving', tags: 'Website · Branding · SEO' },
                { client: 'Smith Lake Family Care', tags: 'Website · Local SEO · GBP' },
              ].map((p) => (
                <div key={p.client} className="bg-white/5 border border-white/[0.08] rounded-xl overflow-hidden">
                  <div className="h-[140px] bg-gradient-to-br from-[#1a3a5c] to-[#0d2a40]" />
                  <div className="p-4">
                    <div className="text-sm font-bold text-white mb-1">{p.client}</div>
                    <div className="text-[11px] text-white/40">{p.tags}</div>
                  </div>
                </div>
              ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/work" className="text-sm font-bold text-[#00b5a5] hover:underline">View Full Portfolio →</Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create Testimonials (server component)**

```tsx
// src/components/sections/Testimonials.tsx
import { createSupabaseServerClient } from '@/lib/supabase-server'

export default async function Testimonials() {
  const supabase = await createSupabaseServerClient()
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('id, author, company, quote')
    .eq('visible', true)
    .order('sort_order')

  const items = testimonials ?? []

  const fallback = [
    { id: '1', author: 'Client Name', company: 'Industry · Walker County', quote: 'Working with Sam completely transformed our online presence. We went from invisible on Google to getting consistent leads every week — and our brand finally looks as professional as our work.' },
    { id: '2', author: 'Client Name', company: 'Industry · Walker County', quote: 'Our leads doubled within 3 months of the new site going live. The whole process was easy, fast, and the results have been beyond what we expected.' },
  ]

  const display = items.length > 0 ? items : fallback

  return (
    <section id="testimonials" className="bg-[#f5f3ef] py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">What Clients Say</div>
        <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-[#1a3557] leading-[1.2] mb-10">
          Walker County Businesses Trust SC Creative
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {display.map((t) => (
            <div key={t.id} className="bg-white rounded-xl p-7 border-l-4 border-[#00b5a5] shadow-[0_2px_12px_rgba(0,0,0,.06)]">
              <p className="text-[15px] text-[#444] leading-[1.7] mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="text-[12px] font-bold text-[#00b5a5]">— {t.author}{t.company ? `, ${t.company}` : ''}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Industries.tsx src/components/sections/Work.tsx src/components/sections/Testimonials.tsx
git commit -m "feat: Industries, Work, and Testimonials sections"
```

---

## Task 14: About and CTA sections

**Files:**
- Create: `src/components/sections/About.tsx`
- Create: `src/components/sections/CTA.tsx`

- [ ] **Step 1: Create About**

```tsx
// src/components/sections/About.tsx
const facts = [
  { icon: '📍', text: 'Based in Cordova, AL — Walker County native' },
  { icon: '🏆', text: '13+ years of digital marketing & brand strategy' },
  { icon: '🤝', text: '100+ projects delivered across Walker County' },
]

export default function About() {
  return (
    <section id="about" className="bg-white py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="grid grid-cols-[280px_1fr] gap-16 items-center">
          <div className="bg-[#e8f0f8] rounded-2xl aspect-square flex items-center justify-center text-7xl">
            👤
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">Meet Sam Cole</div>
            <h2 className="text-[clamp(24px,2.5vw,36px)] font-extrabold text-[#1a3557] leading-[1.2] mb-5">
              Not a Big Agency.<br />A Focused System Built for Walker County.
            </h2>
            <p className="text-[15px] text-[#555] leading-[1.7] mb-4">
              I&apos;ve been helping established local businesses grow for 13+ years. Based right here in Cordova, AL — I know this market, I know these businesses, and I know what it takes to stand out.
            </p>
            <p className="text-[15px] text-[#555] leading-[1.7] mb-8">
              When you work with SC Creative, you&apos;re working directly with me — not a junior designer or an account manager. Every strategy, every design decision, every system is built with your specific goals in mind.
            </p>
            <div className="flex flex-col gap-3">
              {facts.map((f) => (
                <div key={f.text} className="flex items-center gap-3 text-[14px] text-[#444]">
                  <span className="text-lg">{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create CTA**

```tsx
// src/components/sections/CTA.tsx
import Link from 'next/link'

const cities = ['Jasper', 'Cordova', 'Sumiton', 'Dora', 'Parrish', 'Carbon Hill', 'Oakman']

export default function CTA() {
  return (
    <section id="cta" className="bg-[#0d1f35] py-[90px] text-center">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <h2 className="text-[clamp(28px,3vw,44px)] font-extrabold text-white leading-[1.2] mb-4">
          Ready to Grow in Walker County?
        </h2>
        <p className="text-[16px] text-white/60 leading-[1.7] mb-4 max-w-[560px] mx-auto">
          Join established local businesses that trust SC Creative to build and run their digital growth system.
        </p>
        <p className="text-[13px] text-white/35 mb-8">
          Serving {cities.join(' · ')}
        </p>
        <Link
          href="/quote"
          className="inline-block bg-[#00b5a5] text-white text-[15px] font-bold px-10 py-4 rounded-lg hover:opacity-90 transition-opacity"
        >
          Get My Custom Quote →
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/About.tsx src/components/sections/CTA.tsx
git commit -m "feat: About and CTA sections"
```

---

## Task 15: Quote form + API route

**Files:**
- Create: `src/app/api/quote/route.ts`
- Create: `src/components/sections/QuoteForm.tsx`
- Create: `src/__tests__/api/quote.test.ts`

- [ ] **Step 1: Write failing test for the API route**

```ts
// src/__tests__/api/quote.test.ts
import { POST } from '@/app/api/quote/route'

const mockInsert = jest.fn().mockResolvedValue({ error: null })
jest.mock('@/lib/supabase', () => ({
  supabase: { from: () => ({ insert: mockInsert }) },
}))

describe('POST /api/quote', () => {
  it('returns 200 and saves lead on valid payload', async () => {
    const body = { first_name: 'John', last_name: 'Smith', email: 'john@smithhvac.com', business: 'Smith HVAC', phone: '(205) 555-0100', service_interest: 'Website', message: '' }
    const req = new Request('http://localhost/api/quote', { method: 'POST', body: JSON.stringify(body) })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ email: 'john@smithhvac.com' }))
  })

  it('returns 400 when required fields are missing', async () => {
    const req = new Request('http://localhost/api/quote', { method: 'POST', body: JSON.stringify({ first_name: 'John' }) })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
```

- [ ] **Step 2: Run to confirm it fails**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npm test -- src/__tests__/api/quote.test.ts 2>&1 | tail -5
```

Expected: FAIL

- [ ] **Step 3: Create API route**

```bash
mkdir -p /Users/samueldempsey/Desktop/sc-creative/src/app/api/quote
```

```ts
// src/app/api/quote/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const body = await request.json()
  const { first_name, last_name, email, business, phone, service_interest, message } = body

  if (!first_name || !last_name || !email) {
    return NextResponse.json({ error: 'first_name, last_name, and email are required' }, { status: 400 })
  }

  const { error } = await supabase.from('leads').insert({
    first_name,
    last_name,
    email,
    business: business ?? null,
    phone: phone ?? null,
    service_interest: service_interest ?? null,
    message: message ?? null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
```

- [ ] **Step 4: Run tests**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npm test -- src/__tests__/api/quote.test.ts
```

Expected: PASS

- [ ] **Step 5: Create QuoteForm client component**

```tsx
// src/components/sections/QuoteForm.tsx
'use client'
import { useState } from 'react'

const serviceOptions = ['Brand & Logo', 'Website', 'SEO & Growth', 'AI Systems', 'Everything — Full System']

export default function QuoteForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const res = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setStatus(res.ok ? 'success' : 'error')
  }

  return (
    <section id="quote" className="bg-[#0d1f35] py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="grid grid-cols-2 gap-16 items-start">
          <div>
            <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">Get Started</div>
            <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-white leading-[1.2] mb-4">
              Let&apos;s Talk About Your Business
            </h2>
            <p className="text-[15px] text-white/55 leading-[1.7] mb-7">
              Tell us a bit about where you are and what you&apos;re trying to grow — we&apos;ll put together a custom plan for you.
            </p>
            <div className="flex flex-col gap-3">
              {['No obligation, no hard sell', 'Custom quote based on your goals', 'Response within 24 hours'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-[13px] text-white/60">
                  <span className="text-white text-base">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-white mb-2">You&apos;re all set!</h3>
              <p className="text-white/60 text-sm">We&apos;ll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[12px] font-semibold text-white/60 mb-1.5 tracking-[.04em]">First Name</label>
                  <input name="first_name" required placeholder="John" className="w-full bg-white/[.07] border border-white/15 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#00b5a5] transition-colors" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-white/60 mb-1.5 tracking-[.04em]">Last Name</label>
                  <input name="last_name" required placeholder="Smith" className="w-full bg-white/[.07] border border-white/15 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#00b5a5] transition-colors" />
                </div>
              </div>
              {[
                { name: 'business', label: 'Business Name', placeholder: 'Smith HVAC' },
                { name: 'phone', label: 'Phone', placeholder: '(205) 555-0100' },
                { name: 'email', label: 'Email', placeholder: 'john@smithhvac.com', required: true },
              ].map((f) => (
                <div key={f.name} className="mb-4">
                  <label className="block text-[12px] font-semibold text-white/60 mb-1.5 tracking-[.04em]">{f.label}</label>
                  <input name={f.name} type={f.name === 'email' ? 'email' : 'text'} required={f.required} placeholder={f.placeholder} className="w-full bg-white/[.07] border border-white/15 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#00b5a5] transition-colors" />
                </div>
              ))}
              <div className="mb-4">
                <label className="block text-[12px] font-semibold text-white/60 mb-1.5 tracking-[.04em]">What are you looking to improve?</label>
                <select name="service_interest" className="w-full bg-white/[.07] border border-white/15 rounded-md px-3.5 py-2.5 text-sm text-white/70 outline-none focus:border-[#00b5a5] transition-colors">
                  {serviceOptions.map((o) => <option key={o} value={o} className="bg-[#1a3557]">{o}</option>)}
                </select>
              </div>
              {status === 'error' && <p className="text-red-400 text-xs mb-3">Something went wrong. Please try again.</p>}
              <button type="submit" disabled={status === 'loading'} className="w-full bg-[#00b5a5] text-white text-sm font-bold py-3.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60">
                {status === 'loading' ? 'Sending…' : 'Get My Custom Quote →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/api/quote/ src/components/sections/QuoteForm.tsx src/__tests__/api/quote.test.ts
git commit -m "feat: quote form with /api/quote route saving leads to Supabase"
```

---

## Task 16: Assemble homepage

**Files:**
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Assemble page**

```tsx
// src/app/(marketing)/page.tsx
import Hero from '@/components/sections/Hero'
import Systems from '@/components/sections/Systems'
import Process from '@/components/sections/Process'
import Problem from '@/components/sections/Problem'
import Services from '@/components/sections/Services'
import Industries from '@/components/sections/Industries'
import Work from '@/components/sections/Work'
import Testimonials from '@/components/sections/Testimonials'
import About from '@/components/sections/About'
import QuoteForm from '@/components/sections/QuoteForm'
import CTA from '@/components/sections/CTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Systems />
      <Process />
      <Problem />
      <Services />
      <Industries />
      <Work />
      <Testimonials />
      <About />
      <QuoteForm />
      <CTA />
    </>
  )
}
```

- [ ] **Step 2: Build**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npm run build 2>&1 | tail -15
```

Expected: successful build, no errors

- [ ] **Step 3: Run all tests**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npm test 2>&1 | tail -15
```

Expected: all tests pass

- [ ] **Step 4: Commit and push**

```bash
git add src/app/(marketing)/page.tsx
git commit -m "feat: assemble full homepage from all sections"
git push origin main
```

Expected: Vercel deploys automatically from the push

---

## Self-Review

**Spec coverage check:**
- ✅ Supabase schema — all 7 tables with RLS
- ✅ TypeScript types — all tables typed
- ✅ Server-side Supabase client
- ✅ Auth middleware protecting /dashboard/*
- ✅ (marketing) route group layout
- ✅ Nav with all dropdowns (Services, Industries, Service Area)
- ✅ Footer with all link groups
- ✅ All 11 homepage sections
- ✅ Quote form → /api/quote → leads table
- ✅ Work and Testimonials fetch from Supabase (with fallback)

**No placeholders** — all steps contain actual code.

**Type consistency** — `Database` type used in both Supabase clients. `createSupabaseServerClient()` returns typed client consistent with `types.ts`.

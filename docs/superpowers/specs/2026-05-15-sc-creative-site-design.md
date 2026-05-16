# SC Creative — Full Site Design Spec
**Date:** 2026-05-15
**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase · Vercel

---

## Overview

SC Creative is a local business marketing/branding agency serving Walker County, AL. This project converts the existing `homepage-v5.html` design into a full Next.js site with a built-in admin dashboard for content management. All public-facing content is data-driven via Supabase — the admin dashboard is the single interface for managing everything.

---

## Architecture

**Approach:** Single Next.js app with route groups (Option A).

- `(marketing)` route group — all public-facing pages, no auth required
- `(admin)` route group — dashboard protected by Supabase Auth via middleware
- One Vercel deployment, one GitHub repo, one Supabase project

---

## Directory Structure

```
src/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                        # Home
│   │   ├── work/
│   │   │   ├── page.tsx                    # Portfolio index
│   │   │   └── [slug]/page.tsx             # Case study detail
│   │   ├── process/page.tsx
│   │   ├── about/page.tsx
│   │   ├── quote/page.tsx
│   │   ├── insights/
│   │   │   ├── page.tsx                    # Blog index
│   │   │   └── [slug]/page.tsx             # Blog post
│   │   ├── services/
│   │   │   ├── brand-blueprint/page.tsx
│   │   │   ├── visual-branding/page.tsx
│   │   │   ├── website-design/page.tsx
│   │   │   ├── ai-systems/page.tsx
│   │   │   └── growth/page.tsx
│   │   ├── industries/
│   │   │   └── [slug]/page.tsx
│   │   └── service-area/
│   │       ├── page.tsx                    # Walker County hub
│   │       └── [city]/page.tsx             # City pages
│   ├── (admin)/
│   │   ├── login/page.tsx
│   │   └── dashboard/
│   │       ├── page.tsx                    # Overview / stats
│   │       ├── posts/
│   │       │   ├── page.tsx                # Posts list
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx           # Edit post
│   │       ├── projects/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── case-studies/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── testimonials/page.tsx
│   │       ├── industry-pages/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── service-areas/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── leads/page.tsx
│   │       └── settings/page.tsx
│   ├── api/
│   │   └── quote/route.ts                  # Quote form API route
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Nav.tsx                         # Sticky nav with dropdowns
│   │   └── Footer.tsx
│   ├── sections/                           # Homepage sections (converted from HTML)
│   │   ├── Hero.tsx
│   │   ├── Systems.tsx
│   │   ├── Process.tsx
│   │   ├── Problem.tsx
│   │   ├── Services.tsx
│   │   ├── Industries.tsx
│   │   ├── Work.tsx
│   │   ├── Testimonials.tsx
│   │   ├── About.tsx
│   │   ├── QuoteForm.tsx
│   │   └── CTA.tsx
│   ├── ui/                                 # Reusable primitives (Button, Card, Badge, etc.)
│   └── admin/                              # Admin-only components (editors, tables, sidebar)
├── lib/
│   ├── supabase.ts                         # Browser client
│   ├── supabase-server.ts                  # Server-side client (cookies)
│   └── types.ts                            # Generated/manual DB types
└── middleware.ts                            # Redirects unauthenticated users from /dashboard/* to /login
```

---

## Navigation

```
SC [logo] · Work · Services ▾ · Industries ▾ · Service Area ▾ · About · Insights · [Get My Quote →]
```

**Services dropdown:** Brand Blueprint · Visual Branding · Website Design · AI Systems · Growth
**Industries dropdown:** Home & Trade Services · Medical & Dental · Legal & Professional · Construction & Contractors · Financial & Accounting · Automotive · Senior Care & Wellness · Real Estate
**Service Area dropdown:** Walker County hub + Jasper · Cordova · Sumiton · Dora · Parrish · Carbon Hill · Oakman

---

## Public Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — all sections from homepage-v5.html, data-driven |
| `/work` | Portfolio index — pulls from `projects` table |
| `/work/[slug]` | Case study detail — pulls from `case_studies` |
| `/process` | Our process page (static content) |
| `/about` | About Us (static content) |
| `/quote` | Full quote form page — submissions saved to `leads` |
| `/insights` | Blog index — pulls from `posts` |
| `/insights/[slug]` | Individual blog post |
| `/services/[service]` | 5 service pages (static initially) |
| `/industries/[slug]` | Dynamic — pulls from `industry_pages` |
| `/service-area` | Walker County hub page |
| `/service-area/[city]` | City pages — pulls from `service_area_pages` |

---

## Admin Dashboard

Protected by Supabase Auth (email/password). `middleware.ts` redirects all unauthenticated `/dashboard/*` requests to `/login`.

| Section | Purpose |
|---------|---------|
| Overview | Stats: lead count, published posts, active projects |
| Posts | Create/edit/publish blog posts with rich text editor |
| Projects | Manage portfolio items with image gallery uploads |
| Case Studies | Write detailed project stories linked to projects |
| Testimonials | Add/edit/reorder/toggle visibility of testimonials |
| Industry Pages | Create and manage industry landing pages |
| Service Areas | Manage city/county pages |
| Leads | View and filter quote form submissions |
| Settings | Site-wide config (contact info, social links, etc.) |

---

## Supabase Data Model

### `posts`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| title | text | |
| slug | text | unique |
| content | text | Rich text / markdown |
| excerpt | text | |
| cover_image | text | Storage URL |
| published_at | timestamptz | null = draft |
| status | text | draft / published |
| created_at | timestamptz | |

### `projects`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| title | text | |
| slug | text | unique |
| client | text | |
| services | text[] | Array of service tags |
| cover_image | text | |
| gallery | text[] | Array of image URLs |
| summary | text | |
| status | text | draft / published |
| sort_order | int | |
| created_at | timestamptz | |

### `case_studies`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| title | text | |
| slug | text | unique |
| client | text | |
| project_id | uuid | FK → projects |
| content | text | Rich text |
| results | text[] | Key results/stats |
| cover_image | text | |
| status | text | draft / published |
| published_at | timestamptz | |
| created_at | timestamptz | |

### `testimonials`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| author | text | |
| company | text | |
| quote | text | |
| avatar | text | Storage URL, optional |
| visible | bool | Default true |
| sort_order | int | |
| created_at | timestamptz | |

### `leads`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| first_name | text | |
| last_name | text | |
| business | text | |
| phone | text | |
| email | text | |
| service_interest | text | |
| message | text | |
| created_at | timestamptz | |

### `industry_pages`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| title | text | |
| slug | text | unique |
| headline | text | |
| content | text | Rich text |
| services | text[] | |
| hero_image | text | |
| status | text | draft / published |
| created_at | timestamptz | |

### `service_area_pages`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| title | text | |
| slug | text | unique |
| city | text | |
| county | text | Default: Walker County |
| content | text | Rich text |
| status | text | draft / published |
| created_at | timestamptz | |

---

## Auth

- Supabase Auth — email/password, single admin user
- `middleware.ts` matches `/dashboard/:path*` and checks session
- No public user registration — admin account created manually in Supabase dashboard

---

## Homepage Sections (from homepage-v5.html)

All sections converted to React components. Sections with dynamic content query Supabase at the server component level:

- **Hero** — static content + animated 5-panel demo (client component for animations)
- **Systems** — interactive slider (client component)
- **Process** — static
- **Problem** — static
- **Services** — static (links to service pages)
- **Industries** — links to `/industries/[slug]`, data from `industry_pages`
- **Work** — data from `projects`
- **Testimonials** — data from `testimonials`
- **About** — static
- **QuoteForm** — submits to `/api/quote`, saves to `leads`
- **CTA** — static

---

## Key Technical Decisions

- **CSS approach:** Convert existing CSS to Tailwind utility classes. Custom animations (Hero panels, Systems slider) stay as inline styles or CSS modules where Tailwind can't express them cleanly.
- **Server vs. Client components:** Data-fetching sections are server components. Interactive sections (Hero animations, Systems slider, QuoteForm) are client components.
- **Supabase image storage:** Use Supabase Storage bucket for all uploaded images (cover images, gallery, avatars).
- **Rich text:** Store as markdown, render with a markdown parser (react-markdown) on the front end.
- **Service pages:** Start as static Next.js pages. Move to Supabase-driven if content needs to be editable from the dashboard later.

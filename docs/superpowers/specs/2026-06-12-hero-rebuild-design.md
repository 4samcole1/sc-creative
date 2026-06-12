# Hero Section Rebuild — Design Spec
Date: 2026-06-12

## Context

Full from-scratch rebuild of the SC Creative homepage. Starting with the Hero section. Reference design: `/tmp/hero-export/index.html` (exported from ChatGPT/screenshot-to-code). Existing Nav component is preserved as-is. All other homepage sections are deferred to future sessions.

## Color System

| Token | Value |
|-------|-------|
| Background | `#0b1520` |
| Teal accent | `#1cc7c3` |
| Card bg | `rgba(20,31,42,0.68)` |
| Card border | `rgba(31,45,58,0.62)` |
| Body text | `#cfd6dd` |
| Heading | `#f5f7fb` |

Tailwind v4 custom properties defined in `globals.css` via `@theme inline`.

## Layout

Full-viewport (`100vh`) hero. Two-column CSS grid (`1.1fr 1fr`) with `30px` column gap. Content centered at max `1200px`. Single column on mobile (`< 768px`).

## Background

- Asset: `/images/jasper-hero.png` (real Jasper Alabama aerial photo, dusk — copy from `/Users/samueldempsey/Downloads/jasper-hero.png`)
- Applied as `background: url(...) center/cover no-repeat`
- CSS filter: `brightness(0.85) saturate(0.9)`
- Left-to-right gradient overlay on top:
  `rgba(8,15,22,0.96) 0% → rgba(8,15,22,0.9) 38% → rgba(8,15,22,0.45) 60% → rgba(8,15,22,0.25) 100%`

## Left Column (top-aligned)

1. **Eyebrow:** `MODERN GROWTH SOLUTIONS` — teal, 14px, 600 weight, letter-spacing 1.5px
2. **Headline:** `Build a smarter foundation for growth.` — 54px, 800 weight, `#f5f7fb`; the word `growth.` rendered in teal
3. **Body:** Two short paragraphs (SC Creative services + who they help), `#cfd6dd`, 15px
4. **CTAs:**
   - Primary: `Start Your Project +` — teal fill, dark text, box-shadow glow
   - Secondary: `Explore Our Process` — ghost, `#5c6a78` border
5. **Location line:** `MapPin` icon (lucide-react, teal) + "Proudly based in Jasper, Alabama / Serving Walker County, Greater Birmingham, Northwest Alabama, and businesses nationwide."

## Right Column (bottom-aligned)

Three glassmorphism cards pinned to the bottom of the column via `align-items: flex-end` (or `padding-top` to push down). Cards sit side by side.

Each card:
- Width: `~195px`, min-height `180px`
- Background: `rgba(20,31,42,0.68)`, `backdrop-filter: blur(8px)`
- Border: `1px solid rgba(31,45,58,0.62)`, border-radius `14px`
- Content: lucide-react icon (teal, 28px) → h4 title → tagline paragraph

| Card | Icon | Title | Tagline |
|------|------|-------|---------|
| 1 | `MapPin` | Local Focus | Walker County & Beyond |
| 2 | `Settings` | Modern Solutions | Strategic Design & Intelligent Systems |
| 3 | `TrendingUp` | Growth Driven | Built to Scale. Built to Last. |

## Component File

`src/components/sections/Hero.tsx` — replaces existing file entirely.

No props needed. All copy is hardcoded. No Supabase dependency.

## Assets

- Copy `/Users/samueldempsey/Downloads/jasper-hero.png` → `public/images/jasper-hero.png`
- Remove old `public/images/jasper-aerial.jpg` (placeholder)

## Responsive

- `< 768px`: single column, headline scales to 42px, cards wrap and left-align, body overflow scrollable
- Nav: existing Nav.tsx unchanged

## What's NOT in scope

- All other homepage sections (TrustBar, Ecosystem, Work, Community, Newsletter, etc.)
- Footer
- Any routing or page changes beyond the homepage assembly

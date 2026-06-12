# SC Creative Homepage Redesign — Design Spec
**Date:** 2026-05-22  
**Approach:** Option A — rewrite components in place  
**Status:** Approved

---

## Experience Goal

The homepage should feel like a premium digital growth platform — cinematic, layered, editorial, immersive, spacious, intentional, modern, refined.

It should never feel template-based, generic, overly corporate, or like a standard agency site.

Every section connects through consistent spacing, rhythm, typography, atmospheric lighting, layered backgrounds, subtle motion, and premium UI systems.

---

## Global Color System

Update `src/app/globals.css` `@theme inline` block:

| Token | Value |
|---|---|
| `--color-primary` | `#009898` |
| `--color-primary-accent` | `#0EB1AB` |
| `--color-secondary` | `#00304B` |
| `--color-deep-bg` | `#020617` |
| `--color-navy-elevated` | `#071426` |
| `--color-neutral-text` | `#CBD5E1` |
| `--color-muted-text` | `#94A3B8` |
| `--color-soft-border` | `rgba(255,255,255,0.08)` |
| `--color-soft-glow` | `rgba(14,177,171,0.15)` |

Existing tokens (`--color-teal`, `--color-navy`, etc.) can be kept for backward compat but the above are the primary palette going forward.

---

## Page Structure

`src/app/(marketing)/page.tsx` section order:

```
Nav
Hero
TrustBar       ← renamed/rewritten from StatsBar
Ecosystem      ← renamed/rewritten from Systems; Services removed from page
PartnerCTA     ← new component
Work
Community      ← new component
Newsletter     ← new component
Footer
```

Deferred (stay in codebase, removed from page for now): `Problem`, `Process`, `PackageBuilder`, `About`

---

## Components

### Nav.tsx

- Fixed position, floating transparent over hero
- On scroll past hero: background transitions to `bg-[#071426]/95 backdrop-blur-md` (darkens to stay readable)
- Height: 80–90px
- `max-w-[1500px]` container
- Background: `backdrop-blur-md` + `bg-white/5` + `border-b border-white/8`
- Left: SC Creative logo
- Center: Work | Blueprint | Branding | Website | AI Solutions | Growth | About
- Right: "Get In Touch" — teal fill, `rounded-xl`, subtle teal glow, hover elevation
- Links: white/80, hover white

---

### Hero.tsx

**Layout:** 2-column split, `min-h-[90vh]`, centered content

**Background:**
```css
background: radial-gradient(circle at top left, rgba(14,177,171,0.15), transparent 40%),
            linear-gradient(135deg, #020617 0%, #06111f 45%, #0b1020 100%);
```

**Left column:**

- Eyebrow: `"MODERN GROWTH SOLUTIONS"` — uppercase, tracking-widest, teal, small
- Headline: `"Strategy. Design. / Systems. Growth. / All working together."` — font-black, massive scale, tight leading, negative tracking. The line `"All working together."` is teal/accent color.
- Subtext (max-w ~600px, soft white reduced opacity, generous line-height):
  > "SC Creative helps businesses in Jasper, Walker County, and beyond build smarter foundations for growth through strategy, branding, websites, AI systems, and growth marketing that drive real results."
- CTA row (gap 24px):
  - Button 1: `"Start Your Project →"` — teal fill, large, `rounded-xl`, glow on hover
  - Button 2: `"Explore Our Process"` — ghost, white border, transparent bg, subtle hover blur
- Location badge (below CTAs):
  - Map pin icon
  - `"Proudly based in Jasper, Alabama"`
  - `"Serving Walker County, Greater Birmingham & Northwest Alabama"`
  - Soft opacity, lightweight typography

**Right column:**

- Jasper City Hall aerial photo (`/images/jasper-aerial.jpg`)
- Dark overlay + edge fade blending into dark left side
- Teal atmospheric glow treatment
- 3 floating glassmorphism cards at bottom of image:
  - Card 1: 📍 **Local Focus** / "Walker County & Beyond"
  - Card 2: ⚙️ **Modern Solutions** / "Strategy, Design & Intelligent Systems"
  - Card 3: 📈 **Growth Driven** / "Built to Scale. Built to Last."
  - Card style: `backdrop-blur`, translucent bg, `border border-white/10`, subtle teal glow, elevation

---

### TrustBar.tsx (was StatsBar.tsx)

- White background, large vertical padding, airy
- Centered label: `"TRUSTED BY BUSINESSES ACROSS INDUSTRIES"` — uppercase, muted, small
- 5 grayscale logo placeholder slots below
- Logos: grayscale, low opacity, subtle hover fade-in

---

### Ecosystem.tsx (was Systems.tsx)

**Background:** Clean white

**Section intro (centered):**
- Eyebrow: `"THE SC CREATIVE ECOSYSTEM"`
- Headline: `"Everything your business needs to grow."`
- Subtext: `"Five pillars working together to build strong foundations, streamline operations, and drive measurable growth."`

**5-card horizontal grid:**

Cards feel premium SaaS — subtle shadow, hover elevation + glow, large border radius, icon containers, strong spacing. NOT generic service cards.

| # | Title | Description | Bullets |
|---|---|---|---|
| 01 | Blueprint | Clarify your message, positioning, and strategy so everything else works better. | Messaging Strategy, Market Research, Competitive Analysis, Growth Strategy |
| 02 | Branding | Complete visual identity systems that create trust, recognition, and consistency. | Logo & Identity Design, Color & Typography, Brand Guidelines, Marketing Assets |
| 03 | Website | High-performance websites and platforms built for modern businesses and designed to convert. | Custom Websites, E-Commerce, Web Applications, Maintenance & Hosting |
| 04 | AI Solutions | Intelligent systems that automate, streamline, and modernize the way your business operates. | Custom Applications, Workflow Automation, Dashboards & Analytics, AI Integrations |
| 05 | Growth | Data-driven marketing and visibility strategies that increase exposure, attract customers, and scale. | SEO & Local SEO, Paid Advertising, Content & Backlinks, Analytics & Reporting |

Each card has a "Learn More →" teal link at bottom.

---

### PartnerCTA.tsx (new)

- Full-width, cinematic dark section
- Background: deep navy atmospheric gradient + dark cinematic workspace/laptop image with blended overlay (NOT generic office stock)
- **Left:**
  - Eyebrow: `"BUILT FOR BUSINESSES THAT WANT MORE"`
  - Headline: `"More than a vendor. / We're your growth partner."`
  - Subtext: `"We combine strategy, creativity, development, and intelligent systems to help businesses across Walker County and beyond grow with confidence."`
  - CTA: `"Let's Talk About Your Goals →"` — teal fill, `rounded-xl`
- **Right:** Dark cinematic workspace/laptop image — atmospheric, intentional, modern

---

### Work.tsx

- White background
- Eyebrow: `"RECENT WORK"` — teal
- Headline: `"Solutions built for real businesses."`
- Top-right link: `"View All Projects →"`
- 3 project cards — premium, spacious; image zoom on hover, layered shadows, hover elevation

| Category | Title | Description |
|---|---|---|
| WEBSITE DESIGN | Industrial Manufacturing Website | Custom WordPress website with advanced product filtering and lead generation systems. |
| E-COMMERCE | Custom E-Commerce Platform | Advanced Shopify build for a high-volume retailer with custom integrations. |
| WEB APPLICATION | Client Portal & Dashboard | Custom portal with reporting, document management, and task automation. |

Cards: category tag, title, description, `"View Project →"` teal link.

---

### Community.tsx (new)

- 3-column layout
- **Left:**
  - Eyebrow: `"ROOTED IN OUR COMMUNITY"`
  - Headline: `"Proudly serving Jasper, Walker County, and beyond."`
  - Subtext: `"We're proud to be part of this community and even more proud to help local businesses grow, compete, and win."`
  - Location list (map pin icons): Jasper, AL · Walker County, AL · Greater Birmingham · Northwest Alabama
- **Center:** Abstract stylized infrastructure-style map graphic — subtle, premium, elegant. NOT literal Google Maps.
- **Right:** Floating testimonial card — soft shadow, rounded, elevated, subtle glow
  - Quote: *"SC Creative transformed the way we present our business online. The new website, branding, and SEO strategy have brought us more leads and more customers than ever before."*
  - Name: Josh T.
  - Company: Owner, Construction Company

---

### Newsletter.tsx (new)

- Dark atmospheric gradient strip
- Left: `"Stay ahead of the growth game."` headline + `"Insights, systems, and strategies to help your business grow smarter."` subtext
- Right: glass-style email input + `"Subscribe →"` glowing teal button

---

### Footer.tsx

- Background: deep navy/black (`#020617`)
- 4 columns:

| Column 1 | Column 2 | Column 3 | Column 4 |
|---|---|---|---|
| SC Creative logo + "Modern growth solutions for businesses across Walker County, Alabama and surrounding areas." + social icons (minimal outline) | **Quick Links:** Work, Blueprint, Branding, Website, AI Solutions, Growth, About | **Resources:** Blog, Case Studies, FAQs, Process, Careers | **Contact:** Jasper, AL · info@samcolecreative.com · (678) 997-1106 · "Get In Touch →" teal button |

- Bottom bar: `© {new Date().getFullYear()} SC Creative. All rights reserved.` + Privacy Policy | Terms of Service

---

## Assets

- Jasper City Hall aerial photo → save to `public/images/jasper-aerial.jpg`
- PartnerCTA workspace image → Unsplash placeholder until real photo provided
- Community map graphic → SVG abstract infrastructure map, built in-component
- Logo placeholders → styled divs for now

---

## Files Changed

| File | Action |
|---|---|
| `src/app/globals.css` | Update color tokens |
| `src/app/(marketing)/page.tsx` | Update section order |
| `src/components/layout/Nav.tsx` | Rewrite |
| `src/components/layout/Footer.tsx` | Rewrite |
| `src/components/sections/Hero.tsx` | Rewrite |
| `src/components/sections/HeroDemo.tsx` | Delete (replaced) |
| `src/components/sections/StatsBar.tsx` | Rewrite → TrustBar |
| `src/components/sections/Systems.tsx` | Rewrite → Ecosystem |
| `src/components/sections/Work.tsx` | Update |
| `src/components/sections/PartnerCTA.tsx` | New |
| `src/components/sections/Community.tsx` | New |
| `src/components/sections/Newsletter.tsx` | New |
| `src/components/sections/Services.tsx` | Remove from page (keep file) |

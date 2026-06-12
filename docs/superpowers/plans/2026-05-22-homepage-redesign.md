# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the SC Creative homepage to match the premium cinematic design spec — new Nav, Hero, TrustBar, Ecosystem, PartnerCTA, Work, Community, Newsletter, and Footer components.

**Architecture:** Rewrite each existing component in place (Option A). New components (PartnerCTA, Community, Newsletter) added as new files. Services removed from page render. Problem, Process, PackageBuilder, About left in codebase but removed from page for now.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Jest + React Testing Library

---

## Pre-flight

All npm/node commands must be prefixed with:
```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" &&
```

Run the test suite before touching anything to establish a baseline:
```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest --no-coverage 2>&1
```

---

## File Map

| File | Action |
|---|---|
| `src/app/globals.css` | Update color tokens |
| `public/images/jasper-aerial.jpg` | Add (manual step) |
| `src/app/(marketing)/layout.tsx` | Add `pt-[88px]` padding to `<main>` |
| `src/app/(marketing)/page.tsx` | Update imports + section order |
| `src/components/layout/Nav.tsx` | Rewrite |
| `src/components/layout/Footer.tsx` | Rewrite |
| `src/components/sections/Hero.tsx` | Rewrite |
| `src/components/sections/HeroDemo.tsx` | Delete |
| `src/components/sections/StatsBar.tsx` | Rewrite → TrustBar |
| `src/components/sections/Systems.tsx` | Rewrite → Ecosystem |
| `src/components/sections/Work.tsx` | Update UI |
| `src/components/sections/PartnerCTA.tsx` | New |
| `src/components/sections/Community.tsx` | New |
| `src/components/sections/Newsletter.tsx` | New |
| `src/__tests__/components/Nav.test.tsx` | Update |
| `src/__tests__/sections/Hero.test.tsx` | Update |

---

## Task 1: Color tokens + Jasper photo asset

**Files:**
- Modify: `src/app/globals.css`
- Add: `public/images/jasper-aerial.jpg` (manual)

- [ ] **Step 1: Save the Jasper aerial photo**

  Save the Jasper City Hall aerial photo to:
  ```
  /Users/samueldempsey/Desktop/sc-creative/public/images/jasper-aerial.jpg
  ```
  Create the `public/images/` directory if it doesn't exist.

- [ ] **Step 2: Update color tokens in globals.css**

  Replace the entire `@theme inline` block in `src/app/globals.css`:

  ```css
  /* src/app/globals.css */
  @import "tailwindcss";

  @theme inline {
    --color-primary: #009898;
    --color-primary-accent: #0EB1AB;
    --color-secondary: #00304B;
    --color-deep-bg: #020617;
    --color-navy-elevated: #071426;
    --color-neutral-text: #CBD5E1;
    --color-muted-text: #94A3B8;
    --color-soft-border: rgba(255, 255, 255, 0.08);
    --color-soft-glow: rgba(14, 177, 171, 0.15);

    /* Legacy tokens — kept for backward compat with deferred sections */
    --color-navy-darkest: #071829;
    --color-navy-dark: #0d1f35;
    --color-navy: #1a3557;
    --color-navy-mid: #0d2a40;
    --color-teal: #009898;
    --color-teal-dark: #007a7a;
    --color-teal-light: #0EB1AB;
    --color-gold: #c8921a;
    --color-cream: #f5f3ef;
    --color-cream-dark: #ece8e2;

    --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }
  ```

- [ ] **Step 3: Commit**

  ```bash
  cd /Users/samueldempsey/Desktop/sc-creative && git add src/app/globals.css public/images/jasper-aerial.jpg && git commit -m "feat: update color tokens and add Jasper aerial photo"
  ```

---

## Task 2: Nav redesign

**Files:**
- Modify: `src/components/layout/Nav.tsx`
- Modify: `src/app/(marketing)/layout.tsx`
- Modify: `src/__tests__/components/Nav.test.tsx`

- [ ] **Step 1: Update the Nav test first**

  Replace `src/__tests__/components/Nav.test.tsx` entirely:

  ```tsx
  import { render, screen } from '@testing-library/react'
  import Nav from '@/components/layout/Nav'

  describe('Nav', () => {
    it('renders the SC Creative logo link', () => {
      render(<Nav />)
      expect(screen.getByRole('link', { name: /sc creative/i })).toBeInTheDocument()
    })

    it('renders the Get In Touch CTA', () => {
      render(<Nav />)
      expect(screen.getByRole('link', { name: /get in touch/i })).toBeInTheDocument()
    })

    it('renders all nav links', () => {
      render(<Nav />)
      expect(screen.getByRole('link', { name: /^work$/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /^blueprint$/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /^branding$/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /^website$/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /ai solutions/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /^growth$/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /^about$/i })).toBeInTheDocument()
    })
  })
  ```

- [ ] **Step 2: Run test to verify it fails**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/components/Nav.test.tsx --no-coverage 2>&1
  ```

  Expected: FAIL — "Get In Touch" and individual nav link tests will fail against current Nav.

- [ ] **Step 3: Rewrite Nav.tsx**

  Replace `src/components/layout/Nav.tsx` entirely:

  ```tsx
  // src/components/layout/Nav.tsx
  'use client'
  import Link from 'next/link'
  import { useState, useEffect } from 'react'

  const navLinks = [
    { label: 'Work', href: '/work' },
    { label: 'Blueprint', href: '/services/brand-blueprint' },
    { label: 'Branding', href: '/services/visual-branding' },
    { label: 'Website', href: '/services/website-design' },
    { label: 'AI Solutions', href: '/services/ai-systems' },
    { label: 'Growth', href: '/services/growth' },
    { label: 'About', href: '/about' },
  ]

  export default function Nav() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 80)
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#071426]/95 backdrop-blur-md border-b border-white/[0.08]'
            : 'bg-white/[0.03] backdrop-blur-sm border-b border-white/[0.05]'
        }`}
        style={{ height: '88px' }}
      >
        <div className="max-w-[1500px] mx-auto px-8 flex items-center h-full">
          <Link
            href="/"
            className="font-extrabold text-white text-sm tracking-widest uppercase shrink-0 mr-10"
            aria-label="SC Creative"
          >
            SC Creative
          </Link>
          <div className="flex items-center gap-7 flex-1 justify-center">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-white/70 hover:text-white text-sm font-medium transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Link
            href="/contact"
            className="shrink-0 bg-[#009898] text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#0EB1AB] hover:shadow-[0_0_20px_rgba(14,177,171,0.4)] transition-all duration-200"
          >
            Get In Touch
          </Link>
        </div>
      </nav>
    )
  }
  ```

- [ ] **Step 4: Update marketing layout to offset fixed nav**

  Replace `src/app/(marketing)/layout.tsx`:

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

  Note: No `pt-[88px]` on main — the Hero section is designed to sit behind the transparent nav. The Hero itself handles top padding via `pt-[88px]` on its inner content grid.

- [ ] **Step 5: Run test to verify it passes**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/components/Nav.test.tsx --no-coverage 2>&1
  ```

  Expected: PASS — 3 test suites, all green.

- [ ] **Step 6: Commit**

  ```bash
  cd /Users/samueldempsey/Desktop/sc-creative && git add src/components/layout/Nav.tsx src/app/(marketing)/layout.tsx src/__tests__/components/Nav.test.tsx && git commit -m "feat: redesign Nav — fixed transparent, scroll-aware, new links"
  ```

---

## Task 3: Hero redesign

**Files:**
- Modify: `src/components/sections/Hero.tsx`
- Delete: `src/components/sections/HeroDemo.tsx`
- Modify: `src/__tests__/sections/Hero.test.tsx`

- [ ] **Step 1: Update the Hero test first**

  Replace `src/__tests__/sections/Hero.test.tsx`:

  ```tsx
  import { render, screen } from '@testing-library/react'
  import Hero from '@/components/sections/Hero'

  describe('Hero', () => {
    it('renders the main headline', () => {
      render(<Hero />)
      expect(screen.getByRole('heading', { name: /strategy\. design\./i })).toBeInTheDocument()
    })

    it('renders the teal accent line', () => {
      render(<Hero />)
      expect(screen.getByText(/all working together/i)).toBeInTheDocument()
    })

    it('renders the Start Your Project CTA', () => {
      render(<Hero />)
      expect(screen.getByRole('link', { name: /start your project/i })).toBeInTheDocument()
    })

    it('renders the Explore Our Process CTA', () => {
      render(<Hero />)
      expect(screen.getByRole('link', { name: /explore our process/i })).toBeInTheDocument()
    })

    it('renders the location badge', () => {
      render(<Hero />)
      expect(screen.getByText(/proudly based in jasper/i)).toBeInTheDocument()
    })

    it('renders the 3 glassmorphism feature cards', () => {
      render(<Hero />)
      expect(screen.getByText('Local Focus')).toBeInTheDocument()
      expect(screen.getByText('Modern Solutions')).toBeInTheDocument()
      expect(screen.getByText('Growth Driven')).toBeInTheDocument()
    })
  })
  ```

- [ ] **Step 2: Run test to verify it fails**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/sections/Hero.test.tsx --no-coverage 2>&1
  ```

  Expected: FAIL — current Hero has different headline and CTAs.

- [ ] **Step 3: Rewrite Hero.tsx**

  Replace `src/components/sections/Hero.tsx` entirely:

  ```tsx
  // src/components/sections/Hero.tsx
  import Link from 'next/link'

  const featureCards = [
    {
      icon: '📍',
      title: 'Local Focus',
      sub: 'Walker County & Beyond',
    },
    {
      icon: '⚙️',
      title: 'Modern Solutions',
      sub: 'Strategy, Design & Intelligent Systems',
    },
    {
      icon: '📈',
      title: 'Growth Driven',
      sub: 'Built to Scale. Built to Last.',
    },
  ]

  export default function Hero() {
    return (
      <section
        className="relative min-h-[90vh] flex items-center"
        style={{
          background: `
            radial-gradient(circle at top left, rgba(14,177,171,0.15), transparent 40%),
            linear-gradient(135deg, #020617 0%, #06111f 45%, #0b1020 100%)
          `,
        }}
      >
        <div className="max-w-[1500px] mx-auto px-8 w-full pt-[88px] grid grid-cols-2 gap-16 items-center py-20">
          {/* Left column */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#009898] mb-5">
              Modern Growth Solutions
            </div>
            <h1 className="text-[clamp(36px,4vw,64px)] font-black leading-[1.1] tracking-tight text-white mb-6">
              Strategy. Design.<br />
              Systems. Growth.<br />
              <span className="text-[#0EB1AB]">All working together.</span>
            </h1>
            <p className="text-[17px] text-white/60 leading-[1.75] mb-10 max-w-[520px]">
              SC Creative helps businesses in Jasper, Walker County, and beyond build smarter
              foundations for growth through strategy, branding, websites, AI systems, and
              growth marketing that drive real results.
            </p>
            <div className="flex gap-6 flex-wrap mb-10">
              <Link
                href="/contact"
                className="bg-[#009898] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#0EB1AB] hover:shadow-[0_0_30px_rgba(14,177,171,0.5)] transition-all duration-200 text-[15px]"
              >
                Start Your Project →
              </Link>
              <Link
                href="/process"
                className="border border-white/30 text-white/80 font-medium px-8 py-4 rounded-xl hover:border-white/60 hover:text-white transition-all text-[15px]"
              >
                Explore Our Process
              </Link>
            </div>
            <div className="flex items-start gap-2.5 text-sm">
              <span className="text-[#009898] mt-0.5">📍</span>
              <div className="text-white/40 leading-relaxed">
                <span className="text-white/60">Proudly based in Jasper, Alabama</span>
                <br />
                Serving Walker County, Greater Birmingham &amp; Northwest Alabama
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="relative h-[540px]">
            <div className="relative h-full rounded-2xl overflow-hidden">
              <img
                src="/images/jasper-aerial.jpg"
                alt="Jasper, Alabama — home of SC Creative"
                className="w-full h-full object-cover"
              />
              {/* Fade left to blend with hero bg */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/80 via-transparent to-transparent" />
              {/* Fade bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/60 via-transparent to-transparent" />
              {/* Teal atmospheric glow */}
              <div className="absolute inset-0 bg-[rgba(14,177,171,0.06)]" />
            </div>

            {/* Glassmorphism feature cards */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-3">
              {featureCards.map((card) => (
                <div
                  key={card.title}
                  className="flex-1 backdrop-blur-md bg-white/[0.08] border border-white/[0.12] rounded-xl p-3.5 shadow-[0_0_20px_rgba(14,177,171,0.15)]"
                >
                  <div className="text-xl mb-1.5">{card.icon}</div>
                  <div className="text-white text-xs font-bold mb-1">{card.title}</div>
                  <div className="text-white/50 text-[10px] leading-snug">{card.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 4: Delete HeroDemo.tsx**

  ```bash
  rm /Users/samueldempsey/Desktop/sc-creative/src/components/sections/HeroDemo.tsx
  ```

- [ ] **Step 5: Run test to verify it passes**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/sections/Hero.test.tsx --no-coverage 2>&1
  ```

  Expected: PASS — 6 tests green.

- [ ] **Step 6: Commit**

  ```bash
  cd /Users/samueldempsey/Desktop/sc-creative && git add src/components/sections/Hero.tsx src/__tests__/sections/Hero.test.tsx && git rm src/components/sections/HeroDemo.tsx && git commit -m "feat: redesign Hero — cinematic 2-col layout with Jasper photo and glassmorphism cards"
  ```

---

## Task 4: TrustBar (replaces StatsBar)

**Files:**
- Modify: `src/components/sections/StatsBar.tsx` (rewrite in place, export name changes to TrustBar)
- Modify: `src/app/(marketing)/page.tsx` (update import)

- [ ] **Step 1: Write a test for TrustBar**

  Create `src/__tests__/sections/TrustBar.test.tsx`:

  ```tsx
  import { render, screen } from '@testing-library/react'
  import TrustBar from '@/components/sections/StatsBar'

  describe('TrustBar', () => {
    it('renders the trusted by label', () => {
      render(<TrustBar />)
      expect(screen.getByText(/trusted by businesses across industries/i)).toBeInTheDocument()
    })

    it('renders 5 logo placeholder slots', () => {
      render(<TrustBar />)
      const slots = document.querySelectorAll('[data-logo-slot]')
      expect(slots).toHaveLength(5)
    })
  })
  ```

- [ ] **Step 2: Run test to verify it fails**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/sections/TrustBar.test.tsx --no-coverage 2>&1
  ```

  Expected: FAIL — current StatsBar has no "trusted by" text.

- [ ] **Step 3: Rewrite StatsBar.tsx as TrustBar**

  Replace `src/components/sections/StatsBar.tsx` entirely:

  ```tsx
  // src/components/sections/StatsBar.tsx
  export default function TrustBar() {
    return (
      <div className="bg-white py-14 border-b border-gray-100">
        <div className="max-w-[1500px] mx-auto px-8">
          <p className="text-center text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-10">
            Trusted by Businesses Across Industries
          </p>
          <div className="flex items-center justify-center gap-14">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                data-logo-slot
                className="h-8 w-32 bg-gray-200/60 rounded-md opacity-40 hover:opacity-60 transition-opacity"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 4: Run test to verify it passes**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/sections/TrustBar.test.tsx --no-coverage 2>&1
  ```

  Expected: PASS — 2 tests green.

- [ ] **Step 5: Commit**

  ```bash
  cd /Users/samueldempsey/Desktop/sc-creative && git add src/components/sections/StatsBar.tsx src/__tests__/sections/TrustBar.test.tsx && git commit -m "feat: replace StatsBar with TrustBar — logo trust bar"
  ```

---

## Task 5: Ecosystem section (replaces Systems)

**Files:**
- Modify: `src/components/sections/Systems.tsx` (rewrite in place, export name changes to Ecosystem)

- [ ] **Step 1: Write a test for Ecosystem**

  Create `src/__tests__/sections/Ecosystem.test.tsx`:

  ```tsx
  import { render, screen } from '@testing-library/react'
  import Ecosystem from '@/components/sections/Systems'

  describe('Ecosystem', () => {
    it('renders the section eyebrow', () => {
      render(<Ecosystem />)
      expect(screen.getByText(/the sc creative ecosystem/i)).toBeInTheDocument()
    })

    it('renders the section headline', () => {
      render(<Ecosystem />)
      expect(screen.getByText(/everything your business needs to grow/i)).toBeInTheDocument()
    })

    it('renders all 5 pillar cards', () => {
      render(<Ecosystem />)
      expect(screen.getByText('Blueprint')).toBeInTheDocument()
      expect(screen.getByText('Branding')).toBeInTheDocument()
      expect(screen.getByText('Website')).toBeInTheDocument()
      expect(screen.getByText('AI Solutions')).toBeInTheDocument()
      expect(screen.getByText('Growth')).toBeInTheDocument()
    })

    it('renders Learn More links for each pillar', () => {
      render(<Ecosystem />)
      const links = screen.getAllByText(/learn more/i)
      expect(links).toHaveLength(5)
    })
  })
  ```

- [ ] **Step 2: Run test to verify it fails**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/sections/Ecosystem.test.tsx --no-coverage 2>&1
  ```

  Expected: FAIL — current Systems component has slider, no ecosystem content.

- [ ] **Step 3: Rewrite Systems.tsx as Ecosystem**

  Replace `src/components/sections/Systems.tsx` entirely:

  ```tsx
  // src/components/sections/Systems.tsx
  import Link from 'next/link'

  const pillars = [
    {
      num: '01',
      title: 'Blueprint',
      description: 'Clarify your message, positioning, and strategy so everything else works better.',
      bullets: ['Messaging Strategy', 'Market Research', 'Competitive Analysis', 'Growth Strategy'],
      href: '/services/brand-blueprint',
      iconBg: '#6366f1',
    },
    {
      num: '02',
      title: 'Branding',
      description: 'Complete visual identity systems that create trust, recognition, and consistency.',
      bullets: ['Logo & Identity Design', 'Color & Typography', 'Brand Guidelines', 'Marketing Assets'],
      href: '/services/visual-branding',
      iconBg: '#3b82f6',
    },
    {
      num: '03',
      title: 'Website',
      description: 'High-performance websites and platforms built for modern businesses and designed to convert.',
      bullets: ['Custom Websites', 'E-Commerce', 'Web Applications', 'Maintenance & Hosting'],
      href: '/services/website-design',
      iconBg: '#009898',
    },
    {
      num: '04',
      title: 'AI Solutions',
      description: 'Intelligent systems that automate, streamline, and modernize the way your business operates.',
      bullets: ['Custom Applications', 'Workflow Automation', 'Dashboards & Analytics', 'AI Integrations'],
      href: '/services/ai-systems',
      iconBg: '#8b5cf6',
    },
    {
      num: '05',
      title: 'Growth',
      description: 'Data-driven marketing and visibility strategies that increase exposure, attract customers, and scale.',
      bullets: ['SEO & Local SEO', 'Paid Advertising', 'Content & Backlinks', 'Analytics & Reporting'],
      href: '/services/growth',
      iconBg: '#f59e0b',
    },
  ]

  export default function Ecosystem() {
    return (
      <section className="bg-white py-24">
        <div className="max-w-[1500px] mx-auto px-8">
          <div className="text-center mb-16">
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#009898] mb-4">
              The SC Creative Ecosystem
            </div>
            <h2 className="text-[clamp(28px,3vw,48px)] font-black text-gray-900 leading-[1.15] mb-5">
              Everything your business needs to grow.
            </h2>
            <p className="text-[17px] text-gray-500 leading-[1.7] max-w-[600px] mx-auto">
              Five pillars working together to build strong foundations, streamline operations,
              and drive measurable growth.
            </p>
          </div>

          <div className="grid grid-cols-5 gap-5">
            {pillars.map((p) => (
              <div
                key={p.num}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-[11px] font-bold tracking-[0.15em] text-gray-300 mb-3">{p.num}</div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white text-sm font-black"
                  style={{ background: p.iconBg }}
                >
                  {p.title[0]}
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-2">{p.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed mb-4">{p.description}</p>
                <ul className="space-y-1.5 mb-5">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-[12px] text-gray-500">
                      <span style={{ color: p.iconBg }}>✓</span> {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className="text-[13px] font-bold transition-colors"
                  style={{ color: p.iconBg }}
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 4: Run test to verify it passes**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/sections/Ecosystem.test.tsx --no-coverage 2>&1
  ```

  Expected: PASS — 4 tests green.

- [ ] **Step 5: Commit**

  ```bash
  cd /Users/samueldempsey/Desktop/sc-creative && git add src/components/sections/Systems.tsx src/__tests__/sections/Ecosystem.test.tsx && git commit -m "feat: replace Systems slider with Ecosystem 5-pillar cards"
  ```

---

## Task 6: PartnerCTA (new)

**Files:**
- Create: `src/components/sections/PartnerCTA.tsx`
- Create: `src/__tests__/sections/PartnerCTA.test.tsx`

- [ ] **Step 1: Write the test**

  Create `src/__tests__/sections/PartnerCTA.test.tsx`:

  ```tsx
  import { render, screen } from '@testing-library/react'
  import PartnerCTA from '@/components/sections/PartnerCTA'

  describe('PartnerCTA', () => {
    it('renders the eyebrow', () => {
      render(<PartnerCTA />)
      expect(screen.getByText(/built for businesses that want more/i)).toBeInTheDocument()
    })

    it('renders the headline', () => {
      render(<PartnerCTA />)
      expect(screen.getByText(/more than a vendor/i)).toBeInTheDocument()
    })

    it('renders the CTA link', () => {
      render(<PartnerCTA />)
      expect(screen.getByRole('link', { name: /let's talk about your goals/i })).toBeInTheDocument()
    })
  })
  ```

- [ ] **Step 2: Run test to verify it fails**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/sections/PartnerCTA.test.tsx --no-coverage 2>&1
  ```

  Expected: FAIL — component doesn't exist yet.

- [ ] **Step 3: Create PartnerCTA.tsx**

  Create `src/components/sections/PartnerCTA.tsx`:

  ```tsx
  // src/components/sections/PartnerCTA.tsx
  import Link from 'next/link'

  export default function PartnerCTA() {
    return (
      <section
        className="relative overflow-hidden py-24"
        style={{
          background: 'linear-gradient(135deg, #020617 0%, #071426 50%, #020617 100%)',
        }}
      >
        {/* Background workspace image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent" />
        </div>

        <div className="relative max-w-[1500px] mx-auto px-8 grid grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#009898] mb-5">
              Built for Businesses That Want More
            </div>
            <h2 className="text-[clamp(28px,3vw,48px)] font-black text-white leading-[1.15] mb-6">
              More than a vendor.<br />
              We&apos;re your growth partner.
            </h2>
            <p className="text-[17px] text-white/60 leading-[1.75] mb-10 max-w-[480px]">
              We combine strategy, creativity, development, and intelligent systems to help
              businesses across Walker County and beyond grow with confidence.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#009898] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#0EB1AB] hover:shadow-[0_0_30px_rgba(14,177,171,0.5)] transition-all duration-200 text-[15px]"
            >
              Let&apos;s Talk About Your Goals →
            </Link>
          </div>

          {/* Right */}
          <div className="relative h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80"
              alt="Modern workspace"
              className="w-full h-full object-cover rounded-2xl opacity-50"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent" />
            <div className="absolute inset-0 rounded-2xl bg-[rgba(14,177,171,0.05)]" />
          </div>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 4: Run test to verify it passes**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/sections/PartnerCTA.test.tsx --no-coverage 2>&1
  ```

  Expected: PASS — 3 tests green.

- [ ] **Step 5: Commit**

  ```bash
  cd /Users/samueldempsey/Desktop/sc-creative && git add src/components/sections/PartnerCTA.tsx src/__tests__/sections/PartnerCTA.test.tsx && git commit -m "feat: add PartnerCTA section"
  ```

---

## Task 7: Work section update

**Files:**
- Modify: `src/components/sections/Work.tsx`

- [ ] **Step 1: Write updated test**

  Create `src/__tests__/sections/Work.test.tsx`:

  ```tsx
  import { render, screen } from '@testing-library/react'
  import Work from '@/components/sections/Work'

  // Work is an async server component — wrap in Suspense for testing
  jest.mock('@/lib/supabase-server', () => ({
    createSupabaseServerClient: jest.fn().mockRejectedValue(new Error('not configured')),
  }))

  describe('Work', () => {
    it('renders the section eyebrow', async () => {
      render(await Work())
      expect(screen.getByText(/recent work/i)).toBeInTheDocument()
    })

    it('renders the section headline', async () => {
      render(await Work())
      expect(screen.getByText(/solutions built for real businesses/i)).toBeInTheDocument()
    })

    it('renders View All Projects link', async () => {
      render(await Work())
      expect(screen.getByRole('link', { name: /view all projects/i })).toBeInTheDocument()
    })

    it('renders 3 fallback project cards', async () => {
      render(await Work())
      expect(screen.getByText('Industrial Manufacturing Website')).toBeInTheDocument()
      expect(screen.getByText('Custom E-Commerce Platform')).toBeInTheDocument()
      expect(screen.getByText('Client Portal & Dashboard')).toBeInTheDocument()
    })
  })
  ```

- [ ] **Step 2: Run test to verify it fails**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/sections/Work.test.tsx --no-coverage 2>&1
  ```

  Expected: FAIL — current Work uses different wording and different fallback cards.

- [ ] **Step 3: Rewrite Work.tsx**

  Replace `src/components/sections/Work.tsx` entirely:

  ```tsx
  // src/components/sections/Work.tsx
  import Link from 'next/link'
  import { createSupabaseServerClient } from '@/lib/supabase-server'

  const fallbackProjects = [
    {
      category: 'WEBSITE DESIGN',
      title: 'Industrial Manufacturing Website',
      description: 'Custom WordPress website with advanced product filtering and lead generation systems.',
    },
    {
      category: 'E-COMMERCE',
      title: 'Custom E-Commerce Platform',
      description: 'Advanced Shopify build for a high-volume retailer with custom integrations.',
    },
    {
      category: 'WEB APPLICATION',
      title: 'Client Portal & Dashboard',
      description: 'Custom portal with reporting, document management, and task automation.',
    },
  ]

  export default async function Work() {
    let items: {
      id: string
      title: string
      slug: string
      client: string | null
      services: string[]
      cover_image: string | null
    }[] = []

    try {
      const supabase = await createSupabaseServerClient()
      const { data } = await supabase
        .from('projects')
        .select('id, title, slug, client, services, cover_image')
        .eq('status', 'published')
        .order('sort_order')
        .limit(3)
      items = data ?? []
    } catch {
      // Supabase not configured — show fallback cards
    }

    return (
      <section id="work" className="bg-white py-24">
        <div className="max-w-[1500px] mx-auto px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#009898] mb-3">
                Recent Work
              </div>
              <h2 className="text-[clamp(28px,3vw,48px)] font-black text-gray-900 leading-[1.15]">
                Solutions built for real businesses.
              </h2>
            </div>
            <Link
              href="/work"
              className="text-[14px] font-bold text-[#009898] hover:text-[#0EB1AB] transition-colors shrink-0 mb-2"
            >
              View All Projects →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {items.length > 0
              ? items.map((p) => (
                  <Link
                    key={p.id}
                    href={`/work/${p.slug}`}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="h-[220px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      {p.cover_image ? (
                        <img
                          src={p.cover_image}
                          alt={p.client ?? p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#020617] to-[#071426]" />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#009898] mb-2">
                        {p.services[0] ?? 'PROJECT'}
                      </div>
                      <h3 className="font-black text-gray-900 text-lg mb-2">{p.client ?? p.title}</h3>
                      <p className="text-gray-500 text-[13px] leading-relaxed mb-4">
                        {p.services.join(' · ')}
                      </p>
                      <span className="text-[13px] font-bold text-[#009898]">View Project →</span>
                    </div>
                  </Link>
                ))
              : fallbackProjects.map((p) => (
                  <div
                    key={p.title}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="h-[220px] bg-gradient-to-br from-[#020617] to-[#071426] group-hover:scale-105 transition-transform duration-500 overflow-hidden" />
                    <div className="p-6">
                      <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#009898] mb-2">
                        {p.category}
                      </div>
                      <h3 className="font-black text-gray-900 text-lg mb-2">{p.title}</h3>
                      <p className="text-gray-500 text-[13px] leading-relaxed mb-4">{p.description}</p>
                      <span className="text-[13px] font-bold text-[#009898]">View Project →</span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 4: Run test to verify it passes**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/sections/Work.test.tsx --no-coverage 2>&1
  ```

  Expected: PASS — 4 tests green.

- [ ] **Step 5: Commit**

  ```bash
  cd /Users/samueldempsey/Desktop/sc-creative && git add src/components/sections/Work.tsx src/__tests__/sections/Work.test.tsx && git commit -m "feat: update Work section — premium cards, new wording"
  ```

---

## Task 8: Community section (new)

**Files:**
- Create: `src/components/sections/Community.tsx`
- Create: `src/__tests__/sections/Community.test.tsx`

- [ ] **Step 1: Write the test**

  Create `src/__tests__/sections/Community.test.tsx`:

  ```tsx
  import { render, screen } from '@testing-library/react'
  import Community from '@/components/sections/Community'

  describe('Community', () => {
    it('renders the eyebrow', () => {
      render(<Community />)
      expect(screen.getByText(/rooted in our community/i)).toBeInTheDocument()
    })

    it('renders the headline', () => {
      render(<Community />)
      expect(screen.getByText(/proudly serving jasper/i)).toBeInTheDocument()
    })

    it('renders all location items', () => {
      render(<Community />)
      expect(screen.getByText('Jasper, AL')).toBeInTheDocument()
      expect(screen.getByText('Walker County, AL')).toBeInTheDocument()
      expect(screen.getByText('Greater Birmingham')).toBeInTheDocument()
      expect(screen.getByText('Northwest Alabama')).toBeInTheDocument()
    })

    it('renders the testimonial quote', () => {
      render(<Community />)
      expect(screen.getByText(/sc creative transformed/i)).toBeInTheDocument()
    })

    it('renders the testimonial attribution', () => {
      render(<Community />)
      expect(screen.getByText('Josh T.')).toBeInTheDocument()
    })
  })
  ```

- [ ] **Step 2: Run test to verify it fails**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/sections/Community.test.tsx --no-coverage 2>&1
  ```

  Expected: FAIL — component doesn't exist yet.

- [ ] **Step 3: Create Community.tsx**

  Create `src/components/sections/Community.tsx`:

  ```tsx
  // src/components/sections/Community.tsx

  const locations = ['Jasper, AL', 'Walker County, AL', 'Greater Birmingham', 'Northwest Alabama']

  function MapGraphic() {
    return (
      <svg
        viewBox="0 0 200 240"
        className="w-full max-w-[260px] opacity-50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="100" cy="120" r="70" stroke="#009898" strokeWidth="0.8" strokeDasharray="4 4" />
        <circle cx="100" cy="120" r="42" stroke="#009898" strokeWidth="0.5" strokeDasharray="2 6" />
        <circle cx="100" cy="120" r="10" fill="#009898" opacity="0.8" />
        <circle cx="100" cy="120" r="5" fill="#fff" />
        {/* Spoke lines */}
        <line x1="100" y1="110" x2="100" y2="52" stroke="#009898" strokeWidth="0.8" opacity="0.4" />
        <line x1="110" y1="114" x2="162" y2="84" stroke="#009898" strokeWidth="0.8" opacity="0.4" />
        <line x1="110" y1="126" x2="162" y2="156" stroke="#009898" strokeWidth="0.8" opacity="0.4" />
        <line x1="100" y1="130" x2="100" y2="188" stroke="#009898" strokeWidth="0.8" opacity="0.4" />
        <line x1="90" y1="126" x2="38" y2="156" stroke="#009898" strokeWidth="0.8" opacity="0.4" />
        <line x1="90" y1="114" x2="38" y2="84" stroke="#009898" strokeWidth="0.8" opacity="0.4" />
        {/* Outer nodes */}
        <circle cx="100" cy="52" r="5" fill="#009898" opacity="0.7" />
        <circle cx="162" cy="84" r="4" fill="#009898" opacity="0.5" />
        <circle cx="162" cy="156" r="4" fill="#009898" opacity="0.5" />
        <circle cx="100" cy="188" r="5" fill="#009898" opacity="0.6" />
        <circle cx="38" cy="156" r="4" fill="#009898" opacity="0.5" />
        <circle cx="38" cy="84" r="4" fill="#009898" opacity="0.5" />
        {/* Labels */}
        <text x="100" y="42" textAnchor="middle" fill="#009898" opacity="0.8" fontSize="8" fontWeight="600">Jasper</text>
        <text x="170" y="87" textAnchor="start" fill="#009898" opacity="0.5" fontSize="7">Walker Co.</text>
        <text x="170" y="159" textAnchor="start" fill="#009898" opacity="0.5" fontSize="7">Sumiton</text>
        <text x="100" y="204" textAnchor="middle" fill="#009898" opacity="0.5" fontSize="7">Birmingham</text>
        <text x="30" y="159" textAnchor="end" fill="#009898" opacity="0.5" fontSize="7">Cordova</text>
        <text x="30" y="87" textAnchor="end" fill="#009898" opacity="0.5" fontSize="7">Carbon Hill</text>
      </svg>
    )
  }

  export default function Community() {
    return (
      <section className="bg-[#f8fafc] py-24">
        <div className="max-w-[1500px] mx-auto px-8 grid grid-cols-[1fr_280px_1fr] gap-12 items-center">
          {/* Left */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#009898] mb-4">
              Rooted in Our Community
            </div>
            <h2 className="text-[clamp(26px,2.8vw,44px)] font-black text-gray-900 leading-[1.15] mb-5">
              Proudly serving Jasper,<br />Walker County, and beyond.
            </h2>
            <p className="text-[16px] text-gray-500 leading-[1.75] mb-8 max-w-[400px]">
              We&apos;re proud to be part of this community and even more proud to help local
              businesses grow, compete, and win.
            </p>
            <ul className="space-y-3">
              {locations.map((loc) => (
                <li key={loc} className="flex items-center gap-2.5 text-[14px] text-gray-600">
                  <span className="text-[#009898] text-base">📍</span>
                  {loc}
                </li>
              ))}
            </ul>
          </div>

          {/* Center — abstract map */}
          <div className="flex items-center justify-center py-8">
            <MapGraphic />
          </div>

          {/* Right — testimonial */}
          <div>
            <div
              className="bg-white rounded-2xl p-8 border border-gray-100"
              style={{ boxShadow: '0 8px 40px rgba(0,152,152,0.08), 0 2px 12px rgba(0,0,0,0.05)' }}
            >
              <div className="text-5xl text-[#009898] leading-none mb-4 font-serif">&ldquo;</div>
              <p className="text-[15px] text-gray-700 leading-[1.8] mb-6 italic">
                SC Creative transformed the way we present our business online. The new website,
                branding, and SEO strategy have brought us more leads and more customers than
                ever before.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#009898] to-[#0EB1AB] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  J
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">Josh T.</div>
                  <div className="text-gray-400 text-xs">Owner, Construction Company</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 4: Run test to verify it passes**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/sections/Community.test.tsx --no-coverage 2>&1
  ```

  Expected: PASS — 5 tests green.

- [ ] **Step 5: Commit**

  ```bash
  cd /Users/samueldempsey/Desktop/sc-creative && git add src/components/sections/Community.tsx src/__tests__/sections/Community.test.tsx && git commit -m "feat: add Community section with abstract map and testimonial"
  ```

---

## Task 9: Newsletter section (new)

**Files:**
- Create: `src/components/sections/Newsletter.tsx`
- Create: `src/__tests__/sections/Newsletter.test.tsx`

- [ ] **Step 1: Write the test**

  Create `src/__tests__/sections/Newsletter.test.tsx`:

  ```tsx
  import { render, screen } from '@testing-library/react'
  import Newsletter from '@/components/sections/Newsletter'

  describe('Newsletter', () => {
    it('renders the headline', () => {
      render(<Newsletter />)
      expect(screen.getByText(/stay ahead of the growth game/i)).toBeInTheDocument()
    })

    it('renders the subtext', () => {
      render(<Newsletter />)
      expect(screen.getByText(/insights, systems, and strategies/i)).toBeInTheDocument()
    })

    it('renders the email input', () => {
      render(<Newsletter />)
      expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument()
    })

    it('renders the subscribe button', () => {
      render(<Newsletter />)
      expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
    })
  })
  ```

- [ ] **Step 2: Run test to verify it fails**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/sections/Newsletter.test.tsx --no-coverage 2>&1
  ```

  Expected: FAIL — component doesn't exist yet.

- [ ] **Step 3: Create Newsletter.tsx**

  Create `src/components/sections/Newsletter.tsx`:

  ```tsx
  // src/components/sections/Newsletter.tsx
  'use client'
  import { useState } from 'react'

  export default function Newsletter() {
    const [email, setEmail] = useState('')

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault()
      // Email collection to be wired to a service (Mailchimp, ConvertKit, etc.) later
      setEmail('')
    }

    return (
      <section
        className="py-16"
        style={{
          background: 'linear-gradient(135deg, #020617 0%, #071426 60%, #020617 100%)',
        }}
      >
        <div className="max-w-[1500px] mx-auto px-8 flex items-center justify-between gap-12">
          <div>
            <h2 className="text-[clamp(20px,2.5vw,32px)] font-black text-white mb-2">
              Stay ahead of the growth game.
            </h2>
            <p className="text-white/50 text-[15px]">
              Insights, systems, and strategies to help your business grow smarter.
            </p>
          </div>

          <form className="flex gap-3 shrink-0" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-[280px] bg-white/[0.08] backdrop-blur-sm border border-white/[0.12] text-white placeholder:text-white/30 rounded-xl px-5 py-3.5 text-[14px] outline-none focus:border-[#009898]/60 transition-colors"
            />
            <button
              type="submit"
              className="bg-[#009898] text-white font-bold px-7 py-3.5 rounded-xl hover:bg-[#0EB1AB] hover:shadow-[0_0_20px_rgba(14,177,171,0.4)] transition-all duration-200 text-[14px] shrink-0"
            >
              Subscribe →
            </button>
          </form>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 4: Run test to verify it passes**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/sections/Newsletter.test.tsx --no-coverage 2>&1
  ```

  Expected: PASS — 4 tests green.

- [ ] **Step 5: Commit**

  ```bash
  cd /Users/samueldempsey/Desktop/sc-creative && git add src/components/sections/Newsletter.tsx src/__tests__/sections/Newsletter.test.tsx && git commit -m "feat: add Newsletter section"
  ```

---

## Task 10: Footer redesign

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Write updated test**

  Create `src/__tests__/components/Footer.test.tsx`:

  ```tsx
  import { render, screen } from '@testing-library/react'
  import Footer from '@/components/layout/Footer'

  describe('Footer', () => {
    it('renders the SC Creative brand name', () => {
      render(<Footer />)
      expect(screen.getByText('SC Creative')).toBeInTheDocument()
    })

    it('renders Quick Links column', () => {
      render(<Footer />)
      expect(screen.getByText('Quick Links')).toBeInTheDocument()
    })

    it('renders Resources column', () => {
      render(<Footer />)
      expect(screen.getByText('Resources')).toBeInTheDocument()
    })

    it('renders contact email', () => {
      render(<Footer />)
      expect(screen.getByRole('link', { name: /info@samcolecreative\.com/i })).toBeInTheDocument()
    })

    it('renders contact phone', () => {
      render(<Footer />)
      expect(screen.getByRole('link', { name: /678.*997.*1106/i })).toBeInTheDocument()
    })

    it('renders Get In Touch CTA', () => {
      render(<Footer />)
      expect(screen.getByRole('link', { name: /get in touch/i })).toBeInTheDocument()
    })

    it('renders Privacy Policy and Terms links', () => {
      render(<Footer />)
      expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /terms of service/i })).toBeInTheDocument()
    })
  })
  ```

- [ ] **Step 2: Run test to verify it fails**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/components/Footer.test.tsx --no-coverage 2>&1
  ```

  Expected: FAIL — current Footer lacks Quick Links, Resources column headings, correct email/phone, Privacy/Terms links.

- [ ] **Step 3: Rewrite Footer.tsx**

  Replace `src/components/layout/Footer.tsx` entirely:

  ```tsx
  // src/components/layout/Footer.tsx
  import Link from 'next/link'

  const quickLinks = [
    { label: 'Work', href: '/work' },
    { label: 'Blueprint', href: '/services/brand-blueprint' },
    { label: 'Branding', href: '/services/visual-branding' },
    { label: 'Website', href: '/services/website-design' },
    { label: 'AI Solutions', href: '/services/ai-systems' },
    { label: 'Growth', href: '/services/growth' },
    { label: 'About', href: '/about' },
  ]

  const resources = [
    { label: 'Blog', href: '/blog' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Process', href: '/process' },
    { label: 'Careers', href: '/careers' },
  ]

  const socials = [
    { id: 'fb', label: 'Facebook', href: '#' },
    { id: 'ig', label: 'Instagram', href: '#' },
    { id: 'li', label: 'LinkedIn', href: '#' },
    { id: 'tw', label: 'Twitter', href: '#' },
    { id: 'yt', label: 'YouTube', href: '#' },
  ]

  export default function Footer() {
    return (
      <footer style={{ background: '#020617' }} className="text-white pt-20 pb-8">
        <div className="max-w-[1500px] mx-auto px-8">
          <div className="grid grid-cols-4 gap-12 mb-16">
            {/* Column 1 — Brand */}
            <div>
              <div className="font-extrabold text-sm tracking-widest uppercase mb-4">SC Creative</div>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Modern growth solutions for businesses across Walker County, Alabama and surrounding areas.
              </p>
              <div className="flex gap-2.5">
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    aria-label={s.label}
                    className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-white/30 text-[10px] font-bold uppercase hover:border-[#009898]/40 hover:text-[#009898] transition-colors"
                  >
                    {s.id}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 — Quick Links */}
            <div>
              <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/30 mb-5">
                Quick Links
              </div>
              <ul className="space-y-3">
                {quickLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-white/50 hover:text-white text-sm transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Resources */}
            <div>
              <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/30 mb-5">
                Resources
              </div>
              <ul className="space-y-3">
                {resources.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-white/50 hover:text-white text-sm transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Contact */}
            <div>
              <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/30 mb-5">
                Contact
              </div>
              <ul className="space-y-3 mb-6">
                <li className="text-white/50 text-sm">Jasper, AL</li>
                <li>
                  <a
                    href="mailto:info@samcolecreative.com"
                    className="text-white/50 hover:text-white text-sm transition-colors"
                  >
                    info@samcolecreative.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+16789971106"
                    className="text-white/50 hover:text-white text-sm transition-colors"
                  >
                    (678) 997-1106
                  </a>
                </li>
              </ul>
              <Link
                href="/contact"
                className="inline-block bg-[#009898] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#0EB1AB] transition-colors text-sm"
              >
                Get In Touch →
              </Link>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between text-white/20 text-xs">
            <span>© {new Date().getFullYear()} SC Creative. All rights reserved.</span>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white/40 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white/40 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  ```

- [ ] **Step 4: Run test to verify it passes**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest src/__tests__/components/Footer.test.tsx --no-coverage 2>&1
  ```

  Expected: PASS — 7 tests green.

- [ ] **Step 5: Commit**

  ```bash
  cd /Users/samueldempsey/Desktop/sc-creative && git add src/components/layout/Footer.tsx src/__tests__/components/Footer.test.tsx && git commit -m "feat: redesign Footer — 4-col layout, correct contact, Privacy/Terms"
  ```

---

## Task 11: Page assembly + full test run

**Files:**
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Update page.tsx with new section order**

  Replace `src/app/(marketing)/page.tsx` entirely:

  ```tsx
  // src/app/(marketing)/page.tsx
  import Hero from '@/components/sections/Hero'
  import TrustBar from '@/components/sections/StatsBar'
  import Ecosystem from '@/components/sections/Systems'
  import PartnerCTA from '@/components/sections/PartnerCTA'
  import Work from '@/components/sections/Work'
  import Community from '@/components/sections/Community'
  import Newsletter from '@/components/sections/Newsletter'

  // Deferred — to be added back in next design phase
  // import Problem from '@/components/sections/Problem'
  // import Process from '@/components/sections/Process'
  // import PackageBuilder from '@/components/sections/PackageBuilder'
  // import About from '@/components/sections/About'
  // import Testimonials from '@/components/sections/Testimonials'

  export default function HomePage() {
    return (
      <>
        <Hero />
        <TrustBar />
        <Ecosystem />
        <PartnerCTA />
        <Work />
        <Community />
        <Newsletter />
      </>
    )
  }
  ```

- [ ] **Step 2: Run the full test suite**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx jest --no-coverage 2>&1
  ```

  Expected: All tests pass. Note any failures and fix before committing.

- [ ] **Step 3: Run the dev build to check for TypeScript/import errors**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/samueldempsey/Desktop/sc-creative && npx next build 2>&1
  ```

  Expected: Build completes successfully with no errors.

- [ ] **Step 4: Final commit**

  ```bash
  cd /Users/samueldempsey/Desktop/sc-creative && git add src/app/(marketing)/page.tsx && git commit -m "feat: assemble redesigned homepage — Hero, TrustBar, Ecosystem, PartnerCTA, Work, Community, Newsletter"
  ```

---

## Done

All 11 tasks complete. The homepage at samueldempsey.com should now reflect the full redesign spec. Deferred sections (Problem, Process, PackageBuilder, About, Testimonials) remain in the codebase and can be restored in the next design phase.

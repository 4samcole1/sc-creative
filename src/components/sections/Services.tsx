'use client'
import { useEffect, useRef, useState } from 'react'
import { t } from '@/lib/typography'

const CARD_H = 152
const CARD_GAP = 16
const VISIBLE = 3
const STEP = CARD_H + CARD_GAP
const MAX_TRANSLATE = (5 - VISIBLE) * STEP   // 2 × 184 = 368px
const WINDOW_H = VISIBLE * CARD_H + (VISIBLE - 1) * CARD_GAP  // 536px

const services = [
  {
    num: '01',
    name: 'Blueprint',
    tagline: 'Clarity & Strategy',
    desc: 'Your positioning, messaging, and market clarity — built before anything else touches a screen.',
    color: '#2adbd7',
  },
  {
    num: '02',
    name: 'Branding',
    tagline: 'Identity & System',
    desc: 'A complete visual identity — from logo to brand guide — built to be consistent, scalable, and impossible to ignore.',
    color: '#1cc7c3',
  },
  {
    num: '03',
    name: 'Website',
    tagline: 'Design & Build',
    desc: 'Custom design and fast load times that reflect the real quality of your business — and convert.',
    color: '#13a9a6',
  },
  {
    num: '04',
    name: 'AI Systems',
    tagline: 'Automate & Scale',
    desc: 'Custom workflows, automations, and integrations that remove bottlenecks and let your business run smarter.',
    color: '#0b8b88',
  },
  {
    num: '05',
    name: 'Growth',
    tagline: 'Traffic & Revenue',
    desc: 'SEO, paid ads, and content strategies that build real visibility locally and beyond — and compound over time.',
    color: '#056c6a',
  },
]

const painPoints = [
  {
    label: 'Unclear messaging',
    service: 'Blueprint',
    solution: 'We build your positioning and brand narrative from the ground up — so your market knows exactly who you are and why you win.',
    cta: 'Clarify Your Message',
    href: '/services/brand-blueprint',
  },
  {
    label: 'Inconsistent branding',
    service: 'Branding',
    solution: 'We create a complete brand system that stays consistent across every touchpoint, building trust every time someone sees you.',
    cta: 'Unify Your Brand',
    href: '/services/visual-branding',
  },
  {
    label: 'Outdated websites',
    service: 'Website',
    solution: 'We build fast, modern websites designed to convert visitors into clients — not just impress them.',
    cta: 'Rebuild Your Presence',
    href: '/services/website-design',
  },
  {
    label: 'Disconnected systems',
    service: 'AI Systems',
    solution: 'We connect your tools and automate your workflows so nothing falls through the cracks between platforms.',
    cta: 'Connect Your Stack',
    href: '/services/ai-systems',
  },
  {
    label: 'Inefficient processes',
    service: 'AI Systems',
    solution: 'We identify where your team is losing time to manual work and replace it with intelligent, automated systems.',
    cta: 'Automate the Work',
    href: '/services/ai-systems',
  },
  {
    label: 'Reactive marketing',
    service: 'Growth',
    solution: 'We build proactive growth strategies with SEO, paid ads, and content that bring the right clients to you — before they find a competitor.',
    cta: 'Start Growing Proactively',
    href: '/services/growth',
  },
]

function ServiceCard({
  service,
  isHovered,
  onEnter,
  onLeave,
}: {
  service: (typeof services)[0]
  isHovered: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        height: CARD_H,
        flexShrink: 0,
        background: isHovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: `3px solid ${service.color}`,
        borderRadius: '12px',
        padding: '16px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        overflow: 'hidden',
        transform: isHovered ? 'translateX(6px)' : 'translateX(0)',
        transition: 'background 0.25s ease, transform 0.25s ease, border-color 0.25s ease',
        boxSizing: 'border-box',
      }}
    >
      <div>
        <p
          style={{
            ...t.cardLabel,
            color: service.color,
            marginBottom: '4px',
            opacity: 0.85,
          }}
        >
          {service.num} — {service.tagline}
        </p>
        <h3
          style={{
            ...t.h3,
            color: '#f5f7fb',
            marginBottom: '6px',
          }}
        >
          {service.name}
        </h3>
        <p style={{ ...t.small, color: '#8a9aab' }}>
          {service.desc}
        </p>
      </div>

      <div
        style={{
          fontSize: '11.5px',
          fontWeight: 700,
          color: service.color,
          letterSpacing: '0.05em',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(0)' : 'translateX(-10px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
      >
        Learn More →
      </div>
    </div>
  )
}

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [translateY, setTranslateY] = useState(0)
  const [progress, setProgress] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const [hoveredPain, setHoveredPain] = useState<number | null>(null)
  const [activePain, setActivePain] = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      const scrolled = -top
      // Animation completes over first 120vh of scroll, then section holds
      const animPx = window.innerHeight * 1.2
      const prog = Math.max(0, Math.min(1, scrolled / animPx))
      setProgress(prog)
      setTranslateY(prog * MAX_TRANSLATE)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const showArrow = progress < 0.92

  return (
    <div ref={sectionRef} style={{ height: '270vh', position: 'relative', background: 'var(--section-dark)' }}>
      <style>{`
        @keyframes bounce-down {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50%       { transform: translateY(7px); opacity: 1; }
        }
        .arrow-bounce { animation: bounce-down 1.5s ease-in-out infinite; }
        @keyframes popup-in {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pain-popup { animation: popup-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .pain-item {
          display: flex; align-items: center; gap: 10px;
          font-size: 14px; color: #cfd6dd;
          cursor: pointer; padding: 4px 6px; border-radius: 6px;
          transition: color 0.18s ease, background 0.18s ease;
          user-select: none;
        }
        .pain-item:hover { color: #f0f4f8; background: rgba(255,255,255,0.04); }
        .pain-icon {
          width: 18px; height: 18px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; line-height: 1; flex-shrink: 0;
          transition: background 0.18s ease, color 0.18s ease;
        }
      `}</style>

      {/* Sticky viewport — offset by nav height so content centres in visible area */}
      <div
        style={{
          position: 'sticky',
          top: 88,   // nav top(16) + nav height(72)
          height: 'calc(100vh - 88px)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
            padding: '80px 40px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'end',
          }}
        >
          {/* ── Left: copy ── */}
          {/* paddingBottom matches the scroll indicator height so the content bottom
              aligns with the card window bottom, indicator sits below both */}
          <div style={{ paddingBottom: '60px' }}>
            <p style={{ ...t.eyebrow, marginBottom: '20px' }}>
              Why Businesses Struggle
            </p>

            <h2
              style={{
                ...t.h2,
                color: '#f5f7fb',
                marginBottom: '28px',
              }}
            >
              Most Businesses Aren&apos;t Lacking Potential.
              <br />
              They&apos;re Lacking{' '}
              <span style={{ color: '#1cc7c3' }}>Alignment.</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start', position: 'relative' }}>

              {/* Body copy — fades out when a pain point is active */}
              <div style={{ transition: 'opacity 0.2s ease', opacity: activePain !== null ? 0 : 1, pointerEvents: activePain !== null ? 'none' : 'auto' }}>
                <p style={{ ...t.body, color: '#8a9aab', marginBottom: '14px' }}>
                  A website is redesigned. Marketing campaigns launch. Software gets purchased. Ads start running.
                </p>
                <p style={{ ...t.body, color: '#8a9aab' }}>
                  Yet growth remains inconsistent — not because the business lacks potential, but because the pieces aren&apos;t working together.
                </p>
              </div>

              {/* Solution popup — slides in over the body copy column */}
              {activePain !== null && (
                <div
                  className="pain-popup"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 'calc(50% - 16px)',
                    background: 'rgba(18,32,48,0.96)',
                    border: '1px solid rgba(28,199,195,0.25)',
                    borderLeft: '3px solid #1cc7c3',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    zIndex: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '16px' }}>💡</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1cc7c3' }}>
                      SC Creative Solution
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#dde4ec', lineHeight: 1.65, marginBottom: '12px' }}>
                    {painPoints[activePain].solution}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <a
                      href={painPoints[activePain].href}
                      style={{ fontSize: '11.5px', fontWeight: 700, color: '#1cc7c3', letterSpacing: '0.05em', textDecoration: 'none' }}
                    >
                      {painPoints[activePain].cta} →
                    </a>
                    <button
                      onClick={() => setActivePain(null)}
                      style={{ background: 'none', border: 'none', color: '#5a6a7a', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '2px 4px' }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Pain points list */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {painPoints.map((point, i) => {
                  const isActive = activePain === i
                  const isHov = hoveredPain === i
                  return (
                    <li
                      key={point.label}
                      className="pain-item"
                      style={{ color: isActive ? '#1cc7c3' : undefined }}
                      onMouseEnter={() => setHoveredPain(i)}
                      onMouseLeave={() => setHoveredPain(null)}
                      onClick={() => setActivePain(isActive ? null : i)}
                    >
                      <span
                        className="pain-icon"
                        style={{
                          background: isActive
                            ? 'rgba(28,199,195,0.18)'
                            : isHov
                            ? 'rgba(255,255,255,0.08)'
                            : 'transparent',
                          color: isActive ? '#1cc7c3' : isHov ? '#f0f4f8' : '#1cc7c3',
                        }}
                      >
                        {isHov && !isActive ? '?' : '×'}
                      </span>
                      {point.label}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* ── Right: scrolling card window ── */}
          <div style={{ position: 'relative' }}>
            {/* Card window — top fade grows in as scroll begins so card 1 starts fully visible */}
            <div
              style={{
                height: WINDOW_H,
                overflow: 'hidden',
                position: 'relative',
                WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black ${Math.min(8, progress * 200)}%, black ${Math.min(100, 80 + Math.max(0, (progress - 0.8) * 100))}%, transparent 100%)`,
                maskImage: `linear-gradient(to bottom, transparent 0%, black ${Math.min(8, progress * 200)}%, black ${Math.min(100, 80 + Math.max(0, (progress - 0.8) * 100))}%, transparent 100%)`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: CARD_GAP,
                  transform: `translateY(-${translateY}px)`,
                  transition: 'transform 0.06s ease-out',
                  willChange: 'transform',
                }}
              >
                {services.map((s, i) => (
                  <ServiceCard
                    key={s.num}
                    service={s}
                    isHovered={hovered === i}
                    onEnter={() => setHovered(i)}
                    onLeave={() => setHovered(null)}
                  />
                ))}
              </div>
            </div>

            {/* Scroll arrow */}
            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                opacity: showArrow ? 1 : 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#1cc7c3',
                  opacity: 0.7,
                }}
              >
                Scroll to explore
              </span>
              <svg
                className="arrow-bounce"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                style={{ color: '#1cc7c3' }}
              >
                <path
                  d="M9 3v12M3 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

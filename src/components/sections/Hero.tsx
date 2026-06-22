// src/components/sections/Hero.tsx
import Link from 'next/link'
import { MapPin, Settings, TrendingUp } from 'lucide-react'
import HeroNetwork from './HeroNetwork'
import Btn from '@/components/ui/Btn'
import { t } from '@/lib/typography'

const cards = [
  {
    Icon: MapPin,
    title: 'Local Focus',
    tagline: 'Walker County & Beyond',
    desc: 'Rooted in Jasper, built for your market.',
    href: '/about',
    delay: '0.5s',
  },
  {
    Icon: Settings,
    title: 'Modern Solutions',
    tagline: 'Design & Intelligent Systems',
    desc: 'Strategy, branding, websites, and AI — integrated.',
    href: '/services',
    delay: '0.65s',
  },
  {
    Icon: TrendingUp,
    title: 'Growth Driven',
    tagline: 'Built to Scale. Built to Last.',
    desc: 'Every system we build compounds over time.',
    href: '/services/growth',
    delay: '0.8s',
  },
]

export default function Hero() {
  return (
    <section
      className="relative w-full"
      style={{ background: '#f4f7fb', overflow: 'hidden' }}
    >
      <style>{`
        @keyframes left-enter {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes card-enter {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .hero-left-content {
          animation: left-enter 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
        }
        .hero-feat-card {
          animation: card-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
          transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .hero-feat-card:hover {
          background: #ffffff !important;
          transform: translateX(5px);
          box-shadow: 0 12px 32px rgba(13,21,32,0.12);
        }
      `}</style>

      {/* Grid texture — dark lines, full bleed across the light background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(13,21,32,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(13,21,32,0.022) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }}
      />

      {/* Animated node network (teal on light) */}
      <HeroNetwork />

      {/* Radial teal glow — upper right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 65% at 85% 40%, rgba(28,199,195,0.10) 0%, transparent 70%)',
        }}
      />

      {/* Soft left wash so text stays crisp on the light background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(244,247,251,0.85) 0%, rgba(244,247,251,0.35) 50%, transparent 100%)',
        }}
      />

      {/* Content grid */}
      {/* nav is fixed (bottom edge at 88px); paddingTop = 88 + gap so the space
          below the nav equals the space below the hero text (gap = 72px) */}
      <div
        className="relative z-10"
        style={{ width: '100%', paddingTop: '160px', paddingBottom: '72px' }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 40px',
            display: 'grid',
            gridTemplateColumns: '65fr 35fr',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* ── Left column ── */}
          <div className="hero-left-content">
            <p style={{ ...t.eyebrow, marginBottom: '20px' }}>
              Modern Growth Solutions
            </p>

            <h1
              style={{
                ...t.h1,
                color: '#0b1520',
                marginBottom: '24px',
              }}
            >
              Build a Smarter Foundation for{' '}
              <span style={{ color: '#13a9a6' }}>Growth.</span>
            </h1>

            <p style={{ ...t.body, color: '#5a6a7a', marginBottom: '10px', maxWidth: '620px' }}>
              SC Creative helps businesses across Jasper, Walker County, and beyond grow through
              strategic clarity, modern branding, high-performance websites, and intelligent systems.
            </p>

            <p style={{ ...t.body, color: '#5a6a7a', marginBottom: '36px', maxWidth: '620px' }}>
              Whether you&apos;re launching, modernizing, or scaling — we build the infrastructure
              behind long-term success.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Btn href="/contact" variant="primary">Start Your Project +</Btn>
              <Btn href="/process" variant="light">Explore Our Process</Btn>
            </div>
          </div>

          {/* ── Right column — 3 stacked feature cards ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cards.map(({ Icon, title, tagline, desc, href, delay }) => (
              <Link
                key={title}
                href={href}
                className="hero-feat-card"
                style={{
                  animationDelay: delay,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px 22px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.72)',
                  border: '1px solid rgba(13,21,32,0.08)',
                  borderLeft: '3px solid #1cc7c3',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 6px 22px rgba(13,21,32,0.06)',
                  textDecoration: 'none',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(28,199,195,0.12)',
                    border: '1px solid rgba(28,199,195,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={19} style={{ color: '#0EB1AB' }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0b1520', lineHeight: 1.2, marginBottom: '3px' }}>
                    {title}
                  </p>
                  <p style={{ fontSize: '12px', color: '#8a98a6', lineHeight: 1.4, marginBottom: '4px' }}>
                    {tagline}
                  </p>
                  <p style={{ fontSize: '12px', color: '#5a6a7a', lineHeight: 1.5 }}>
                    {desc}
                  </p>
                </div>

                <span style={{ fontSize: '14px', color: '#b0bcc8', flexShrink: 0 }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

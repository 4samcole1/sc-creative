// src/components/sections/Hero.tsx
import Link from 'next/link'
import { MapPin, Settings, TrendingUp } from 'lucide-react'
import HeroNetwork from './HeroNetwork'

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
    <section className="relative w-full h-screen overflow-hidden">
      <style>{`
        @keyframes left-enter {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawer-enter {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .hero-left-content {
          animation: left-enter 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
        }
        .hero-drawer {
          width: 280px;
          animation: drawer-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
          transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                      background 0.3s ease,
                      box-shadow 0.3s ease;
          cursor: pointer;
        }
        .hero-drawer:hover {
          width: 380px;
          background: rgba(18, 30, 44, 0.85) !important;
          box-shadow: -12px 0 40px rgba(0,0,0,0.35);
        }
        .drawer-desc {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.35s ease, opacity 0.25s ease;
        }
        .hero-drawer:hover .drawer-desc {
          max-height: 100px;
          opacity: 1;
        }
        .drawer-cta {
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.25s ease 0.1s, transform 0.25s ease 0.1s;
        }
        .hero-drawer:hover .drawer-cta {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* Base dark background */}
      <div className="absolute inset-0" style={{ background: '#0b1520' }} />

      {/* Animated node network */}
      <HeroNetwork />

      {/* Radial teal glow — right side light source */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 80% 50%, rgba(28,199,195,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Left-side vignette to keep text crisp */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(11,21,32,0.6) 0%, rgba(11,21,32,0.2) 50%, transparent 100%)',
        }}
      />

      {/* Left content — within 1200px container, ~60% wide */}
      <div
        className="absolute inset-0 flex items-center"
        style={{ paddingTop: '88px' }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 40px',
          }}
        >
          <div className="hero-left-content" style={{ maxWidth: '730px' }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#1cc7c3',
                marginBottom: '20px',
              }}
            >
              Modern Growth Solutions
            </p>

            <h1
              style={{
                fontSize: 'clamp(36px, 4vw, 54px)',
                fontWeight: 800,
                lineHeight: 1.08,
                color: '#f5f7fb',
                marginBottom: '24px',
              }}
            >
              Build a Smarter Foundation for{' '}
              <span style={{ color: '#1cc7c3' }}>Growth.</span>
            </h1>

            <p style={{ fontSize: '15px', color: '#9aaab6', lineHeight: 1.72, marginBottom: '10px', maxWidth: '660px' }}>
              SC Creative helps businesses across Jasper, Walker County, and beyond grow through
              strategic clarity, modern branding, high-performance websites, and intelligent systems.
            </p>

            <p style={{ fontSize: '15px', color: '#9aaab6', lineHeight: 1.72, marginBottom: '36px', maxWidth: '660px' }}>
              Whether you&apos;re launching, modernizing, or scaling — we build the infrastructure
              behind long-term success.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
              <Link
                href="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  padding: '12px 26px',
                  borderRadius: '10px',
                  background: '#1cc7c3',
                  color: '#07262b',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(28,199,195,0.28)',
                }}
              >
                Start Your Project +
              </Link>
              <Link
                href="/process"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '12px 26px',
                  borderRadius: '10px',
                  color: '#dbe3ea',
                  textDecoration: 'none',
                  border: '1.5px solid rgba(255,255,255,0.16)',
                }}
              >
                Explore Our Process
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#7a8898', fontSize: '13px', lineHeight: 1.55 }}>
              <MapPin size={15} style={{ color: '#1cc7c3', flexShrink: 0, marginTop: '2px' }} />
              <span>
                Proudly based in Jasper, Alabama — serving Walker County, Greater Birmingham,
                Northwest Alabama, and businesses nationwide.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right cards — flush to viewport right edge, drawer-expand on hover */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(calc(-50% + 44px))',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 20,
          alignItems: 'flex-end',
        }}
      >
        {cards.map(({ Icon, title, tagline, desc, href, delay }) => (
          <Link
            key={title}
            href={href}
            className="hero-drawer"
            style={{
              animationDelay: delay,
              display: 'block',
              padding: '18px 24px',
              borderRadius: '14px 0 0 14px',
              background: 'rgba(12,22,34,0.72)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRight: 'none',
              borderLeft: '3px solid #1cc7c3',
              textDecoration: 'none',
              overflow: 'hidden',
            }}
          >
            {/* Icon + title row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '9px',
                  background: 'rgba(28,199,195,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={18} style={{ color: '#1cc7c3' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#f0f4f8', lineHeight: 1.2 }}>
                  {title}
                </p>
                <p style={{ fontSize: '11.5px', color: '#6b7a88', marginTop: '2px', lineHeight: 1.3 }}>
                  {tagline}
                </p>
              </div>
            </div>

            {/* Expanded content */}
            <div className="drawer-desc" style={{ paddingLeft: '52px' }}>
              <p style={{ fontSize: '12.5px', color: '#8a9aaa', lineHeight: 1.55, marginTop: '10px', marginBottom: '12px' }}>
                {desc}
              </p>
              <span
                className="drawer-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#1cc7c3',
                  letterSpacing: '0.04em',
                }}
              >
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

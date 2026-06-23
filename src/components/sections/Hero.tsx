// src/components/sections/Hero.tsx
import HeroNetwork from './HeroNetwork'
import Btn from '@/components/ui/Btn'
import OnboardingForm from './OnboardingForm'
import { t } from '@/lib/typography'

export default function Hero() {
  return (
    <section
      className="relative w-full"
      style={{ background: 'var(--section-light)', overflow: 'hidden' }}
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

          {/* ── Right column — onboarding / quote form ── */}
          <OnboardingForm />
        </div>
      </div>
    </section>
  )
}

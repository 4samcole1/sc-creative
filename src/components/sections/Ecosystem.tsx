'use client'
// src/components/sections/Ecosystem.tsx
import React, { useRef, useState } from 'react'
import {
  Brain, BarChart3, Palette, MonitorSmartphone,
  Map as MapIcon, Zap, LineChart,
} from 'lucide-react'
import { t } from '@/lib/typography'

// ─── Shared card chrome (dark theme) ─────────────────────────────────────
const cardBase: React.CSSProperties = {
  position: 'relative',
  background: 'rgba(255,255,255,0.025)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
  padding: '28px',
  overflow: 'hidden',
}

function Tag({ label, color, Icon }: { label: string; color: string; Icon: React.ElementType }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
      <span
        style={{
          ...t.cardLabel,
          color,
          background: `${color}14`,
          border: `1px solid ${color}2e`,
          borderRadius: '999px',
          padding: '5px 11px',
        }}
      >
        {label}
      </span>
      <Icon size={18} style={{ color, opacity: 0.85 }} />
    </div>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 style={{ ...t.h4, fontSize: '19px', color: '#f0f4f8', marginBottom: '8px' }}>{children}</h3>
}

function CardDesc({ children }: { children: React.ReactNode }) {
  return <p style={{ ...t.small, color: '#7a8898', margin: 0 }}>{children}</p>
}

// ─── Hero card 1: AI Systems (chat mockup, 3D tilt) ──────────────────────
const SUBTASKS = [
  'Capture the lead',
  'Qualify & score',
  'Notify your team',
  'Send follow-up email',
  'Log to CRM',
]

const FLAT = 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale(1)'

function AICard() {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState(FLAT)

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5   // -0.5 (left) .. 0.5 (right)
    const py = (e.clientY - r.top) / r.height - 0.5   // -0.5 (top)  .. 0.5 (bottom)
    const MAX = 3
    const ry = px * 2 * MAX        // turn toward cursor on X
    const rx = -py * 2 * MAX       // tilt toward cursor on Y
    setTransform(`perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.005)`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setTransform(FLAT)}
      className="eco-card eco-card-tilt"
      style={{
        ...cardBase,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        ['--eco-glow' as string]: '#1cc7c3',
        transform,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.12s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
        willChange: 'transform',
      } as React.CSSProperties}
    >
      <Tag label="AI SYSTEMS" color="#1cc7c3" Icon={Brain} />
      <CardTitle>Your AI teammate that plans, builds, and automates</CardTitle>
      <CardDesc>Ask in plain English. Get workflows mapped, built, and running — instantly.</CardDesc>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', margin: '24px 0' }}>
        {/* User prompt bubble */}
        <div
          className="eco-fade"
          style={{
            alignSelf: 'flex-end',
            maxWidth: '78%',
            background: 'rgba(28,199,195,0.12)',
            border: '1px solid rgba(28,199,195,0.22)',
            borderRadius: '12px 12px 4px 12px',
            padding: '10px 14px',
            fontSize: '13px',
            color: '#cfe9e8',
          }}
        >
          Build a lead follow-up sequence
        </div>

        {/* AI response */}
        <div
          className="eco-fade eco-fade-2"
          style={{
            alignSelf: 'flex-start',
            maxWidth: '88%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px 12px 12px 4px',
            padding: '12px 14px',
          }}
        >
          <p style={{ fontSize: '12px', color: '#aeb9c5', margin: '0 0 8px' }}>
            <span style={{ color: '#1cc7c3', fontWeight: 700 }}>✦ SC AI</span>　Creating 5 steps:
          </p>
          {SUBTASKS.map((s, i) => (
            <p key={s} style={{ fontSize: '12.5px', color: '#c4cdd8', margin: '3px 0', lineHeight: 1.4 }}>
              <span style={{ color: '#1cc7c3', fontWeight: 700 }}>{['①', '②', '③', '④', '⑤'][i]}</span> {s}
            </p>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '11px 14px',
        }}
      >
        <span style={{ fontSize: '13px', color: '#5a6a7a', flex: 1 }}>Ask SC anything…</span>
        <span style={{ fontSize: '11px', color: '#3a4a5a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '5px', padding: '2px 6px' }}>↵</span>
      </div>
    </div>
  )
}

// ─── Hero card 2: Growth analytics (bar chart) ───────────────────────────
const BARS = [28, 34, 30, 42, 38, 48, 44, 56, 52, 64, 60, 78]

function GrowthCard() {
  return (
    <div className="eco-card" style={{ ...cardBase, ['--eco-glow' as string]: '#30c060' } as React.CSSProperties}>
      <Tag label="GROWTH" color="#30c060" Icon={BarChart3} />
      <CardTitle>Real-time leads &amp; revenue</CardTitle>
      <CardDesc>See exactly where your pipeline stands at any moment.</CardDesc>

      <div style={{ marginTop: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '90px' }}>
          {BARS.map((h, i) => {
            const last = i === BARS.length - 1
            return (
              <div
                key={i}
                className="eco-bar"
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: last ? '#30c060' : 'rgba(48,192,96,0.28)',
                  borderRadius: '3px 3px 0 0',
                  animationDelay: `${i * 0.05}s`,
                  transformOrigin: 'bottom',
                }}
              />
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <span style={{ fontSize: '11px', color: '#4a5a6a' }}>Month start</span>
          <span style={{ fontSize: '11px', color: '#30c060', fontWeight: 700 }}>Today ▲ +28%</span>
        </div>
      </div>
    </div>
  )
}

// ─── Wide card: Blueprint (roadmap rows) ─────────────────────────────────
const MILESTONES = [
  { label: 'Positioning locked', tag: 'strategy', done: true },
  { label: 'Messaging framework', tag: 'brand', done: true },
  { label: 'Channel & growth plan', tag: 'growth', done: false },
]

function BlueprintCard() {
  return (
    <div className="eco-card" style={{ ...cardBase, ['--eco-glow' as string]: '#a060f0' } as React.CSSProperties}>
      <Tag label="BLUEPRINT" color="#a060f0" Icon={MapIcon} />
      <CardTitle>Strategy mapped before we build</CardTitle>
      <CardDesc>Positioning, messaging, and a clear plan — zero guesswork.</CardDesc>

      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {MILESTONES.map(m => (
          <div
            key={m.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '9px 12px',
            }}
          >
            <span style={{ fontSize: '12px', color: '#7a8898', flex: 1 }}>{m.label}</span>
            <span style={{ fontSize: '10px', color: '#a060f0', background: 'rgba(160,96,240,0.12)', borderRadius: '5px', padding: '2px 8px', fontWeight: 600 }}>{m.tag}</span>
            <span
              style={{
                width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 800,
                background: m.done ? 'rgba(48,192,96,0.15)' : 'rgba(240,160,32,0.15)',
                color: m.done ? '#30c060' : '#f0a020',
              }}
            >
              {m.done ? '✓' : '○'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Small cards (with hover "More info" → popup) ────────────────────────
function SmallCard({ label, color, Icon, title, desc, more }: {
  label: string; color: string; Icon: React.ElementType; title: string; desc: string; more: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="eco-card eco-card-sm"
      style={{ ...cardBase, height: '100%', display: 'flex', flexDirection: 'column', ['--eco-glow' as string]: color } as React.CSSProperties}
    >
      <Tag label={label} color={color} Icon={Icon} />
      <CardTitle>{title}</CardTitle>
      <CardDesc>{desc}</CardDesc>

      <button className="eco-more-btn" onClick={() => setOpen(true)}>
        More info →
      </button>

      {open && (
        <div
          className="eco-popup"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(7,12,20,0.95)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            borderLeft: `3px solid ${color}`,
            padding: '24px 26px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ ...t.cardLabel, color }}>{label}</span>
            <button
              className="eco-popup-close"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <h3 style={{ ...t.h4, fontSize: '16px', color: '#f0f4f8', marginBottom: '10px' }}>{title}</h3>
          <p style={{ ...t.small, color: '#9aa8b6', margin: 0, overflowY: 'auto' }}>{more}</p>
        </div>
      )}
    </div>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────
export default function Ecosystem() {
  return (
    <section
      style={{
        position: 'relative',
        background: 'var(--section-dark)',
        padding: '72px 0',
        overflow: 'hidden',
      }}
    >
      {/* Grid texture + glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to bottom, #000 0%, #000 86%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 86%, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '760px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(28,199,195,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <style>{`
        @keyframes eco-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .eco-fade   { animation: eco-fade-in 0.5s ease both; animation-delay: 0.15s; }
        .eco-fade-2 { animation-delay: 0.45s; }
        @keyframes eco-bar-grow {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
        .eco-bar { animation: eco-bar-grow 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }

        .eco-card {
          --eco-glow: #1cc7c3;
          transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 18px 50px rgba(0,0,0,0.35);
        }
        .eco-card:hover {
          transform: translateY(-4px);
          border-color: color-mix(in srgb, var(--eco-glow) 42%, transparent);
          background: rgba(255,255,255,0.04);
          box-shadow: 0 24px 60px rgba(0,0,0,0.45);
        }
        /* AI card drives its own transform (3D tilt) via inline style */
        .eco-card-tilt:hover { transform: none; }

        /* "More info" hover button on the small cards */
        .eco-more-btn {
          margin-top: auto;
          align-self: flex-start;
          background: transparent;
          border: none;
          padding: 8px 0 0;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--eco-glow);
          cursor: pointer;
          opacity: 0;
          transform: translateY(5px);
          transition: opacity 0.22s ease, transform 0.22s ease;
        }
        .eco-card-sm:hover .eco-more-btn,
        .eco-card-sm:focus-within .eco-more-btn { opacity: 1; transform: translateY(0); }
        .eco-more-btn:hover { text-decoration: underline; }

        .eco-popup { animation: eco-pop-in 0.2s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes eco-pop-in {
          from { opacity: 0; transform: scale(0.98); }
          to   { opacity: 1; transform: scale(1); }
        }
        .eco-popup-close {
          background: none; border: none; cursor: pointer;
          color: #5a6a7a; font-size: 20px; line-height: 1; padding: 0;
          transition: color 0.15s ease;
        }
        .eco-popup-close:hover { color: #d0dae4; }
      `}</style>

      <div style={{ position: 'relative', zIndex: 5, maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 64px' }}>
          <p style={{ ...t.eyebrow, marginBottom: '18px' }}>One Connected Partner</p>
          <h2 style={{ ...t.h2, color: '#f0f4f8', marginBottom: '18px' }}>
            Everything your growth needs,{' '}
            <span style={{ color: '#1cc7c3' }}>in one place</span>
          </h2>
          <p style={{ ...t.body, color: '#7a8898', margin: 0 }}>
            Strategy, branding, websites, automation, and growth — connected into one system,
            not six disconnected vendors.
          </p>
        </div>

        {/* Bento grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'stretch' }}>
          {/* Left macro column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AICard />
            <BlueprintCard />
          </div>

          {/* Right macro column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <GrowthCard />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1 }}>
              <SmallCard
                label="BRANDING" color="#f0a020" Icon={Palette}
                title="One brand, consistent everywhere"
                desc="A complete identity system that builds trust on every touchpoint."
                more="From logo and color system to voice and typography, we build a complete brand guide your whole team can apply — so every email, post, and page feels unmistakably you. Consistency is what turns recognition into trust."
              />
              <SmallCard
                label="WEBSITES" color="#5a7aff" Icon={MonitorSmartphone}
                title="Built to convert, not just impress"
                desc="Fast, modern sites designed around turning visitors into clients."
                more="We design and build custom, mobile-first sites on a modern stack — no bloated templates. Every layout is structured around a clear path to contact, book, or buy, with the speed and SEO foundations to back it up."
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1 }}>
              <SmallCard
                label="SPEED" color="#13c8d4" Icon={Zap}
                title="Under 1s load times"
                desc="Performance that keeps visitors — and search rankings — on your side."
                more="Core Web Vitals aren't optional anymore. We optimize images, code, and hosting so pages load in under a second — keeping bounce rates down, conversions up, and Google on your side."
              />
              <SmallCard
                label="REPORTING" color="#f06090" Icon={LineChart}
                title="Know what's working, early"
                desc="Clear reporting that turns raw numbers into the next right move."
                more="You get a single dashboard tying together traffic, leads, and revenue — plus a plain-English read on what it means and what to do next. No vanity metrics, just the signal that drives decisions."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

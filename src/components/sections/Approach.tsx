'use client'
// src/components/sections/Approach.tsx
import { useState } from 'react'
import { Zap, Lightbulb, Play } from 'lucide-react'
import { t } from '@/lib/typography'

interface Item {
  id: string
  label: string
  desc: string
}

const traditionalItems: Item[] = [
  { id: 't1', label: 'Website', desc: 'A standalone site with no strategy behind it is just an online brochure — easy to build, hard to grow from.' },
  { id: 't2', label: 'Logo', desc: 'A logo alone doesn\'t build a brand. Brand is the full system — voice, visuals, positioning, and consistency.' },
  { id: 't3', label: 'Ads', desc: 'Paid ads without a strong brand and conversion system burn budget fast and rarely compound.' },
  { id: 't4', label: 'Monthly Reports', desc: 'Reports without connected action are just numbers. Growth comes from decisions, not dashboards.' },
  { id: 't5', label: 'Short-Term Tactics', desc: 'Tactics produce spikes. Systems produce momentum. Most agencies are built for the former.' },
  { id: 't6', label: 'Disconnected Services', desc: 'When vendors don\'t talk to each other, your brand, messaging, and data all suffer for it.' },
]

const ecosystemItems: Item[] = [
  { id: 's1', label: 'Strategy', desc: 'Every engagement starts with clarity — who you serve, how you\'re positioned, and what success actually looks like.' },
  { id: 's2', label: 'Branding', desc: 'A complete brand system: identity, voice, and visual language built to hold up across every channel and context.' },
  { id: 's3', label: 'Websites', desc: 'Performance-first sites designed to convert visitors into leads — not just look good in a portfolio.' },
  { id: 's4', label: 'Intelligent Systems', desc: 'AI and automation workflows that reduce manual work, speed up decisions, and scale with your business.' },
  { id: 's5', label: 'Growth Infrastructure', desc: 'The foundation behind growth: analytics, SEO, CRM, and channels — all aligned and talking to each other.' },
  { id: 's6', label: 'Long-Term Partnership', desc: 'We stay in your corner past launch. Not a one-time vendor — an ongoing partner invested in your results.' },
]

function ItemRow({
  item,
  type,
  onHover,
}: {
  item: Item
  type: 'traditional' | 'ecosystem'
  onHover: (h: { desc: string; isTrad: boolean } | null) => void
}) {
  const [hovered, setHovered] = useState(false)

  const isTrad = type === 'traditional'
  const iconColor = isTrad ? '#cc4444' : '#13a9a6'
  const iconBg = isTrad ? 'rgba(200,50,50,0.07)' : 'rgba(28,199,195,0.12)'
  const iconBorder = isTrad ? 'rgba(200,50,50,0.16)' : 'rgba(28,199,195,0.3)'
  const symbol = isTrad ? '✕' : '✓'

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'default',
          borderRadius: '8px',
          padding: '3px 4px',
          margin: '-3px -4px',
          transition: 'background 0.15s ease',
          background: hovered ? (isTrad ? 'rgba(200,50,50,0.04)' : 'rgba(28,199,195,0.06)') : 'transparent',
        }}
        onMouseEnter={() => {
          setHovered(true)
          onHover({ desc: item.desc, isTrad })
        }}
        onMouseLeave={() => {
          setHovered(false)
          onHover(null)
        }}
      >
        <span
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: hovered ? 'rgba(90,90,160,0.1)' : iconBg,
            border: `1px solid ${hovered ? 'rgba(90,90,160,0.25)' : iconBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '9px',
            color: hovered ? '#7a7aaa' : iconColor,
            fontWeight: 700,
            transition: 'all 0.15s ease',
          }}
        >
          {hovered ? '?' : symbol}
        </span>
        <span
          style={{
            fontSize: '13px',
            color: isTrad ? '#7a8a9a' : '#2a3a4a',
            fontWeight: 500,
            transition: 'color 0.15s ease',
          }}
        >
          {item.label}
        </span>
      </div>
    </div>
  )
}

export default function Approach() {
  const [hoveredItem, setHoveredItem] = useState<{ desc: string; isTrad: boolean } | null>(null)

  return (
    <section style={{ background: 'var(--section-light)', padding: '72px 0' }}>
      <style>{`
        .approach-card-trad {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .approach-card-trad:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 56px rgba(0,0,0,0.10);
        }
        .approach-card-sc {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .approach-card-sc:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 56px rgba(28,199,195,0.18);
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '45fr 55fr',
            gap: '80px',
            alignItems: 'start',
          }}
        >
          {/* ── Left column — header + video placeholder ── */}
          <div>
            <p style={{ ...t.eyebrow, marginBottom: '20px' }}>
              A Different Approach
            </p>

            <h2
              style={{
                ...t.h2,
                color: '#0b1520',
                marginBottom: '36px',
              }}
            >
              Most Agencies Focus on Tactics.{' '}
              <span style={{ color: '#1cc7c3' }}>We Focus on Systems.</span>
            </h2>

            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0b1520 0%, #14263a 100%)',
                border: '1px solid rgba(28,199,195,0.18)',
                boxShadow: '0 24px 56px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(28,199,195,0.14)',
                  border: '1px solid rgba(28,199,195,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Play size={26} style={{ color: '#1cc7c3', marginLeft: '4px' }} fill="#1cc7c3" />
              </div>
              <span
                style={{
                  ...t.cardLabel,
                  position: 'absolute',
                  bottom: '20px',
                  left: '24px',
                  color: 'rgba(255,255,255,0.55)',
                }}
              >
                Video Placeholder
              </span>
            </div>
          </div>

          {/* ── Right column ── */}
          <div>
            {/* Comparison cards + VS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 52px 1fr',
                alignItems: 'stretch',
                marginBottom: '16px',
              }}
            >
              {/* Traditional card */}
              <div
                className="approach-card-trad"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '16px 0 0 16px',
                  padding: '28px 24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ ...t.cardLabel, color: '#9aabbc', marginBottom: '6px' }}>
                    Traditional Agency
                  </p>
                  <h3 style={{ ...t.h4, color: '#3a4a5a' }}>
                    Individual Services Model
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  {traditionalItems.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      type="traditional"
                      onHover={setHoveredItem}
                    />
                  ))}
                </div>
              </div>

              {/* VS badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#0b1520',
                    border: '2px solid #1cc7c3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#1cc7c3',
                    letterSpacing: '0.04em',
                    boxShadow: '0 0 0 5px #f5f7fb, 0 4px 16px rgba(0,0,0,0.14)',
                    flexShrink: 0,
                  }}
                >
                  VS
                </div>
              </div>

              {/* SC Creative card */}
              <div
                className="approach-card-sc"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(28,199,195,0.22)',
                  borderRadius: '0 16px 16px 0',
                  padding: '28px 24px',
                  boxShadow: '0 4px 20px rgba(28,199,195,0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #1cc7c3, #2adbd7)',
                    borderRadius: '0 16px 0 0',
                  }}
                />
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ ...t.cardLabel, color: '#13a9a6', marginBottom: '6px' }}>
                    SC Creative
                  </p>
                  <h3 style={{ ...t.h4, color: '#0b1520' }}>
                    Growth Ecosystem Model
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  {ecosystemItems.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      type="ecosystem"
                      onHover={setHoveredItem}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Callout banner — reflects the hovered comparison item */}
            <div
              style={{
                marginTop: '24px',
                background: '#ffffff',
                border: `1px solid ${
                  hoveredItem
                    ? hoveredItem.isTrad
                      ? 'rgba(200,50,50,0.2)'
                      : 'rgba(28,199,195,0.28)'
                    : 'rgba(28,199,195,0.18)'
                }`,
                borderRadius: '14px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'border-color 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: hoveredItem && hoveredItem.isTrad ? 'rgba(200,50,50,0.08)' : 'rgba(28,199,195,0.1)',
                  border: `1px solid ${
                    hoveredItem && hoveredItem.isTrad ? 'rgba(200,50,50,0.18)' : 'rgba(28,199,195,0.22)'
                  }`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                {hoveredItem ? (
                  <Lightbulb size={16} style={{ color: hoveredItem.isTrad ? '#cc4444' : '#1cc7c3' }} />
                ) : (
                  <Zap size={16} style={{ color: '#1cc7c3' }} />
                )}
              </div>
              <p style={{ fontSize: '13px', color: '#5a6a7a', lineHeight: 1.65, margin: 0 }}>
                {hoveredItem
                  ? hoveredItem.desc
                  : 'Instead of managing multiple vendors, you gain a partner that understands how every piece works together to drive growth.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

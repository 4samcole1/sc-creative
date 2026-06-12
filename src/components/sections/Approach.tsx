// src/components/sections/Approach.tsx
import { Zap } from 'lucide-react'

const traditionalItems = [
  'Website',
  'Logo',
  'Ads',
  'Monthly Reports',
  'Short-Term Tactics',
  'Disconnected Services',
]

const ecosystemItems = [
  'Strategy',
  'Branding',
  'Websites',
  'Intelligent Systems',
  'Growth Infrastructure',
  'Long-Term Partnership',
]

const benefits = [
  'Stronger strategy',
  'Fewer disconnects',
  'Better communication',
  'More sustainable growth',
]

export default function Approach() {
  return (
    <section style={{ background: '#f5f7fb', padding: '120px 0' }}>
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
            gridTemplateColumns: '40% 60%',
            gap: '80px',
            alignItems: 'start',
          }}
        >
          {/* ── Left column ── */}
          <div>
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
              A Different Approach
            </p>

            <h2
              style={{
                fontSize: 'clamp(26px, 2.6vw, 40px)',
                fontWeight: 800,
                lineHeight: 1.12,
                color: '#0b1520',
                marginBottom: '28px',
              }}
            >
              Most Agencies Focus on Tactics.{' '}
              <span style={{ color: '#1cc7c3' }}>We Focus on Systems.</span>
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                marginBottom: '36px',
              }}
            >
              {[
                'Many agencies can build a website. Some can run ads. Others can design a logo.',
                'Few can connect strategy, branding, development, automation, and growth into a single ecosystem designed to support long-term success.',
                "That's where SC Creative is different.",
                "We don't view websites, branding, AI, or marketing as isolated services. We see them as interconnected parts of a larger growth system.",
              ].map((p, i) => (
                <p
                  key={i}
                  style={{ fontSize: '14px', color: '#5a6a7a', lineHeight: 1.72, margin: 0 }}
                >
                  {p}
                </p>
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px 20px',
              }}
            >
              {benefits.map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'rgba(28,199,195,0.12)',
                      border: '1px solid rgba(28,199,195,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '10px',
                      color: '#13a9a6',
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ fontSize: '13px', color: '#3a4a5a', fontWeight: 500 }}>{b}</span>
                </div>
              ))}
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
                  <p
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#9aabbc',
                      marginBottom: '6px',
                    }}
                  >
                    Traditional Agency
                  </p>
                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#3a4a5a',
                      lineHeight: 1.3,
                    }}
                  >
                    Individual Services Model
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  {traditionalItems.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'rgba(200,50,50,0.07)',
                          border: '1px solid rgba(200,50,50,0.16)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '9px',
                          color: '#cc4444',
                          fontWeight: 700,
                        }}
                      >
                        ✕
                      </span>
                      <span style={{ fontSize: '13px', color: '#7a8a9a', fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* VS badge column */}
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
                {/* Subtle teal top bar accent */}
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
                  <p
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#13a9a6',
                      marginBottom: '6px',
                    }}
                  >
                    SC Creative
                  </p>
                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#0b1520',
                      lineHeight: 1.3,
                    }}
                  >
                    Growth Ecosystem Model
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  {ecosystemItems.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'rgba(28,199,195,0.12)',
                          border: '1px solid rgba(28,199,195,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '9px',
                          color: '#13a9a6',
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </span>
                      <span style={{ fontSize: '13px', color: '#2a3a4a', fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Callout banner */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid rgba(28,199,195,0.18)',
                borderRadius: '14px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(28,199,195,0.1)',
                  border: '1px solid rgba(28,199,195,0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Zap size={16} style={{ color: '#1cc7c3' }} />
              </div>
              <p style={{ fontSize: '13px', color: '#5a6a7a', lineHeight: 1.65, margin: 0 }}>
                Instead of managing multiple vendors, you gain a partner that understands how every
                piece works together to drive growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

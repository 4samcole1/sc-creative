// src/components/sections/StatsBar.tsx
import { t } from '@/lib/typography'

const stats = [
  { value: '200+', label: 'Businesses served',     color: '#1cc7c3' },
  { value: '20M+', label: 'Annual reach',          color: '#0EB1AB' },
  { value: '100%', label: 'Locally owned',         color: '#4ade80' },
  { value: '5.0★', label: 'Average client rating', color: '#c8921a' },
]

// Shared muted style for stat labels + brand names — one style, not three.
const muted = { ...t.small, color: '#94A3B8' } as const

// Effective panel-fill colour (translucent white over the navy section) — keep
// the marquee edge fades in sync so names dissolve into the panel cleanly.
const PANEL_EDGE = '#13202f'

// Sorted alphabetically (case-insensitive) at module load. Add/remove freely — it re-sorts.
const businesses = [
  '4 Seasons Landscaping',
  '67 Magazine',
  'Always Answered',
  'Andrews Mechanical',
  'Answer Pro',
  'AOC Connect',
  'ARS Roofing',
  'At The Lake Spa & Wellness',
  'Backyard Blessings',
  'Bethlehem Doodles',
  'BoatSafe',
  'Brandblueprint.ai',
  'Brock Transportation',
  'Carson Plumbing',
  'Clarry Lane',
  'Color Faux Walls',
  'Daybreak Care',
  'DirectLine',
  'Divergent',
  'Ducktown Lodge',
  'Employee Hotlines',
  'Expert Language Services',
  'GB Construction',
  'Gen Growth',
  'Georgia Standard',
  'Glory Fellowship Baptist Church',
  'Hallway Healthcare',
  'HaulX Moving',
  'Heritage Home Painting',
  'Imago Dei Academy',
  'James Health',
  'Jasper AL',
  'Loyal Standard',
  'Mann Home Services',
  'Mastercraft Plumbing',
  'Mayer Landscaping',
  'MCM Clothing',
  'Medical Diagnostics',
  'Mentality',
  'Miller Roofing',
  'Muncie Rooterman',
  'Peak Performance',
  'Piece by Peace',
  'Precision Bill Review',
  'Roundtable Advisors',
  'Sanders Aviation',
  'SHOAlign',
  'Smith Lake Family Care',
  'Soukkala',
  'Southeastern Construction',
  'TaleGate Sports',
  'Talladega County Sheriff',
  'The Walker Leader',
  'United Physician Group',
  'Vote Beaty',
  'Water Extraction Tech',
].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))

// Floating trust panel — straddles the Hero/Ecosystem seam. The negative top
// margin lifts it up over the dark Hero while its lower half rests on the light
// section that renders it.
export default function TrustBar() {
  return (
    <div style={{ position: 'relative', zIndex: 30, maxWidth: '1200px', margin: '56px auto -50px', padding: '0 40px' }}>
      <div
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          boxShadow: '0 18px 50px rgba(0,0,0,0.35)',
          paddingTop: '46px',
          paddingBottom: '38px',
          overflow: 'hidden',
        }}
      >
        {/* stats + heading */}
        <div style={{ padding: '0 40px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '40px 64px',
              marginBottom: '44px',
            }}
          >
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ ...t.h2, fontSize: 'clamp(26px, 2.6vw, 40px)', color: s.color, letterSpacing: '-0.02em' }}>
                  {s.value}
                </div>
                <div style={{ ...muted, marginTop: '10px' }}>
                  {s.label}
                </div>
                <div style={{ width: '40px', height: '3px', borderRadius: '2px', background: s.color, margin: '14px auto 0' }} />
              </div>
            ))}
          </div>

          {/* Trusted-by heading — eyebrow style, sized to outrank the brand names below */}
          <p style={{ ...t.eyebrow, fontSize: '13px', textAlign: 'center', marginBottom: '28px' }}>
            Trusted by Businesses Across the Region
          </p>
        </div>

        {/* Infinite rotating carousel of business names (no logos) */}
        <div style={{ overflow: 'hidden', position: 'relative', width: '100%' }}>
          <style>{`
            @keyframes name-marquee {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>

          {/* edge fades */}
          <div
            style={{
              pointerEvents: 'none', position: 'absolute', left: 0, top: 0, height: '100%', width: '110px', zIndex: 2,
              background: `linear-gradient(to right, ${PANEL_EDGE}, transparent)`,
            }}
          />
          <div
            style={{
              pointerEvents: 'none', position: 'absolute', right: 0, top: 0, height: '100%', width: '110px', zIndex: 2,
              background: `linear-gradient(to left, ${PANEL_EDGE}, transparent)`,
            }}
          />

          {/* track: two identical copies → translateX(-50%) loops seamlessly */}
          <div
            style={{
              display: 'flex',
              width: 'max-content',
              alignItems: 'center',
              animation: 'name-marquee 80s linear infinite',
              willChange: 'transform',
            }}
          >
            {[...businesses, ...businesses].map((name, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ ...muted, whiteSpace: 'nowrap', padding: '0 26px' }}>
                  {name}
                </span>
                <span style={{ ...muted, color: 'rgba(148,163,184,0.3)' }}>·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

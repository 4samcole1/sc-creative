// src/components/sections/HeroStats.tsx
// Trust strip for the bottom of the hero's left column: businesses helped,
// Google rating, and location — a white card with three divided cells.
import { Users, MapPin, Star } from 'lucide-react'

const TEAL = '#13a9a6'
const INK = '#0b1520'
const MUTED = '#5a6a7a'
const GOLD = '#f5b829'

function Divider() {
  return <div aria-hidden style={{ width: '1px', alignSelf: 'stretch', background: 'rgba(13,21,32,0.08)', margin: '8px 0' }} />
}

export default function HeroStats() {
  return (
    <div
      style={{
        marginTop: '36px',
        maxWidth: '600px',
        background: '#ffffff',
        border: '1px solid rgba(13,21,32,0.06)',
        borderRadius: '16px',
        boxShadow: '0 16px 44px rgba(13,21,32,0.08)',
        display: 'flex',
        alignItems: 'stretch',
        padding: '18px 6px',
      }}
    >
      {/* Businesses helped */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', padding: '2px 18px' }}>
        <Users size={26} strokeWidth={1.8} style={{ color: TEAL, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: INK, lineHeight: 1.1 }}>200+</div>
          <div style={{ fontSize: '12.5px', color: MUTED }}>Businesses Helped</div>
        </div>
      </div>

      <Divider />

      {/* Google reviews */}
      <div style={{ flex: 1, padding: '2px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: '2px', marginBottom: '5px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={15} color={GOLD} fill={GOLD} />
          ))}
        </div>
        <div style={{ fontSize: '13.5px', fontWeight: 700, color: INK, lineHeight: 1.2 }}>5-Star Google Reviews</div>
        <div style={{ fontSize: '12px', color: MUTED }}>From Local Clients</div>
      </div>

      <Divider />

      {/* Location */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', padding: '2px 18px' }}>
        <MapPin size={24} strokeWidth={1.8} style={{ color: TEAL, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: INK, lineHeight: 1.15 }}>Based in</div>
          <div style={{ fontSize: '12.5px', color: MUTED }}>Jasper, Alabama</div>
        </div>
      </div>
    </div>
  )
}

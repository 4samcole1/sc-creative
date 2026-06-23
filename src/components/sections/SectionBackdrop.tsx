// src/components/sections/SectionBackdrop.tsx
// The Ecosystem-style dark-section backdrop: a faint grid texture (fading out at
// the bottom) plus an optional soft teal glow behind the section header.
// Drop it as the FIRST child of a dark section that is `position: relative` and
// `overflow: hidden`, and give the section's content wrapper `position: relative;
// zIndex: 1` so text/UI sits crisply above the texture.
import type { CSSProperties } from 'react'

const grid: CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
  backgroundSize: '48px 48px',
  maskImage: 'linear-gradient(to bottom, #000 0%, #000 86%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 86%, transparent 100%)',
  pointerEvents: 'none',
}

export default function SectionBackdrop({
  glow = true,
  glowTop = '90px',
  glowLeft = '50%',
}: {
  glow?: boolean
  glowTop?: string
  glowLeft?: string
}) {
  return (
    <>
      <div aria-hidden style={grid} />
      {glow && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: glowTop,
            left: glowLeft,
            transform: 'translateX(-50%)',
            width: '760px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(28,199,195,0.10) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  )
}

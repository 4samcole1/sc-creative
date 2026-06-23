// src/components/sections/SectionBackdrop.tsx
// Shared section backdrop: a faint grid texture (fading out at the bottom) plus an
// optional soft teal glow behind the section header. `variant` flips the grid line
// color for dark vs light sections.
// Drop it as the FIRST child of a section that is `position: relative` and
// `overflow: hidden`, and give the section's content wrapper `position: relative;
// zIndex: 1` so content sits crisply above the texture.
import type { CSSProperties } from 'react'

export default function SectionBackdrop({
  variant = 'dark',
  glow = variant === 'dark',
  glowTop = '90px',
  glowLeft = '50%',
}: {
  variant?: 'dark' | 'light'
  glow?: boolean
  glowTop?: string
  glowLeft?: string
}) {
  const line = variant === 'dark' ? 'rgba(255,255,255,0.018)' : 'rgba(13,21,32,0.022)'
  const grid: CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
    backgroundSize: '48px 48px',
    maskImage: 'linear-gradient(to bottom, #000 0%, #000 86%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 86%, transparent 100%)',
    pointerEvents: 'none',
  }

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

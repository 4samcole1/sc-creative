// src/lib/typography.ts
// Single source of truth for text styles — spread into inline style props.
import type { CSSProperties } from 'react'

export const t = {
  // ── Labels ──────────────────────────────────────────────
  // Section eyebrow (e.g. "Why Businesses Struggle")
  eyebrow: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#1cc7c3',
  } as CSSProperties,

  // Inline card category label (e.g. "01 — Clarity & Strategy", "SC Creative")
  cardLabel: {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.13em',
    textTransform: 'uppercase',
  } as CSSProperties,

  // ── Headings ─────────────────────────────────────────────
  // H1 — Hero only
  h1: {
    fontSize: 'clamp(36px, 4vw, 54px)',
    fontWeight: 800,
    lineHeight: 1.08,
  } as CSSProperties,

  // H2 — Every section headline
  h2: {
    fontSize: 'clamp(28px, 3vw, 44px)',
    fontWeight: 800,
    lineHeight: 1.12,
  } as CSSProperties,

  // H3 — Prominent card titles (e.g. service names in scroll cards)
  h3: {
    fontSize: '20px',
    fontWeight: 800,
    lineHeight: 1.1,
  } as CSSProperties,

  // H4 — Card category headings (e.g. "Individual Services Model")
  h4: {
    fontSize: '16px',
    fontWeight: 700,
    lineHeight: 1.2,
  } as CSSProperties,

  // ── Body ─────────────────────────────────────────────────
  body: {
    fontSize: '15px',
    lineHeight: 1.72,
  } as CSSProperties,

  small: {
    fontSize: '13px',
    lineHeight: 1.65,
  } as CSSProperties,

  xs: {
    fontSize: '12px',
    lineHeight: 1.6,
  } as CSSProperties,
}

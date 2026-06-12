'use client'
import Link from 'next/link'
import { CSSProperties, ReactNode, useState } from 'react'

const base: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '13px',
  fontWeight: 700,
  padding: '12px 26px',
  borderRadius: '10px',
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease, border-color 0.2s ease, color 0.2s ease',
}

const variants = {
  // Teal fill — primary action on any background
  primary: {
    rest: { ...base, background: '#1cc7c3', color: '#07262b', boxShadow: '0 8px 24px rgba(28,199,195,0.28)' },
    hover: { background: '#2adbd7', boxShadow: '0 10px 28px rgba(28,199,195,0.4)', transform: 'translateY(-1px)' },
    active: { transform: 'translateY(0px)', boxShadow: '0 4px 14px rgba(28,199,195,0.22)' },
  },
  // Ghost / outline — secondary action on dark backgrounds
  ghost: {
    rest: { ...base, background: 'transparent', color: '#dbe3ea', border: '1.5px solid rgba(255,255,255,0.16)' },
    hover: { background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.34)', color: '#ffffff', transform: 'translateY(-1px)' },
    active: { transform: 'translateY(0px)' },
  },
  // White fill — primary action on light/white backgrounds
  light: {
    rest: { ...base, background: '#ffffff', color: '#0b1520', boxShadow: '0 4px 14px rgba(0,0,0,0.10)' },
    hover: { background: '#f0f4f8', boxShadow: '0 6px 20px rgba(0,0,0,0.15)', transform: 'translateY(-1px)' },
    active: { transform: 'translateY(0px)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  },
}

export type BtnVariant = keyof typeof variants

interface BtnProps {
  href?: string
  variant?: BtnVariant
  children: ReactNode
  style?: CSSProperties
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export default function Btn({ href, variant = 'primary', children, style, onClick, type = 'button' }: BtnProps) {
  const [state, setState] = useState<'rest' | 'hover' | 'active'>('rest')
  const v = variants[variant]
  const computed: CSSProperties = { ...v.rest, ...(state !== 'rest' ? v[state] : {}), ...style }

  const handlers = {
    onMouseEnter: () => setState('hover'),
    onMouseLeave: () => setState('rest'),
    onMouseDown: () => setState('active'),
    onMouseUp: () => setState('hover'),
  }

  if (href) {
    return <Link href={href} style={computed} {...handlers}>{children}</Link>
  }

  return (
    <button type={type} style={computed} onClick={onClick} {...handlers}>
      {children}
    </button>
  )
}

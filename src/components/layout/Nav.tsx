// src/components/layout/Nav.tsx
'use client'
import Link from 'next/link'

const navLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Blueprint', href: '/services/brand-blueprint' },
  { label: 'Branding', href: '/services/visual-branding' },
  { label: 'Website', href: '/services/website-design' },
  { label: 'AI Solutions', href: '/services/ai-systems' },
  { label: 'Growth', href: '/services/growth' },
  { label: 'About', href: '/about' },
]

export default function Nav() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: '16px',
        left: 0,
        right: 0,
        margin: '0 auto',
        width: '100%',
        maxWidth: '1200px',
        height: '72px',
        zIndex: 50,
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
      }}
    >
      <Link
        href="/"
        style={{
          fontWeight: 800,
          fontSize: '13px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#0b1520',
          flexShrink: 0,
          marginRight: '40px',
          textDecoration: 'none',
        }}
        aria-label="SC Creative"
      >
        SC Creative
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flex: 1, justifyContent: 'center' }}>
        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#4a5568',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0b1520')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4a5568')}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <Link
        href="/contact"
        style={{
          flexShrink: 0,
          background: '#1cc7c3',
          color: '#07262b',
          fontSize: '13px',
          fontWeight: 700,
          padding: '10px 22px',
          borderRadius: '10px',
          textDecoration: 'none',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#2adbd7')}
        onMouseLeave={e => (e.currentTarget.style.background = '#1cc7c3')}
      >
        Get In Touch
      </Link>
    </nav>
  )
}

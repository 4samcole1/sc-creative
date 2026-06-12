// src/components/layout/Nav.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import Btn from '@/components/ui/Btn'

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
        style={{ flexShrink: 0, marginRight: '40px', lineHeight: 0 }}
        aria-label="SC Creative"
      >
        <Image
          src="/images/logo-dark.png"
          alt="SC Creative"
          width={160}
          height={23}
          priority
          style={{ height: '23px', width: 'auto' }}
        />
      </Link>

      {/* Absolutely centered so links sit at the true midpoint of the nav
          regardless of logo vs button widths */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '28px' }}>
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
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0b1520')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4a5568')}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div style={{ marginLeft: 'auto' }}>
        <Btn href="/contact" variant="primary" style={{ padding: '10px 22px' }}>
          Get In Touch
        </Btn>
      </div>
    </nav>
  )
}

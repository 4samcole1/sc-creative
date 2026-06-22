'use client'
import Link from 'next/link'
import Image from 'next/image'
import Btn from '@/components/ui/Btn'
import type { NavLink } from '@/lib/pages-data'

const fallbackLinks: NavLink[] = [
  { label: 'Work',         url: '/work',                      opens_new_tab: false },
  { label: 'Blueprint',    url: '/services/brand-blueprint',  opens_new_tab: false },
  { label: 'Branding',     url: '/services/visual-branding',  opens_new_tab: false },
  { label: 'Website',      url: '/services/website-design',   opens_new_tab: false },
  { label: 'AI Solutions', url: '/services/ai-systems',       opens_new_tab: false },
  { label: 'Growth',       url: '/services/growth',           opens_new_tab: false },
  { label: 'About',        url: '/about',                     opens_new_tab: false },
]

export default function Nav({ logoDarkUrl, links }: { logoDarkUrl?: string; links?: NavLink[] }) {
  const logoSrc = logoDarkUrl || '/images/logo-dark.png'
  const navLinks = links && links.length > 0 ? links : fallbackLinks

  return (
    <nav
      style={{
        position: 'fixed',
        top: '16px',
        left: 0,
        right: 0,
        margin: '0 auto',
        width: 'calc(100% - 80px)',
        maxWidth: '1120px',
        height: '72px',
        zIndex: 50,
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 28px',
      }}
    >
      <Link href="/" style={{ flexShrink: 0, marginRight: '40px', lineHeight: 0 }} aria-label="SC Creative">
        <Image
          src={logoSrc}
          alt="SC Creative"
          width={160}
          height={23}
          priority
          style={{ height: '23px', width: 'auto' }}
          unoptimized={logoSrc.startsWith('http')}
        />
      </Link>

      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '28px' }}>
        {navLinks.map((l) => (
          <Link
            key={l.url}
            href={l.url}
            target={l.opens_new_tab ? '_blank' : undefined}
            rel={l.opens_new_tab ? 'noopener noreferrer' : undefined}
            style={{ fontSize: '13px', fontWeight: 500, color: '#4a5568', textDecoration: 'none', transition: 'color 0.2s ease', whiteSpace: 'nowrap' }}
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

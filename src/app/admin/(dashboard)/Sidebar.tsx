'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react'
import { logoutAction } from '@/app/login/actions'

const nav = [
  { label: 'Dashboard', href: '/admin',          Icon: LayoutDashboard },
  { label: 'Clients',   href: '/admin/clients',  Icon: Users },
  { label: 'Settings',  href: '/admin/settings', Icon: Settings },
  // Next increment (own spec):
  // { label: 'Blog', href: '/admin/posts', Icon: FileText },
]

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside
      style={{
        width: '220px', flexShrink: 0, background: '#0b1520',
        borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex',
        flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0,
      }}
    >
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" target="_blank" style={{ lineHeight: 0, display: 'inline-block' }}>
          <Image src="/images/logo-white.png" alt="SC Creative" width={130} height={19} style={{ height: '19px', width: 'auto' }} />
        </Link>
        <p style={{ fontSize: '10px', fontWeight: 600, color: '#2a4a5a', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '8px' }}>
          Admin
        </p>
      </div>

      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {nav.map(({ label, href, Icon }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 20px',
                fontSize: '13px', fontWeight: active ? 600 : 500,
                color: active ? '#c0d8e8' : '#4a6a7a', textDecoration: 'none',
                background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                borderLeft: `2px solid ${active ? '#1cc7c3' : 'transparent'}`,
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize: '11px', color: '#2a4a5a', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {email}
        </p>
        <form action={logoutAction}>
          <button type="submit"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#4a5a6a', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}

import { redirect } from 'next/navigation'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard, Users, FolderOpen,
  FileText, Star, Settings, LogOut,
} from 'lucide-react'
import { sessionOptions, type SessionData } from '@/lib/session'
import { logoutAction } from '@/app/admin/login/actions'

const nav = [
  { label: 'Dashboard', href: '/admin', Icon: LayoutDashboard },
  { label: 'Leads',     href: '/admin/leads',     Icon: Users },
  { label: 'Projects',  href: '/admin/projects',  Icon: FolderOpen },
  { label: 'Blog',      href: '/admin/posts',     Icon: FileText },
  { label: 'Testimonials', href: '/admin/testimonials', Icon: Star },
  { label: 'Settings',  href: '/admin/settings',  Icon: Settings },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  if (!session.isLoggedIn) redirect('/admin/login')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070d17' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '220px',
          flexShrink: 0,
          background: '#0b1520',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" target="_blank" style={{ lineHeight: 0, display: 'inline-block' }}>
            <Image
              src="/images/logo-white.png"
              alt="SC Creative"
              width={130}
              height={19}
              style={{ height: '19px', width: 'auto' }}
            />
          </Link>
          <p style={{ fontSize: '10px', fontWeight: 600, color: '#2a4a5a', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '8px' }}>
            Admin
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {nav.map(({ label, href, Icon }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 20px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#4a6a7a',
                textDecoration: 'none',
                transition: 'color 0.15s ease, background 0.15s ease',
                borderLeft: '2px solid transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#c0d8e8'
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#4a6a7a'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom — user + logout */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: '11px', color: '#2a4a5a', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {session.email}
          </p>
          <form action={logoutAction}>
            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#4a5a6a',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f06060')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4a5a6a')}
            >
              <LogOut size={13} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: '220px', padding: '36px 40px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}

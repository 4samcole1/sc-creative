import { redirect } from 'next/navigation'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, type SessionData } from '@/lib/session'
import { Sidebar } from './Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  if (!session.isLoggedIn) redirect('/login')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070d17' }}>
      <Sidebar email={session.email} />
      <main style={{ flex: 1, marginLeft: '220px', padding: '36px 40px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}

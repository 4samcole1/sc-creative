import Link from 'next/link'
import { getClients } from '@/lib/clients-data'
import { AdminPageHeader } from './components/AdminUI'

export default async function DashboardPage() {
  const clients = await getClients()
  const onMap = clients.filter(c => c.show.map).length
  const onTrustBar = clients.filter(c => c.show.trustBar).length

  return (
    <>
      <AdminPageHeader title="Dashboard" subtitle="SC Creative admin" />
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total clients', value: clients.length, href: '/admin/clients' },
          { label: 'On the map', value: onMap, href: '/admin/clients' },
          { label: 'On the trust bar', value: onTrustBar, href: '/admin/clients' },
        ].map(card => (
          <Link key={card.label} href={card.href}
            style={{ flex: '1 1 180px', background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px', textDecoration: 'none' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1cc7c3' }}>{card.value}</div>
            <div style={{ fontSize: '13px', color: '#4a6a7a', marginTop: '4px' }}>{card.label}</div>
          </Link>
        ))}
      </div>
    </>
  )
}

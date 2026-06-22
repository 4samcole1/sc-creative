import Link from 'next/link'
import { getClients } from '@/lib/clients-data'
import { deleteClientAction } from './actions'
import {
  AdminPageHeader, NewButton, AdminTable, AdminTableRow, AdminTableCell,
  EmptyState, DeleteButton,
} from '../components/AdminUI'

export default async function ClientsPage() {
  const clients = await getClients()

  const tag = (on: boolean, label: string) => (
    <span style={{ fontSize: '10px', fontWeight: 700, marginRight: '6px', padding: '2px 6px', borderRadius: '4px',
      background: on ? 'rgba(28,199,195,0.12)' : 'rgba(74,106,122,0.12)',
      color: on ? '#1cc7c3' : '#2a4a5a' }}>{label}</span>
  )

  return (
    <>
      <AdminPageHeader title="Clients" subtitle={`${clients.length} total`}
        action={<NewButton href="/admin/clients/new" label="New client" />} />

      {clients.length === 0 ? (
        <EmptyState message="No clients yet. Add your first one." />
      ) : (
        <AdminTable headers={['Name', 'Location', 'Industry', 'Placement', '']}>
          {clients.map((c, i) => (
            <AdminTableRow key={c.id} last={i === clients.length - 1}>
              <AdminTableCell>
                <Link href={`/admin/clients/${c.id}/edit`} style={{ color: '#c0d8e8', textDecoration: 'none', fontWeight: 600 }}>
                  {c.name}{c.needsReview && <span style={{ color: '#c8921a', marginLeft: '6px', fontSize: '11px' }}>⚠ review</span>}
                </Link>
              </AdminTableCell>
              <AdminTableCell muted>{[c.city, c.state].filter(Boolean).join(', ') || '—'}</AdminTableCell>
              <AdminTableCell muted>{c.industry || '—'}</AdminTableCell>
              <AdminTableCell>{tag(c.show.trustBar, 'TRUST')}{tag(c.show.map, 'MAP')}{tag(c.show.portfolio, 'PORTFOLIO')}</AdminTableCell>
              <AdminTableCell><DeleteButton action={deleteClientAction.bind(null, c.id)} noun="client" /></AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}
    </>
  )
}

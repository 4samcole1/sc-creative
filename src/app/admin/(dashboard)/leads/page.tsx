import { createAdminClient } from '@/lib/supabase-admin'
import {
  AdminPageHeader, AdminTable, AdminTableRow, AdminTableCell, EmptyState,
} from '../components/AdminUI'

interface LeadRow {
  id: string
  challenge: string
  services: string[]
  budget: string
  timeline: string
  name: string
  business_name: string
  email: string
  notes: string
  created_at: string
}

async function getLeads(): Promise<LeadRow[]> {
  const { data } = await createAdminClient().from('leads').select('*').order('created_at', { ascending: false })
  return (data ?? []) as LeadRow[]
}

export default async function LeadsPage() {
  let leads: LeadRow[] = []
  let dbError = false
  try { leads = await getLeads() } catch { dbError = true }

  return (
    <>
      <AdminPageHeader title="Leads" subtitle={`${leads.length} total`} />

      {dbError && (
        <div style={{ background: 'rgba(240,160,32,0.08)', border: '1px solid rgba(240,160,32,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#f0a020' }}>
          ⚠ Could not load leads — the leads table may not exist yet.
        </div>
      )}

      {!dbError && leads.length === 0 ? (
        <EmptyState message="No leads yet. Submissions from the homepage form will appear here." />
      ) : (
        <AdminTable headers={['Name', 'Business', 'Email', 'Challenge', 'Services', 'Budget', 'Timeline', 'When']}>
          {leads.map((l, i) => (
            <AdminTableRow key={l.id} last={i === leads.length - 1}>
              <AdminTableCell>{l.name || '—'}</AdminTableCell>
              <AdminTableCell muted>{l.business_name || '—'}</AdminTableCell>
              <AdminTableCell muted>{l.email || '—'}</AdminTableCell>
              <AdminTableCell muted>{l.challenge || '—'}</AdminTableCell>
              <AdminTableCell muted>{(l.services ?? []).join(', ') || '—'}</AdminTableCell>
              <AdminTableCell muted>{l.budget || '—'}</AdminTableCell>
              <AdminTableCell muted>{l.timeline || '—'}</AdminTableCell>
              <AdminTableCell muted>{new Date(l.created_at).toLocaleDateString()}</AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}
    </>
  )
}

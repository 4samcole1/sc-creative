import { createAdminClient } from '@/lib/supabase-admin'
import type { Lead } from '@/lib/types'
import { AdminPageHeader, AdminTable, AdminTableRow, AdminTableCell, StatusBadge, EmptyState } from '../components/AdminUI'

async function getLeads(): Promise<Lead[]> {
  const { data } = await createAdminClient()
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  return (data ?? []) as Lead[]
}

export default async function LeadsPage() {
  let leads: Lead[] = []
  let dbError = false
  try { leads = await getLeads() } catch { dbError = true }

  return (
    <div>
      <AdminPageHeader
        title="Leads"
        subtitle={`${leads.length} total lead${leads.length !== 1 ? 's' : ''}`}
      />

      {dbError && (
        <div style={{ background: 'rgba(240,160,32,0.08)', border: '1px solid rgba(240,160,32,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#f0a020' }}>
          ⚠ Could not load leads — the leads table may not exist yet.
        </div>
      )}

      {!dbError && leads.length === 0 ? (
        <EmptyState message="No leads yet. Leads submitted via your contact form will appear here." />
      ) : (
        <AdminTable headers={['Name', 'Business', 'Email', 'Phone', 'Service', 'Date']}>
          {leads.map((lead, i) => (
            <AdminTableRow key={lead.id} last={i === leads.length - 1}>
              <AdminTableCell>
                <span style={{ fontWeight: 600 }}>{lead.first_name} {lead.last_name}</span>
              </AdminTableCell>
              <AdminTableCell muted>{lead.business ?? '—'}</AdminTableCell>
              <AdminTableCell>
                <a href={`mailto:${lead.email}`} style={{ color: '#1cc7c3', textDecoration: 'none', fontSize: '13px' }}>
                  {lead.email}
                </a>
              </AdminTableCell>
              <AdminTableCell muted>{(lead as Lead & { phone?: string }).phone ?? '—'}</AdminTableCell>
              <AdminTableCell>
                {lead.service_interest ? (
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#1cc7c3', background: 'rgba(28,199,195,0.1)', border: '1px solid rgba(28,199,195,0.18)', borderRadius: '4px', padding: '2px 8px' }}>
                    {lead.service_interest}
                  </span>
                ) : <span style={{ color: '#2a4a5a' }}>—</span>}
              </AdminTableCell>
              <AdminTableCell muted>
                {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}
    </div>
  )
}

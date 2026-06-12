import { getLocalPages, deleteLocalPageAction, type LocalPage } from './actions'
import { AdminPageHeader, NewButton, AdminTable, AdminTableRow, AdminTableCell, StatusBadge, EmptyState, DeleteButton } from '../components/AdminUI'

export default async function LocalPagesPage() {
  let pages: LocalPage[] = []
  let dbError = false
  try { pages = await getLocalPages() } catch { dbError = true }

  return (
    <div>
      <AdminPageHeader
        title="Local Pages"
        subtitle="SEO landing pages targeting specific cities and regions"
        action={<NewButton href="/admin/local-pages/new" label="New Local Page" />}
      />

      {dbError && (
        <div style={{ background: 'rgba(240,160,32,0.08)', border: '1px solid rgba(240,160,32,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#f0a020' }}>
          ⚠ Could not load local pages — run the SQL migration to create the local_pages table.
        </div>
      )}

      {!dbError && pages.length === 0 ? (
        <EmptyState message="No local pages yet. Create location-specific landing pages to boost local SEO." />
      ) : (
        <AdminTable headers={['City', 'State', 'Status', 'Slug', 'Actions']}>
          {pages.map((page, i) => (
            <AdminTableRow key={page.id} last={i === pages.length - 1}>
              <AdminTableCell>
                <a href={`/admin/local-pages/${page.id}/edit`} style={{ color: '#c0d0e0', fontWeight: 600, textDecoration: 'none', fontSize: '13px' }}>
                  {page.city}
                </a>
              </AdminTableCell>
              <AdminTableCell muted>{page.state}</AdminTableCell>
              <AdminTableCell><StatusBadge status={page.status} /></AdminTableCell>
              <AdminTableCell muted mono>/{page.slug}</AdminTableCell>
              <AdminTableCell>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <a href={`/admin/local-pages/${page.id}/edit`} style={{ fontSize: '12px', color: '#1cc7c3', textDecoration: 'none', fontWeight: 600 }}>Edit</a>
                  <DeleteButton action={deleteLocalPageAction.bind(null, page.id)} noun="local page" />
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}
    </div>
  )
}

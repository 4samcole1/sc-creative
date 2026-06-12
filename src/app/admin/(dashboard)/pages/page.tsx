import { getPages, deletePageAction, type Page } from './actions'
import { AdminPageHeader, NewButton, AdminTable, AdminTableRow, AdminTableCell, StatusBadge, EmptyState, DeleteButton } from '../components/AdminUI'

export default async function PagesPage() {
  let pages: Page[] = []
  let dbError = false
  try { pages = await getPages() } catch { dbError = true }

  return (
    <div>
      <AdminPageHeader
        title="Pages"
        subtitle={`${pages.length} page${pages.length !== 1 ? 's' : ''}`}
        action={<NewButton href="/admin/pages/new" label="New Page" />}
      />

      {dbError && (
        <div style={{ background: 'rgba(240,160,32,0.08)', border: '1px solid rgba(240,160,32,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#f0a020' }}>
          ⚠ Could not load pages — run the SQL migration to create the pages table.
        </div>
      )}

      {!dbError && pages.length === 0 ? (
        <EmptyState message="No pages yet. Create your first page to get started." />
      ) : (
        <AdminTable headers={['Title', 'Status', 'Slug', 'Last Updated', 'Actions']}>
          {pages.map((page, i) => (
            <AdminTableRow key={page.id} last={i === pages.length - 1}>
              <AdminTableCell>
                <a href={`/admin/pages/${page.id}/edit`} style={{ color: '#c0d0e0', fontWeight: 600, textDecoration: 'none', fontSize: '13px' }}>
                  {page.title || <span style={{ color: '#2a4a5a' }}>Untitled</span>}
                </a>
              </AdminTableCell>
              <AdminTableCell><StatusBadge status={page.status} /></AdminTableCell>
              <AdminTableCell muted mono>/{page.slug}</AdminTableCell>
              <AdminTableCell muted>
                {new Date(page.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </AdminTableCell>
              <AdminTableCell>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <a href={`/admin/pages/${page.id}/edit`} style={{ fontSize: '12px', color: '#1cc7c3', textDecoration: 'none', fontWeight: 600 }}>Edit</a>
                  <DeleteButton action={deletePageAction.bind(null, page.id)} noun="page" />
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}
    </div>
  )
}

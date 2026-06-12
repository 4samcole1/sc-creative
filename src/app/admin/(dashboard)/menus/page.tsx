import { getMenusWithItems } from './actions'
import { AdminPageHeader } from '../components/AdminUI'
import MenusClient from './MenusClient'

export default async function MenusPage() {
  let menus: Awaited<ReturnType<typeof getMenusWithItems>> = []
  let dbError = false
  try { menus = await getMenusWithItems() } catch { dbError = true }

  return (
    <div>
      <AdminPageHeader
        title="Menu Manager"
        subtitle="Manage navigation and footer link collections"
      />

      {dbError || menus.length === 0 ? (
        <div style={{ background: 'rgba(240,160,32,0.08)', border: '1px solid rgba(240,160,32,0.2)', borderRadius: '10px', padding: '14px 18px', fontSize: '13px', color: '#f0a020' }}>
          ⚠ No menus found — run the SQL migration to create the menus and menu_items tables with default menu locations.
        </div>
      ) : (
        <MenusClient menus={menus} />
      )}
    </div>
  )
}

import { getPages } from '../actions'
import { BackLink, AdminPageHeader } from '../../components/AdminUI'
import PageForm from '../PageForm'

export default async function NewPagePage() {
  const allPages = await getPages().catch(() => [])
  return (
    <div>
      <BackLink href="/admin/pages" label="All Pages" />
      <AdminPageHeader title="New Page" />
      <PageForm allPages={allPages} />
    </div>
  )
}

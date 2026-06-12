import { BackLink, AdminPageHeader } from '../../components/AdminUI'
import PageForm from '../PageForm'

export default function NewPagePage() {
  return (
    <div>
      <BackLink href="/admin/pages" label="All Pages" />
      <AdminPageHeader title="New Page" />
      <PageForm />
    </div>
  )
}

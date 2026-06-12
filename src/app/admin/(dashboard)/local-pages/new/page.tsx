import { BackLink, AdminPageHeader } from '../../components/AdminUI'
import LocalPageForm from '../LocalPageForm'

export default function NewLocalPagePage() {
  return (
    <div>
      <BackLink href="/admin/local-pages" label="Local Pages" />
      <AdminPageHeader title="New Local Page" />
      <LocalPageForm />
    </div>
  )
}

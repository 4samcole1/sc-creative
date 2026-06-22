import { ClientForm } from '../ClientForm'
import { AdminPageHeader, BackLink } from '../../components/AdminUI'

export default function NewClientPage() {
  return (
    <>
      <BackLink href="/admin/clients" label="Back to clients" />
      <AdminPageHeader title="New client" />
      <ClientForm />
    </>
  )
}

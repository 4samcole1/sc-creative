import { notFound } from 'next/navigation'
import { ClientForm } from '../../ClientForm'
import { getClientRow } from '../../actions'
import { rowToClient } from '@/lib/clients-data'
import { AdminPageHeader, BackLink } from '../../../components/AdminUI'

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const row = await getClientRow(id)
  if (!row) notFound()
  const client = rowToClient(row)

  return (
    <>
      <BackLink href="/admin/clients" label="Back to clients" />
      <AdminPageHeader title="Edit client" subtitle={client.name} />
      <ClientForm client={client} />
    </>
  )
}

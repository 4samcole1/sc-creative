import { notFound } from 'next/navigation'
import { getLocalPage } from '../../actions'
import { BackLink, AdminPageHeader } from '../../../components/AdminUI'
import LocalPageForm from '../../LocalPageForm'

export default async function EditLocalPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const page = await getLocalPage(id)
  if (!page) notFound()

  return (
    <div>
      <BackLink href="/admin/local-pages" label="Local Pages" />
      <AdminPageHeader
        title={`${page.city}, ${page.state}`}
        subtitle={`/${page.slug}`}
      />
      <LocalPageForm page={page} />
    </div>
  )
}

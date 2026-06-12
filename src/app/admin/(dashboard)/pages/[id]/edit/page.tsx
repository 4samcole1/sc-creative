import { notFound } from 'next/navigation'
import { getPage } from '../../actions'
import { BackLink, AdminPageHeader } from '../../../components/AdminUI'
import PageForm from '../../PageForm'

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const page = await getPage(id)
  if (!page) notFound()

  return (
    <div>
      <BackLink href="/admin/pages" label="All Pages" />
      <AdminPageHeader
        title={page.title || 'Edit Page'}
        subtitle={`/${page.slug}`}
      />
      <PageForm page={page} />
    </div>
  )
}

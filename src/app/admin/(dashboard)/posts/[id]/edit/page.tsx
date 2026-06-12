import { notFound } from 'next/navigation'
import { getPost } from '../../actions'
import { BackLink, AdminPageHeader } from '../../../components/AdminUI'
import PostForm from '../../PostForm'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPost(id)
  if (!post) notFound()

  return (
    <div>
      <BackLink href="/admin/posts" label="All Posts" />
      <AdminPageHeader
        title={post.title || 'Edit Post'}
        subtitle={`Last updated ${new Date(post.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
      />
      <PostForm post={post} />
    </div>
  )
}

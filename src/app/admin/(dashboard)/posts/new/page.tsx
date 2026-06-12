import { BackLink, AdminPageHeader } from '../../components/AdminUI'
import PostForm from '../PostForm'

export default function NewPostPage() {
  return (
    <div>
      <BackLink href="/admin/posts" label="All Posts" />
      <AdminPageHeader title="New Post" />
      <PostForm />
    </div>
  )
}
